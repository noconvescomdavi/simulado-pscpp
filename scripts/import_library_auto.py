#!/usr/bin/env python3
from __future__ import annotations
import argparse, hashlib, json, os, re, unicodedata
from pathlib import Path
from collections import Counter

import fitz
import psycopg
from dotenv import load_dotenv

ROOT=Path(__file__).resolve().parents[1]
DEFAULT_FOLDER=ROOT/"biblioteca-pdfs"

STOPWORDS_PT={"de","da","do","das","dos","e","em","para","com","uma","um","o","a","os","as","por","que","se"}
STOPWORDS_EN={"the","of","and","to","in","a","an","for","with","on","by","is","are","from","this","that"}

def slugify(s):
    s=unicodedata.normalize("NFKD",str(s or "")).encode("ascii","ignore").decode().lower()
    s=re.sub(r"[^a-z0-9]+","-",s).strip("-")
    return s[:120] or "documento"

def sha256_file(path):
    h=hashlib.sha256()
    with open(path,"rb") as f:
        for b in iter(lambda:f.read(1024*1024),b""): h.update(b)
    return h.hexdigest()

def clean_text(s):
    s=(s or "").replace("\x00"," ")
    s=re.sub(r"(?<=\w)-\n(?=\w)","",s)
    s=re.sub(r"[ \t]+"," ",s)
    s=re.sub(r"\n{3,}","\n\n",s)
    return s.strip()

def first_nonempty_lines(text,limit=80):
    return [re.sub(r"\s+"," ",x).strip() for x in text.splitlines() if x.strip()][:limit]

def detect_language(text):
    words=re.findall(r"[A-Za-zÀ-ÿ]+",text.lower())
    if not words: return ("und",0.1)
    c=Counter(words)
    pt=sum(c[w] for w in STOPWORDS_PT)
    en=sum(c[w] for w in STOPWORDS_EN)
    total=max(1,pt+en)
    if pt==en==0: return ("und",0.25)
    return ("pt", min(.98,.55+pt/total*.4)) if pt>en else ("en",min(.98,.55+en/total*.4))

def infer_isbn(text):
    pats=[
        r"\bISBN(?:-1[03])?\s*:?\s*((?:97[89][\s-]?)?(?:\d[\s-]?){9}[\dXx])\b",
        r"\b((?:97[89][\s-]?)?(?:\d[\s-]?){9}[\dXx])\b"
    ]
    for p in pats:
        m=re.search(p,text,re.I)
        if m:
            raw=re.sub(r"[^0-9Xx]","",m.group(1))
            if len(raw) in (10,13): return raw
    return ""

def infer_year(text,meta):
    candidates=[]
    for s in [str(meta.get("creationDate","")),str(meta.get("modDate","")),text[:12000]]:
        candidates += [int(x) for x in re.findall(r"\b(19[5-9]\d|20[0-3]\d)\b",s)]
    if not candidates:return None
    # Prefer most frequent recent plausible year
    cnt=Counter(candidates)
    return cnt.most_common(1)[0][0]

def infer_edition(text):
    pats=[
        r"\b(\d+(?:st|nd|rd|th)\s+edition)\b",
        r"\b(\d+[ªº]?\s+edi[cç][aã]o)\b",
        r"\b(revised\s+edition)\b",
        r"\b(second|third|fourth|fifth|sixth|seventh|eighth|ninth|tenth)\s+edition\b",
        r"\b(segunda|terceira|quarta|quinta|sexta|s[eé]tima|oitava|nona|d[eé]cima)\s+edi[cç][aã]o\b"
    ]
    for p in pats:
        m=re.search(p,text,re.I)
        if m:return m.group(1).strip()
    return ""

def infer_authors(meta,lines):
    author=(meta.get("author") or "").strip()
    bad={"administrator","admin","unknown","microsoft","user"}
    if author and author.lower() not in bad and len(author)<180:
        names=[x.strip() for x in re.split(r";|,\s+(?=[A-Z][a-z]+(?:\s|$))",author) if x.strip()]
        return names[:8],.9,"pdf_metadata"
    # Conservative textual inference
    for i,line in enumerate(lines[:35]):
        if re.search(r"\b(by|por)\b",line,re.I) and len(line)<140:
            candidate=re.sub(r"^.*?\b(by|por)\b\s*:?\s*","",line,flags=re.I).strip()
            if 3<len(candidate)<120:
                return [candidate],.62,"first_pages"
        if re.search(r"\b(authors?|autores?)\b",line,re.I):
            candidate=re.sub(r"^.*?\b(authors?|autores?)\b\s*:?\s*","",line,flags=re.I).strip()
            if 3<len(candidate)<140:
                return [candidate],.62,"first_pages"
    return [],.2,"unknown"

def score_title_line(line):
    if not (4 <= len(line) <= 180): return -999
    if re.search(r"https?://|www\.|isbn|copyright|contents|sum[aá]rio",line,re.I): return -999
    words=line.split()
    if len(words)<2:return -20
    caps=sum(1 for ch in line if ch.isalpha() and ch.isupper())
    alpha=sum(1 for ch in line if ch.isalpha())
    capratio=caps/max(1,alpha)
    return len(words)*2 + capratio*8 - abs(len(line)-55)/18

def infer_title(meta,lines,filename):
    title=(meta.get("title") or "").strip()
    bad=re.compile(r"^(untitled|microsoft word|document|pdf|unknown)",re.I)
    if title and not bad.search(title) and len(title)>3:
        return title,.93,"pdf_metadata"
    candidates=sorted(((score_title_line(x),x) for x in lines[:45]),reverse=True)
    for score,line in candidates:
        if score>0:
            return line,.72,"first_pages"
    return Path(filename).stem,.35,"filename"

def infer_publisher(text):
    pats=[
        r"\b(Published by|Publisher|Editora)\s*:?\s*([^\n]{3,120})",
        r"\b(Society of Naval Architects and Marine Engineers|SNAME)\b"
    ]
    for p in pats:
        m=re.search(p,text,re.I)
        if m:
            return (m.group(2) if m.lastindex and m.lastindex>=2 else m.group(1)).strip()
    return ""

def make_chunks(pages,target=2600,overlap=320):
    chunks=[];buf="";start=None;end=None
    def flush():
        nonlocal buf,start,end
        clean=buf.strip()
        if clean: chunks.append({"page_start":start,"page_end":end,"content":clean})
        buf=clean[-overlap:] if clean and overlap else ""
        start=end
    for page_no,text in pages:
        paras=[p.strip() for p in re.split(r"\n\s*\n",text) if p.strip()]
        for para in paras:
            if start is None:start=page_no
            end=page_no
            add=para+"\n\n"
            if len(buf)+len(add)>target and buf: flush()
            buf+=add
    if buf.strip():chunks.append({"page_start":start,"page_end":end,"content":buf.strip()})
    return chunks

def load_manual_manifest(folder):
    p=folder/"manifest.json"
    if not p.exists():return {}
    try:
        data=json.loads(p.read_text(encoding="utf-8"))
        return {d.get("file"):d for d in data.get("documents",[]) if d.get("file")}
    except Exception:
        return {}

def merge_manual(auto,manual):
    if not manual:return auto
    protected={"file","sha256","page_count"}
    for k,v in manual.items():
        if k in protected:continue
        if v not in (None,"",[],{}):auto[k]=v
    auto["metadata_status"]="manual_override"
    return auto

def metadata_for_pdf(path):
    doc=fitz.open(path)
    meta=doc.metadata or {}
    sample=[]
    pages=[]
    for i in range(doc.page_count):
        text=clean_text(doc.load_page(i).get_text("text"))
        pages.append((i+1,text))
        if i<8:sample.append(text)
    doc.close()
    sample_text="\n\n".join(sample)
    lines=first_nonempty_lines(sample_text)
    title,tconf,tsrc=infer_title(meta,lines,path.name)
    authors,aconf,asrc=infer_authors(meta,lines)
    lang,lconf=detect_language(sample_text[:30000])
    edition=infer_edition(sample_text[:25000])
    isbn=infer_isbn(sample_text[:25000])
    year=infer_year(sample_text[:25000],meta)
    publisher=infer_publisher(sample_text[:25000])
    digest=sha256_file(path)
    status="auto_verified" if tconf>=.85 and lconf>=.65 else "review"
    auto={
        "file":path.name,"slug":slugify(title),"title":title,"authors":authors,
        "edition":edition,"publisher":publisher,"publication_year":year,"isbn":isbn,
        "language":lang,"document_type":"book","subjects":[],
        "page_count":len(pages),"sha256":digest,"metadata_status":status,
        "metadata_confidence":{"title":round(tconf,2),"authors":round(aconf,2),"language":round(lconf,2)},
        "metadata_source":{"title":tsrc,"authors":asrc,"language":"text_heuristic"},
        "rights_note":"Uso interno conforme licença/direitos aplicáveis."
    }
    return auto,pages

def save_manifest(folder,docs):
    out={"generated_by":"ESTIBORDO auto library importer","documents":docs}
    (folder/"manifest.json").write_text(json.dumps(out,ensure_ascii=False,indent=2),encoding="utf-8")

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument("--folder",default=str(DEFAULT_FOLDER))
    ap.add_argument("--scan-only",action="store_true",help="Gera/atualiza manifest.json sem gravar no PostgreSQL.")
    args=ap.parse_args()
    folder=Path(args.folder).resolve();folder.mkdir(parents=True,exist_ok=True)
    pdfs=sorted(folder.glob("*.pdf"))
    if not pdfs: raise SystemExit(f"Nenhum PDF encontrado em {folder}")

    manual=load_manual_manifest(folder)
    scanned=[];extracted={}
    print(f"Encontrados {len(pdfs)} PDFs.")
    for i,pdf in enumerate(pdfs,1):
        print(f"[{i}/{len(pdfs)}] Analisando {pdf.name}...")
        auto,pages=metadata_for_pdf(pdf)
        auto=merge_manual(auto,manual.get(pdf.name))
        scanned.append(auto);extracted[pdf.name]=pages
        mark="OK" if auto["metadata_status"]=="auto_verified" else "REVISAR"
        print(f"  [{mark}] {auto['title']} | {auto['language']} | {auto['page_count']} páginas")

    save_manifest(folder,scanned)
    print(f"Manifesto salvo em: {folder/'manifest.json'}")
    if args.scan_only:return

    load_dotenv(ROOT/".env.local");load_dotenv(ROOT/".env")
    db=os.getenv("DATABASE_URL")
    if not db: raise SystemExit("DATABASE_URL não encontrada em .env.local/.env")

    with psycopg.connect(db) as conn:
        for meta in scanned:
            pages=extracted[meta["file"]]
            with conn.cursor() as cur:
                cur.execute("""
                  INSERT INTO library_documents
                  (slug,title,authors,edition,publisher,publication_year,isbn,language,document_type,
                   file_name,storage_path,sha256,page_count,rights_note,metadata_status,
                   metadata_confidence,metadata_source,is_active)
                  VALUES(%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s::jsonb,%s::jsonb,TRUE)
                  ON CONFLICT(sha256) DO UPDATE SET
                    slug=EXCLUDED.slug,title=EXCLUDED.title,authors=EXCLUDED.authors,
                    edition=EXCLUDED.edition,publisher=EXCLUDED.publisher,
                    publication_year=EXCLUDED.publication_year,isbn=EXCLUDED.isbn,
                    language=EXCLUDED.language,document_type=EXCLUDED.document_type,
                    file_name=EXCLUDED.file_name,storage_path=EXCLUDED.storage_path,
                    page_count=EXCLUDED.page_count,rights_note=EXCLUDED.rights_note,
                    metadata_status=EXCLUDED.metadata_status,
                    metadata_confidence=EXCLUDED.metadata_confidence,
                    metadata_source=EXCLUDED.metadata_source,updated_at=NOW()
                  RETURNING id
                """,(meta["slug"],meta["title"],meta["authors"],meta["edition"],meta["publisher"],
                     meta["publication_year"],meta["isbn"],meta["language"],meta["document_type"],
                     meta["file"],str(folder/meta["file"]),meta["sha256"],meta["page_count"],
                     meta["rights_note"],meta["metadata_status"],
                     json.dumps(meta["metadata_confidence"]),json.dumps(meta["metadata_source"])))
                doc_id=cur.fetchone()[0]
                cur.execute("DELETE FROM library_document_subjects WHERE document_id=%s",(doc_id,))
                for s in meta.get("subjects",[]):
                    cur.execute("INSERT INTO library_document_subjects(document_id,subject_slug) VALUES(%s,%s) ON CONFLICT DO NOTHING",(doc_id,s))
                cur.execute("DELETE FROM library_pages WHERE document_id=%s",(doc_id,))
                cur.executemany("INSERT INTO library_pages(document_id,page_number,content) VALUES(%s,%s,%s)",[(doc_id,n,t) for n,t in pages])
                cur.execute("DELETE FROM library_chunks WHERE document_id=%s",(doc_id,))
                chunks=make_chunks(pages)
                cur.executemany("""
                  INSERT INTO library_chunks(document_id,page_start,page_end,chunk_index,language,content)
                  VALUES(%s,%s,%s,%s,%s,%s)
                """,[(doc_id,c["page_start"],c["page_end"],idx,meta["language"],c["content"]) for idx,c in enumerate(chunks)])
            conn.commit()
            print(f"  Importado: {meta['title']} ({len(chunks)} trechos)")

if __name__=="__main__":main()

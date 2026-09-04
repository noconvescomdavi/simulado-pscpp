#!/usr/bin/env python3
from pathlib import Path
import os
from bs4 import BeautifulSoup
import psycopg
from dotenv import load_dotenv

ROOT=Path(__file__).resolve().parents[1]
load_dotenv(ROOT/".env.local");load_dotenv(ROOT/".env")
db=os.getenv("DATABASE_URL")
if not db: raise SystemExit("DATABASE_URL ausente.")
rows=[]
for path in (ROOT/"protected-content"/"study-content"/"simulado").glob("*/index.html"):
    soup=BeautifulSoup(path.read_text(encoding="utf-8",errors="ignore"),"html.parser")
    subject=(soup.body.get("data-subject") if soup.body else None) or path.parent.name
    order=0
    for item in soup.select(".program .item"):
        n=item.select_one(".item-num");t=item.select_one(".item-text")
        if not n or not t: continue
        code=n.get_text(" ",strip=True).rstrip(".");title=t.get_text(" ",strip=True)
        parent=".".join(code.split(".")[:-1]) or None
        rows.append((subject,code,title,parent,order));order+=1
with psycopg.connect(db) as conn:
    with conn.cursor() as cur:
        for row in rows:
            cur.execute("""
              INSERT INTO syllabus_topics(subject_slug,topic_code,title_pt,parent_code,sort_order)
              VALUES(%s,%s,%s,%s,%s)
              ON CONFLICT(subject_slug,topic_code) DO UPDATE SET
                title_pt=EXCLUDED.title_pt,parent_code=EXCLUDED.parent_code,sort_order=EXCLUDED.sort_order
            """,row)
    conn.commit()
print(f"{len(rows)} tópicos cadastrados.")

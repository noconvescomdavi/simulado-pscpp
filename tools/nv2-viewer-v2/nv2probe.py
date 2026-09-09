#!/usr/bin/env python3
import argparse, json, math, os, struct, zlib

SCALES=[("1e4",1e4),("1e5",1e5),("1e6",1e6),("1e7",1e7),("semicircle",2147483648/180)]

def entropy(data):
    if not data:return 0
    freq=[0]*256
    for b in data:freq[b]+=1
    n=len(data);h=0.0
    for f in freq:
        if f:
            p=f/n;h-=p*math.log2(p)
    return h

def scan_ascii(data):
    out=[]
    for s in (b"NAVIONICS",b"Navionics",b"NAVIONIC",b"SILVER",b"GOLD",b"PLATINUM"):
        p=0
        while True:
            p=data.find(s,p)
            if p<0:break
            out.append({"text":s.decode("ascii"),"offset":p});p+=1
    return out[:50]

def metrics(pts):
    xs=[p[0] for p in pts];ys=[p[1] for p in pts]
    ds=[math.hypot(pts[i][0]-pts[i-1][0],pts[i][1]-pts[i-1][1]) for i in range(1,len(pts))]
    return {"count":len(pts),"bbox":[min(xs),min(ys),max(xs),max(ys)],"span":[max(xs)-min(xs),max(ys)-min(ys)],"avgStep":sum(ds)/max(1,len(ds)),"smallStepRatio":sum(d<0.25 for d in ds)/max(1,len(ds))}

def score(m):
    count=min(1,m["count"]/300);cont=min(1,m["smallStepRatio"]/0.9)
    span=1 if m["span"][0]<=40 and m["span"][1]<=30 and sum(m["span"])>1e-5 else 0
    step=1 if m["avgStep"]<0.5 else .7 if m["avgStep"]<1 else .2
    return round(.3*count+.35*cont+.2*span+.15*step,4)

def near(a,b):
    d=math.hypot(a[0]-b[0],a[1]-b[1]);return 1e-10<d<=2.5

def scan_int32(data,source="raw"):
    out=[];maxlen=min(len(data),64*1024*1024)
    for endian,fmt in (("LE","<ii"),("BE",">ii")):
      for sname,div in SCALES:
       for order in ("lonlat","latlon"):
        run=[];runs=[]
        for off in range(0,maxlen-7,4):
            a,b=struct.unpack_from(fmt,data,off);a/=div;b/=div
            lon,lat=(a,b) if order=="lonlat" else (b,a)
            ok=math.isfinite(lon) and math.isfinite(lat) and abs(lon)<=180 and abs(lat)<=90
            if ok and (not run or near(run[-1],[lon,lat])):run.append([lon,lat])
            else:
                if len(run)>=12:runs.append(run)
                run=[[lon,lat]] if ok else []
        if len(run)>=12:runs.append(run)
        runs.sort(key=len,reverse=True)
        for pts in runs[:3]:
            m=metrics(pts);sc=score(m)
            if sc>.55:out.append({"kind":"int32","source":source,"endian":endian,"scale":sname,"order":order,"score":sc,"metrics":m,"points":pts[:20000]})
    return out

def inflate_candidates(data):
    out=[]
    for i in range(len(data)-2):
        if data[i]==0x78 and data[i+1] in (0x01,0x5e,0x9c,0xda):
            try:
                dec=zlib.decompress(data[i:])
                if 64<len(dec)<128*1024*1024:out.append((i,dec))
            except Exception:pass
            if len(out)>=24:break
    return out

def main():
    ap=argparse.ArgumentParser();ap.add_argument("file");ap.add_argument("-o","--output");args=ap.parse_args()
    data=open(args.file,"rb").read()
    cand=scan_int32(data)
    infl=inflate_candidates(data)
    for off,dec in infl:cand.extend(scan_int32(dec,f"deflate@{off}"))
    cand.sort(key=lambda x:x["score"],reverse=True)
    best=cand[0] if cand and cand[0]["score"]>=.78 and cand[0]["metrics"]["count"]>=20 else None
    result={"file":{"name":os.path.basename(args.file),"size":len(data)},"signature":scan_ascii(data[:4*1024*1024]),"entropy":[{"offset":i,"entropy":round(entropy(data[i:i+65536]),3)} for i in range(0,min(len(data),64*65536),65536)],"compressedBlocks":[{"offset":o,"size":len(d)} for o,d in infl],"state":"decoded-partial" if best else "unrecognized","best":best,"alternatives":cand[:8],"note":"Só aceita geometria com consistência espacial; não atribui simbologia Navionics sem evidência."}
    text=json.dumps(result,indent=2,ensure_ascii=False)
    if args.output:open(args.output,"w",encoding="utf-8").write(text)
    else:print(text)
if __name__=="__main__":main()

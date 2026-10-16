#!/usr/bin/env python3
"""Apply a source-verified, guarded editorial PIANC patch to staged and CGE banks."""
import json
from pathlib import Path

root=Path(__file__).resolve().parents[1]
patch=json.loads((root/"data/questions/patches/pianc121-cap1-editorial-001.json").read_text(encoding="utf-8"))
targets=[root/"data/questions/imports/pianc121-cap1-quarentena.json",root/"data/questions/conhecimentos-gerais.json"]
expected_count=46
for target in targets:
    data=json.loads(target.read_text(encoding="utf-8"))
    questions=data["questions"]
    assert sum(q["id"].startswith("CGE-PIANC121-C1-") for q in questions)==expected_count
    by_id={q["id"]:q for q in questions}
    for edit in patch["edits"]:
        q=by_id[edit["id"]]
        assert q["correct_answer"]==edit["expected_correct_answer"], edit["id"]
        assert q["active"] is False and q["status"]=="quarantined", edit["id"]
        assert set(o["key"] for o in edit["options"])==set("ABCDE")
        assert edit["expected_correct_answer"] in {o["key"] for o in edit["options"]}
        q["question"]=edit["question"]
        q["options"]=edit["options"]
        q["explanation"]=edit["explanation"]
        q.setdefault("quality",{})["editorial_patch"]=patch["version"]
        q["quality"]["editorial_source"]=patch["source"]
        q["quality"]["quarantine_reason"]="pianc121_editorial_review_not_homologated"
    target.write_text(json.dumps(data,ensure_ascii=False,indent=2)+"\n",encoding="utf-8")
    print("Patched",target.relative_to(root))

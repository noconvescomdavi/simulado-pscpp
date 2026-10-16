#!/usr/bin/env python3
"""Merge idempotente da extensão PIANC 121 em conhecimentos-gerais.json.
Não ativa nem homologa itens em quarentena. Faz backup lógico via arquivo distinto.
Uso: python merge_pianc121_conhecimentos_gerais.py BASE.json SAIDA.json
"""
import json, sys
from pathlib import Path
from collections import Counter

if len(sys.argv)!=3:
    raise SystemExit('Uso: python merge_pianc121_conhecimentos_gerais.py BASE.json SAIDA.json')
base_path,output_path=map(Path,sys.argv[1:])
addon_path=Path(__file__).resolve().parents[1] / 'data/questions/imports/pianc121-cap1-quarentena.json'
base=json.loads(base_path.read_text(encoding='utf-8'))
addon=json.loads(addon_path.read_text(encoding='utf-8'))
assert isinstance(base.get('questions'),list)
assert base.get('schema_version')==addon.get('schema_version')
def align_pianc_taxonomy(question):
    """Align with the bibliography catalog, preserving stable question IDs."""
    t=question['taxonomy']
    if t.get('bibliography_id') not in ('pianc121','pianc-channels'):
        raise ValueError('Unexpected bibliography ID')
    t['bibliography_id']='pianc-channels'
    t['chapter_id']='pianc-channels::ch1'
    t['topic_id']=t['topic_id'].replace('VII-pianc121-ch1-','VII-pianc-channels-ch1-')
    question['tracking']['work']['id']='pianc-channels'
    question['tracking']['chapter']['id']='pianc-channels::ch1'
    question['tracking']['topic']['id']=t['topic_id']
    question.setdefault('tags',[])
    question['tags']=['pianc-channels' if x=='pianc121' else ('pianc-channels::ch1' if x=='pianc121::ch1' else x) for x in question['tags']]
    return question

existing={q['id']:q for q in base['questions']}
merged=0
updated=0
for q in addon['questions']:
    assert q['active'] is False and q['status']=='quarantined'
    q=align_pianc_taxonomy(q)
    if q['id'] in existing:
        old=existing[q['id']]
        if old['taxonomy'].get('bibliography_id') not in ('pianc121','pianc-channels'):
            raise SystemExit('Unexpected existing record: '+q['id'])
        old=align_pianc_taxonomy(old)
        if old!=q:
            raise SystemExit('CONFLITO DE CONTEUDO: '+q['id'])
        updated+=1
    else:
        base['questions'].append(q)
        existing[q['id']]=q
        merged+=1
# Validação de integridade da nova composição.
assert len({q['id'] for q in base['questions']})==len(base['questions'])
# Não reprovar a importação por anomalias preexistentes em registros não modificados.
# Validar rigorosamente apenas o lote PIANC adicionado/reencontrado.
assert all(
    len(q['options']) == 5
    and set(x['key'] for x in q['options']) == set('ABCDE')
    and q['correct_answer'] in set(x['key'] for x in q['options'])
    for q in addon['questions']
)
assert all(q['active'] is False and q['status']=='quarantined' for q in addon['questions'])
# Recalcular metadados de contagem (não inferir novas respostas ativas).
validation=base.setdefault('validation',{})
validation['total']=len(base['questions'])
validation['by_module']=dict(sorted(Counter(q.get('module','') for q in base['questions']).items()))
validation['by_difficulty']=dict(sorted(Counter(q.get('difficulty','') for q in base['questions']).items()))
validation['by_style']=dict(sorted(Counter(q.get('style','') for q in base['questions']).items()))
validation['answer_balance']=dict(sorted(Counter(q['correct_answer'] for q in base['questions']).items()))
validation['pianc121_quarantine_count']=sum(q.get('taxonomy',{}).get('bibliography_id')=='pianc-channels' and q.get('active') is False for q in base['questions'])
validation['metadata_recalculated_from_questions']=True
output_path.parent.mkdir(parents=True,exist_ok=True)
output_path.write_text(json.dumps(base,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(f'Merge OK: acrescentadas {merged}; total {len(base["questions"])}; PIANC 121 em quarentena {validation["pianc121_quarantine_count"]}.')
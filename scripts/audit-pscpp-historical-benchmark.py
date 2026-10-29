"""Recompute structural metrics from supplied original PDFs, not bank copies.

Usage: python3 scripts/audit-pscpp-historical-benchmark.py /path/to/dossier
Requires pdftotext, openpyxl and PyMuPDF. Does not publish complete examination texts.
Structural classification is not full editorial/bibliographic certification.
"""
import collections
import argparse
import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import openpyxl
import fitz


def colored_keys(pdf):
    """Associate red answer spans with geometric question/option boundaries.

    Number and point-value are separate PDF spans. Header/footer text is never
    removed globally, since an institutional name may be an answer component.
    Red notices before the first option do not constitute an answer key.
    """
    doc = fitz.open(pdf)
    spans = []
    for page_number, page in enumerate(doc, 1):
        page_spans = [s for b in page.get_text('dict')['blocks'] if 'lines' in b
                      for line in b['lines'] for s in line['spans']]
        for span in page_spans:
            spans.append({**span, 'page':page_number,
                          'position':page_number * 10000 + span['bbox'][1]})
    spans.sort(key=lambda s: (s['position'], s['bbox'][0]))
    headers = []
    for span in spans:
        if re.match(r'^\([\d.,]+\s*PONTO', span['text'].strip()):
            candidates = [s for s in spans if s['page'] == span['page']
                          and abs(s['bbox'][1]-span['bbox'][1]) < 2
                          and s['bbox'][0] < span['bbox'][0]
                          and re.fullmatch(r'\d{1,2}', s['text'].strip())]
            assert len(candidates) == 1, f'{pdf}: ambiguous question heading'
            headers.append((int(candidates[0]['text']), span['position']))
    result = {}
    for i, (number, position) in enumerate(headers):
        end = headers[i+1][1] if i+1 < len(headers) else float('inf')
        current_option = None
        evidence = {}
        for span in spans:
            if not position <= span['position'] < end:
                continue
            label = re.match(r'^\(?([a-e])\)', span['text'].strip())
            if label and span['bbox'][0] < 90:
                current_option = label[1].upper()
            # Superscript degree signs precede their baseline in y-sorted text;
            # they must not be assigned to the preceding answer alternative.
            if span['color'] == 0xFF0000 and span['size'] >= 8 and span['text'].strip() and current_option:
                evidence.setdefault(current_option, {'page':span['page'],
                    'bbox':[round(v, 3) for v in span['bbox']], 'color_rgb':'FF0000'})
        result[number] = evidence
    return result

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('dossier')
parser.add_argument('--private-text-output', help='Optional local extraction for reading; never commit complete source texts.')
args = parser.parse_args()
source = Path(args.dossier)
out = Path('docs/auditoria-pscpp')
out.mkdir(parents=True, exist_ok=True)
names = {
    2006: 'prova_escrita_2006.pdf', 2008: 'prova_escrita_2008.pdf',
    2011: 'prova_escrita_2011.pdf',
    2012: 'PROVA ROSA 2012 - GABARITO DEFINITIVO - 22 FEV 2013.pdf',
}
previous_book = openpyxl.load_workbook(source / 'analise_banca_PSCPP_2006_2008_2011_2012.xlsx', data_only=True)
previous = {(r[0], r[1]): r for r in list(previous_book['Inventário 264'].values)[1:]}
manual_file = out / 'REVISAO_HISTORICA_MANUAL.tsv'
manual = {}
if manual_file.exists():
    with manual_file.open(encoding='utf-8', newline='') as stream:
        for review in csv.DictReader(stream, delimiter='\t'):
            key = (int(review['year']), int(review['number']))
            assert key not in manual, f'Duplicate manual review: {key}'
            if review['format'] == 'X':
                assert review['cognitive_level'] == review['language'] == 'NA'
                assert review['observed_key'] == '-'
            else:
                assert review['format'] in 'ABCDE'
                assert review['cognitive_level'] in ['L1', 'L2', 'L3', 'L4']
                assert review['language'] in ['pt', 'en', 'mixed']
                assert review['observed_key'] in [*'ABCDE', '-']
            assert all(review.get(field) for field in ['subject','concept','source_work','editorial_notes'])
            assert review['subject'] in ['arte-naval','comunicacoes','meteorologia-oceanografia',
                'navegacao-aguas-restritas','manobrabilidade','legislacao-regulamentacao','conhecimentos-gerais','indisponivel_no_pdf']
            manual[key] = review
integrity = json.loads((out / 'INTEGRIDADE_DOSSIE.json').read_text())
expected_hashes = {entry['name']: entry['expected_sha256'] for entry in integrity}
formats = {'Alternativa direta/contextual': 'A', 'Afirmativas combinadas': 'B',
           'Sequência V/F (ou C/E)': 'C', 'Lacunas': 'D', 'Associação/correlação': 'E', 'Anulada': None}
rows = []
private_text_records = []
for year, name in names.items():
    pdf = source / name
    text = subprocess.check_output(['pdftotext', '-layout', str(pdf), '-'], text=True)
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
    assert digest == expected_hashes[name], f'{name}: source changed since manual review baseline'
    red_keys = colored_keys(pdf) if year in [2011, 2012] else {}
    if year == 2006:
        matches = [m for m in re.finditer(r'^[ \t]*(\d{1,2})[ \t]*$', text, re.M)
                   if not re.match(r'\s*\f', text[m.end():])]
    else:
        matches = list(re.finditer(r'^[ \t]*(\d{1,2})[ \t]+\(([\d.,]+)\s*PONTO[S]?\)([^\n]*)', text, re.M))
    expected = {2006: 70, 2008: 73, 2011: 71, 2012: 50}[year]
    assert [int(m[1]) for m in matches] == list(range(1, expected + 1)), f'{year}: incomplete numbering'
    for i, match in enumerate(matches):
        number = int(match[1])
        raw = text[match.end():matches[i + 1].start() if i + 1 < len(matches) else len(text)]
        option_matches = list(re.finditer(r'^\s*\(?([a-e])\)\s*', raw, re.M))
        # Table rows in 2011/49 and lettered statements in 2011/58 also use
        # a), b), etc. The final a-e run contains the answer alternatives.
        if len(option_matches) > 5:
            option_matches = option_matches[-5:]
        stem = raw[:option_matches[0].start()] if option_matches else raw
        options = [raw[m.end():option_matches[j + 1].start() if j + 1 < len(option_matches) else len(raw)]
                   for j, m in enumerate(option_matches)]
        annulled = bool(re.search('ANULAD', match[0] + raw, re.I))
        if not annulled:
            assert [m[1] for m in option_matches] == list('abcde'), f'{year}/{number}: options not recovered'
        color_evidence = red_keys.get(number, {})
        if year in [2011,2012]:
            assert len(color_evidence) == (0 if annulled else 1), f'{year}/{number}: ambiguous red key {color_evidence}'
        # C has priority over Roman numbering; D has priority over enumerated gaps.
        if sum(bool(re.search(r'\(\s*[VFCE]\s*\).*\(\s*[VFCE]\s*\)', o)) for o in options) >= 3:
            kind = 'C'
        elif re.search(r'_{3,}|preenchimento das lacunas|completa corretamente as lacunas', stem, re.I):
            kind = 'D'
        elif re.search(r'\b(?:associe|correlacione|coluna A|coluna B)\b', stem, re.I):
            kind = 'E'
        elif (year, number) == (2008, 27):
            # Reviewed exception: five definitions mapped to five knot names;
            # the alternatives are not truth-value combinations.
            kind = 'E'
        elif re.search(r'^\s*\(?(?:I|II|III|IV|V)\)', stem, re.M):
            kind = 'B'
        else:
            kind = 'A'
        prior = previous[year, number]
        private_text_records.append({
            'year':year, 'number':number, 'page_start':text[:match.start()].count('\f')+1,
            'points':None if year == 2006 else float(match[2].replace(',', '.')),
            'annulled':annulled, 'stem':stem,
            'options':[{'key':m[1].upper(),'text':opt} for m,opt in zip(option_matches, options)],
            'raw':raw,
            'key_markers':[option_matches[j][1].upper() for j,opt in enumerate(options) if re.search(r'\(\s*X\s*\)',opt,re.I)],
        })
        rows.append({
            'year': year, 'number': number, 'source_pdf': name, 'source_sha256': digest,
            'page_start': text[:match.start()].count('\f') + 1,
            'points': None if year == 2006 else float(match[2].replace(',', '.')),
            'annulled': annulled, 'format_recomputed': None if annulled else kind,
            'format_previous': formats[prior[6]],
            'format_disagreement': not annulled and kind != formats[prior[6]],
            'subject_previous_unverified': prior[4], 'topic_previous_unverified': prior[5],
            'key_previous_unverified': prior[8],
            'key_x_marker': ','.join(option_matches[j][1].upper() for j, opt in enumerate(options)
                                     if re.search(r'\(\s*X\s*\)', opt, re.I)),
            'key_red_marker': ','.join(color_evidence),
            'key_red_evidence': json.dumps(color_evidence, separators=(',', ':')) if color_evidence else '',
            'key_change_in_pdf': 'D -> A' if year == 2011 and number == 24
                                 and 'GABARITO PRELIMINAR ALTERADO' in match[0] else '',
            'extracted_stem_chars': len(stem.strip()), 'extracted_options': len(options),
            'review_status': 'structural_recomputation_only_full_editorial_read_pending',
        })
        review = manual.get((year, number))
        row = rows[-1]
        row.update({
            'record_reviewed': bool(review),
            'full_text_read': bool(review and review['format'] != 'X'),
            'format_reviewed': review['format'] if review else '',
            'subject_reviewed': review['subject'] if review else '',
            'concept_reviewed': review['concept'] if review else '',
            'cognitive_level_reviewed': review['cognitive_level'] if review else '',
            'language_reviewed': review['language'] if review else '',
            'observed_key_reviewed': review['observed_key'] if review else '',
            'tags_reviewed': review['tags'] if review else '',
            'source_work_reviewed': review['source_work'] if review else '',
            'editorial_notes_reviewed': review['editorial_notes'] if review else '',
        })
        if review:
            assert review['observed_key'] != '-' or annulled, f'{year}/{number}: missing key on valid question'
            if review['format'] == 'X':
                assert annulled and not option_matches, f'{year}/{number}: cannot mark available question as missing'
                row['review_status'] = 'annulled_notice_checked_question_body_not_in_supplied_pdf'
            else:
                row['review_status'] = 'full_text_read_key_observed_technical_revalidation_not_claimed'
            if row['key_x_marker']:
                assert row['key_x_marker'] == review['observed_key'], f'{year}/{number}: key marker disagrees with manual record'
            if row['key_red_marker']:
                assert row['key_red_marker'] == review['observed_key'], f'{year}/{number}: red key disagrees with manual record'
        if year in [2006,2008]:
            assert len(row['key_x_marker']) == (0 if annulled else 1), f'{year}/{number}: ambiguous X key'
assert set(manual).issubset({(r['year'], r['number']) for r in rows})
valid = [r for r in rows if not r['annulled']]
assert len(rows) == 264 and len(valid) == 254
for year in [2008, 2011, 2012]:
    assert abs(sum(r['points'] for r in rows if r['year'] == year) - 70) < 1e-9
manual_complete = len(manual) == len(rows)
structural_counts = collections.Counter(r['format_recomputed'] for r in valid)
counts = collections.Counter(r['format_reviewed'] if manual_complete else r['format_recomputed'] for r in valid)
manual_structural_differences = [r for r in valid if r['record_reviewed'] and r['format_reviewed'] != r['format_recomputed']]
assert {(r['year'],r['number']) for r in manual_structural_differences}.issubset({(2011,17),(2011,47)})
for r in manual_structural_differences:
    assert r['format_reviewed'] == 'A' and r['format_recomputed'] == 'B'
summary = {
    'status': 'historical_full_text_classified_not_active_bank_certification' if manual_complete else 'partial_manual_read',
    'total': len(rows), 'valid': len(valid), 'annulled': len(rows) - len(valid),
    'by_year': {year: {'total': sum(r['year'] == year for r in rows),
                      'valid': sum(r['year'] == year for r in valid),
                      'annulled_numbers': [r['number'] for r in rows if r['year'] == year and r['annulled']],
                      'points_total': None if year == 2006 else round(sum(r['points'] for r in rows if r['year'] == year), 8)}
                for year in names},
    'formats': {k: {'count': counts[k], 'percent': 100 * counts[k] / len(valid)} for k in 'ABCDE'},
    'formats_basis': 'manual_full_text_review' if manual_complete else 'structural_heuristic',
    'formats_structural_heuristic': dict(structural_counts),
    'manual_structural_disagreements': [{k:r[k] for k in ['year','number','format_recomputed','format_reviewed','editorial_notes_reviewed']} for r in manual_structural_differences],
    'disagreements': [{k: r[k] for k in ['year','number','page_start','format_previous','format_recomputed']}
                      for r in rows if r['format_disagreement']],
    'subject_matrix_status': 'manual_primary_competence_classification' if len(manual) == len(rows) else 'partial_manual_classification',
    'format_targets_approved': False,
    'historical_key_observation_complete': manual_complete,
    'historical_answers_revalidated_against_current_primary_bibliography': False,
    'manual_totals_valid': {
        field: dict(collections.Counter(r[field] for r in valid if r['record_reviewed']))
        for field in ['subject_reviewed','format_reviewed','cognitive_level_reviewed','language_reviewed']
    },
    'manual_subject_points_by_year': {
        year: {subject:{
            'valid_count':sum(r['subject_reviewed']==subject for r in valid if r['year']==year),
            'valid_points':None if year==2006 else round(sum(r['points'] for r in valid if r['year']==year and r['subject_reviewed']==subject), 8),
        } for subject in sorted({r['subject_reviewed'] for r in valid if r['year']==year and r['record_reviewed']})}
        for year in names
    },
    'annulled_points_by_year': {year:None if year==2006 else round(sum(r['points'] for r in rows if r['year']==year and r['annulled']),8) for year in names},
    'manual_records_reviewed': len(manual), 'manual_record_denominator': len(rows),
    'manual_full_text_read': sum(r['full_text_read'] for r in rows),
    'manual_full_text_denominator': sum(r['extracted_options'] > 0 for r in rows),
    'manual_read_by_year': {year: sum(r['year'] == year and r['full_text_read'] for r in rows) for year in names},
    'manual_records_complete_years': [year for year in names if all(r['record_reviewed'] for r in rows if r['year'] == year)],
    'manual_counts_by_year': {
        year: {
            field: dict(collections.Counter(r[field] for r in rows if r['year'] == year and r['full_text_read'] and not r['annulled']))
            for field in ['subject_reviewed','format_reviewed','cognitive_level_reviewed','language_reviewed']
        } for year in names
    },
}
(out / 'BENCHMARK_DADOS.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
with (out / 'BENCHMARK_264.csv').open('w', newline='', encoding='utf-8-sig') as stream:
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n'); writer.writeheader(); writer.writerows(rows)
if args.private_text_output:
    target = Path(args.private_text_output)
    assert not target.resolve().is_relative_to(Path.cwd().resolve()), 'Keep complete source extraction outside the public repository'
    target.write_text(json.dumps(private_text_records, ensure_ascii=False, indent=2)+'\n')
print(json.dumps(summary, ensure_ascii=False, indent=2))

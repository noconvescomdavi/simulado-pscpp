"""Recompute structural metrics from supplied original PDFs, not bank copies.

Usage: python3 scripts/audit-pscpp-historical-benchmark.py /path/to/dossier
Requires pdftotext and openpyxl. Does not publish complete examination texts.
Structural classification is not full editorial/bibliographic certification.
"""
import collections
import csv
import hashlib
import json
import re
import subprocess
import sys
from pathlib import Path

import openpyxl

source = Path(sys.argv[1])
out = Path('docs/auditoria-pscpp')
out.mkdir(parents=True, exist_ok=True)
names = {
    2006: 'prova_escrita_2006.pdf', 2008: 'prova_escrita_2008.pdf',
    2011: 'prova_escrita_2011.pdf',
    2012: 'PROVA ROSA 2012 - GABARITO DEFINITIVO - 22 FEV 2013.pdf',
}
previous_book = openpyxl.load_workbook(source / 'analise_banca_PSCPP_2006_2008_2011_2012.xlsx', data_only=True)
previous = {(r[0], r[1]): r for r in list(previous_book['Inventário 264'].values)[1:]}
formats = {'Alternativa direta/contextual': 'A', 'Afirmativas combinadas': 'B',
           'Sequência V/F (ou C/E)': 'C', 'Lacunas': 'D', 'Associação/correlação': 'E', 'Anulada': None}
rows = []
for year, name in names.items():
    pdf = source / name
    text = subprocess.check_output(['pdftotext', '-layout', str(pdf), '-'], text=True)
    digest = hashlib.sha256(pdf.read_bytes()).hexdigest()
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
            'key_change_in_pdf': 'D -> A' if year == 2011 and number == 24
                                 and 'GABARITO PRELIMINAR ALTERADO' in match[0] else '',
            'extracted_stem_chars': len(stem.strip()), 'extracted_options': len(options),
            'review_status': 'structural_recomputation_only_full_editorial_read_pending',
        })
valid = [r for r in rows if not r['annulled']]
assert len(rows) == 264 and len(valid) == 254
for year in [2008, 2011, 2012]:
    assert abs(sum(r['points'] for r in rows if r['year'] == year) - 70) < 1e-9
counts = collections.Counter(r['format_recomputed'] for r in valid)
summary = {
    'status': 'provisional_structural_recomputation_full_editorial_read_pending',
    'total': len(rows), 'valid': len(valid), 'annulled': len(rows) - len(valid),
    'by_year': {year: {'total': sum(r['year'] == year for r in rows),
                      'valid': sum(r['year'] == year for r in valid),
                      'annulled_numbers': [r['number'] for r in rows if r['year'] == year and r['annulled']],
                      'points_total': None if year == 2006 else round(sum(r['points'] for r in rows if r['year'] == year), 8)}
                for year in names},
    'formats': {k: {'count': counts[k], 'percent': 100 * counts[k] / len(valid)} for k in 'ABCDE'},
    'disagreements': [{k: r[k] for k in ['year','number','page_start','format_previous','format_recomputed']}
                      for r in rows if r['format_disagreement']],
    'subject_matrix_status': 'previous_labels_not_independently_revalidated',
    'format_targets_approved': False,
}
(out / 'BENCHMARK_DADOS.json').write_text(json.dumps(summary, ensure_ascii=False, indent=2) + '\n')
with (out / 'BENCHMARK_264.csv').open('w', newline='', encoding='utf-8-sig') as stream:
    writer = csv.DictWriter(stream, fieldnames=list(rows[0]), lineterminator='\n'); writer.writeheader(); writer.writerows(rows)
print(json.dumps(summary, ensure_ascii=False, indent=2))

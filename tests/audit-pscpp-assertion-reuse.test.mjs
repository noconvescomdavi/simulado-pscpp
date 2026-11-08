import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const script = fileURLToPath(new URL('../scripts/audit-pscpp-assertion-reuse.mjs', import.meta.url));
test('overlap between embedded and explicit assertions is not an internal duplicate', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'pscpp-audit-'));
  const sentence = 'O diâmetro tático corresponde ao deslocamento transversal aos cento e oitenta graus.';
  try {
    const path = join(dir, 'questions.json');
    await writeFile(path, JSON.stringify([
      {id:'MAN-TEST-1', active:true, assertions:[sentence], question:`( ) ${sentence}`},
      {id:'MAN-TEST-2', active:true, question:`( ) ${sentence}\n( ) ${sentence}`},
      {id:'MAN-TEST-3', active:false, assertions:[sentence]}
    ]));
    const run = spawnSync(process.execPath, [script, path], {encoding:'utf8'});
    assert.equal(run.status, 0, run.stderr);
    const result = JSON.parse(run.stdout);
    assert.equal(result.active_count, 2);
    assert.equal(result.cross_id_exact_assertion_groups, 1);
    assert.deepEqual(result.duplicates[0].ids, ['MAN-TEST-1','MAN-TEST-2']);
    assert.equal(result.internal_repeat_occurrences, 1);
    assert.equal(result.internal_repeats[0].id, 'MAN-TEST-2');
  } finally { await rm(dir,{recursive:true,force:true}); }
});

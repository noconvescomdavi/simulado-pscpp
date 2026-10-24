import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { hashLocalModuleClosure } from './lib/hash-module-closure.mjs';
import { appendMissingQuestionIds } from '../lib/question-source-merge.js';

const canonical = { id:'same', question:'canonical', options:[{key:'A',text:'answer'}] };
const supplementary = { id:'same', question:'older', options:[{letter:'A',text:'answer'}] };
const newItem = { id:'new' };
assert.deepEqual(appendMissingQuestionIds([canonical], [supplementary,newItem,newItem]), [canonical,newItem]);
assert.equal(appendMissingQuestionIds([canonical], [supplementary])[0], canonical);
const root = fileURLToPath(new URL('../', import.meta.url));
const notebook = await hashLocalModuleClosure(root, ['lib/question-banks-source.js']);
assert.ok(notebook.inputs.includes('data/pscpp/arte-naval-cap9-108.json'));
assert.ok(notebook.inputs.includes('lib/question-source-merge.js'));
const exam = await hashLocalModuleClosure(root, ['lib/pscpp-exam-source.js']);
assert.ok(exam.inputs.includes('data/pscpp/approved-drive-blocks/block_020.json'));
const temp = await fs.mkdtemp(path.join(os.tmpdir(), 'pscpp-source-hash-'));
try {
  await fs.writeFile(path.join(temp,'entry.js'), 'import data from "./child";');
  await fs.writeFile(path.join(temp,'child.js'), 'import data from "./leaf.json";');
  await fs.writeFile(path.join(temp,'leaf.json'), '{"value":1}');
  const before = await hashLocalModuleClosure(temp,['entry.js']);
  await fs.writeFile(path.join(temp,'unrelated.json'), '{"value":9}');
  assert.equal((await hashLocalModuleClosure(temp,['entry.js'])).sourceHash, before.sourceHash);
  await fs.writeFile(path.join(temp,'leaf.json'), '{"value":2}');
  assert.notEqual((await hashLocalModuleClosure(temp,['entry.js'])).sourceHash, before.sourceHash);
} finally { await fs.rm(temp,{recursive:true,force:true}); }
console.log('Canonical ID precedence and transitive source fingerprints: OK');

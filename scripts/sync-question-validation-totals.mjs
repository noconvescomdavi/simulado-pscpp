import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const dir = path.join(root, 'data', 'questions');
const files = fs.readdirSync(dir).filter((name) => name.endsWith('.json'));

for (const name of files) {
  const file = path.join(dir, name);
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  if (!Array.isArray(bank.questions)) continue;
  bank.validation = bank.validation && typeof bank.validation === 'object' ? bank.validation : {};
  bank.validation.total = bank.questions.length;
  bank.validation.last_sync = new Date().toISOString();
  fs.writeFileSync(file, JSON.stringify(bank, null, 2) + '\n');
  console.log(`${name}: validation.total=${bank.validation.total}`);
}

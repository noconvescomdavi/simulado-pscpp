import fs from "node:fs";

const targets = [
  {
    path: "data/questions/navegacao-aguas-restritas.json",
    match: /^NAV-MIGV3-C(37|38|40|42)-/,
    expected: 255,
    total: 2080
  },
  {
    path: "data/questions/meteorologia-oceanografia.json",
    match: /^MEO-MIGV3-C45-/,
    expected: 123,
    total: 1353
  }
];

for (const t of targets) {
  const bank = JSON.parse(fs.readFileSync(t.path, "utf8"));
  if (!Array.isArray(bank.questions)) throw new Error(`${t.path}: questions ausente`);

  const selected = bank.questions.filter((q) => t.match.test(String(q.id || "")));
  if (selected.length !== t.expected) {
    throw new Error(`${t.path}: novas=${selected.length}; esperado=${t.expected}`);
  }

  for (const q of selected) {
    if (!Array.isArray(q.options) || q.options.length !== 5) {
      throw new Error(`${q.id}: options inválidas`);
    }

    q.options = q.options.map((o) => ({
      key: o.key ?? o.letter,
      text: o.text
    }));

    const keys = q.options.map((o) => o.key);
    if (keys.join("") !== "ABCDE") {
      throw new Error(`${q.id}: chaves das opções=${keys.join(",")}`);
    }
    if (!keys.includes(q.correct_answer)) {
      throw new Error(`${q.id}: gabarito ${q.correct_answer} não existe nas opções`);
    }
  }

  if (bank.questions.length !== t.total) {
    throw new Error(`${t.path}: total=${bank.questions.length}; esperado=${t.total}`);
  }

  const ids = bank.questions.map((q) => q.id);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${t.path}: IDs duplicados`);
  }

  fs.writeFileSync(t.path, JSON.stringify(bank, null, 2) + "\n");
  console.log(JSON.stringify({
    path: t.path,
    total: bank.questions.length,
    corrected: selected.length
  }));
}

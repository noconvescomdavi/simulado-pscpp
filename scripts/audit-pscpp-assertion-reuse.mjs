// Diagnostic only: detects exact reused propositions without changing the PSCPP selector.
// Run: node scripts/audit-pscpp-assertion-reuse.mjs
import { readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const source = new URL("../data/pscpp/runtime-active-questions.json", import.meta.url);
const bytes = await readFile(source);
const parsed = JSON.parse(bytes.toString("utf8"));
if (!Array.isArray(parsed.questions)) throw new Error("Expected runtime questions array");
const normalize = value => String(value ?? "").normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/\s+/g, " ").trim();
const byAssertion = new Map();
const active = parsed.questions.filter(q => q && q.active !== false && !q.annulled);
for (const q of active) {
  const explicit = Array.isArray(q.assertions) ? q.assertions.map(a => typeof a === "string" ? a : a?.text) : [];
  const embedded = String(q.question ?? "").split(/\r?\n/)
    .filter(line => /^\s*(?:I|II|III|IV|V|VI)\s*[).:-]\s+/i.test(line))
    .map(line => line.replace(/^\s*(?:I|II|III|IV|V|VI)\s*[).:-]\s+/i, ""));
  for (const assertion of [...explicit, ...embedded]) {
    const key = normalize(assertion);
    if (key.length < 35) continue;
    if (!byAssertion.has(key)) byAssertion.set(key, new Set());
    byAssertion.get(key).add(String(q.id));
  }
}
const duplicates = [...byAssertion.entries()]
  .filter(([, ids]) => ids.size > 1)
  .map(([assertion, ids]) => ({ ids: [...ids].sort(), assertion_sha256: createHash("sha256").update(assertion).digest("hex"), assertion }))
  .sort((a, b) => a.ids.join(",").localeCompare(b.ids.join(",")) || a.assertion_sha256.localeCompare(b.assertion_sha256));
const output = {
  source: "data/pscpp/runtime-active-questions.json",
  source_sha256: createHash("sha256").update(bytes).digest("hex"),
  active_count: active.length,
  cross_id_exact_assertion_groups: duplicates.length,
  duplicates,
  limitation: "Exact normalized text only; not a semantic equivalence test or evidence of co-selection. Source is runtime snapshot, not necessarily all editorial-bank records."
};
process.stdout.write(JSON.stringify(output, null, 2) + "\n");

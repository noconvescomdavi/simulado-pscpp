const CATEGORY_POINTS = new Map([
  ["CLC", 2.0], ["OF. GENERAL", 2.0], ["OFICIAL GENERAL", 2.0], ["OF. SUPERIOR", 2.0], ["OFICIAL SUPERIOR", 2.0],
  ["CCB", 1.5], ["CAPITÃO-TENENTE", 1.5], ["CAPITAO-TENENTE", 1.5],
  ["1ON", 1.0], ["PRT", 1.0], ["1º TENENTE", 1.0], ["1 TENENTE", 1.0],
  ["2ON", 0.8], ["CFL", 0.8], ["2º TENENTE", 0.8], ["2 TENENTE", 0.8],
  ["MCB", 0.5], ["PLF", 0.5], ["PAP", 0.5],
  ["CTR", 0.3], ["MFL", 0.3], ["PPI", 0.3],
]);

function days(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

function codeFromCategory(value) {
  const text = String(value || "").toUpperCase();
  for (const code of CATEGORY_POINTS.keys()) {
    if (text.includes(code)) return code;
  }
  return "";
}

export function embarkationPoints(value) {
  const d = days(value);
  if (d > 2190) return 3;
  if (d >= 1461) return 2;
  if (d >= 731) return 1;
  return 0;
}

export function categoryPoints(value) {
  return CATEGORY_POINTS.get(codeFromCategory(value)) || 0;
}

export function commandPoints(value) {
  const d = days(value);
  if (d > 1460) return 5;
  if (d >= 1096) return 4;
  if (d >= 731) return 3;
  if (d >= 366) return 2;
  if (d >= 180) return 1;
  return 0;
}

export function calculateTitleScore({ category, embarkationDays, commandDays }) {
  const embarkation = embarkationPoints(embarkationDays);
  const professionalCategory = categoryPoints(category);
  const command = commandPoints(commandDays);
  return {
    embarkation,
    category: professionalCategory,
    command,
    total: embarkation + professionalCategory + command,
  };
}

const AQUAVIARIO_POINTS = new Map([
  ["CLC", 2.0],
  ["CCB", 1.5],
  ["1ON", 1.0], ["PRT", 1.0],
  ["2ON", 0.8], ["CFL", 0.8],
  ["MCB", 0.5], ["PLF", 0.5], ["PAP", 0.5],
  ["CTR", 0.3], ["MFL", 0.3], ["PPI", 0.3],
]);

function days(value) {
  const n = Number(value || 0);
  return Number.isFinite(n) && n > 0 ? Math.floor(n) : 0;
}

export function embarkationPoints(value) {
  const d = days(value);
  if (d > 2190) return 3;
  if (d >= 1461) return 2;
  if (d >= 731) return 1;
  return 0;
}

export function categoryPoints(value, occupationType = "") {
  const text = String(value || "").toUpperCase();
  if (occupationType === "militar_mb") {
    if (text.includes("OFICIAL GENERAL") || text.includes("OFICIAL SUPERIOR")) return 2;
    if (text.includes("CAPITÃO-TENENTE") || text.includes("CAPITAO-TENENTE")) return 1.5;
    if (text.includes("1º TENENTE") || text.includes("1 TENENTE")) return 1;
    if (text.includes("2º TENENTE") || text.includes("2 TENENTE")) return 0.8;
    return 0;
  }
  if (occupationType !== "aquaviario") return 0;
  for (const [code, points] of AQUAVIARIO_POINTS) {
    if (new RegExp(`(?:—|\\s)\\s*${code}$`).test(text) || text === code) return points;
  }
  return 0;
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

export function calculateTitleScore({ category, occupationType, embarkationDays, commandDays }) {
  const embarkation = embarkationPoints(embarkationDays);
  const professionalCategory = categoryPoints(category, occupationType);
  const command = commandPoints(commandDays);
  return {
    embarkation,
    category: professionalCategory,
    command,
    total: embarkation + professionalCategory + command,
  };
}

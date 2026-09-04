export const SUBJECTS = [
  { slug: "manobrabilidade", label: "Manobrabilidade" },
  { slug: "arte-naval", label: "Arte Naval" },
  { slug: "navegacao-aguas-restritas", label: "Navegação em Águas Restritas" },
  { slug: "legislacao-regulamentacao", label: "Legislação e Regulamentação" },
  { slug: "meteorologia-oceanografia", label: "Meteorologia e Oceanografia" },
  { slug: "comunicacoes", label: "Comunicações" },
  { slug: "conhecimentos-gerais", label: "Conhecimentos Gerais" },
];

function comparable(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeSubject(value) {
  const normalized = comparable(value);
  return SUBJECTS.find(
    (subject) => normalized === subject.slug || normalized === comparable(subject.label)
  )?.slug || normalized || "geral";
}

export function subjectLabel(slug) {
  return SUBJECTS.find((subject) => subject.slug === normalizeSubject(slug))?.label || String(slug);
}

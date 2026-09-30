import officialExams from "../data/pscpp/official-exams.json";
import { historicalSubject, HISTORICAL_SAMPLE } from "./historical-exam-blueprint";
import { normalizeSubject, ALL_SUBJECTS_SLUG, TRIAL_SUBJECT_SLUG } from "./subjects";
import { buildQuestionFilterFacets, filterQuestions } from "./question-filters";

// Use original exams, before any simulation-specific reformulation.
const questions = officialExams.questions
  .filter(q => q.origin === "official_exam" && HISTORICAL_SAMPLE.years.includes(Number(q.year)) &&
    q.active !== false && !q.annulled && q.validation_status !== "rejected")
  .map(q => {
    const subject = historicalSubject(q);
    return {
      ...q,
      source_subject: subject,
      tags: [...(q.tags || []), ...(/ripeam|colreg/i.test(q.question) ? ["ripeam"] : [])],
      tracking: {
        subject_slug: subject,
        work: { id: `pscpp-official-${q.year}`, title: q.source.title },
        chapter: { id: `pscpp-official-${q.year}-${q.number}`, number: String(q.number),
          title: `Questão ${q.number}`, label: `Questão ${q.number}` },
      },
    };
  });
const index = new Map(questions.map(q => [String(q.id), q]));

export function getOfficialNotebookBank(subject) {
  const key = normalizeSubject(subject);
  return { title: "Provas anteriores PSCPP", questions:
    [ALL_SUBJECTS_SLUG, TRIAL_SUBJECT_SLUG].includes(key)
      ? questions : questions.filter(q => q.source_subject === key) };
}

export function getOfficialNotebookQuestion(subject, id) {
  const q = index.get(String(id));
  return q && q.source_subject === normalizeSubject(subject) ? q : null;
}

export function selectOfficialNotebookQuestions(subjects, filters = {}) {
  const selected = new Set(subjects.map(normalizeSubject));
  const all = selected.has(ALL_SUBJECTS_SLUG) || selected.has(TRIAL_SUBJECT_SLUG);
  return filterQuestions(questions.filter(q => all || selected.has(q.source_subject)),
    { ...filters, official_only: true });
}

export function officialNotebookMetadata(subject) {
  const bank = getOfficialNotebookBank(subject);
  return {
    official_count: bank.questions.length,
    official_year_counts: Object.fromEntries(HISTORICAL_SAMPLE.years.map(year =>
      [year, bank.questions.filter(q => Number(q.year) === year).length])),
    official_filters: buildQuestionFilterFacets(bank.questions, normalizeSubject(subject)),
  };
}

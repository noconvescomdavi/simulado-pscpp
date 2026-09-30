import restorations from "../data/question-restorations/notebook-complete-stems.json";

import contextRestorations from "../data/question-restorations/notebook-context-stems.json";

const edits = new Map([...restorations.edits, ...contextRestorations.edits].map(edit => [`${edit.bank}::${edit.id}`, edit]));

// Apply after automatic editorial normalization, which removed inline
// propositions and legitimate fill-in sentences by treating every quote as a leak.
export function restoreCompleteNotebookStem(subject, question) {
  const edit = edits.get(`${subject}::${question.id}`);
  if (!edit) return question;
  const { structure, ...restored } = question;
  return {
    ...restored,
    question: edit.question,
    ...(edit.pscpp_format ? { pscpp_format: edit.pscpp_format, style: edit.style } : {}),
    ...(edit.options ? { options: edit.options, explanation: edit.explanation } : {}),
    editorial_review: {
      ...question.editorial_review,
      complete_stem_restored: true,
      complete_stem_version: restorations.version,
    },
  };
}

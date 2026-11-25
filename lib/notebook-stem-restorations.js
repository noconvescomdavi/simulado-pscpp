import manMsc137Lote39 from "../data/question-restorations/manobrabilidade-msc137-lote-39.json";
import manMsc137Lote40 from "../data/question-restorations/manobrabilidade-msc137-lote-40.json";
import manMsc137Lote41 from "../data/question-restorations/manobrabilidade-msc137-lote-41.json";
import manMsc137Lote42 from "../data/question-restorations/manobrabilidade-msc137-lote-42.json";
import manMsc137Lote43 from "../data/question-restorations/manobrabilidade-msc137-lote-43.json";
import manMsc137Lote44 from "../data/question-restorations/manobrabilidade-msc137-lote-44.json";
import manMsc137Lote45 from "../data/question-restorations/manobrabilidade-msc137-lote-45.json";
import manMsc137Lote46 from "../data/question-restorations/manobrabilidade-msc137-lote-46.json";
import manMsc137Lote47 from "../data/question-restorations/manobrabilidade-msc137-lote-47.json";
import manMsc137Lote48 from "../data/question-restorations/manobrabilidade-msc137-lote-48.json";
import manMsc137Lote49 from "../data/question-restorations/manobrabilidade-msc137-lote-49.json";
import manMsc137Lote50 from "../data/question-restorations/manobrabilidade-msc137-lote-50.json";
import manCrenshawLote51 from "../data/question-restorations/manobrabilidade-crenshaw-lote-51.json";
import manMsc1053Lote52 from "../data/question-restorations/manobrabilidade-msc1053-lote-52.json";
import manBertramLote53 from "../data/question-restorations/manobrabilidade-bertram-lote-53.json";
import manLarssonLote54 from "../data/question-restorations/manobrabilidade-larsson-lote-54.json";
import restorations from "../data/question-restorations/notebook-complete-stems.json";

import contextRestorations from "../data/question-restorations/notebook-context-stems.json";

const edits = new Map([...restorations.edits, ...contextRestorations.edits, ...manMsc137Lote39.notebookStems, ...manMsc137Lote40.notebookStems, ...manMsc137Lote41.notebookStems, ...manMsc137Lote42.notebookStems, ...manMsc137Lote43.notebookStems, ...manMsc137Lote44.notebookStems, ...manMsc137Lote45.notebookStems, ...manMsc137Lote46.notebookStems, ...manMsc137Lote47.notebookStems, ...manMsc137Lote48.notebookStems, ...manMsc137Lote49.notebookStems, ...manMsc137Lote50.notebookStems, ...manCrenshawLote51.notebookStems, ...manMsc1053Lote52.notebookStems, ...manBertramLote53.notebookStems, ...manLarssonLote54.notebookStems].map(edit => [`${edit.bank}::${edit.id}`, edit]));

export const completeNotebookStemEdits = restorations.edits.map(edit => edits.get(`${edit.bank}::${edit.id}`));

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

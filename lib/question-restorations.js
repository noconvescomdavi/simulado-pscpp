import arte from "../data/question-restorations/arte-naval.json";
import com from "../data/question-restorations/comunicacoes.json";
import comSequential from "../data/question-restorations/comunicacoes-sequencial.json";
import cge from "../data/question-restorations/conhecimentos-gerais.json";
import leg1 from "../data/question-restorations/legislacao-regulamentacao-01.json";
import leg2 from "../data/question-restorations/legislacao-regulamentacao-02.json";
import leg3 from "../data/question-restorations/legislacao-regulamentacao-03.json";
import leg4 from "../data/question-restorations/legislacao-regulamentacao-04.json";
import leg5 from "../data/question-restorations/legislacao-regulamentacao-05.json";
import leg6 from "../data/question-restorations/legislacao-regulamentacao-06.json";
import man1 from "../data/question-restorations/manobrabilidade-01.json";
import man2 from "../data/question-restorations/manobrabilidade-02.json";
import man3 from "../data/question-restorations/manobrabilidade-03.json";
import man4 from "../data/question-restorations/manobrabilidade-04.json";
import man5 from "../data/question-restorations/manobrabilidade-05.json";
import met1 from "../data/question-restorations/meteorologia-oceanografia-01.json";
import met2 from "../data/question-restorations/meteorologia-oceanografia-02.json";
import met3 from "../data/question-restorations/meteorologia-oceanografia-03.json";
import met4 from "../data/question-restorations/meteorologia-oceanografia-04.json";
import met5 from "../data/question-restorations/meteorologia-oceanografia-05.json";
import met6 from "../data/question-restorations/meteorologia-oceanografia-06.json";
import met7 from "../data/question-restorations/meteorologia-oceanografia-07.json";
import nav from "../data/question-restorations/navegacao-aguas-restritas-01.json";
import { reformulateLeakingStem } from "./question-quality.js";


const RESTORATIONS = {
  "arte-naval": [arte],
  comunicacoes: [com],
  "conhecimentos-gerais": [cge],
  "legislacao-regulamentacao": [leg1, leg2, leg3, leg4],
  manobrabilidade: [man1, man2, man3, man4, man5],
  "meteorologia-oceanografia": [met1, met2, met3, met4, met5, met6, met7],
  "navegacao-aguas-restritas": [nav],
};

const EDITORIAL_OVERRIDES = {
  comunicacoes: comSequential.questions,
  "legislacao-regulamentacao": leg5.questions,
};

const contentEdits = new Map(leg6.questions.map(q => [String(q.id), q]));

// Run after the caderno extensions have been appended: LEG-B questions must
// receive the same final editorial override as questions from the base bank.
export function applyContentEditorialRestoration(subject, question) {
  if (subject !== "legislacao-regulamentacao") return question;
  const edit = contentEdits.get(String(question.id));
  if (!edit) return question;
  return {
    ...question, ...edit,
    source: { ...question.source, ...edit.source },
    tracking: question.tracking ? {
      ...question.tracking,
      topic: { ...question.tracking.topic, title: edit.topic },
    } : question.tracking,
    provenance: { ...question.provenance, ...edit.provenance },
  };
}

export function applyQuestionRestorations(subject, bank) {
  const packs = RESTORATIONS[subject] || [];
  const edits = EDITORIAL_OVERRIDES[subject] || [];
  if (!packs.length && !edits.length) return bank;
  const replacements = new Map(packs.flatMap((pack) => pack.questions || []).map((q) => [String(q.id), q]));
  const overrides = new Map(edits.map((q) => [String(q.id), q]));
  return {
    ...bank,
    questions: (bank.questions || []).map((q) => {
      const restored = replacements.get(String(q.id)) || q;
      const edit = overrides.get(String(q.id));
      return reformulateLeakingStem(edit ? {
        ...restored,
        ...edit,
        source: { ...restored.source, ...edit.source },
        provenance: { ...restored.provenance, ...edit.provenance },
      } : restored);
    }),
  };
}

export function restorationCount(subject) {
  return (RESTORATIONS[subject] || []).reduce((sum, pack) => sum + (pack.questions || []).length, 0);
}

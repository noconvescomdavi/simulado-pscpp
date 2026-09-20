import arte from "../data/question-restorations/arte-naval.json";
import com from "../data/question-restorations/comunicacoes.json";
import cge from "../data/question-restorations/conhecimentos-gerais.json";
import leg1 from "../data/question-restorations/legislacao-regulamentacao-01.json";
import leg2 from "../data/question-restorations/legislacao-regulamentacao-02.json";
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
import { reformulateLeakingStem } from "./question-quality";


const RESTORATIONS = {
  "arte-naval": [arte],
  comunicacoes: [com],
  "conhecimentos-gerais": [cge],
  "legislacao-regulamentacao": [leg1, leg2],
  manobrabilidade: [man1, man2, man3, man4, man5],
  "meteorologia-oceanografia": [met1, met2, met3, met4, met5, met6, met7],
  "navegacao-aguas-restritas": [nav],
};

export function applyQuestionRestorations(subject, bank) {
  const packs = RESTORATIONS[subject] || [];
  if (!packs.length) return bank;
  const replacements = new Map(packs.flatMap((pack) => pack.questions || []).map((q) => [String(q.id), q]));
  return {
    ...bank,
    questions: (bank.questions || []).map((q) => reformulateLeakingStem(replacements.get(String(q.id)) || q)),
  };
}

export function restorationCount(subject) {
  return (RESTORATIONS[subject] || []).reduce((sum, pack) => sum + (pack.questions || []).length, 0);
}

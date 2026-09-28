import catalog from "../data/questions/runtime-question-catalog.json";
import {normalizeSubject,ALL_SUBJECTS_SLUG,TRIAL_SUBJECT_SLUG} from "./subjects";

const ordinary=catalog.banks.filter(bank=>bank.slug!=="simulado-pscpp");
const bySlug=new Map(catalog.banks.map(bank=>[bank.slug,bank]));
export function availableQuestionBanks({includePscpp=false}={}){
  return includePscpp?catalog.banks:ordinary;
}
export function getQuestionCatalogCount(subject){
  const slug=normalizeSubject(subject);
  if(slug===ALL_SUBJECTS_SLUG||slug===TRIAL_SUBJECT_SLUG)return ordinary.reduce((n,bank)=>n+bank.count,0);
  return bySlug.get(slug)?.count??null;
}

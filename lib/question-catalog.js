import facets from "../data/questions/runtime-question-facets.json";
import {availableQuestionBanks as summaries,getQuestionCatalogCount} from "./question-summary";
import {normalizeSubject,ALL_SUBJECTS_SLUG,TRIAL_SUBJECT_SLUG} from "./subjects";

const empty={works:[],chapters:[],modules:[]};
export function availableQuestionBanks({includeFilters=false,includePscpp=false}={}){
  const banks=summaries({includePscpp});
  return includeFilters?banks.map(bank=>({...bank,filters:facets.by_slug[bank.slug]||empty})):banks;
}
export function getQuestionFilterFacets(subject){
  const slug=normalizeSubject(subject);
  if(slug===ALL_SUBJECTS_SLUG||slug===TRIAL_SUBJECT_SLUG)return facets.combined_filters;
  return getQuestionCatalogCount(slug)===null?empty:facets.by_slug[slug]||empty;
}
export {getQuestionCatalogCount};

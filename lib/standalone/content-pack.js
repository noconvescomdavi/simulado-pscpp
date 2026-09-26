import {availableQuestionBanks,getQuestionBank,publicQuestion} from "../question-banks";
export const STANDALONE_CONTENT_SCHEMA=1;
export function bundledContentPack(){const banks=(availableQuestionBanks()||[]).map(b=>{const bank=getQuestionBank(b.slug);return {subject:b.slug,title:b.title||bank?.title||b.slug,questions:(bank?.questions||[]).map(q=>publicQuestion(q))}}).filter(b=>b.questions.length);const total_questions=banks.reduce((n,b)=>n+b.questions.length,0);return {schema_version:STANDALONE_CONTENT_SCHEMA,version:"bundled-"+STANDALONE_CONTENT_SCHEMA,banks,total_questions};}

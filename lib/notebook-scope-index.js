import scope from "../data/questions/runtime-notebook-scope.json";
import {normalizeSubject} from "./subjects";

export function getNotebookScopeEntry(subject,id){
  return scope.scope_index[normalizeSubject(subject)]?.[String(id)]||null;
}

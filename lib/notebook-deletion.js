import {withTransaction} from "./db";
import {deleteNotebookRecord,isNotebookId} from "./notebook-deletion-policy.mjs";

export {isNotebookId};

export function deleteUserNotebook(userId,notebookId){
  return deleteNotebookRecord(userId,notebookId,withTransaction);
}

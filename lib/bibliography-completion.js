import {query} from "./db";
import {bibliographyUnits} from "../data/study/bibliography";

// Calculate completion from the authoritative study catalogue, even if the
// optional SQL catalogue or its materialized study_progress is not populated.
export async function getBibliographyCompletion(userId){
  const units=bibliographyUnits();
  const records=await query("select bibliography_key,section_key,status from student_bibliography_progress where user_id=$1",[userId]);
  const completed=new Set(records.rows.filter(row=>row.status==="done").map(row=>row.bibliography_key+"|"+row.section_key));
  const done=units.filter(unit=>completed.has(unit.bibliography_key+"|"+unit.section_key)).length;
  return {done,total:units.length,percent:units.length?Math.round(done/units.length*100):0};
}

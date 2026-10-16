import assert from "node:assert/strict";
import test from "node:test";
import {lastEligibleStudyDate,earliestNextPending,sourceDate,classifyDeferred} from "../lib/study-plan-manual-queue.mjs";

const base={examDate:"2027-11-01",firstPassDeadline:"2027-07-30",studyDays:[1,2,3,4,5,6]};
test("reading is always postponed before the first-pass deadline",()=>{
 assert.equal(lastEligibleStudyDate({...base,taskType:"reading",fromDate:"2026-10-16"}),"2027-07-30");
 assert.equal(lastEligibleStudyDate({...base,taskType:"reading",fromDate:"2027-08-02"}),null);
});
test("questions and reviews may be deferred through the final pre-exam day",()=>{
 for(const type of ["questions","review"]){
  assert.equal(lastEligibleStudyDate({...base,taskType:type,fromDate:"2026-10-16"}),"2027-10-31");
 }
});
test("simulado remains on a Sunday",()=>{
 assert.equal(lastEligibleStudyDate({...base,taskType:"simulado",fromDate:"2027-10-17"}),"2027-10-31");
});
test("tail date honors study weekdays, while preserving study Sundays",()=>{
 assert.equal(lastEligibleStudyDate({...base,taskType:"reading",fromDate:"2027-07-20",studyDays:[2]}),"2027-07-27");
 assert.equal(lastEligibleStudyDate({...base,taskType:"questions",fromDate:"2027-10-29",studyDays:[]}),"2027-10-31");
});
test("there is no eligible day after the examination",()=>{
 assert.equal(lastEligibleStudyDate({...base,taskType:"questions",fromDate:"2027-11-02"}),null);
});
test("queue promotion chooses the nearest pending item with the same task type",()=>{
 const items=[
  {id:3,date:"2026-10-18",position:0,type:"reading"},
  {id:1,date:"2026-10-16",position:0,type:"reading"},
  {id:2,date:"2026-10-17",position:1,type:"review"},
  {id:4,date:"2026-10-19",position:0,type:"reading"},
  {id:5,date:"2026-10-20",position:0,type:"reading"}
 ];
 assert.equal(earliestNextPending(items,{id:1},{isDone:item=>item.id===3}).id,4);
 assert.equal(earliestNextPending(items,{id:5}),null);
});
test("manual task origin persists independently of display date",()=>{
 assert.equal(sourceDate({source_plan_date:"2026-10-16",plan_date:"2027-07-30"}),"2026-10-16");
 assert.equal(classifyDeferred({originalDate:"2026-10-16",targetDate:"2027-07-30",currentDate:"2027-07-01",status:"pending"}),"scheduled");
 assert.equal(classifyDeferred({originalDate:"2026-10-16",targetDate:"2027-07-30",currentDate:"2027-08-01",status:"pending"}),"overdue");
 assert.equal(classifyDeferred({originalDate:"2026-10-16",targetDate:"2027-07-30",currentDate:"2027-08-01",status:"done"}),"completed");
});

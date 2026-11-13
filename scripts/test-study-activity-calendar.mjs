import test from "node:test";
import assert from "node:assert/strict";
import {buildStudyActivityCalendar,nextISO,weekdayISO} from "../lib/study-activity-calendar.mjs";

test("datas atravessam mês, ano e dia da semana sem deslocamento de fuso",()=>{
  assert.equal(nextISO("2026-12-31"),"2027-01-01");
  assert.equal(nextISO("2026-03-01",-1),"2026-02-28");
  assert.equal(weekdayISO("2026-11-08"),7);
  assert.equal(weekdayISO("2026-11-09"),1);
});
test("tempo inferior a 15min e atividade sem duração nunca qualificam",()=>{
  const x=buildStudyActivityCalendar({
    today:"2026-11-10",
    sessions:[{day:"2026-11-10",seconds:899,session_count:1}],
    activities:[{day:"2026-11-09",activity_count:7}]
  });
  assert.equal(x.days["2026-11-10"].state,"short");
  assert.equal(x.days["2026-11-09"].state,"unmeasured");
  assert.equal(x.qualified_days,0);
  assert.equal(x.total_seconds,899);
  assert.equal(x.activity_days,2);
});
test("sessões no mesmo dia somam sem multiplicar o número de dias",()=>{
  const x=buildStudyActivityCalendar({today:"2026-11-10",sessions:[
    {day:"2026-11-10",seconds:600,session_count:1},
    {day:"2026-11-10",seconds:900,session_count:1}
  ]});
  assert.equal(x.days["2026-11-10"].seconds,1500);
  assert.equal(x.qualified_days,1);
  assert.equal(x.streak,1);
});
test("folga semanal e dia indisponível mantêm sequência sem inventar estudo",()=>{
  const x=buildStudyActivityCalendar({
    today:"2026-11-10",studyWeekdays:[1,2,3,4,5],
    sessions:[{day:"2026-11-06",seconds:1200},{day:"2026-11-09",seconds:1000}],
    unavailability:[{day:"2026-11-10"}]
  });
  assert.equal(x.streak,2);
  assert.equal(x.days["2026-11-08"].state,"rest");
  assert.equal(x.days["2026-11-10"].state,"rest");
  assert.equal(x.longest,2);
});
test("falta em dia útil interrompe a sequência, mas hoje ainda está aberto",()=>{
  const x=buildStudyActivityCalendar({
    today:"2026-11-10",studyWeekdays:[1,2,3,4,5],
    sessions:[{day:"2026-11-06",seconds:1000}]
  });
  assert.equal(x.streak,0);
  const y=buildStudyActivityCalendar({
    today:"2026-11-10",studyWeekdays:[1,2,3,4,5],
    sessions:[{day:"2026-11-09",seconds:1200}]
  });
  assert.equal(y.streak,1);
});
test("dias futuros não contam no tempo, nas sequências ou no calendário de atividade",()=>{
  const x=buildStudyActivityCalendar({today:"2026-11-10",sessions:[
    {day:"2026-11-10",seconds:1200},{day:"2026-11-11",seconds:1200}
  ]});
  assert.equal(x.qualified_days,1);
  assert.equal(x.days["2026-11-11"].state,"future");
  assert.equal(x.total_seconds,1200);
});

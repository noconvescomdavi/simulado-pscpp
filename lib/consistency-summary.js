const formatter=new Intl.DateTimeFormat("en-CA",{timeZone:"America/Sao_Paulo",year:"numeric",month:"2-digit",day:"2-digit"});
export function consistencyFromDays(days,questions){
  const set=new Set(days.map(r=>r.study_date instanceof Date?r.study_date.toISOString().slice(0,10):String(r.study_date).slice(0,10)));
  const todayKey=formatter.format(new Date());
  const today=new Date(todayKey+"T12:00:00-03:00");let streak=0;
  for(let i=0;i<365;i++){
    const d=new Date(today.getTime()-i*86400000),k=formatter.format(d);
    if(set.has(k))streak++;else if(i>0)break;
  }
  const q=Number(questions||0);
  const badges=[
    {label:"Primeiras 100",earned:q>=100},{label:"500 questões",earned:q>=500},
    {label:"1.000 questões",earned:q>=1000},{label:"7 dias de consistência",earned:streak>=7},
    {label:"30 dias de consistência",earned:streak>=30}
  ];
  return{streak,study_days:set.size,questions:q,badges};
}

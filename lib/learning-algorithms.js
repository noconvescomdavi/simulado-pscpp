const n=(v)=>Number(v||0);
const clamp=(v,min=0,max=100)=>Math.max(min,Math.min(max,Number(v)||0));
const pct=(c,t)=>t?(Number(c||0)/Number(t||0))*100:0;

function daysSince(value,nowMs=Date.now()){
  if(!value)return 365;
  return Math.max(0,(Number(nowMs)-new Date(value).getTime())/86400000);
}

export function calculateMasteryScore({answers,correct,last_answered_at,stability,review_count,lapse_count},nowMs=Date.now()){
  const accuracy=pct(correct,answers);
  const confidence=Math.min(100,Math.sqrt(Math.max(0,Number(answers)||0)/30)*100);
  const recency=Math.max(0,100-daysSince(last_answered_at,nowMs)*1.2);
  const reviewStrength=Math.min(100,n(stability)*8+n(review_count)*4);
  const lapsePenalty=Math.min(24,n(lapse_count)*4);
  const score=accuracy*.55+confidence*.15+recency*.10+reviewStrength*.20-lapsePenalty;
  return{
    mastery_score:Math.round(clamp(score)*10)/10,
    confidence_score:Math.round(clamp(confidence)*10)/10,
    accuracy:Math.round(clamp(accuracy)*10)/10
  };
}

export function calculateReviewSchedule(quality,stabilityValue=1){
  const stability=Math.max(1,n(stabilityValue)||1);
  const safeQuality=["again","hard","good","easy"].includes(quality)?quality:"good";
  const lapse=safeQuality==="again";
  const multipliers={again:0,hard:1.25,good:2.4,easy:4.2};
  const minimums={again:1,hard:2,good:5,easy:10};
  const maximums={again:1,hard:21,good:60,easy:120};
  const raw=lapse?1:Math.round(stability*(multipliers[safeQuality]||2.4));
  const days=Math.max(minimums[safeQuality]||5,Math.min(maximums[safeQuality]||60,raw));
  const stabilityDelta=safeQuality==="easy"?Math.max(3,stability*.35):safeQuality==="good"?Math.max(2,stability*.18):safeQuality==="hard"?0.5:-Math.max(1,stability*.35);
  const difficultyDelta=safeQuality==="easy"?-0.7:safeQuality==="hard"?0.5:lapse?1:safeQuality==="good"?-0.15:0;
  return{quality:safeQuality,lapse,days,stabilityDelta,difficultyDelta};
}

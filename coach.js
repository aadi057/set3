// ══════════════════════════════════════════════════════
// COACH — a weekly plan, adjusted to what you actually did.
//
// THE PLAN (a typical week when you follow it):
//   Lower A · Upper A · Cardio · Lower B · Upper B · Long cardio · Rest
// Strength days rotate lower → upper → lower → upper, so every muscle is
// trained twice a week with 48h+ between hits. After two lifting days in a
// row comes a cardio day. Every strength day ends with a 15-min incline
// walk, which puts weekly cardio around 150 min.
//
// Today's suggestion, rules in order:
//  1. Six training days in a row → rest.
//  2. Your declared rest day → rest (walk optional).
//  3. Under 5.5h sleep in today's check-in → light day.
//  4. Nothing logged, or 7+ days off → lighter full-body day.
//  5. Lifted on each of the last two days → cardio day (long one on weekends).
//  6. Four strength days already this week → cardio (or rest if cardio is met).
//  7. Otherwise the next strength day in the rotation, unless its muscles
//     were trained under 48h ago (then the other half, else cardio).
// Missed a day? Nothing breaks; the rotation just continues.
// ══════════════════════════════════════════════════════
const STRENGTH_DAYS_TARGET=4;   // per 7 days
const CARDIO_TARGET=5;          // days with cardio per 7 days (finishers count)
const COACH_BLOCKING=['legs','back','chest','shoulders'];
const LOWER_MAIN=['legs'],UPPER_MAIN=['chest','back','shoulders'];

const PLAN_RULES=[
  'Warm up 5–10 min: easy cardio, then leg swings, hip circles and bodyweight squats.',
  'Leave 2–3 reps in the tank on every set. You should finish each set feeling you could do two or three more with good form.',
  'Rest about 2 min after the first two moves, 60–90 s after the rest.',
  'Moving up: once every set hits the top of the rep range with 2 reps left, use the next weight step.',
  'Finish with static stretches for what you trained, 20–30 s each.',
  'Dizzy, shaky, sweaty out of nowhere, or any chest pain: stop, sit, eat something, and don\'t push through.',
];

// Session plans. groups = what gets logged when you tap "Log this".
const PLAN={
  lowerA:{title:'Lower A',sub:'Quads + core',kind:'lower',tone:'yellow',icon:'legs',groups:['legs','core','cardio'],
    moves:[['Leg press','3 × 10–12'],['Goblet squat or hack squat','3 × 8–10'],['Seated leg curl','3 × 10–12'],['Leg extension','2 × 12–15'],['Standing calf raise','2 × 12–15'],['Dead bug','2 × 8 per side']],
    finish:'Incline walk 15 min (incline 4–6, a pace you can talk at)'},
  upperA:{title:'Upper A',sub:'Push + pull',kind:'upper',tone:'pink',icon:'chest',groups:['chest','back','shoulders','arms','cardio'],
    moves:[['Chest press machine','3 × 8–12'],['Seated cable row','3 × 10–12'],['Shoulder press machine','2 × 10–12'],['Lat pulldown','2 × 10–12'],['Rear delt fly','2 × 12–15'],['Triceps pushdown','2 × 12'],['Dumbbell curl','2 × 12']],
    finish:'Incline walk 15 min'},
  lowerB:{title:'Lower B',sub:'Glutes + hamstrings',kind:'lower',tone:'yellow',icon:'legs',groups:['legs','core','cardio'],
    moves:[['Hip thrust','3 × 10–12'],['Romanian deadlift (dumbbells)','3 × 8–10'],['Walking lunge or split squat','2 × 10 per leg'],['Lying leg curl','2 × 10–12'],['Hip abductor machine','2 × 15'],['Plank','2 × 30–45 s']],
    finish:'Incline walk 15 min'},
  upperB:{title:'Upper B',sub:'Back + shoulders',kind:'upper',tone:'pink',icon:'back',groups:['back','chest','shoulders','arms','cardio'],
    moves:[['Lat pulldown','3 × 8–12'],['Incline dumbbell press','3 × 8–10'],['Single-arm dumbbell row','3 × 10 per arm'],['Lateral raise','3 × 12–15'],['Face pull','2 × 15'],['Hammer curl','2 × 12'],['Overhead triceps extension','2 × 12']],
    finish:'Incline walk 15 min'},
  full:{title:'Full body',sub:'Easing back in',kind:'full',tone:'green',icon:'gym',groups:['legs','chest','back','core'],
    moves:[['Leg press','2 × 12'],['Chest press machine','2 × 12'],['Lat pulldown','2 × 12'],['Hip thrust','2 × 12'],['Seated cable row','2 × 12'],['Dead bug','2 × 8 per side']],
    finish:'Easy walk 10 min. Keep 3–4 reps in the tank today; soreness should be mild.'},
  cardio:{title:'Cardio day',sub:'Steady + core',kind:'cardio',tone:'blue',icon:'cardio',groups:['cardio','core'],
    moves:[['Incline walk, bike or rower','35–45 min, easy'],['Dead bug','2 × 8 per side'],['Side plank','2 × 20–30 s per side'],['Hip flexor + hamstring stretch','5 min']],
    finish:'Easy pace means you can talk in full sentences but couldn\'t sing.'},
  long:{title:'Long cardio',sub:'Easy, longer',kind:'cardio',tone:'blue',icon:'cardio',groups:['cardio'],
    moves:[['Outdoor walk, incline walk or cycling','45–60 min, easy'],['Mobility: cat-cow, hip circles, stretches','10 min']],
    finish:'Splitting it into two shorter walks counts too.'},
  light:{title:'Light day',sub:'Walk + mobility',kind:'walk',tone:'green',icon:'mobility',groups:['mobility'],
    moves:[['Easy walk, ideally outside in daylight','30–40 min'],['Mobility: cat-cow, hip circles, stretches','10 min']],
    finish:'No heavy lifting today. You\'ll train better tomorrow.'},
  rest:{title:'Rest day',sub:'Recover',kind:'rest',tone:'green',icon:'bed',groups:['mobility'],
    moves:[['Optional easy walk','20–30 min'],['Optional stretching','10 min']],
    finish:'Muscle is rebuilt on rest days. Eat your protein and get to bed on time.'},
};
const STRENGTH_KEYS=['lowerA','upperA','lowerB','upperB','full'];

// ── Reading your history ──────────────────────────────
function sessionKind(s){
  if(s.plan&&PLAN[s.plan])return PLAN[s.plan].kind;
  const g=s.groups||[];
  const lower=g.indexOf('legs')>=0;
  const upper=g.some(function(k){return UPPER_MAIN.indexOf(k)>=0||k==='arms'});
  if(lower&&upper)return 'full';
  if(lower)return 'lower';
  if(upper)return 'upper';
  if(g.indexOf('cardio')>=0||g.indexOf('core')>=0)return 'cardio';
  if(g.length)return 'walk';
  return 'none';
}
function isStrength(s){const k=sessionKind(s);return k==='lower'||k==='upper'||k==='full'}
function sessTitle(s){
  if(s.plan&&PLAN[s.plan])return PLAN[s.plan].title;
  return sessionLabel(s.groups);
}

function coachStats(asOf,list){
  const past=(list||getSess()).filter(function(s){return s.date<asOf});
  const from7=addDays(asOf,-7);
  const st={groups:{},lastAny:null,gap:null,run:0,strengthDays7:0,cardio7:0,lastStrength:null,byDate:{}};
  GROUPS.forEach(function(g){st.groups[g.k]={last:null,since:null,n7:0}});
  const strengthDays={},cardioDays={},trainDays={};
  past.forEach(function(s){
    const gs=s.groups||[];
    if(!gs.length)return;
    st.byDate[s.date]=s;
    gs.forEach(function(k){
      const g=st.groups[k];if(!g)return;
      if(!g.last||s.date>g.last)g.last=s.date;
      if(s.date>=from7)g.n7++;
    });
    if(isStrength(s)){
      if(s.date>=from7)strengthDays[s.date]=1;
      if(!st.lastStrength||s.date>st.lastStrength.date)st.lastStrength=s;
    }
    if(s.date>=from7&&gs.indexOf('cardio')>=0)cardioDays[s.date]=1;
    if(gs.some(function(k){return k!=='mobility'}))trainDays[s.date]=1;
    if(!st.lastAny||s.date>st.lastAny)st.lastAny=s.date;
  });
  Object.keys(st.groups).forEach(function(k){const g=st.groups[k];if(g.last)g.since=daysBetween(g.last,asOf)});
  if(st.lastAny)st.gap=daysBetween(st.lastAny,asOf);
  st.strengthDays7=Object.keys(strengthDays).length;
  st.cardio7=Object.keys(cardioDays).length;
  let d=addDays(asOf,-1);
  while(trainDays[d]){st.run++;d=addDays(d,-1)}
  const y1=st.byDate[addDays(asOf,-1)],y2=st.byDate[addDays(asOf,-2)];
  st.lifted1=!!(y1&&isStrength(y1));
  st.lifted2=!!(y2&&isStrength(y2));
  return st;
}
// Which variant (A/B) of a lower or upper day comes next.
function nextVariant(kind,asOf,list){
  const past=(list||getSess()).filter(function(s){return s.date<asOf&&sessionKind(s)===kind}).sort(function(a,b){return a.date.localeCompare(b.date)});
  const last=past[past.length-1];
  const A=kind+'A',B=kind+'B';
  if(last&&last.plan===A)return B;
  if(last&&last.plan===B)return A;
  // Logged by hand: alternate if it was recent, otherwise start the rotation at A.
  return last&&daysBetween(last.date,asOf)<=7?B:A;
}
function agoText(n){return n===0?'today':n===1?'yesterday':n>=21?'over '+Math.floor(n/7)+' weeks ago':n+' days ago'}
function groupsText(keys){
  const w=keys.map(function(k){return GROUP(k).short.toLowerCase()});
  const s=w.length<=2?w.join(' and '):w.slice(0,-1).join(', ')+' and '+w[w.length-1];
  return s.charAt(0).toUpperCase()+s.slice(1);
}

function coachSleep(asOf){
  if(asOf!==today()||typeof ckGet!=='function')return null;
  const e=ckGet(ckDay());
  return e?ckSleep(e.bed,e.wake):null;
}

// ── Today's suggestion ─────────────────────────────────
function recommend(asOf,list){
  asOf=asOf||today();
  const st=coachStats(asOf,list);
  const dow=new Date(asOf+'T00:00:00').getDay();
  const weekend=dow===0||dow===6;
  const sleep=coachSleep(asOf);
  const weekLine='Last 7 days: '+st.strengthDays7+' of '+STRENGTH_DAYS_TARGET+' strength days, cardio on '+st.cardio7+' of '+CARDIO_TARGET+' days.';
  function out(key,reasons){
    const P=PLAN[key];
    return {key:key,plan:P,kind:P.kind,title:P.title,sub:P.sub,groups:P.groups.slice(),reasons:reasons,stats:st,asOf:asOf};
  }
  function cardioDay(lead){
    return out(weekend?'long':'cardio',[lead,'Cardio is the biggest lever on visceral fat, and yours started at level '+BASELINE.visceral+'.',weekLine]);
  }

  if(st.run>=6)return out('rest',['You\'ve trained '+st.run+' days in a row. Strength is built while you recover, so the plan has one full rest day a week.','A short walk is fine if you want to move.']);
  if(getRestDays().indexOf(dow)>=0)return out('rest',['Today is one of your rest days. A walk still counts toward your morning movement habit.',weekLine]);
  if(sleep!=null&&sleep<5.5)return out('light',['You slept '+(Math.round(sleep*10)/10)+'h. Short sleep cuts strength and raises injury risk, so lifting heavy today costs more than it gives.','An easy walk still counts as activity, and the plan picks up again tomorrow.']);
  if(!st.lastAny||st.gap>=7){
    return out('full',[st.lastAny?'It\'s been '+st.gap+' days since your last session. A lighter full-body day restarts every muscle without heavy soreness.':'Nothing logged yet. A lighter full-body day is the standard way to start.','Keep 3–4 reps in the tank today. The full plan starts from your next session.']);
  }
  if(st.lifted1&&st.lifted2)return cardioDay('You lifted on each of the last two days. A cardio day lets those muscles recover while you keep burning fat.');
  if(st.strengthDays7>=STRENGTH_DAYS_TARGET){
    if(st.cardio7<CARDIO_TARGET)return cardioDay('You\'ve done '+st.strengthDays7+' strength days in the last week, which is the plan. Today goes to cardio.');
    return out('rest',['Strength and cardio targets are both met for the week. Rest, or take an easy walk.']);
  }

  const last=st.lastStrength,lastKind=last?sessionKind(last):null;
  const first=lastKind==='lower'?'upper':'lower';
  const order=[first,first==='lower'?'upper':'lower'];
  const blockedBy=function(kind){
    return (kind==='lower'?LOWER_MAIN:UPPER_MAIN).filter(function(k){const g=st.groups[k];return g.since!=null&&g.since<2});
  };
  for(let i=0;i<order.length;i++){
    const kind=order[i];
    if(blockedBy(kind).length)continue;
    const key=nextVariant(kind,asOf,list),P=PLAN[key];
    const reasons=[];
    if(!last)reasons.push('Starting your rotation with legs.');
    else if(i===0)reasons.push('Next in your rotation. Your last strength day was '+sessTitle(last)+', '+agoText(daysBetween(last.date,asOf))+'.');
    else{const b=blockedBy(order[0]);reasons.push(groupsText(b)+' trained '+agoText(st.groups[b[0]].since)+' and still need a day, so '+P.title+' goes first.')}
    const main=kind==='lower'?['legs']:['chest','back'];
    const since=main.map(function(k){return st.groups[k].since}).filter(function(x){return x!=null});
    if(since.length)reasons.push((kind==='lower'?'Legs':'Chest and back')+' last trained '+agoText(Math.min.apply(null,since))+', so they\'ve had the 48 hours they need.');
    if(kind==='lower')reasons.push('Legs get two days a week because your InBody scan showed low leg muscle, and they\'re your biggest calorie burners at rest.');
    else reasons.push('Two upper days balance the two leg days, so every muscle gets trained twice a week.');
    reasons.push(weekLine+' The 15-min walk at the end counts as cardio.');
    return out(key,reasons);
  }
  const bl=blockedBy('lower').concat(blockedBy('upper'));
  return cardioDay(groupsText(bl)+' trained in the last 48 hours, so today is a cardio day while they recover.');
}

// The week Mon–Sun: what you did, today, and what's planned if you follow it.
function weekPlan(){
  const td=today();
  const d=new Date(td+'T00:00:00');const mon=addDays(td,-((d.getDay()+6)%7));
  const real=getSess();
  const sim=real.slice();
  const days=[];
  for(let i=0;i<7;i++){
    const iso=addDays(mon,i);
    const logged=real.filter(function(s){return s.date===iso&&(s.groups||[]).length})[0];
    if(iso<td){days.push({date:iso,state:logged?'done':'off',session:logged});continue}
    if(iso===td&&logged){days.push({date:iso,state:'done',session:logged,today:true});continue}
    const rec=recommend(iso,sim);
    days.push({date:iso,state:iso===td?'today':'planned',rec:rec,today:iso===td});
    if(rec.key!=='rest')sim.push({id:'sim'+i,date:iso,groups:rec.groups,plan:rec.key});
  }
  return days;
}

// Label for a session logged by hand (no plan attached).
function sessionLabel(groups){
  groups=(groups||[]).slice();
  if(!groups.length)return 'Workout';
  const strength=groups.filter(function(k){return k!=='cardio'&&k!=='mobility'});
  const extras=groups.filter(function(k){return k==='cardio'||k==='mobility'});
  const hasLegs=strength.indexOf('legs')>=0;
  const up=strength.filter(function(k){return UPPER_MAIN.indexOf(k)>=0||k==='arms'});
  let base=null;
  if(hasLegs&&up.length)base='Full body';
  else if(hasLegs)base='Lower body';
  else if(up.length>=3)base='Upper body';
  else if(strength.length)base=strength.map(function(k){return GROUP(k).short}).join(' + ');
  const ex=extras.map(function(k){return k==='cardio'?'cardio':'walk'});
  if(!base)return ex.length===1?(ex[0]==='walk'?'Walk & mobility':'Cardio'):'Cardio + walk';
  return base+(ex.length?' + '+ex.join(' + '):'');
}

const COACH_SOURCES=[
  ['Upper/lower, each muscle twice a week','Training a muscle twice a week builds more than once a week.','Schoenfeld, Ogborn & Krieger (2016), Sports Medicine, meta-analysis'],
  ['Sets, reps and 48h recovery','For newer lifters: 1–3 sets of 8–12 reps, and about 48 hours before training the same muscle hard again.','American College of Sports Medicine, resistance training position stand (2009)'],
  ['Stop 2–3 reps short of failure','Sets ended a few reps before failure build similar muscle with less fatigue, so you recover faster for the next session.','Refalo et al. (2023), Sports Medicine, meta-analysis'],
  ['How much cardio','150–250 minutes a week gives modest fat loss; more than 250 gives more. The plan gets you to about 150 and builds from there.','Donnelly et al. (2009), ACSM position stand on physical activity and weight loss'],
  ['Cardio for visceral fat','Aerobic exercise reduces visceral fat; resistance training alone had little effect on it.','Ismail et al. (2012), Obesity Reviews, meta-analysis'],
  ['Why both','Cardio cut the most fat; adding weights also built lean muscle. The combination does both, which is what recomposition needs.','Willis et al. (2012), Journal of Applied Physiology'],
  ['Spread it across the week','150–300 minutes of moderate activity weekly, plus muscle strengthening on 2 or more days.','World Health Organization guidelines (2020)'],
  ['Sleep','Sleep loss lowers strength and endurance, which is why short nights get a light day.','Fullagar et al. (2015), Sports Medicine, review'],
];

// ── Per-group details for the dial insight ─────────────
const GROUP_INFO={
  legs:{what:'Quads, hamstrings and glutes: the biggest muscles you have.',why:'Your InBody scan flagged low leg muscle. Building it raises your resting calorie burn more than any other group.',moves:['Leg press','Hip thrust','Romanian deadlift','Leg extension / leg curl','Walking lunges']},
  back:{what:'Lats, mid-back and rear shoulders.',why:'Balances all the pressing and the long hours at the edit desk, which helps posture.',moves:['Lat pulldown','Seated cable row','Single-arm dumbbell row','Face pull']},
  chest:{what:'Pecs, with front shoulders and triceps helping.',why:'Your main pushing strength. Pair it with back work so posture stays balanced.',moves:['Chest press machine','Incline dumbbell press','Pec fly machine','Push-ups']},
  shoulders:{what:'Front, side and rear delts.',why:'Side and rear delts give width and protect the shoulder joint. Rear delt flys count here.',moves:['Shoulder press machine','Lateral raises','Rear delt fly','Face pull']},
  arms:{what:'Biceps, triceps and forearms.',why:'They already work on every upper day; a couple of direct sets each finish the job.',moves:['Dumbbell or cable curl','Hammer curl','Triceps pushdown','Overhead triceps extension']},
  core:{what:'Abs, obliques and the deep muscles that brace your spine.',why:'Supports every heavy lift and your lower back during long sitting.',moves:['Dead bug','Plank','Side plank','Cable crunch']},
  cardio:{what:'Anything that keeps your heart rate up: incline walking, cycling, rowing.',why:'The main lever on visceral fat, which started at level 15. The plan puts some in on 5–6 days a week.',moves:['Incline treadmill walk','Cycling','Rowing','Outdoor walk']},
  mobility:{what:'Easy walks, stretching and mobility work.',why:'Counts toward your morning movement habit and helps recovery between hard days.',moves:['20–30 min outdoor walk','Hip flexor stretch','Cat-cow','Foam rolling']},
};

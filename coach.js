// ══════════════════════════════════════════════════════
// COACH — what to train today.
// Rules, in order:
//  1. Six training days in a row → rest (recovery is where adaptation happens).
//  2. Your declared rest day → rest, a walk is optional.
//  3. Under 5.5h sleep in today's check-in → light day (sleep loss lowers
//     strength and endurance performance).
//  4. No history, or 7+ days off → full body, lighter than usual.
//  5. Otherwise pick the session that best fills this week's gaps:
//     each major muscle group twice a week, never the same large group
//     within 48h, legs weighted up (InBody: low leg muscle).
//  6. Add cardio until 3 sessions a week (~150 min), the main lever on
//     visceral fat (baseline level 15).
// ══════════════════════════════════════════════════════
const TEMPLATES=[
  {k:'lower',label:'Lower body',groups:['legs','core'],eg:'Leg press or squat, a hinge (Romanian deadlift or hip thrust), lunges, then core.'},
  {k:'push',label:'Push day',groups:['chest','shoulders','arms'],eg:'Chest press, shoulder press, lateral raises, triceps pushdown.'},
  {k:'pull',label:'Pull day',groups:['back','arms'],eg:'Lat pulldown, seated row, face pulls, biceps curls.'},
  {k:'upper',label:'Upper body',groups:['chest','back','shoulders','arms'],eg:'One press, one pull for chest and back, then shoulders and arms.'},
  {k:'full',label:'Full body',groups:['legs','back','chest','core'],eg:'One leg move, one press, one pull, one core move. Keep weights moderate.'},
];
// Priority weights for filling weekly gaps. Legs highest: largest muscle
// group and flagged low on the InBody scan.
const COACH_WEIGHT={legs:1.5,back:1.15,chest:1,shoulders:0.85,arms:0.5,core:0.7};
// Large groups that need ~48h before being trained again.
const COACH_BLOCKING=['legs','back','chest','shoulders'];
const CARDIO_TARGET=3;
const STRENGTH_DAYS_TARGET=3;

function coachStats(asOf){
  const past=getSess().filter(function(s){return s.date<asOf});
  const from7=addDays(asOf,-7);
  const st={groups:{},lastAny:null,gap:null,run:0,strengthDays7:0,cardio7:0};
  GROUPS.forEach(function(g){st.groups[g.k]={last:null,since:null,n7:0}});
  const strengthDays={},cardioDays={},anyDays={};
  past.forEach(function(s){
    const gs=s.groups||[];
    anyDays[s.date]=1;
    gs.forEach(function(k){
      const g=st.groups[k];if(!g)return;
      if(!g.last||s.date>g.last)g.last=s.date;
      if(s.date>=from7)g.n7++;
    });
    if(s.date>=from7){
      if(gs.some(function(k){const G=GROUP(k);return G&&G.strength}))strengthDays[s.date]=1;
      if(gs.indexOf('cardio')>=0)cardioDays[s.date]=1;
    }
    if(!st.lastAny||s.date>st.lastAny)st.lastAny=s.date;
  });
  Object.keys(st.groups).forEach(function(k){const g=st.groups[k];if(g.last)g.since=daysBetween(g.last,asOf)});
  if(st.lastAny)st.gap=daysBetween(st.lastAny,asOf);
  st.strengthDays7=Object.keys(strengthDays).length;
  st.cardio7=Object.keys(cardioDays).length;
  // consecutive training days ending yesterday (walk-only days don't count)
  let d=addDays(asOf,-1);
  const trainDays={};
  past.forEach(function(s){if((s.groups||[]).some(function(k){return k!=='mobility'}))trainDays[s.date]=1});
  while(trainDays[d]){st.run++;d=addDays(d,-1)}
  return st;
}

function coachSleep(asOf){
  if(typeof ckGet!=='function')return null;
  const e=ckGet(asOf);
  return e?ckSleep(e.bed,e.wake):null;
}

function agoText(n){return n===1?'yesterday':n>=21?'over '+Math.floor(n/7)+' weeks ago':n+' days ago'}

function recommend(asOf){
  asOf=asOf||today();
  const st=coachStats(asOf);
  const dow=new Date(asOf+'T00:00:00').getDay();
  const sleep=coachSleep(asOf);
  const cardioLine=st.cardio7<CARDIO_TARGET
    ?'Cardio: '+st.cardio7+' of '+CARDIO_TARGET+' sessions this week. Aerobic work is what moves visceral fat most, and yours started at level '+BASELINE.visceral+'.'
    :'Cardio target met this week ('+st.cardio7+'/'+CARDIO_TARGET+').';

  const scored=TEMPLATES.map(function(t){
    const blocked=t.groups.filter(function(k){const g=st.groups[k];return COACH_BLOCKING.indexOf(k)>=0&&g.since!=null&&g.since<2});
    let score=0;
    t.groups.forEach(function(k){
      const g=st.groups[k],G=GROUP(k);
      score+=(COACH_WEIGHT[k]||0.5)*Math.max(0,G.target-g.n7);
      score+=0.06*Math.min(g.since==null?7:g.since,7);
    });
    return {t:t,score:score,blocked:blocked};
  }).sort(function(a,b){return b.score-a.score});
  const open=scored.filter(function(x){return !x.blocked.length});
  const best=open[0]||null,alt=open[1]||null;

  function pack(o){
    o.stats=st;o.sleep=sleep;o.asOf=asOf;
    o.groups=o.groups||[];
    return o;
  }

  if(st.run>=6){
    return pack({kind:'rest',title:'Rest day',groups:['mobility'],
      reasons:['You\'ve trained '+st.run+' days in a row. Muscle repair and strength gains happen during recovery, so take at least one full rest day a week.','An easy walk is fine if you want to move.']});
  }
  if(getRestDays().indexOf(dow)>=0){
    return pack({kind:'rest',title:'Planned rest day',groups:['mobility'],
      reasons:['Today is one of your rest days. A walk counts toward your morning movement habit.',cardioLine],alt:best?best.t.label:null});
  }
  if(sleep!=null&&sleep<5.5){
    return pack({kind:'light',title:'Light day: walk + mobility',groups:['mobility','cardio'],
      reasons:['You slept '+(Math.round(sleep*10)/10)+'h. Short sleep lowers strength and endurance, so today isn\'t the day to push heavy weights.','30–40 minutes of easy walking still counts as a cardio session.'],
      alt:best?best.t.label+' (if you feel fine)':null});
  }
  if(!st.lastAny||st.gap>=7){
    const full=TEMPLATES[4];
    return pack({kind:'train',title:'Full body',template:full,groups:full.groups.concat(st.cardio7<CARDIO_TARGET?['cardio']:[]),addCardio:st.cardio7<CARDIO_TARGET,
      reasons:[st.lastAny?'It\'s been '+st.gap+' days since your last session. Full body, lighter than usual, is the easiest way back in.':'No sessions logged yet. Full body hits every major muscle and is the standard starting point.',
        'Pick weights you could lift 2–3 more times at the end of each set.',cardioLine]});
  }
  if(!best||best.score<0.6){
    if(st.cardio7<CARDIO_TARGET){
      return pack({kind:'train',title:'Cardio + core',groups:['cardio','core'],addCardio:true,
        reasons:[best?'Your muscle groups are covered for the week.':'Your big muscle groups were trained in the last 48 hours.',
          '30–45 minutes of incline walking, cycling or rowing at a pace where you can talk but not sing.',cardioLine]});
    }
    return pack({kind:'rest',title:'Easy day',groups:['mobility'],
      reasons:['This week\'s strength and cardio targets are met. Rest, walk, or do a short mobility session.']});
  }

  const t=best.t;
  const reasons=[];
  t.groups.forEach(function(k){
    if(k==='arms'||k==='core')return;
    const g=st.groups[k],G=GROUP(k);
    reasons.push(G.label+': '+(g.since==null?'not trained yet':'last trained '+agoText(g.since))+' · '+g.n7+' of '+G.target+' this week.');
  });
  if(t.groups.indexOf('legs')>=0)reasons.push('Legs get priority: your InBody scan showed low leg muscle, and legs are your largest muscle group.');
  const recovering=scored.filter(function(x){return x.blocked.length}).reduce(function(a,x){x.blocked.forEach(function(k){if(a.indexOf(k)<0)a.push(k)});return a},[]);
  if(recovering.length)reasons.push(recovering.map(function(k){return GROUP(k).label}).join(' and ')+' trained in the last 48 hours, so '+(recovering.length>1?'they\'re':'it\'s')+' still recovering.');
  const addCardio=st.cardio7<CARDIO_TARGET;
  reasons.push(addCardio?'Finish with 20–30 min of cardio. '+cardioLine:cardioLine);
  return pack({kind:'train',title:t.label+(addCardio?' + cardio':''),template:t,groups:t.groups.concat(addCardio?['cardio']:[]),addCardio:addCardio,reasons:reasons,alt:alt?alt.t.label:null});
}

// Label for a logged session from its groups.
function sessionLabel(groups){
  groups=(groups||[]).slice();
  if(!groups.length)return 'Workout';
  const strength=groups.filter(function(k){return k!=='cardio'&&k!=='mobility'});
  const extras=groups.filter(function(k){return k==='cardio'||k==='mobility'});
  const key=function(a){return a.slice().sort().join(',')};
  let base=null;
  TEMPLATES.forEach(function(t){if(!base&&key(t.groups)===key(strength))base=t.label});
  if(!base&&strength.length){
    base=strength.length>=4?'Full body':strength.map(function(k){return GROUP(k).short}).join(' + ');
  }
  const ex=extras.map(function(k){return k==='cardio'?'cardio':'walk'});
  if(!base)return ex.length===1?(ex[0]==='walk'?'Walk & mobility':'Cardio'):'Cardio + walk';
  return base+(ex.length?' + '+ex.join(' + '):'');
}

const COACH_SOURCES=[
  ['How often to train each muscle','Training a muscle group twice a week builds more muscle than once a week.','Schoenfeld, Ogborn & Krieger (2016), Sports Medicine, meta-analysis'],
  ['48 hours between hard sessions','Leave about 48 hours before training the same large muscle group hard again; 2–3 resistance sessions a week.','American College of Sports Medicine position stands (2009, 2011)'],
  ['Weekly cardio','150–300 minutes of moderate aerobic activity a week, plus muscle-strengthening on 2 or more days.','World Health Organization guidelines (2020)'],
  ['Visceral fat','Aerobic exercise is the core of reducing visceral fat; resistance training alone had little effect on it.','Ismail et al. (2012), Obesity Reviews, meta-analysis'],
  ['Cardio and weights together','Aerobic training cut the most fat; adding resistance training also built lean mass, so the combination does both.','Willis et al. (2012), Journal of Applied Physiology, STRRIDE AT/RT trial'],
  ['Sleep','Sleep loss reduces strength and endurance performance, which is why short nights get a lighter day.','Fullagar et al. (2015), Sports Medicine, review'],
];

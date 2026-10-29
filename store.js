// ══════════════════════════════════════════════════════
// STORE — one place for all data.
// Reads are synchronous from an in-memory cache. Every write goes to
// localStorage (fast, offline) and, when the app runs as a Claude
// artifact, to the private per-user db so it survives browsers and
// devices. On the standalone PWA only localStorage is used.
// ══════════════════════════════════════════════════════
const KEYS=['sessions','mets','restDays','daily','reset','timer','profile','picks'];
const LS='set3:';
const S={cache:{},at:{},db:null,uid:null,mode:'local',writing:{},dirty:{},err:null};

function lsRead(k){try{const v=localStorage.getItem(LS+k);return v==null?null:JSON.parse(v)}catch(e){return null}}
function lsWrite(k,v){try{localStorage.setItem(LS+k,JSON.stringify(v))}catch(e){}}
function sGet(k,def){const v=S.cache[k];return v==null?def:v}
function sSet(k,v){
  S.cache[k]=v;S.at[k]=Date.now();
  lsWrite(k,v);lsWrite('__at',S.at);
  cloudWrite(k);
}


// ── Cloud (artifact db) ────────────────────────────────
function cloudRef(k){return S.db.collection('data/users/'+S.uid).doc(k)}
async function cloudWrite(k){
  if(!S.db)return;
  S.dirty[k]=true;
  if(S.writing[k])return;
  S.writing[k]=true;
  while(S.dirty[k]){
    S.dirty[k]=false;
    const body={v:S.cache[k]==null?null:S.cache[k],at:S.at[k]||Date.now()};
    try{await cloudRef(k).set(body);S.err=null}
    catch(e){
      if(e&&e.code==='unavailable'){
        await new Promise(function(r){setTimeout(r,800+Math.random()*1200)});
        try{await cloudRef(k).set(body);S.err=null}catch(e2){S.err=(e2&&e2.code)||'unavailable'}
      } else S.err=(e&&e.code)||'unavailable';
    }
  }
  S.writing[k]=false;
  if(typeof onSyncChange==='function')onSyncChange();
}
async function initCloud(){
  if(!window.claude||typeof window.claude.use!=='function')return;
  let db=null,user=null;
  try{const r=await Promise.all([window.claude.use('db'),window.claude.use('user')]);db=r[0];user=r[1]}catch(e){}
  if(!db||!user){S.mode='local';if(typeof onSyncChange==='function')onSyncChange();return}
  const uid=await user.id();
  if(!uid){S.mode='local';if(typeof onSyncChange==='function')onSyncChange();return}
  S.db=db;S.uid=uid;
  let remote={};
  try{
    const snap=await db.collection('data/users/'+uid).get();
    snap.docs.forEach(function(d){if(d.exists){const b=d.data();remote[d.id]=b}});
  }catch(e){S.err=(e&&e.code)||'unavailable';S.db=null;S.mode='local';if(typeof onSyncChange==='function')onSyncChange();return}
  let changed=false;
  // Lists merge item by item so a fresh device (or a seeded session) never
  // wipes history kept in the account. Everything else: newest copy wins.
  const MERGE={sessions:'id',daily:'date',mets:'date'};
  KEYS.forEach(function(k){
    const r=remote[k],localAt=S.at[k]||0;
    if(MERGE[k]&&r&&Array.isArray(r.v)&&Array.isArray(S.cache[k])){
      const key=MERGE[k],newer=(r.at||0)>=localAt,map={};
      (newer?S.cache[k]:r.v).forEach(function(x){if(x&&x[key]!=null)map[x[key]]=x});
      (newer?r.v:S.cache[k]).forEach(function(x){if(x&&x[key]!=null)map[x[key]]=x});
      const merged=Object.keys(map).map(function(id){return map[id]});
      const same=JSON.stringify(merged)===JSON.stringify(r.v);
      S.cache[k]=merged;S.at[k]=same?(r.at||Date.now()):Date.now();lsWrite(k,merged);changed=true;
      if(!same)cloudWrite(k);
      return;
    }
    if(r&&(r.at||0)>=localAt&&r.v!=null){
      S.cache[k]=r.v;S.at[k]=r.at||Date.now();lsWrite(k,r.v);changed=true;
    } else if(S.cache[k]!=null&&(!r||(r.at||0)<localAt)){
      cloudWrite(k);
    }
  });
  lsWrite('__at',S.at);
  S.mode='cloud';
  if(changed)migrateSessions();
  if(typeof onSyncChange==='function')onSyncChange(changed);
}

// ── Dates ──────────────────────────────────────────────
const localISO=function(d){return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const today=function(){return localISO(new Date())};
function addDays(iso,n){const d=new Date(iso+'T00:00:00');d.setDate(d.getDate()+n);return localISO(d)}
function daysBetween(a,b){return Math.round((new Date(b+'T00:00:00')-new Date(a+'T00:00:00'))/86400000)}
const uid=function(){return Date.now().toString(36)+Math.random().toString(36).slice(2)};
function esc(s){return String(s==null?'':s).replace(/[&<>"']/g,function(c){return{'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]})}

// ── Data accessors ─────────────────────────────────────
const getSess=function(){return sGet('sessions',[])};
const putSess=function(a){sSet('sessions',a)};
const getMets=function(){return sGet('mets',[])};
const putMets=function(a){sSet('mets',a)};
const getRestDays=function(){return sGet('restDays',[])};
const putRestDays=function(a){sSet('restDays',a)};
const getProfile=function(){return Object.assign({name:'Aadi'},sGet('profile',{}))};
const putProfile=function(p){sSet('profile',p)};

// InBody baseline (June 2026). The coach reads goals from here.
const BASELINE={date:'2026-06',weight:75.2,bodyFat:38.3,visceral:15,bmr:1372,score:57,legMuscle:'Low',target:60};

// ── Muscle groups ──────────────────────────────────────
// target = sessions per week, matching the coach's plan: every strength
// group twice a week (upper/lower split); cardio on 5 days (finishers count).
const GROUPS=[
  {k:'legs',label:'Legs & glutes',short:'Legs',icon:'legs',tone:'yellow',target:2,strength:true},
  {k:'back',label:'Back',short:'Back',icon:'back',tone:'blue',target:2,strength:true},
  {k:'chest',label:'Chest',short:'Chest',icon:'chest',tone:'pink',target:2,strength:true},
  {k:'shoulders',label:'Shoulders',short:'Shoulders',icon:'shoulders',tone:'green',target:2,strength:true},
  {k:'arms',label:'Arms',short:'Arms',icon:'arms',tone:'yellow',target:2,strength:true},
  {k:'core',label:'Core',short:'Core',icon:'core',tone:'blue',target:2,strength:true},
  {k:'cardio',label:'Cardio',short:'Cardio',icon:'cardio',tone:'pink',target:5,strength:false},
  {k:'mobility',label:'Walk & mobility',short:'Walk',icon:'mobility',tone:'green',target:0,strength:false},
];
const GROUP=function(k){for(let i=0;i<GROUPS.length;i++){if(GROUPS[i].k===k)return GROUPS[i]}return null};

// ── Migration from the old sets/reps format ────────────
const EXMAP={"Barbell Bench Press":"chest","Incline Barbell Press":"chest","Decline Barbell Press":"chest","Close-Grip Bench Press":"chest","Dumbbell Bench Press":"chest","Incline Dumbbell Press":"chest","Dumbbell Flyes":"chest","Incline Dumbbell Flyes":"chest","Chest Press Machine":"chest","Pec Fly / Chest Fly Machine":"chest","Iso-Lateral Chest Press":"chest","Seated Chest Press":"chest","Clip Chest":"chest","Smith Machine Bench Press":"chest","Cable Chest Fly (Low)":"chest","Cable Chest Fly (High)":"chest","Push-Up":"chest","Diamond Push-Up":"chest","Dips (Chest Focus)":"chest","Barbell Deadlift":"back","Romanian Deadlift":"back","Barbell Row":"back","T-Bar Row":"back","Rack Pull":"back","Dumbbell Row (Single Arm)":"back","Lat Pulldown":"back","Wide-Grip Lat Pulldown":"back","Seated Cable Row":"back","Straight-Arm Pulldown":"back","Face Pull":"back","Lat Pulldown Machine":"back","Seated Row Machine":"back","Iso-Lateral Back Row":"back","Vertical Row Machine":"back","45\u00b0 Back Extension":"back","Pull-Up":"back","Chin-Up":"back","Barbell Overhead Press":"shoulders","Shrugs (Barbell)":"shoulders","Upright Row (Barbell)":"shoulders","Dumbbell Shoulder Press":"shoulders","Arnold Press":"shoulders","Lateral Raise (Dumbbell)":"shoulders","Front Raise (Dumbbell)":"shoulders","Rear Delt Fly (Dumbbell)":"shoulders","Shrugs (Dumbbell)":"shoulders","Lateral Raise (Cable)":"shoulders","Rear Delt Fly (Cable)":"shoulders","Reverse Pec Deck":"shoulders","Shoulder Press Machine":"shoulders","Lateral Raise Machine":"shoulders","Barbell Curl":"arms","EZ Bar Curl":"arms","Reverse Curl":"arms","Dumbbell Curl":"arms","Hammer Curl":"arms","Concentration Curl":"arms","Incline Dumbbell Curl":"arms","Cable Curl":"arms","Preacher Curl":"arms","Machine Bicep Curl":"arms","Tricep Pushdown (Bar)":"arms","Tricep Pushdown (Rope)":"arms","Overhead Tricep Extension":"arms","Skull Crusher":"arms","Tricep Kickback":"arms","Tricep Machine":"arms","Tricep Dips (Bench)":"arms","Barbell Back Squat":"legs","Barbell Front Squat":"legs","Hip Thrust (Barbell)":"legs","Goblet Squat":"legs","Sumo Squat (Dumbbell)":"legs","Dumbbell Squat":"legs","Bulgarian Split Squat":"legs","Lunge (Dumbbell)":"legs","Walking Lunge":"legs","Romanian Deadlift (Dumbbell)":"legs","Leg Press":"legs","Leg Extension":"legs","Hack Squat Machine":"legs","Seated Leg Curl":"legs","Lying Leg Curl":"legs","Hip Thrust (Machine)":"legs","Abductor Machine":"legs","Adductor Machine":"legs","Smith Machine Squat":"legs","Glute Bridge":"legs","Wall Sit":"legs","Standing Calf Raise":"legs","Seated Calf Raise":"legs","Stepper Calf Raise":"legs","Leg Press Calf Press":"legs","Crunch":"core","Reverse Crunch":"core","Bicycle Crunch":"core","Leg Raise (Lying)":"core","Hanging Leg Raise":"core","Plank":"core","Side Plank":"core","Russian Twist":"core","Dead Bug":"core","Mountain Climber":"core","Cable Crunch":"core","Machine Crunch":"core","Hollow Body Hold":"core","Treadmill Walk":"cardio","Treadmill Run":"cardio","Treadmill Incline Walk":"cardio","Stationary Bike":"cardio","Elliptical":"cardio","Rowing Machine":"cardio","Stairmaster / StepMill":"cardio","Assault Bike":"cardio","Jump Rope":"cardio","Burpee":"cardio","High Knees":"cardio","Box Jump":"cardio","Clean and Press":"full","Power Clean":"full","Thruster":"full","Kettlebell Swing":"full","Turkish Get-Up":"full","Wall Ball":"full","Medicine Ball Slam":"full","TRX Row":"full","TRX Push-Up":"full","Battle Ropes":"full","Farmer's Walk":"full","Wrist Curl":"arms","Reverse Wrist Curl":"arms","Dead Hang":"arms","Hip Flexor Stretch":"mobility","Pigeon Pose":"mobility","Hamstring Stretch":"mobility","Quad Stretch":"mobility","Calf Stretch":"mobility","Cat-Cow":"mobility","Child's Pose":"mobility","Cobra Pose":"mobility","Doorway Chest Stretch":"mobility","Foam Roll \u2014 Quads":"mobility","Diaphragmatic Breathing":"mobility"};
const TYPE_TO_GROUPS={upper:['chest','back','shoulders','arms'],lower:['legs'],cardio:['cardio'],core:['cardio','core'],rest:['mobility'],other:[]};
const TIMER_MAX_MIN=120;
// Sessions shared from exported logs, added if that day is missing.
// 26 Oct exercises are read from the notes Aadi wrote that day.
const SEED_EX_1026=['Hip Thrust (Machine)','Seated Leg Curl','Leg Press','Lat Pulldown','Chest Press Machine','Rear Delt Fly (Dumbbell)','Dead Bug','Plank','Treadmill Incline Walk'];
const SEED_SESSIONS=[
  {id:'log-2026-10-26',date:'2026-10-26',plan:'full',groups:['back','chest','core','cardio','legs','shoulders'],durationMin:120,durationCapped:true,
   exercises:SEED_EX_1026,
   notes:'Comeback day after 2-week break. Hip thrust, leg curl, leg press (iso, 10kg/side), lat pulldown, chest press, rear delt fly, dead bugs, plank. Treadmill 15 min, incline 3–4. Light loads, felt good. Leg extension skipped — add back next leg day.'},
];
// 27 Oct was an outdoor walk (7,719 steps) on a travel day, logged as cardio.
const SESSION_FIXES=[
  {id:'walk-1027',date:'2026-10-27',set:{plan:'light',groups:['mobility'],exercises:['Easy Walk'],notes:'Walk 7719 steps'}},
];
function migrateSessions(){
  const all=sGet('sessions',null)||[];
  let changed=false;
  all.forEach(function(s){
    if(Array.isArray(s.groups))return;
    const set={};
    (s.exercises||[]).forEach(function(e){
      const g=EXMAP[e.n];
      if(g==='full'){set.legs=1;set.back=1;set.core=1}
      else if(g)set[g]=1;
    });
    let groups=Object.keys(set);
    if(!groups.length)groups=(TYPE_TO_GROUPS[s.type]||[]).slice();
    s.groups=groups;
    if(s.exercises&&s.exercises.length)s.legacy=s.exercises.map(function(e){return e.n});
    delete s.exercises;delete s.type;
    changed=true;
  });
  all.forEach(function(s){
    if(s.durationMin>TIMER_MAX_MIN){s.durationMin=TIMER_MAX_MIN;s.durationCapped=true;changed=true}
  });
  SEED_SESSIONS.forEach(function(seed){
    const have=all.filter(function(s){return s.date===seed.date})[0];
    if(!have){all.push(JSON.parse(JSON.stringify(seed)));changed=true;return}
    // Older copy of the seeded session: give it the exercises from its notes.
    if(have.id===seed.id&&!Array.isArray(have.exercises)){
      have.exercises=seed.exercises.slice();
      seed.groups.forEach(function(g){if(have.groups.indexOf(g)<0)have.groups.push(g)});
      changed=true;
    }
  });
  // One-off corrections Aadi asked for. Each runs once per session (marked
  // with s.fix) so later edits in the app are never overwritten.
  SESSION_FIXES.forEach(function(f){
    all.forEach(function(s){
      if(s.date!==f.date||(s.fixes||[]).indexOf(f.id)>=0)return;
      Object.keys(f.set).forEach(function(k){s[k]=JSON.parse(JSON.stringify(f.set[k]))});
      s.fixes=(s.fixes||[]).concat(f.id);changed=true;
    });
  });
  if(changed){S.cache.sessions=all;S.at.sessions=Date.now();lsWrite('sessions',all);lsWrite('__at',S.at);cloudWrite('sessions')}
}

// Boot from the local mirror (and the old app's keys, once).
(function bootLocal(){
  S.at=lsRead('__at')||{};
  KEYS.forEach(function(k){const v=lsRead(k);if(v!=null)S.cache[k]=v});
  const OLD={sessions:'s3_sess',mets:'s3_mets',restDays:'s3_restdays',daily:'s3_daily',reset:'s3_reset',timer:'s3_timer'};
  let imported=false;
  Object.keys(OLD).forEach(function(k){
    if(S.cache[k]!=null)return;
    try{const raw=localStorage.getItem(OLD[k]);if(raw!=null){S.cache[k]=JSON.parse(raw);S.at[k]=1;lsWrite(k,S.cache[k]);imported=true}}catch(e){}
  });
  if(imported)lsWrite('__at',S.at);
  migrateSessions();
})();

// ══════════════════════════════════════════════════════
// EXERCISE DATABASE
// ══════════════════════════════════════════════════════
const EXDB=[
  {n:'Barbell Bench Press',g:'Chest',eq:'Barbell',m:'Chest, Triceps',t:'weight'},
  {n:'Incline Barbell Press',g:'Chest',eq:'Barbell',m:'Upper Chest',t:'weight'},
  {n:'Decline Barbell Press',g:'Chest',eq:'Barbell',m:'Lower Chest',t:'weight'},
  {n:'Close-Grip Bench Press',g:'Chest',eq:'Barbell',m:'Triceps, Inner Chest',t:'weight'},
  {n:'Dumbbell Bench Press',g:'Chest',eq:'Dumbbell',m:'Chest, Triceps',t:'weight'},
  {n:'Incline Dumbbell Press',g:'Chest',eq:'Dumbbell',m:'Upper Chest',t:'weight'},
  {n:'Dumbbell Flyes',g:'Chest',eq:'Dumbbell',m:'Chest',t:'weight'},
  {n:'Incline Dumbbell Flyes',g:'Chest',eq:'Dumbbell',m:'Upper Chest',t:'weight'},
  {n:'Chest Press Machine',g:'Chest',eq:'Machine',m:'Chest, Triceps',t:'weight'},
  {n:'Pec Fly / Chest Fly Machine',g:'Chest',eq:'Machine',m:'Chest',t:'weight'},
  {n:'Iso-Lateral Chest Press',g:'Chest',eq:'Machine',m:'Chest',t:'weight'},
  {n:'Seated Chest Press',g:'Chest',eq:'Machine',m:'Chest',t:'weight'},
  {n:'Clip Chest',g:'Chest',eq:'Machine',m:'Chest',t:'weight'},
  {n:'Smith Machine Bench Press',g:'Chest',eq:'Smith Machine',m:'Chest',t:'weight'},
  {n:'Cable Chest Fly (Low)',g:'Chest',eq:'Cable',m:'Upper Chest',t:'weight'},
  {n:'Cable Chest Fly (High)',g:'Chest',eq:'Cable',m:'Lower Chest',t:'weight'},
  {n:'Push-Up',g:'Chest',eq:'Bodyweight',m:'Chest, Triceps',t:'reps'},
  {n:'Diamond Push-Up',g:'Chest',eq:'Bodyweight',m:'Triceps, Inner Chest',t:'reps'},
  {n:'Dips (Chest Focus)',g:'Chest',eq:'Bodyweight',m:'Lower Chest',t:'weight'},
  {n:'Barbell Deadlift',g:'Back',eq:'Barbell',m:'Lower Back, Glutes',t:'weight'},
  {n:'Romanian Deadlift',g:'Back',eq:'Barbell',m:'Hamstrings, Lower Back',t:'weight'},
  {n:'Barbell Row',g:'Back',eq:'Barbell',m:'Mid Back, Lats',t:'weight'},
  {n:'T-Bar Row',g:'Back',eq:'Barbell',m:'Mid Back, Lats',t:'weight'},
  {n:'Rack Pull',g:'Back',eq:'Barbell',m:'Upper Back, Traps',t:'weight'},
  {n:'Dumbbell Row (Single Arm)',g:'Back',eq:'Dumbbell',m:'Lat, Mid Back',t:'weight'},
  {n:'Lat Pulldown',g:'Back',eq:'Cable',m:'Lats, Biceps',t:'weight'},
  {n:'Wide-Grip Lat Pulldown',g:'Back',eq:'Cable',m:'Outer Lats',t:'weight'},
  {n:'Seated Cable Row',g:'Back',eq:'Cable',m:'Mid Back, Lats',t:'weight'},
  {n:'Straight-Arm Pulldown',g:'Back',eq:'Cable',m:'Lats',t:'weight'},
  {n:'Face Pull',g:'Back',eq:'Cable',m:'Rear Delt, Traps',t:'weight'},
  {n:'Lat Pulldown Machine',g:'Back',eq:'Machine',m:'Lats, Biceps',t:'weight'},
  {n:'Seated Row Machine',g:'Back',eq:'Machine',m:'Mid Back, Biceps',t:'weight'},
  {n:'Iso-Lateral Back Row',g:'Back',eq:'Machine',m:'Back',t:'weight'},
  {n:'Vertical Row Machine',g:'Back',eq:'Machine',m:'Upper Back',t:'weight'},
  {n:'45° Back Extension',g:'Back',eq:'Machine',m:'Lower Back, Glutes',t:'weight'},
  {n:'Pull-Up',g:'Back',eq:'Bodyweight',m:'Lats, Biceps',t:'weight'},
  {n:'Chin-Up',g:'Back',eq:'Bodyweight',m:'Lats, Biceps',t:'weight'},
  {n:'Barbell Overhead Press',g:'Shoulders',eq:'Barbell',m:'Front Delt, Triceps',t:'weight'},
  {n:'Shrugs (Barbell)',g:'Shoulders',eq:'Barbell',m:'Traps',t:'weight'},
  {n:'Upright Row (Barbell)',g:'Shoulders',eq:'Barbell',m:'Side Delt, Traps',t:'weight'},
  {n:'Dumbbell Shoulder Press',g:'Shoulders',eq:'Dumbbell',m:'Front & Side Delt',t:'weight'},
  {n:'Arnold Press',g:'Shoulders',eq:'Dumbbell',m:'All Deltoid Heads',t:'weight'},
  {n:'Lateral Raise (Dumbbell)',g:'Shoulders',eq:'Dumbbell',m:'Side Delt',t:'weight'},
  {n:'Front Raise (Dumbbell)',g:'Shoulders',eq:'Dumbbell',m:'Front Delt',t:'weight'},
  {n:'Rear Delt Fly (Dumbbell)',g:'Shoulders',eq:'Dumbbell',m:'Rear Delt',t:'weight'},
  {n:'Shrugs (Dumbbell)',g:'Shoulders',eq:'Dumbbell',m:'Traps',t:'weight'},
  {n:'Lateral Raise (Cable)',g:'Shoulders',eq:'Cable',m:'Side Delt',t:'weight'},
  {n:'Rear Delt Fly (Cable)',g:'Shoulders',eq:'Cable',m:'Rear Delt',t:'weight'},
  {n:'Reverse Pec Deck',g:'Shoulders',eq:'Machine',m:'Rear Delt',t:'weight'},
  {n:'Shoulder Press Machine',g:'Shoulders',eq:'Machine',m:'Front & Side Delt',t:'weight'},
  {n:'Lateral Raise Machine',g:'Shoulders',eq:'Machine',m:'Side Delt',t:'weight'},
  {n:'Barbell Curl',g:'Biceps',eq:'Barbell',m:'Biceps',t:'weight'},
  {n:'EZ Bar Curl',g:'Biceps',eq:'Barbell',m:'Biceps, Brachialis',t:'weight'},
  {n:'Reverse Curl',g:'Biceps',eq:'Barbell',m:'Brachioradialis',t:'weight'},
  {n:'Dumbbell Curl',g:'Biceps',eq:'Dumbbell',m:'Biceps',t:'weight'},
  {n:'Hammer Curl',g:'Biceps',eq:'Dumbbell',m:'Brachialis',t:'weight'},
  {n:'Concentration Curl',g:'Biceps',eq:'Dumbbell',m:'Biceps',t:'weight'},
  {n:'Incline Dumbbell Curl',g:'Biceps',eq:'Dumbbell',m:'Long Head Biceps',t:'weight'},
  {n:'Cable Curl',g:'Biceps',eq:'Cable',m:'Biceps',t:'weight'},
  {n:'Preacher Curl',g:'Biceps',eq:'Machine',m:'Short Head Biceps',t:'weight'},
  {n:'Machine Bicep Curl',g:'Biceps',eq:'Machine',m:'Biceps',t:'weight'},
  {n:'Tricep Pushdown (Bar)',g:'Triceps',eq:'Cable',m:'Triceps',t:'weight'},
  {n:'Tricep Pushdown (Rope)',g:'Triceps',eq:'Cable',m:'Lateral Head',t:'weight'},
  {n:'Overhead Tricep Extension',g:'Triceps',eq:'Cable',m:'Long Head',t:'weight'},
  {n:'Skull Crusher',g:'Triceps',eq:'Barbell',m:'Triceps',t:'weight'},
  {n:'Tricep Kickback',g:'Triceps',eq:'Dumbbell',m:'Lateral Head',t:'weight'},
  {n:'Tricep Machine',g:'Triceps',eq:'Machine',m:'Triceps',t:'weight'},
  {n:'Tricep Dips (Bench)',g:'Triceps',eq:'Bodyweight',m:'Triceps',t:'weight'},
  {n:'Barbell Back Squat',g:'Legs',eq:'Barbell',m:'Quads, Glutes',t:'weight'},
  {n:'Barbell Front Squat',g:'Legs',eq:'Barbell',m:'Quads, Core',t:'weight'},
  {n:'Hip Thrust (Barbell)',g:'Legs',eq:'Barbell',m:'Glutes',t:'weight'},
  {n:'Goblet Squat',g:'Legs',eq:'Dumbbell',m:'Quads, Glutes',t:'weight'},
  {n:'Sumo Squat (Dumbbell)',g:'Legs',eq:'Dumbbell',m:'Inner Thighs, Glutes',t:'weight'},
  {n:'Dumbbell Squat',g:'Legs',eq:'Dumbbell',m:'Quads, Glutes',t:'weight'},
  {n:'Bulgarian Split Squat',g:'Legs',eq:'Dumbbell',m:'Quads, Glutes',t:'weight'},
  {n:'Lunge (Dumbbell)',g:'Legs',eq:'Dumbbell',m:'Quads, Glutes',t:'weight'},
  {n:'Walking Lunge',g:'Legs',eq:'Dumbbell',m:'Quads, Glutes',t:'weight'},
  {n:'Romanian Deadlift (Dumbbell)',g:'Legs',eq:'Dumbbell',m:'Hamstrings',t:'weight'},
  {n:'Leg Press',g:'Legs',eq:'Machine',m:'Quads, Glutes',t:'weight'},
  {n:'Leg Extension',g:'Legs',eq:'Machine',m:'Quads',t:'weight'},
  {n:'Hack Squat Machine',g:'Legs',eq:'Machine',m:'Quads, Glutes',t:'weight'},
  {n:'Seated Leg Curl',g:'Legs',eq:'Machine',m:'Hamstrings',t:'weight'},
  {n:'Lying Leg Curl',g:'Legs',eq:'Machine',m:'Hamstrings',t:'weight'},
  {n:'Hip Thrust (Machine)',g:'Legs',eq:'Machine',m:'Glutes',t:'weight'},
  {n:'Abductor Machine',g:'Legs',eq:'Machine',m:'Outer Glutes',t:'weight'},
  {n:'Adductor Machine',g:'Legs',eq:'Machine',m:'Inner Thighs',t:'weight'},
  {n:'Smith Machine Squat',g:'Legs',eq:'Smith Machine',m:'Quads, Glutes',t:'weight'},
  {n:'Glute Bridge',g:'Legs',eq:'Bodyweight',m:'Glutes',t:'reps'},
  {n:'Wall Sit',g:'Legs',eq:'Bodyweight',m:'Quads',t:'time'},
  {n:'Standing Calf Raise',g:'Calves',eq:'Machine',m:'Gastrocnemius',t:'weight'},
  {n:'Seated Calf Raise',g:'Calves',eq:'Machine',m:'Soleus',t:'weight'},
  {n:'Stepper Calf Raise',g:'Calves',eq:'Bodyweight',m:'Calves',t:'weight'},
  {n:'Leg Press Calf Press',g:'Calves',eq:'Machine',m:'Gastrocnemius',t:'weight'},
  {n:'Crunch',g:'Core',eq:'Bodyweight',m:'Upper Abs',t:'reps'},
  {n:'Reverse Crunch',g:'Core',eq:'Bodyweight',m:'Lower Abs',t:'reps'},
  {n:'Bicycle Crunch',g:'Core',eq:'Bodyweight',m:'Obliques',t:'reps'},
  {n:'Leg Raise (Lying)',g:'Core',eq:'Bodyweight',m:'Lower Abs',t:'reps'},
  {n:'Hanging Leg Raise',g:'Core',eq:'Bodyweight',m:'Lower Abs',t:'reps'},
  {n:'Plank',g:'Core',eq:'Bodyweight',m:'Core',t:'time'},
  {n:'Side Plank',g:'Core',eq:'Bodyweight',m:'Obliques',t:'time'},
  {n:'Russian Twist',g:'Core',eq:'Bodyweight',m:'Obliques',t:'reps'},
  {n:'Dead Bug',g:'Core',eq:'Bodyweight',m:'Deep Core',t:'reps'},
  {n:'Mountain Climber',g:'Core',eq:'Bodyweight',m:'Core, Cardio',t:'reps'},
  {n:'Cable Crunch',g:'Core',eq:'Cable',m:'Abs',t:'weight'},
  {n:'Machine Crunch',g:'Core',eq:'Machine',m:'Abs',t:'weight'},
  {n:'Hollow Body Hold',g:'Core',eq:'Bodyweight',m:'Core',t:'time'},
  {n:'Treadmill Walk',g:'Cardio',eq:'Machine',m:'Cardio',t:'duration'},
  {n:'Treadmill Run',g:'Cardio',eq:'Machine',m:'Cardio',t:'duration'},
  {n:'Treadmill Incline Walk',g:'Cardio',eq:'Machine',m:'Glutes, Cardio',t:'duration'},
  {n:'Stationary Bike',g:'Cardio',eq:'Machine',m:'Quads, Cardio',t:'duration'},
  {n:'Elliptical',g:'Cardio',eq:'Machine',m:'Full Body',t:'duration'},
  {n:'Rowing Machine',g:'Cardio',eq:'Machine',m:'Back, Legs, Core',t:'duration'},
  {n:'Stairmaster / StepMill',g:'Cardio',eq:'Machine',m:'Glutes, Cardio',t:'duration'},
  {n:'Assault Bike',g:'Cardio',eq:'Machine',m:'Full Body',t:'duration'},
  {n:'Jump Rope',g:'Cardio',eq:'Other',m:'Cardio, Calves',t:'duration'},
  {n:'Burpee',g:'Cardio',eq:'Bodyweight',m:'Full Body',t:'reps'},
  {n:'High Knees',g:'Cardio',eq:'Bodyweight',m:'Cardio, Core',t:'duration'},
  {n:'Box Jump',g:'Cardio',eq:'Bodyweight',m:'Quads, Cardio',t:'reps'},
  {n:'Clean and Press',g:'Olympic',eq:'Barbell',m:'Full Body',t:'weight'},
  {n:'Power Clean',g:'Olympic',eq:'Barbell',m:'Full Body',t:'weight'},
  {n:'Thruster',g:'Olympic',eq:'Barbell',m:'Full Body',t:'weight'},
  {n:'Kettlebell Swing',g:'Olympic',eq:'Kettlebell',m:'Hamstrings, Glutes',t:'weight'},
  {n:'Turkish Get-Up',g:'Olympic',eq:'Kettlebell',m:'Full Body',t:'weight'},
  {n:'Wall Ball',g:'Functional',eq:'Other',m:'Quads, Shoulders',t:'weight'},
  {n:'Medicine Ball Slam',g:'Functional',eq:'Other',m:'Full Body, Core',t:'weight'},
  {n:'TRX Row',g:'Functional',eq:'Suspension',m:'Back, Biceps',t:'reps'},
  {n:'TRX Push-Up',g:'Functional',eq:'Suspension',m:'Chest, Core',t:'reps'},
  {n:'Battle Ropes',g:'Functional',eq:'Other',m:'Shoulders, Core',t:'duration'},
  {n:'Farmer\'s Walk',g:'Functional',eq:'Dumbbell',m:'Grip, Traps, Core',t:'duration'},
  {n:'Wrist Curl',g:'Forearms',eq:'Dumbbell',m:'Wrist Flexors',t:'weight'},
  {n:'Reverse Wrist Curl',g:'Forearms',eq:'Dumbbell',m:'Wrist Extensors',t:'weight'},
  {n:'Dead Hang',g:'Forearms',eq:'Bodyweight',m:'Grip',t:'time'},
  {n:'Hip Flexor Stretch',g:'Mobility',eq:'Bodyweight',m:'Hip Flexors',t:'time'},
  {n:'Pigeon Pose',g:'Mobility',eq:'Bodyweight',m:'Hip Flexors',t:'time'},
  {n:'Hamstring Stretch',g:'Mobility',eq:'Bodyweight',m:'Hamstrings',t:'time'},
  {n:'Quad Stretch',g:'Mobility',eq:'Bodyweight',m:'Quads',t:'time'},
  {n:'Calf Stretch',g:'Mobility',eq:'Bodyweight',m:'Calves',t:'time'},
  {n:'Cat-Cow',g:'Mobility',eq:'Bodyweight',m:'Spine',t:'reps'},
  {n:'Child\'s Pose',g:'Mobility',eq:'Bodyweight',m:'Back, Hips',t:'time'},
  {n:'Cobra Pose',g:'Mobility',eq:'Bodyweight',m:'Lower Back',t:'time'},
  {n:'Doorway Chest Stretch',g:'Mobility',eq:'Bodyweight',m:'Chest',t:'time'},
  {n:'Foam Roll — Quads',g:'Mobility',eq:'Other',m:'Quads',t:'time'},
  {n:'Diaphragmatic Breathing',g:'Mobility',eq:'Bodyweight',m:'Deep Core',t:'time'},
];
const EQ_TYPES=['All',...new Set(EXDB.map(e=>e.eq))].filter((v,i,a)=>a.indexOf(v)===i);
const GROUPS=['All',...new Set(EXDB.map(e=>e.g))].filter((v,i,a)=>a.indexOf(v)===i);
const exMeta=name=>EXDB.find(e=>e.n===name)||null;
const exType=name=>{const e=exMeta(name);return e?e.t:'weight'};
const isDumbbell=name=>{const e=exMeta(name);return e&&e.eq==='Dumbbell'};

// ══════════════════════════════════════════════════════
// DROPDOWN OPTIONS
// ══════════════════════════════════════════════════════
const WEIGHT_OPTS=(()=>{
  const opts=[{v:'',label:'Free weight'}];
  for(let kg=5;kg<=200;kg+=5){
    const lbs=Math.round(kg*2.205);
    opts.push({v:kg+'kg',label:kg+' kg / '+lbs+' lb'});
  }
  return opts;
})();
const REP_OPTS=Array.from({length:30},(_,i)=>i+1);
const SET_OPTS=Array.from({length:10},(_,i)=>i+1);

// ══════════════════════════════════════════════════════
// STORAGE
// ══════════════════════════════════════════════════════
const K={s:'s3_sess',m:'s3_mets',r:'s3_restdays',mig:'s3_migrated_units'};
const load=k=>{try{return JSON.parse(localStorage.getItem(k)||'null')}catch{return null}};
const store=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const getSess=()=>load(K.s)||[];
const getMets=()=>load(K.m)||[];
const putSess=a=>store(K.s,a);
const putMets=a=>store(K.m,a);
const getRestDays=()=>load(K.r)||[];
const putRestDays=a=>store(K.r,a);
const uid=()=>Date.now().toString(36)+Math.random().toString(36).slice(2);
const today=()=>new Date().toISOString().slice(0,10);

// Seed
(function(){
  if(load(K.s))return;
  const s=[
    {id:uid(),date:'2026-06-16',type:'cardio',exercises:[],notes:'First gym session'},
    {id:uid(),date:'2026-06-17',type:'upper',exercises:[],notes:''},
    {id:uid(),date:'2026-06-18',type:'lower',exercises:[],notes:''},
    {id:uid(),date:'2026-06-23',type:'cardio',exercises:[],notes:''},
    {id:uid(),date:'2026-06-24',type:'upper',exercises:[
      {n:'Pec Fly / Chest Fly Machine',w:'',r:15,d:'',sets:3},
      {n:'Chest Press Machine',w:'',r:15,d:'',sets:3},
      {n:'Clip Chest',w:'',r:15,d:'',sets:3},
      {n:'Iso-Lateral Chest Press',w:'',r:15,d:'',sets:3},
      {n:'Dumbbell Curl',w:'',r:10,d:'',sets:3},
      {n:'Hammer Curl',w:'',r:10,d:'',sets:3},
      {n:'Reverse Curl',w:'',r:10,d:'',sets:3},
    ],notes:'Struggled at end of sets'},
    {id:uid(),date:'2026-06-30',type:'cardio',exercises:[],notes:'Back after 5-day break'},
    {id:uid(),date:'2026-07-01',type:'upper',exercises:[
      {n:'Chest Press Machine',w:'',r:15,d:'',sets:3},
      {n:'Pec Fly / Chest Fly Machine',w:'',r:15,d:'',sets:3},
      {n:'Lateral Raise (Dumbbell)',w:'',r:15,d:'',sets:3},
    ],notes:'Low weights'},
    {id:uid(),date:'2026-07-02',type:'lower',exercises:[
      {n:'Sumo Squat (Dumbbell)',w:'',r:15,d:'',sets:3},
      {n:'Leg Extension',w:'',r:15,d:'',sets:3},
      {n:'Seated Leg Curl',w:'',r:15,d:'',sets:3},
      {n:'Stepper Calf Raise',w:'',r:15,d:'',sets:3},
    ],notes:''},
    {id:uid(),date:'2026-07-03',type:'upper',exercises:[
      {n:'Seated Cable Row',w:'',r:15,d:'',sets:3},
      {n:'Lat Pulldown',w:'',r:15,d:'',sets:3},
      {n:'Vertical Row Machine',w:'',r:15,d:'',sets:3},
      {n:'Iso-Lateral Back Row',w:'',r:15,d:'',sets:3},
      {n:'45° Back Extension',w:'',r:15,d:'',sets:3},
    ],notes:''},
    {id:uid(),date:'2026-07-04',type:'upper',exercises:[
      {n:'Dumbbell Shoulder Press',w:'',r:15,d:'',sets:3},
      {n:'Lateral Raise (Dumbbell)',w:'3kg',r:10,d:'',sets:5},
      {n:'Front Raise (Dumbbell)',w:'3kg',r:15,d:'',sets:3},
      {n:'Rear Delt Fly (Dumbbell)',w:'30kg',r:15,d:'',sets:3},
      {n:'Shrugs (Dumbbell)',w:'5kg',r:15,d:'',sets:3},
    ],notes:'First session with weights'},
    {id:uid(),date:'2026-07-06',type:'lower',exercises:[
      {n:'Sumo Squat (Dumbbell)',w:'7.5kg',r:15,d:'',sets:3},
      {n:'Leg Extension',w:'',r:15,d:'',sets:3},
      {n:'Seated Leg Curl',w:'',r:15,d:'',sets:3},
      {n:'Stepper Calf Raise',w:'',r:15,d:'',sets:3},
      {n:'Lunge (Dumbbell)',w:'',r:15,d:'',sets:3},
    ],notes:'Target 10kg next leg day'},
    {id:uid(),date:'2026-07-07',type:'cardio',exercises:[
      {n:'Treadmill Incline Walk',w:'',r:'',d:'20',sets:1},
      {n:'Treadmill Run',w:'',r:'',d:'10',sets:1},
    ],notes:''},
  ];
  putSess(s);
})();

// One-time unit relabel migration
(function migrateUnits(){
  if(load(K.mig))return;
  const sess=getSess();
  let changed=false;
  sess.forEach(s=>{
    (s.exercises||[]).forEach(ex=>{
      if(ex.w && /lb/i.test(ex.w) && !isDumbbell(ex.n)){
        ex.w=ex.w.replace(/lbs?/i,'kg');
        changed=true;
      }
    });
  });
  if(changed)putSess(sess);
  store(K.mig,true);
})();

// ══════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════
const TYPE_META={
  upper:{label:'Upper Body',cls:'tp-upper'},
  lower:{label:'Lower Body',cls:'tp-lower'},
  cardio:{label:'Cardio',cls:'tp-cardio'},
  core:{label:'Cardio+Core',cls:'tp-core'},
  rest:{label:'Rest',cls:'tp-rest'},
  other:{label:'Other',cls:'tp-rest'},
};
function fmtD(iso){const d=new Date(iso+'T00:00:00');return d.toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}
function fmtDLong(iso){const d=new Date(iso+'T00:00:00');return d.toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}

function calcStreak(sessions){
  const w=new Set(sessions.map(s=>s.date));
  const rd=new Set(getRestDays());
  let n=0;const d=new Date();
  for(let i=0;i<180;i++){
    const iso=d.toISOString().slice(0,10);
    const dow=d.getDay();
    if(w.has(iso)){n++;}
    else if(i===0){}
    else if(rd.has(dow)){}
    else break;
    d.setDate(d.getDate()-1);
  }
  return n;
}
function streakStart(sessions){
  const w=new Set(sessions.map(s=>s.date));
  const rd=new Set(getRestDays());
  let start=null;const d=new Date();
  for(let i=0;i<180;i++){
    const iso=d.toISOString().slice(0,10);
    const dow=d.getDay();
    if(w.has(iso))start=iso;
    else if(i===0){}
    else if(rd.has(dow)){}
    else break;
    d.setDate(d.getDate()-1);
  }
  return start;
}

let _tt;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(_tt);_tt=setTimeout(()=>el.classList.remove('show'),2000)}
function rmOv(){document.querySelectorAll('.overlay,.picker-overlay,.fmodal-overlay').forEach(o=>o.remove())}

// ══════════════════════════════════════════════════════
// STREAK CANVAS
// ══════════════════════════════════════════════════════
let _raf,_p=[];
function drawStreak(streak){
  const cv=document.getElementById('streakCanvas');if(!cv)return;
  const ctx=cv.getContext('2d');
  const W=cv.offsetWidth,H=cv.offsetHeight;cv.width=W;cv.height=H;
  const intensity=Math.min(streak/30,1);
  if(!_p.length&&streak>0)for(let i=0;i<35;i++)_p.push({x:Math.random()*W,y:Math.random()*H,vx:(Math.random()-.5)*.5,vy:-Math.random()*.7-.2,sz:Math.random()*1.8+.8,life:Math.random()});
  cancelAnimationFrame(_raf);
  function frame(){
    ctx.clearRect(0,0,W,H);
    if(streak>0){
      const g=ctx.createRadialGradient(W/2,H/2,10,W/2,H/2,H*.7);
      g.addColorStop(0,'rgba(113,242,80,'+(0.22*intensity)+')');
      g.addColorStop(1,'rgba(113,242,80,0)');
      ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
      const t=Date.now()/1000,pulse=Math.sin(t*2)*.03+.05,ringR=58+Math.sin(t*1.5)*7;
      ctx.beginPath();ctx.arc(W/2,H/2,ringR,0,Math.PI*2);ctx.strokeStyle='rgba(113,242,80,'+(pulse*intensity)+')';ctx.lineWidth=1;ctx.stroke();
      _p.forEach(function(p){
        p.x+=p.vx;p.y+=p.vy;p.life+=.005;
        if(p.life>1||p.y<-10){p.x=Math.random()*W;p.y=H+10;p.life=0}
        const a=Math.sin(p.life*Math.PI)*.5*intensity;
        ctx.beginPath();ctx.arc(p.x,p.y,p.sz,0,Math.PI*2);ctx.fillStyle='rgba(113,242,80,'+a+')';ctx.fill();
      });
    }
    _raf=requestAnimationFrame(frame);
  }
  frame();
}

// ══════════════════════════════════════════════════════
// ROUTER
// ══════════════════════════════════════════════════════
let cur='today';
function go(tab){
  cancelAnimationFrame(_raf);_p=[];
  document.querySelectorAll('.screen').forEach(function(s){s.classList.remove('active')});
  document.querySelectorAll('.tab').forEach(function(t){t.classList.toggle('on',t.dataset.tab===tab)});
  document.getElementById('screen-'+tab).classList.add('active');
  cur=tab;RENDER[tab]();
}

// ══════════════════════════════════════════════════════
// LOCATION — manual search & select, no IP lookup, no permission prompt
// ══════════════════════════════════════════════════════
const LOC_KEY='s3_location_cache';
function initLocation(){
  const titleEl=document.getElementById('topbar-title');
  const cached=load(LOC_KEY);
  if(titleEl)titleEl.textContent=(cached&&cached.text)?cached.text:'Set your gym';
}

function openLocationModal(){
  rmOv();
  const cached=load(LOC_KEY);
  const ov=document.createElement('div');
  ov.className='overlay';ov.id='ov-loc';
  ov.innerHTML='<div class="sheet" onclick="event.stopPropagation()">'
    +'<div class="handle"></div>'
    +'<div class="sh-title" style="margin-bottom:16px">Your gym</div>'
    +'<div class="f-lbl">Gym name</div>'
    +'<input type="text" class="finp" id="loc-input" placeholder="e.g. Gold\'s Gym, Kumbalam" value="'+((cached&&cached.text)?cached.text:'')+'" autocomplete="off" autocorrect="off">'
    +'<div class="finp-hint">Shown at the top of the app instead of a page title.</div>'
    +'<div class="btn-row" style="margin-top:16px">'
    +'<button class="btn btn-ghost" onclick="rmOv()">Cancel</button>'
    +'<button class="btn btn-green" onclick="saveLocation()">Save</button>'
    +'</div><div class="sp-md"></div></div>';
  ov.addEventListener('click',rmOv);
  document.body.appendChild(ov);
  addSwipe(ov,null);
  setTimeout(function(){const el=document.getElementById('loc-input');if(el){el.focus();el.select()}},250);
}
function saveLocation(){
  const el=document.getElementById('loc-input');
  const val=el?el.value.trim():'';
  if(!val){toast('Enter a gym name');return}
  store(LOC_KEY,{text:val,ts:Date.now()});
  const titleEl=document.getElementById('topbar-title');
  if(titleEl)titleEl.textContent=val;
  rmOv();
  toast('Saved');
}

// ══════════════════════════════════════════════════════
// WORKOUT TIMER — survives app close; attaches duration to today's session
// ══════════════════════════════════════════════════════
const TK='s3_timer'; // {startTs, date}
let _timerInterval=null;
function getTimer(){return load(TK)}
function setTimerRec(v){store(TK,v)}
function clearTimerRec(){localStorage.removeItem(TK)}

function fmtElapsed(ms){
  const totalSec=Math.floor(ms/1000);
  const h=Math.floor(totalSec/3600);
  const m=Math.floor((totalSec%3600)/60);
  const s=totalSec%60;
  if(h>0)return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
  return String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}

function startTimer(){
  if(getTimer())return;
  setTimerRec({startTs:Date.now(),date:today()});
  showTimerLive();
  toast('Workout timer started');
}
function stopTimer(){
  const t=getTimer();
  if(!t)return;
  const elapsedMs=Date.now()-t.startTs;
  const mins=Math.max(1,Math.round(elapsedMs/60000));
  clearTimerRec();
  hideTimerLive();
  attachDurationToDay(mins,t.date);
  toast('Workout logged: '+mins+' min');
}
function attachDurationToDay(mins,dateIso){
  const all=getSess();
  let idx=-1;
  for(let i=0;i<all.length;i++){if(all[i].date===dateIso){idx=i;break}}
  if(idx>=0){
    all[idx].durationMin=(all[idx].durationMin||0)+mins;
    putSess(all);
    if(cur==='today'||cur==='log')RENDER[cur]();
  } else {
    const rec={id:uid(),date:dateIso,type:'other',exercises:[],notes:'',durationMin:mins};
    all.push(rec);
    putSess(all);
    _s=JSON.parse(JSON.stringify(rec));
    _isEditing=true;
    buildSheet();
  }
}
function showTimerLive(){
  const startBtn=document.getElementById('timer-start-btn');
  const live=document.getElementById('timer-live');
  if(startBtn)startBtn.style.display='none';
  if(live)live.style.display='flex';
  updateTimerDisplay();
  clearInterval(_timerInterval);
  _timerInterval=setInterval(updateTimerDisplay,1000);
}
function hideTimerLive(){
  const startBtn=document.getElementById('timer-start-btn');
  const live=document.getElementById('timer-live');
  if(startBtn)startBtn.style.display='flex';
  if(live)live.style.display='none';
  clearInterval(_timerInterval);
}
function updateTimerDisplay(){
  const t=getTimer();
  if(!t){hideTimerLive();return}
  const el=document.getElementById('timer-elapsed');
  if(el)el.textContent=fmtElapsed(Date.now()-t.startTs);
}
function initTimerOnBoot(){
  if(getTimer())showTimerLive();
}

// ══════════════════════════════════════════════════════
// TODAY
// ══════════════════════════════════════════════════════
function renderToday(){
  const td=today(),sessions=getSess();
  const tdSess=sessions.filter(function(s){return s.date===td});
  const streak=calcStreak(sessions);
  const logged=tdSess.length>0;
  const monthSess=sessions.filter(function(s){return s.date.startsWith(td.slice(0,7))}).length;

  const now=new Date(),yr=now.getFullYear(),mo=now.getMonth();
  const worked=new Set(sessions.map(function(s){return s.date}));
  const dim=new Date(yr,mo+1,0).getDate();
  const sd=new Date(yr,mo,1).getDay();
  const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
  const wls=['S','M','T','W','T','F','S'].map(function(l){return '<div class="cal-wl">'+l+'</div>'}).join('');
  let dots='';
  for(let i=0;i<sd;i++)dots+='<div></div>';
  for(let d=1;d<=dim;d++){
    const iso=yr+'-'+String(mo+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const isFut=iso>td,isW=worked.has(iso);
    let cls='cdot';if(isW)cls+=' w';if(iso===td)cls+=' td';if(isFut)cls+=' fut';
    const click=isW&&!isFut?'onclick="showPopup(this,\''+iso+'\')"':'';
    dots+='<div class="'+cls+'" '+click+'>'+d+'</div>';
  }

  const streakMsg=streak===0?'Start your streak today':streak<3?'Building momentum':streak<7?'Getting consistent':streak<14?'On a roll':'Unstoppable';

  const recent7=sessions.slice().sort(function(a,b){return b.date.localeCompare(a.date)}).slice(0,7);
  const tc={upper:0,lower:0,cardio:0,core:0};
  recent7.forEach(function(s){if(tc[s.type]!==undefined)tc[s.type]++});
  let suggHTML='';
  if(!logged){
    const rd=getRestDays();
    const todayDow=new Date(td+'T00:00:00').getDay();
    let sg;
    if(rd.includes(todayDow)){
      sg={label:'Rest Day',cls:'tp-rest',reason:'Your declared rest day. Recovery is part of training.'};
    } else {
      const scores={lower:3-tc.lower,cardio:2.5-tc.cardio,upper:2-tc.upper,core:1.5-tc.core};
      const best=Object.entries(scores).sort(function(a,b){return b[1]-a[1]})[0][0];
      const reasons={lower:'Low leg muscle on your InBody — raises BMR most.',cardio:'Cardio burns visceral fat (VFL 15). Priority.',upper:'Good balance — keeps the week rounded.',core:'Core plus cardio: burns fat, strengthens midsection.'};
      sg={label:TYPE_META[best].label,cls:TYPE_META[best].cls,reason:reasons[best]};
    }
    suggHTML='<div class="s-lbl">Next session — suggestion</div>'
      +'<div class="plan-card"><div class="plan-top"><div class="plan-title">'+sg.label+'</div>'
      +'<span class="type-pill '+sg.cls+'">'+sg.label+'</span></div>'
      +'<div style="font-size:12px;color:var(--muted);margin-top:3px;line-height:1.6">'+sg.reason+'</div></div>';
  }

  const lastSess=sessions.slice().sort(function(a,b){return b.date.localeCompare(a.date)})[0]||null;
  let lastHTML='';
  if(lastSess){
    const disp=logged?tdSess:[lastSess];
    const lbl=logged?'Today':'Last session';
    const cards=disp.map(function(s){
      const m=TYPE_META[s.type]||TYPE_META.other;
      const chips=s.exercises.length?'<div class="sc-chips">'+s.exercises.map(function(e){return '<span class="chip">'+e.n+'</span>'}).join('')+'</div>':'';
      const durChip=s.durationMin?'<span class="chip" style="color:var(--green)">⏱ '+s.durationMin+' min</span>':'';
      const note=s.notes?'<div class="sc-note">'+s.notes+'</div>':'';
      return'<div class="sess-card" onclick="openSess(\''+s.id+'\')"><div class="sc-date">'+fmtD(s.date)+'</div><div class="sc-top"><div class="sc-title">'+m.label+'</div><span class="type-pill '+m.cls+'">'+m.label+'</span></div>'+chips+(durChip?'<div class="sc-chips">'+durChip+'</div>':'')+note+'</div>';
    }).join('');
    lastHTML='<div class="s-lbl">'+lbl+'</div><div class="card">'+cards+'</div>';
  } else {
    lastHTML='<div class="empty"><div class="empty-t">Nothing logged yet</div><div class="empty-s">Tap + to log your first session</div></div>';
  }

  document.getElementById('screen-today').innerHTML=''
    +'<div class="hdr">'
    +'<div><div class="eyebrow">'+fmtDLong(td)+'</div><div class="hdr-title">SET<span>3</span></div></div>'
    +'<div style="display:flex;gap:8px;align-items:center">'
    +'<button class="add-btn ghost" onclick="openRestDayModal()"><svg viewBox="0 0 24 24"><path d="M13 2L4.5 13.5H11L10 22L19.5 10.5H13Z"/></svg></button>'
    +'<button class="add-btn" onclick="openLogModal()"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button>'
    +'</div></div>'
    +'<div class="streak-hero" onclick="openStreakModal()">'
    +'<div class="streak-canvas-wrap"><canvas id="streakCanvas"></canvas>'
    +'<div class="streak-center"><div class="streak-num '+(streak>=7?'fire':'')+'">'+streak+'</div><div class="streak-word">Day Streak</div><div class="streak-msg">'+streakMsg+'</div></div></div>'
    +'<div class="streak-bottom"><div class="streak-stat"><div class="lbl">Sessions</div><div class="val">'+sessions.length+'</div></div>'
    +'<div class="streak-div"></div><div class="streak-stat"><div class="lbl">This month</div><div class="val green">'+monthSess+'</div></div></div></div>'
    +suggHTML
    +lastHTML
    +'<div class="s-lbl">'+MONTHS[mo]+' '+yr+'</div>'
    +'<div class="card"><div style="padding:14px 16px 10px">'
    +'<div class="cal-mhdr"><div class="cal-mlbl">'+MONTHS[mo]+'</div><div class="cal-ylbl">'+yr+'</div></div>'
    +'<div class="cal-wk">'+wls+'</div><div class="cal-grid">'+dots+'</div></div></div>'
    +'<div class="sp-md"></div>';
  requestAnimationFrame(function(){drawStreak(streak)});
}

// ══════════════════════════════════════════════════════
// LOG — bento dashboard + weekly/monthly toggle
// ══════════════════════════════════════════════════════
const WEEKLY_TARGET={lower:2,upper:2,cardio:3,core:1};
let _logView='weekly';

function isoWeek(dateStr){
  const d=new Date(dateStr+'T00:00:00');
  const day=(d.getDay()+6)%7;
  d.setDate(d.getDate()-day+3);
  const firstThu=new Date(d.getFullYear(),0,4);
  const week=1+Math.round(((d-firstThu)/86400000-3+((firstThu.getDay()+6)%7))/7);
  return d.getFullYear()+'-W'+String(week).padStart(2,'0');
}
function weekLabel(dateStr){
  const d=new Date(dateStr+'T00:00:00');
  const day=(d.getDay()+6)%7;
  const mon=new Date(d);mon.setDate(d.getDate()-day);
  const sun=new Date(mon);sun.setDate(mon.getDate()+6);
  const f=function(x){return x.toLocaleDateString('en-IN',{day:'numeric',month:'short'})};
  return f(mon)+' – '+f(sun);
}
function monthLabel(dateStr){
  const d=new Date(dateStr+'T00:00:00');
  return d.toLocaleDateString('en-IN',{month:'long',year:'numeric'});
}

function renderLog(){
  const sessions=getSess().slice().sort(function(a,b){return b.date.localeCompare(a.date)});
  const td=today();
  const monthPrefix=td.slice(0,7);

  const monthSess=sessions.filter(function(s){return s.date.startsWith(monthPrefix)});
  const catCount={lower:0,upper:0,cardio:0,core:0,other:0};
  monthSess.forEach(function(s){const k=catCount[s.type]!==undefined?s.type:'other';catCount[k]++});
  const dayOfMonth=new Date(td+'T00:00:00').getDate();
  const weeksElapsed=Math.max(1,Math.ceil(dayOfMonth/7));

  const bentoItems=[
    {key:'lower',label:'Lower Body',cls:'tp-lower',color:'#FFB450',target:WEEKLY_TARGET.lower},
    {key:'upper',label:'Upper Body',cls:'tp-upper',color:'#71F250',target:WEEKLY_TARGET.upper},
    {key:'cardio',label:'Cardio',cls:'tp-cardio',color:'#50B4FF',target:WEEKLY_TARGET.cardio},
    {key:'core',label:'Cardio + Core',cls:'tp-core',color:'#C878FF',target:WEEKLY_TARGET.core},
  ];
  const bento='<div class="bento-grid">'+bentoItems.map(function(b){
    const count=catCount[b.key];
    const targetTotal=b.target*weeksElapsed;
    const pct=Math.min(Math.round((count/targetTotal)*100),100);
    return '<div class="bento" onclick="showBentoDetail(\''+b.key+'\')">'
      +'<div class="bento-top"><span class="bento-label">'+b.label+'</span><span class="type-pill '+b.cls+'">'+b.target+'/wk</span></div>'
      +'<div class="bento-count"><span style="color:'+b.color+'">'+count+'</span></div>'
      +'<div class="bento-sub">this month · target '+targetTotal+'</div>'
      +'<div class="bento-bar"><div class="bento-bar-fill" style="width:'+pct+'%;background:'+b.color+'"></div></div>'
      +'<div class="bento-pct" style="color:'+b.color+'">'+pct+'% of good-mix target</div></div>';
  }).join('')+'</div>';

  const groups={};
  sessions.forEach(function(s){
    const key=_logView==='weekly'?isoWeek(s.date):s.date.slice(0,7);
    if(!groups[key])groups[key]={label:_logView==='weekly'?weekLabel(s.date):monthLabel(s.date),sessions:[]};
    groups[key].sessions.push(s);
  });
  const sortedKeys=Object.keys(groups).sort(function(a,b){return b.localeCompare(a)});

  let histHTML='';
  if(!sessions.length){
    histHTML='<div class="empty"><div class="empty-t">No sessions yet</div><div class="empty-s">Log your first session on the Today tab.</div></div>';
  } else {
    histHTML=sortedKeys.map(function(k){
      const g=groups[k];
      const cards=g.sessions.map(function(s){
        const m=TYPE_META[s.type]||TYPE_META.other;
        const chips=s.exercises.length?'<div class="sc-chips">'+s.exercises.map(function(e){return '<span class="chip">'+e.n+'</span>'}).join('')+'</div>':'';
        const durChip=s.durationMin?'<div class="sc-chips"><span class="chip" style="color:var(--green)">⏱ '+s.durationMin+' min</span></div>':'';
        return'<div class="sess-card" onclick="openSess(\''+s.id+'\')"><div class="sc-date">'+fmtD(s.date)+'</div><div class="sc-top"><div class="sc-title">'+m.label+'</div><span class="type-pill '+m.cls+'">'+m.label+'</span></div>'+chips+durChip+'</div>';
      }).join('');
      return '<div class="period-group"><div class="period-hdr">'+g.label+'<span class="count">'+g.sessions.length+' session'+(g.sessions.length!==1?'s':'')+'</span></div><div class="card">'+cards+'</div></div>';
    }).join('');
  }

  document.getElementById('screen-log').innerHTML=''
    +'<div class="hdr"><div><div class="eyebrow">Workout mix</div><div class="hdr-title">Log</div></div>'
    +'<button class="add-btn" onclick="openLogModal()"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>'
    +bento
    +'<div style="display:flex;align-items:center;justify-content:space-between;padding:8px 20px 4px">'
    +'<div class="s-lbl" style="padding:0">History</div>'
    +'<div class="view-toggle"><button class="vt-btn '+(_logView==='weekly'?'on':'')+'" onclick="setLogView(\'weekly\')">Weekly</button>'
    +'<button class="vt-btn '+(_logView==='monthly'?'on':'')+'" onclick="setLogView(\'monthly\')">Monthly</button></div></div>'
    +histHTML
    +'<div class="sp-md"></div>';
}
function setLogView(v){_logView=v;renderLog()}

function showBentoDetail(key){
  const sessions=getSess();
  const td=today(),monthPrefix=td.slice(0,7);
  const monthSess=sessions.filter(function(s){return s.date.startsWith(monthPrefix)&&s.type===key});
  const total=sessions.filter(function(s){return s.type===key}).length;
  const dayOfMonth=new Date(td+'T00:00:00').getDate();
  const weeksElapsed=Math.max(1,Math.ceil(dayOfMonth/7));
  const target=WEEKLY_TARGET[key]||1;
  const targetTotal=target*weeksElapsed;
  const pct=Math.min(Math.round((monthSess.length/targetTotal)*100),100);
  const m=TYPE_META[key]||TYPE_META.other;
  const guidance={
    lower:'ACSM recommends training each major muscle group 2+ times weekly. Legs are your priority — they raise BMR.',
    upper:'Train upper body 2+ times weekly. Balances push and pull for good posture.',
    cardio:'ACSM: 150 min moderate cardio weekly, roughly 3 sessions. Directly targets visceral fat.',
    core:'Core and flexibility work weekly supports every other lift and helps belly appearance.',
  };
  rmOv();
  const ov=document.createElement('div');
  ov.className='overlay';
  ov.innerHTML='<div class="sheet" onclick="event.stopPropagation()">'
    +'<div class="handle"></div><div class="sh-title">'+m.label+'</div>'
    +'<div class="si-card" style="margin-top:14px">'
    +'<div class="si-row"><span class="si-lbl">This month</span><span class="si-val green">'+monthSess.length+' sessions</span></div>'
    +'<div class="si-row"><span class="si-lbl">Good-mix target</span><span class="si-val">'+targetTotal+' ('+target+'/wk)</span></div>'
    +'<div class="si-row"><span class="si-lbl">Progress</span><span class="si-val">'+pct+'%</span></div>'
    +'<div class="si-row"><span class="si-lbl">All-time total</span><span class="si-val">'+total+'</span></div></div>'
    +'<div style="font-size:12px;color:var(--muted);line-height:1.7;padding:0 2px 8px">'+(guidance[key]||'')+'</div>'
    +'<button class="btn btn-ghost" onclick="rmOv()">Close</button><div class="sp-md"></div></div>';
  ov.addEventListener('click',rmOv);
  document.body.appendChild(ov);
  addSwipe(ov,null);
}

// ══════════════════════════════════════════════════════
// BODY
// ══════════════════════════════════════════════════════
function renderBody(){
  const mets=getMets().slice().sort(function(a,b){return b.date.localeCompare(a.date)});
  const lat=mets[0]||null,prev=mets[1]||null;
  const wD=(lat&&lat.weight&&prev&&prev.weight)?(parseFloat(lat.weight)-parseFloat(prev.weight)).toFixed(1):null;
  const waD=(lat&&lat.waist&&prev&&prev.waist)?(parseFloat(lat.waist)-parseFloat(prev.waist)).toFixed(1):null;
  const hist=!mets.length?'<div class="empty" style="padding:28px"><div class="empty-t">No measurements yet</div></div>'
    :mets.slice(0,12).map(function(mm,i){
      const p=mets[i+1];
      const wd=(p&&p.weight&&mm.weight)?(parseFloat(mm.weight)-parseFloat(p.weight)).toFixed(1):null;
      const wad=(p&&p.waist&&mm.waist)?(parseFloat(mm.waist)-parseFloat(p.waist)).toFixed(1):null;
      let s='<div class="metric-row"><div class="mr-date">'+fmtD(mm.date)+'</div><div class="mr-vals">';
      if(mm.weight){
        s+='<div class="mr-v"><div class="mr-num">'+mm.weight+'<span class="mr-u"> kg</span></div>';
        if(wd)s+='<div class="mr-d '+(parseFloat(wd)<0?'dn':'up')+'">'+(parseFloat(wd)>0?'+':'')+wd+'</div>';
        s+='</div>';
      }
      if(mm.waist){
        s+='<div class="mr-v"><div class="mr-num">'+mm.waist+'<span class="mr-u"> cm</span></div>';
        if(wad)s+='<div class="mr-d '+(parseFloat(wad)<0?'dn':'up')+'">'+(parseFloat(wad)>0?'+':'')+wad+'</div>';
        s+='</div>';
      }
      s+='</div></div>';
      return s;
    }).join('');
  document.getElementById('screen-body').innerHTML=''
    +'<div class="hdr"><div><div class="eyebrow">Measurements</div><div class="hdr-title">Body</div></div>'
    +'<button class="add-btn" onclick="openMetModal()"><svg viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg></button></div>'
    +'<div class="stat-row c2"><div class="stat-cell"><div class="lbl">Weight</div><div class="val">'+(lat?lat.weight||'—':'—')+'<span class="unit"> kg</span></div>'
    +(wD?'<div class="delta '+(parseFloat(wD)<0?'dn':'up')+'">'+(parseFloat(wD)>0?'+':'')+wD+' kg</div>':'<div style="font-size:11px;color:var(--muted);margin-top:4px">Log to track</div>')
    +'</div><div class="stat-cell"><div class="lbl">Waist</div><div class="val">'+(lat?lat.waist||'—':'—')+'<span class="unit"> cm</span></div>'
    +(waD?'<div class="delta '+(parseFloat(waD)<0?'dn':'up')+'">'+(parseFloat(waD)>0?'+':'')+waD+' cm</div>':'<div style="font-size:11px;color:var(--muted);margin-top:4px">Log to track</div>')
    +'</div></div>'
    +'<div class="s-lbl">InBody baseline · Jun 2026</div>'
    +'<div class="ib-grid"><div class="ib-cell"><div class="lbl">Start wt</div><div class="val">75.2 kg</div></div>'
    +'<div class="ib-cell"><div class="lbl">Body fat</div><div class="val" style="color:var(--red)">38.3%</div></div>'
    +'<div class="ib-cell"><div class="lbl">Visc fat</div><div class="val warn">VFL 15</div></div>'
    +'<div class="ib-cell"><div class="lbl">BMR</div><div class="val">1372</div></div>'
    +'<div class="ib-cell"><div class="lbl">Score</div><div class="val">57/100</div></div>'
    +'<div class="ib-cell"><div class="lbl">Leg ms</div><div class="val warn">Low</div></div></div>'
    +'<div class="ib-note">Target ~60 kg · Retest week 10–12</div>'
    +'<div class="s-lbl">History</div><div class="card">'+hist+'</div>'
    +'<div class="sp-md"></div>';
}

// ══════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════
function renderExport(){
  const sessions=getSess(),mets=getMets();
  document.getElementById('screen-export').innerHTML=''
    +'<div class="hdr"><div><div class="eyebrow">Analysis</div><div class="hdr-title">Export</div></div></div>'
    +'<div style="padding:0 20px 16px;font-size:13px;color:var(--muted);line-height:1.7">Generate a PDF of your training log and share to Claude for analysis.</div>'
    +'<div class="card">'
    +'<div class="exp-row"><div class="exp-text"><div class="t">Full workout log</div><div class="s">'+sessions.length+' sessions · all exercises</div></div></div>'
    +'<div class="exp-row"><div class="exp-text"><div class="t">Body measurements</div><div class="s">'+mets.length+' entries · weight and waist</div></div></div>'
    +'<div class="exp-row"><div class="exp-text"><div class="t">InBody baseline included</div><div class="s">Jun 2026 reference + deltas</div></div></div></div>'
    +'<button class="big-btn" onclick="genPDF()">Generate PDF for Claude</button>'
    +'<div style="font-size:11px;color:var(--muted);text-align:center;margin:8px 0 4px">Opens print dialog → Save as PDF → Share to Claude</div>'
    +'<div class="s-lbl">How to share</div><div class="card">'
    +['Save PDF from the print dialog','Open Claude on your phone','Tap the attachment icon and select the PDF','Ask Claude to analyse your progress'].map(function(s,i){
      return '<div class="how-row"><div class="how-n">'+(i+1)+'</div><div class="how-t">'+s+'</div></div>';
    }).join('')
    +'</div>'
    +'<div class="s-lbl">Backup and restore</div>'
    +'<div style="padding:0 20px 10px;font-size:12px;color:var(--muted);line-height:1.7">Your data lives only in this browser. Download a backup regularly, and always before redeploying — dropping onto a <strong style="color:var(--ink)">different</strong> Netlify site creates a fresh, empty storage space.</div>'
    +'<div class="card">'
    +'<div class="exp-row" style="cursor:pointer" onclick="downloadBackup()"><div class="exp-text"><div class="t">Download backup</div><div class="s">Saves all sessions, measurements and settings as a file</div></div></div>'
    +'<div class="exp-row" style="cursor:pointer" onclick="triggerRestore()"><div class="exp-text"><div class="t">Restore from backup</div><div class="s">Merges a backup file back into the app — never overwrites newer data</div></div></div>'
    +'</div>'
    +'<input type="file" id="restore-file-input" accept="application/json" style="display:none" onchange="handleRestoreFile(this)">'
    +'<div class="sp-md"></div>';
}

// ══════════════════════════════════════════════════════
// BACKUP / RESTORE — protects data across deploys and browser resets
// ══════════════════════════════════════════════════════
function downloadBackup(){
  const data={
    schema:2,
    exportedAt:new Date().toISOString(),
    sessions:getSess(),
    mets:getMets(),
    restDays:getRestDays(),
  };
  const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='set3-backup-'+today()+'.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(function(){URL.revokeObjectURL(url)},1000);
  toast('Backup downloaded');
}
function triggerRestore(){
  const inp=document.getElementById('restore-file-input');
  if(inp)inp.click();
}
function handleRestoreFile(input){
  const file=input.files[0];
  if(!file)return;
  const reader=new FileReader();
  reader.onload=function(e){
    try{
      const data=JSON.parse(e.target.result);
      if(!data.sessions||!Array.isArray(data.sessions)){toast('Invalid backup file');return}
      const existingSess=getSess();
      const byId={};
      existingSess.forEach(function(s){byId[s.id]=s});
      (data.sessions||[]).forEach(function(s){if(!byId[s.id])byId[s.id]=s});
      putSess(Object.values(byId));
      const existingMets=getMets();
      const byDate={};
      existingMets.forEach(function(m){byDate[m.date]=m});
      (data.mets||[]).forEach(function(m){if(!byDate[m.date])byDate[m.date]=m});
      putMets(Object.values(byDate));
      if(data.restDays&&data.restDays.length&&!getRestDays().length)putRestDays(data.restDays);
      toast('Backup restored');
      RENDER[cur]();
    }catch(err){
      toast('Could not read backup file');
    }
  };
  reader.readAsText(file);
  input.value='';
}

// ══════════════════════════════════════════════════════
// EXERCISE PICKER
// ══════════════════════════════════════════════════════
let _pickerSel=[],_pickerCb=null,_fEq='All',_fGrp='All',_fQ='';
function openPicker(currentNames,cb){
  _pickerSel=currentNames.slice();_pickerCb=cb;_fEq='All';_fGrp='All';_fQ='';
  const ov=document.createElement('div');
  ov.className='picker-overlay';ov.id='ov-picker';
  ov.innerHTML='<div class="picker-inner">'
    +'<div class="picker-hdr"><input class="picker-search" type="text" placeholder="Search exercises…" id="ps-q" oninput="fPick(this.value)" autocomplete="off" autocorrect="off" spellcheck="false">'
    +'<button class="picker-cancel" onclick="closePicker()">Done</button></div>'
    +'<div class="picker-filters" id="ps-grp">'+GROUPS.map(function(g){return '<button class="filt-btn '+(g==='All'?'on':'')+'" onclick="setGrp(\''+g+'\',this)">'+g+'</button>'}).join('')+'</div>'
    +'<div class="picker-filters" id="ps-eq">'+EQ_TYPES.map(function(e){return '<button class="filt-btn" onclick="setEq(\''+e+'\',this)">'+e+'</button>'}).join('')+'</div>'
    +'<div class="picker-list" id="ps-list"></div></div>';
  document.body.appendChild(ov);
  renderPickerList();
  setTimeout(function(){const el=document.getElementById('ps-q');if(el)el.focus()},200);
}
function fPick(q){_fQ=q;renderPickerList()}
function setGrp(g,btn){_fGrp=g;document.querySelectorAll('#ps-grp .filt-btn').forEach(function(b){b.classList.remove('on')});btn.classList.add('on');renderPickerList()}
function setEq(e,btn){_fEq=e;document.querySelectorAll('#ps-eq .filt-btn').forEach(function(b){b.classList.remove('on')});btn.classList.add('on');renderPickerList()}
function renderPickerList(){
  const q=_fQ.toLowerCase().trim();
  let list=EXDB.filter(function(e){
    if(_fGrp!=='All'&&e.g!==_fGrp)return false;
    if(_fEq!=='All'&&e.eq!==_fEq)return false;
    if(q&&e.n.toLowerCase().indexOf(q)<0&&e.m.toLowerCase().indexOf(q)<0&&e.g.toLowerCase().indexOf(q)<0)return false;
    return true;
  });
  if(!list.length){document.getElementById('ps-list').innerHTML='<div class="empty"><div class="empty-t">No exercises found</div></div>';return}
  const groups={};list.forEach(function(e){if(!groups[e.g])groups[e.g]=[];groups[e.g].push(e)});
  let html='';
  Object.entries(groups).forEach(function(entry){
    const grp=entry[0],exs=entry[1];
    html+='<div class="picker-group-lbl">'+grp+'</div>';
    exs.forEach(function(e){
      const sel=_pickerSel.indexOf(e.n)>=0;
      html+='<div class="picker-item" onclick="togPickEx(\''+e.n.replace(/'/g,"\\'")+'\')"><div class="pi-info"><div class="pi-name">'+e.n+'</div><div class="pi-meta">'+e.eq+' · '+e.m+'</div></div><div class="pi-check '+(sel?'on':'')+'"></div></div>';
    });
  });
  document.getElementById('ps-list').innerHTML=html;
}
function togPickEx(name){
  const i=_pickerSel.indexOf(name);
  if(i>=0)_pickerSel.splice(i,1);else _pickerSel.push(name);
  renderPickerList();
  if(_pickerCb)_pickerCb(_pickerSel);
}
function closePicker(){const el=document.getElementById('ov-picker');if(el)el.remove()}

// ══════════════════════════════════════════════════════
// SESSION MODAL — reworked: dropdowns, autosave, action circles
// ══════════════════════════════════════════════════════
let _s=null,_isEditing=false;

function openLogModal(){
  _s={id:uid(),date:today(),type:'upper',exercises:[],notes:''};
  _isEditing=false;
  buildSheet();
}
function openSess(id){
  const all=getSess();
  let f=null;
  for(let i=0;i<all.length;i++){if(all[i].id===id){f=all[i];break}}
  if(!f)return;
  _s=JSON.parse(JSON.stringify(f));
  _isEditing=true;
  buildSheet();
}

function autosave(){
  const notesEl=document.getElementById('s-notes');
  if(notesEl)_s.notes=notesEl.value.trim();
  const typeEl=document.getElementById('s-type');
  if(typeEl)_s.type=typeEl.value;
  const dateEl=document.getElementById('s-date');
  if(dateEl)_s.date=dateEl.value;
  const durEl=document.getElementById('s-duration');
  if(durEl)_s.durationMin=durEl.value?parseInt(durEl.value,10):null;
  const all=getSess();
  let idx=-1;
  for(let i=0;i<all.length;i++){if(all[i].id===_s.id){idx=i;break}}
  const hasContent=_s.exercises.length>0||_s.notes||_s.durationMin;
  if(hasContent){
    if(idx>=0)all[idx]=_s;else all.push(_s);
    putSess(all);
  }
}

function fmtDuration(mins){
  mins=parseInt(mins,10)||0;
  if(mins===0)return 'No timer';
  if(mins<60)return mins+' min';
  return (mins/60).toFixed(1)+' Hours';
}
function onDurationInput(val){
  const lbl=document.getElementById('duration-label');
  if(lbl)lbl.textContent=fmtDuration(val);
}

function buildSheet(){
  rmOv();
  const ov=document.createElement('div');
  ov.className='fmodal-overlay';ov.id='ov-sess';
  const durVal=_s.durationMin||0;
  ov.innerHTML='<div class="fmodal-card" onclick="event.stopPropagation()">'
    +'<div class="sh-header"><div class="sh-title">'+(_isEditing?'Edit session':'Log session')+'</div>'
    +'<div class="sh-actions">'
    +'<button class="circle-btn del" onclick="deleteCurrentSession()" title="Delete"><svg viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/><path d="M10 11v6M14 11v6"/></svg></button>'
    +'<button class="circle-btn" onclick="saveAndClose()" title="Save"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></button>'
    +'</div></div>'
    +'<div class="field-row2">'
    +'<div><div class="f-lbl">Date</div><input type="date" class="finp" id="s-date" value="'+_s.date+'" max="'+today()+'" onchange="autosave()"></div>'
    +'<div><div class="f-lbl">Type</div><select class="finp" id="s-type" onchange="autosave()">'
    +'<option value="upper" '+(_s.type==='upper'?'selected':'')+'>Upper body</option>'
    +'<option value="lower" '+(_s.type==='lower'?'selected':'')+'>Lower body</option>'
    +'<option value="cardio" '+(_s.type==='cardio'?'selected':'')+'>Cardio</option>'
    +'<option value="core" '+(_s.type==='core'?'selected':'')+'>Cardio + Core</option>'
    +'<option value="rest" '+(_s.type==='rest'?'selected':'')+'>Rest / Walk</option>'
    +'<option value="other" '+(_s.type==='other'?'selected':'')+'>Other</option>'
    +'</select></div></div>'
    +'<div class="f-lbl">Workout duration</div>'
    +'<div class="duration-card">'
    +'<div class="duration-val" id="duration-label">'+fmtDuration(durVal)+'</div>'
    +'<input type="range" class="duration-slider" id="s-duration" min="0" max="180" step="5" value="'+durVal+'" oninput="onDurationInput(this.value)" onchange="autosave()">'
    +'<div class="duration-ticks"><span>0</span><span>1h</span><span>2h</span><span>3h</span></div>'
    +'</div>'
    +'<div class="finp-hint">Auto-filled if you use the timer at the top of the app.</div>'
    +'<div class="f-lbl">Exercises</div>'
    +'<div id="s-exl"></div>'
    +'<button class="btn-dashed" style="margin-bottom:14px" onclick="openPicker(_s.exercises.map(function(e){return e.n}),function(names){syncEx(names)})">+ Choose exercises ('+EXDB.length+' in library)</button>'
    +'<div class="f-lbl">Notes</div>'
    +'<textarea class="finp" id="s-notes" placeholder="How it felt, trainer feedback…" rows="3" onchange="autosave()">'+(_s.notes||'')+'</textarea>'
    +'<button class="btn btn-green" style="margin-top:16px" onclick="saveAndClose()">Save session</button>'
    +'</div>';
  ov.addEventListener('click',function(){saveAndClose()});
  document.body.appendChild(ov);
  renderExUnits();
}

function syncEx(names){
  const existing={};
  _s.exercises.forEach(function(e){existing[e.n]=e});
  _s.exercises=names.map(function(n){return existing[n]||{n:n,w:'',r:15,d:'',sets:3}});
  autosave();
  renderExUnits();
}

function renderExUnits(){
  const el=document.getElementById('s-exl');
  if(!el)return;
  el.innerHTML=_s.exercises.map(function(ex,ei){
    const t=exType(ex.n);
    const meta=exMeta(ex.n);
    const isTime=t==='time'||t==='duration';
    let controls;
    if(isTime){
      controls='<div class="dd-lbl">'+(t==='duration'?'Duration (minutes)':'Hold time (seconds)')+'</div>'
        +'<input class="ex-time-input" type="number" inputmode="numeric" placeholder="'+(t==='duration'?'e.g. 20':'e.g. 30')+'" value="'+(ex.d||'')+'" onchange="updEx('+ei+',\'d\',this.value)">';
    } else {
      const wOpts=WEIGHT_OPTS.map(function(o){return '<option value="'+o.v+'" '+(ex.w===o.v?'selected':'')+'>'+o.label+'</option>'}).join('');
      const rOpts=REP_OPTS.map(function(r){return '<option value="'+r+'" '+(String(ex.r)===String(r)?'selected':'')+'>'+r+'</option>'}).join('');
      const sOpts=SET_OPTS.map(function(s){return '<option value="'+s+'" '+(String(ex.sets)===String(s)?'selected':'')+'>'+s+'</option>'}).join('');
      controls='<div class="ex-dropdowns">'
        +'<div class="dd-wrap"><span class="dd-lbl">Weight</span><select class="dd" onchange="updEx('+ei+',\'w\',this.value)">'+wOpts+'</select></div>'
        +'<div class="dd-wrap"><span class="dd-lbl">Reps</span><select class="dd" onchange="updEx('+ei+',\'r\',this.value)">'+rOpts+'</select></div>'
        +'<div class="dd-wrap"><span class="dd-lbl">Sets</span><select class="dd" onchange="updEx('+ei+',\'sets\',this.value)">'+sOpts+'</select></div>'
        +'</div>';
    }
    return '<div class="ex-unit"><div class="ex-unit-hdr"><div><div class="ex-unit-name">'+ex.n+'</div>'
      +(meta?'<div class="ex-unit-meta">'+meta.eq+' · '+meta.m+'</div>':'')+'</div>'
      +'<button class="ex-rm" onclick="rmEx('+ei+')">×</button></div>'
      +controls+'</div>';
  }).join('');
}
function updEx(ei,key,val){_s.exercises[ei][key]=val;autosave()}
function rmEx(i){_s.exercises.splice(i,1);autosave();renderExUnits()}

function saveAndClose(){
  autosave();
  rmOv();
  toast('Session saved');
  RENDER[cur]();
}
function deleteCurrentSession(){
  if(!confirm('Delete this session?'))return;
  putSess(getSess().filter(function(s){return s.id!==_s.id}));
  rmOv();
  toast('Session deleted');
  RENDER[cur]();
}

// ══════════════════════════════════════════════════════
// SWIPE — down to SAVE (not just dismiss)
// ══════════════════════════════════════════════════════
function addSwipe(overlayEl,mode){
  const sheet=overlayEl.querySelector('.sheet');
  if(!sheet)return;
  let startY=0,curY=0,dragging=false,fromTop=false;
  sheet.addEventListener('touchstart',function(e){
    startY=e.touches[0].clientY;curY=startY;dragging=true;
    fromTop=sheet.scrollTop<=2;
  },{passive:true});
  sheet.addEventListener('touchmove',function(e){
    if(!dragging||!fromTop)return;
    curY=e.touches[0].clientY;
    const dy=curY-startY;
    if(dy>0){sheet.style.transform='translateY('+dy+'px)';sheet.style.transition='none'}
  },{passive:true});
  sheet.addEventListener('touchend',function(){
    if(!dragging)return;dragging=false;
    const dy=curY-startY;
    sheet.style.transition='transform .25s cubic-bezier(.32,.72,0,1)';
    if(dy>90){
      sheet.style.transform='translateY(100%)';
      overlayEl.style.opacity='0';
      if(mode==='save'){autosave();toast('Session saved')}
      setTimeout(function(){overlayEl.remove();RENDER[cur]()},240);
    } else {
      sheet.style.transform='translateY(0)';
    }
  });
}

// ══════════════════════════════════════════════════════
// METRIC MODAL
// ══════════════════════════════════════════════════════
function openMetModal(){
  rmOv();
  const ov=document.createElement('div');
  ov.className='overlay';
  ov.innerHTML='<div class="sheet" onclick="event.stopPropagation()">'
    +'<div class="handle"></div><div class="sh-title" style="margin-bottom:16px">Log measurement</div>'
    +'<div class="f-lbl">Date</div><input type="date" class="finp" id="m-date" value="'+today()+'" max="'+today()+'">'
    +'<div class="f-lbl">Weight (kg)</div><input type="number" inputmode="decimal" step="0.1" class="finp" id="m-wt" placeholder="e.g. 74.8">'
    +'<div class="f-lbl">Waist circumference (cm)</div><input type="number" inputmode="decimal" step="0.5" class="finp" id="m-wa" placeholder="e.g. 96">'
    +'<div class="finp-hint">Measure at navel level, exhale naturally.</div>'
    +'<div class="btn-row" style="margin-top:18px"><button class="btn btn-ghost" onclick="rmOv()">Cancel</button><button class="btn btn-green" onclick="saveMet()">Save</button></div>'
    +'<div class="sp-md"></div></div>';
  ov.addEventListener('click',rmOv);document.body.appendChild(ov);
  addSwipe(ov,null);
}
function saveMet(){
  const date=document.getElementById('m-date').value;
  const wt=document.getElementById('m-wt').value,wa=document.getElementById('m-wa').value;
  if(!wt&&!wa){toast('Enter at least one value');return}
  const all=getMets();
  let idx=-1;for(let i=0;i<all.length;i++){if(all[i].date===date){idx=i;break}}
  const rec={date:date,weight:wt||null,waist:wa||null};
  if(idx>=0)all[idx]=rec;else all.push(rec);
  putMets(all);rmOv();toast('Saved');renderBody();
}

// ══════════════════════════════════════════════════════
// STREAK DETAIL
// ══════════════════════════════════════════════════════
function openStreakModal(){
  const sessions=getSess();
  const streak=calcStreak(sessions);
  const start=streakStart(sessions);
  const rd=getRestDays();
  const DOW=['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  rmOv();
  const ov=document.createElement('div');
  ov.className='overlay';
  ov.innerHTML='<div class="sheet" onclick="event.stopPropagation()">'
    +'<div class="handle"></div><div class="sh-title" style="margin-bottom:14px">Streak details</div>'
    +'<div class="si-card">'
    +'<div class="si-row"><span class="si-lbl">Current streak</span><span class="si-val green">'+streak+' day'+(streak!==1?'s':'')+'</span></div>'
    +'<div class="si-row"><span class="si-lbl">Streak started</span><span class="si-val">'+(start?fmtD(start):'—')+'</span></div>'
    +'<div class="si-row"><span class="si-lbl">Total sessions</span><span class="si-val">'+sessions.length+'</span></div>'
    +'<div class="si-row"><span class="si-lbl">Rest days</span><span class="si-val">'+(rd.length?rd.map(function(d){return DOW[d]}).join(', '):'None set')+'</span></div>'
    +'</div><button class="btn btn-ghost" onclick="rmOv()">Close</button><div class="sp-md"></div></div>';
  ov.addEventListener('click',rmOv);document.body.appendChild(ov);
  addSwipe(ov,null);
}

// ══════════════════════════════════════════════════════
// REST DAY MODAL
// ══════════════════════════════════════════════════════
let _pendingRd=null;
function openRestDayModal(){
  _pendingRd=getRestDays().slice();
  const DOW_S=['S','M','T','W','T','F','S'];
  const DOW_F=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  rmOv();
  const ov=document.createElement('div');
  ov.className='overlay';
  ov.innerHTML='<div class="sheet" onclick="event.stopPropagation()">'
    +'<div class="handle"></div><div class="sh-title" style="margin-bottom:8px">Rest days</div>'
    +'<p style="font-size:12px;color:var(--muted);margin-bottom:14px;line-height:1.6">Tap days you regularly skip. Skipping a declared rest day won\'t break your streak.</p>'
    +'<div class="dow-grid">'+DOW_S.map(function(s,i){return '<button class="dow-btn '+(_pendingRd.indexOf(i)>=0?'on':'')+'" id="rd'+i+'" onclick="togRd('+i+')">'+s+'</button>'}).join('')+'</div>'
    +'<div class="dow-hint" id="rdhint">'+buildHint(_pendingRd,DOW_F)+'</div>'
    +'<button class="btn btn-green" style="margin-top:16px" onclick="saveRd()">Save rest days</button>'
    +'<button class="btn btn-ghost" style="margin-top:8px" onclick="rmOv()">Cancel</button><div class="sp-md"></div></div>';
  ov.addEventListener('click',rmOv);document.body.appendChild(ov);
  addSwipe(ov,null);
}
function togRd(d){
  const i=_pendingRd.indexOf(d);
  if(i>=0)_pendingRd.splice(i,1);else _pendingRd.push(d);
  const btn=document.getElementById('rd'+d);
  if(btn)btn.classList.toggle('on',_pendingRd.indexOf(d)>=0);
  const DOW_F=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const el=document.getElementById('rdhint');if(el)el.textContent=buildHint(_pendingRd,DOW_F);
}
function buildHint(sel,names){return sel.length?'Rest days: '+sel.map(function(d){return names[d]}).join(', ')+'.':'No rest days — every day counts.'}
function saveRd(){
  putRestDays(_pendingRd);_pendingRd=null;
  rmOv();toast('Rest days saved');
  cancelAnimationFrame(_raf);_p=[];renderToday();
}

// ══════════════════════════════════════════════════════
// CALENDAR POPUP
// ══════════════════════════════════════════════════════
let _popupDate=null;
function showPopup(el,iso){
  document.querySelectorAll('.day-popup').forEach(function(p){p.remove()});
  const s=getSess().filter(function(x){return x.date===iso});
  if(!s.length)return;
  _popupDate=iso;
  const m=TYPE_META[s[0].type]||TYPE_META.other;
  const exList=s[0].exercises.length?s[0].exercises.slice(0,3).map(function(e){return e.n}).join(', ')+(s[0].exercises.length>3?'…':''):'';

  const rect=el.getBoundingClientRect();
  const vw=window.innerWidth;
  const maxW=Math.min(240,vw-32); // never exceed viewport minus 16px margin each side

  const sessId=s[0].id;
  const pop=document.createElement('div');
  pop.className='day-popup';
  pop.onclick=function(){
    pop.remove();
    go('log');
    // Open this day's session as a modal bottom sheet, as if tapped from the Log list
    setTimeout(function(){ openSess(sessId); },80);
  };
  pop.style.cssText='position:fixed;z-index:999;background:#71F250;color:#0A0A0A;'
    +'padding:10px 13px;border-radius:12px;font-size:12px;font-weight:600;line-height:1.4;'
    +'width:'+maxW+'px;box-sizing:border-box;white-space:normal;word-wrap:break-word;'
    +'cursor:pointer;box-shadow:0 6px 20px rgba(0,0,0,0.35);';

  pop.innerHTML='<div style="font-weight:700;margin-bottom:'+(exList?'3px':'0')+'">'+m.label+'</div>'
    +(exList?'<div style="font-weight:500;font-size:11px;opacity:.85">'+exList+'</div>':'')
    +'<div style="font-weight:600;font-size:9px;margin-top:5px;opacity:.7;text-transform:uppercase;letter-spacing:.05em">Tap to open session →</div>';

  document.body.appendChild(pop);

  // Position centered on the dot, then clamp so it never overflows either edge
  const popRect=pop.getBoundingClientRect();
  let left=rect.left+rect.width/2-popRect.width/2;
  left=Math.max(16,Math.min(left,vw-popRect.width-16));
  let top=rect.top-popRect.height-10;
  if(top<10)top=rect.bottom+10; // flip below the dot if too close to top of screen
  pop.style.left=left+'px';
  pop.style.top=top+'px';

  setTimeout(function(){if(pop.parentNode)pop.remove()},3200);
}

// ══════════════════════════════════════════════════════
// PDF EXPORT
// ══════════════════════════════════════════════════════
function genPDF(){
  const sessions=getSess().slice().sort(function(a,b){return a.date.localeCompare(b.date)});
  const mets=getMets().slice().sort(function(a,b){return a.date.localeCompare(b.date)});
  const streak=calcStreak(sessions);
  const now=new Date().toLocaleDateString('en-IN',{day:'numeric',month:'long',year:'numeric'});
  const loCnt=sessions.filter(function(s){return s.type==='lower'}).length;
  const upCnt=sessions.filter(function(s){return s.type==='upper'}).length;
  const totEx=sessions.reduce(function(n,s){return n+(s.exercises||[]).length},0);

  const sessBlocks=sessions.map(function(s){
    const m=TYPE_META[s.type]||TYPE_META.other;
    const hasEx=s.exercises&&s.exercises.length>0;
    let exTable='<p class="ne">No exercises recorded</p>';
    if(hasEx){
      exTable='<table class="ex-t"><thead><tr><th>Exercise</th><th>Weight</th><th>Reps</th><th>Sets</th></tr></thead><tbody>'
        +s.exercises.map(function(e){
          const dbEx=exMeta(e.n);
          const isTime=dbEx&&(dbEx.t==='time'||dbEx.t==='duration');
          if(isTime){
            return '<tr><td class="en">'+e.n+'</td><td colspan="3">'+(e.d||'?')+' '+(dbEx.t==='duration'?'min':'sec')+'</td></tr>';
          }
          return '<tr><td class="en">'+e.n+'</td><td>'+(e.w||'Free')+'</td><td>'+(e.r||'?')+'</td><td>'+(e.sets||'?')+'</td></tr>';
        }).join('')
        +'</tbody></table>';
    }
    return '<div class="sb"><div class="sh"><div class="sd">'+fmtD(s.date)+'</div><div class="st">'+m.label+(s.durationMin?' · '+s.durationMin+' min':'')+'</div><span class="stp '+s.type+'">'+m.label+'</span></div>'
      +exTable+(s.notes?'<div class="sn">'+s.notes+'</div>':'')+'</div>';
  }).join('');

  let metTable='<p class="ne">No measurements logged.</p>';
  if(mets.length){
    metTable='<table class="std-t"><thead><tr><th>Date</th><th>Weight</th><th>Δ</th><th>Waist</th><th>Δ</th></tr></thead><tbody>'
      +mets.map(function(m,i){
        const p=mets[i-1];
        const wd=(p&&p.weight&&m.weight)?(parseFloat(m.weight)-parseFloat(p.weight)).toFixed(1):null;
        const wad=(p&&p.waist&&m.waist)?(parseFloat(m.waist)-parseFloat(p.waist)).toFixed(1):null;
        return '<tr><td>'+fmtD(m.date)+'</td><td><b>'+(m.weight||'—')+'</b></td>'
          +'<td class="'+(wd?(parseFloat(wd)<0?'gd':'bd'):'')+'">'+(wd?(parseFloat(wd)>0?'+':'')+wd:'—')+'</td>'
          +'<td><b>'+(m.waist||'—')+'</b></td>'
          +'<td class="'+(wad?(parseFloat(wad)<0?'gd':'bd'):'')+'">'+(wad?(parseFloat(wad)>0?'+':'')+wad:'—')+'</td></tr>';
      }).join('')+'</tbody></table>';
  }

  const w=window.open('','_blank');
  w.document.write('<!DOCTYPE html><html><head><meta charset="UTF-8"><title>SET3 Training Log</title>'
    +'<style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:Arial,sans-serif;font-size:11px;color:#111;background:#fff;padding:28px 32px;line-height:1.4}'
    +'.cover{display:flex;align-items:flex-start;justify-content:space-between;padding-bottom:18px;border-bottom:3px solid #0D0D0D;margin-bottom:22px}'
    +'.app{font-size:34px;font-weight:700;letter-spacing:-1px}.app span{color:#71F250}'
    +'.tag{font-size:11px;color:#888;margin-top:3px}.cr{text-align:right;font-size:11px;color:#888;line-height:1.8}.cr strong{color:#111}'
    +'.sh2{font-size:9px;font-weight:700;letter-spacing:.14em;text-transform:uppercase;color:#888;border-bottom:2px solid #71F250;padding-bottom:4px;margin:22px 0 12px;display:inline-block}'
    +'.stats{display:grid;grid-template-columns:repeat(5,1fr);gap:8px;margin-bottom:4px}'
    +'.sb2{border:1px solid #EEE;border-radius:6px;padding:9px 11px;background:#FAFAFA}'
    +'.sb2 .l{font-size:8px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:4px}'
    +'.sb2 .n{font-size:26px;font-weight:700;letter-spacing:-.5px;line-height:1}.sb2 .n.green{color:#5AD93C}'
    +'.ib2{display:grid;grid-template-columns:repeat(6,1fr);gap:7px}'
    +'.ic{border:1px solid #EEE;border-radius:6px;padding:8px 9px;background:#FAFAFA}'
    +'.ic .l{font-size:7px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:#aaa;margin-bottom:3px}'
    +'.ic .v{font-size:15px;font-weight:700}.ic .v.red{color:#E8003D}.ic .v.warn{color:#D97706}'
    +'.sb{border:1px solid #EBEBEB;border-radius:8px;margin-bottom:10px;overflow:hidden;page-break-inside:avoid}'
    +'.sh{display:flex;align-items:center;gap:10px;background:#F4F4F4;padding:8px 12px;border-bottom:1px solid #EBEBEB}'
    +'.sd{font-size:9px;font-weight:500;color:#888;white-space:nowrap}.st{font-size:13px;font-weight:700;flex:1}'
    +'.stp{font-size:8px;font-weight:700;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:20px;white-space:nowrap}'
    +'.stp.upper{background:rgba(113,242,80,.15);color:#3B9E1F}.stp.lower{background:rgba(255,180,80,.15);color:#B36A00}'
    +'.stp.cardio{background:rgba(80,180,255,.15);color:#1D6FB3}.stp.core{background:rgba(200,120,255,.15);color:#8A2FBF}'
    +'.stp.rest,.stp.other{background:#F0F0F0;color:#888}'
    +'.ex-t{width:100%;border-collapse:collapse;font-size:9px}'
    +'.ex-t th{padding:5px 8px;text-align:left;font-size:7px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;color:#aaa;border-bottom:1px solid #EBEBEB;background:#F9F9F9}'
    +'.ex-t td{padding:6px 8px;border-bottom:1px solid #F4F4F4;text-align:center;color:#444}'
    +'.ex-t td:first-child{text-align:left;font-weight:600;color:#111;font-size:10px}'
    +'.ex-t tbody tr:last-child td{border-bottom:none}.en{min-width:120px}.ne{padding:8px 12px;color:#aaa;font-style:italic;font-size:10px}'
    +'.sn{padding:6px 12px;font-size:9px;color:#888;font-style:italic;background:#FAFAFA;border-top:1px solid #EBEBEB}'
    +'.std-t{width:100%;border-collapse:collapse;font-size:11px}.std-t th{background:#111;color:#fff;padding:7px 10px;text-align:left;font-size:8px;letter-spacing:.08em;text-transform:uppercase}'
    +'.std-t td{padding:7px 10px;border-bottom:1px solid #F0F0F0}.std-t tbody tr:nth-child(even){background:#FAFAFA}'
    +'.gd{color:#059669;font-weight:600}.bd{color:#E8003D;font-weight:600}'
    +'.footer{margin-top:24px;padding-top:12px;border-top:1px solid #EEE;font-size:9px;color:#aaa;display:flex;justify-content:space-between}'
    +'.prompt{background:#F4F4F4;border-radius:6px;padding:8px 12px;font-size:10px;color:#555;font-style:italic;margin-top:8px;line-height:1.5}'
    +'@media print{body{padding:14px 18px}.sb{page-break-inside:avoid}}</style></head><body>'
    +'<div class="cover"><div><div class="app">SET<span>3</span></div><div class="tag">Personal gym training log</div></div>'
    +'<div class="cr">Generated <strong>'+now+'</strong><br>Sessions: <strong>'+sessions.length+'</strong><br>'
    +'Period: <strong>'+(sessions.length?fmtD(sessions[0].date)+' → '+fmtD(sessions[sessions.length-1].date):'N/A')+'</strong></div></div>'
    +'<div class="sh2">Summary</div><div class="stats">'
    +'<div class="sb2"><div class="l">Streak</div><div class="n green">'+streak+'</div></div>'
    +'<div class="sb2"><div class="l">Total sessions</div><div class="n">'+sessions.length+'</div></div>'
    +'<div class="sb2"><div class="l">Leg sessions</div><div class="n">'+loCnt+'</div></div>'
    +'<div class="sb2"><div class="l">Upper sessions</div><div class="n">'+upCnt+'</div></div>'
    +'<div class="sb2"><div class="l">Exercises logged</div><div class="n">'+totEx+'</div></div></div>'
    +'<div class="sh2">InBody Baseline · Jun 2026</div><div class="ib2">'
    +'<div class="ic"><div class="l">Start weight</div><div class="v">75.2 kg</div></div>'
    +'<div class="ic"><div class="l">Body fat</div><div class="v red">38.3%</div></div>'
    +'<div class="ic"><div class="l">Visceral fat</div><div class="v warn">VFL 15</div></div>'
    +'<div class="ic"><div class="l">BMR</div><div class="v">1,372</div></div>'
    +'<div class="ic"><div class="l">InBody score</div><div class="v">57/100</div></div>'
    +'<div class="ic"><div class="l">Leg muscle</div><div class="v warn">Low</div></div></div>'
    +'<div class="sh2">Workout Log · '+sessions.length+' sessions</div>'+(sessBlocks||'<p class="ne">No sessions logged yet.</p>')
    +'<div class="sh2">Body Measurements</div>'+metTable
    +'<div class="footer"><span>SET3 · '+now+'</span><span>Share to Claude for analysis</span></div>'
    +'<div class="prompt">Suggested prompt: "Here is my SET3 training log. Analyse my progress — what\'s improving, what needs attention, and what I should focus on for the next 4 weeks."</div>'
    +'</body></html>');
  w.document.close();w.focus();setTimeout(function(){w.print()},600);
}

// ══════════════════════════════════════════════════════
// BOOT
// ══════════════════════════════════════════════════════
const RENDER={today:renderToday,log:renderLog,body:renderBody,export:renderExport};
if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js').catch(function(){});
renderToday();
initTimerOnBoot();
initLocation();

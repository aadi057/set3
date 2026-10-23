// ══════════════════════════════════════════════════════
// DAILY RESET — 4-week check-in experiment
// ══════════════════════════════════════════════════════
const CK_DAYS=28;          // length of the experiment
const CK_MOVED=1.0;        // week-4 mood avg must beat week-1 avg by this to count as "clearly moved"
const CK_DROP=1.5;         // early warning: last-7-day avg this far below week 1
const CK_LOW=3;            // early warning: five check-ins in a row at or below this mood
const CK_ROLLOVER=4;       // check-ins before 4am count for the previous day

const ckAll=function(){return sGet('daily',[])};
const ckSaveAll=function(a){sSet('daily',a)};
const ckReset=function(){return sGet('reset',null)};
const ckSaveReset=function(v){sSet('reset',v)};

function ckDay(){const d=new Date();if(d.getHours()<CK_ROLLOVER)d.setDate(d.getDate()-1);return localISO(d)}
function ckMin(t){if(!t)return null;const p=t.split(':');return parseInt(p[0],10)*60+parseInt(p[1],10)}
function ckSleep(bed,wake){
  if(!bed||!wake)return null;
  let d=ckMin(wake)-ckMin(bed);if(d<=0)d+=1440;
  return d/60;
}
function ckMean(a){return a.length?a.reduce(function(x,y){return x+y},0)/a.length:null}
function ckFmtMin(m){m=parseInt(m,10)||0;if(!m)return '0m';const h=Math.floor(m/60),r=m%60;return h?(h+'h'+(r?' '+r+'m':'')):r+'m'}
function ckFmtHrs(h){return h==null?'—':(Math.round(h*10)/10)+'h'}
function ckFmtTime(t){
  if(!t)return '—';
  const m=ckMin(t),h=Math.floor(m/60),mm=String(m%60).padStart(2,'0');
  return ((h%12)||12)+':'+mm+(h<12?'am':'pm');
}

function ckGet(date){const all=ckAll();for(let i=0;i<all.length;i++){if(all[i].date===date)return all[i]}return null}
function ckPut(e){
  const all=ckAll().slice();let i=-1;
  for(let j=0;j<all.length;j++){if(all[j].date===e.date){i=j;break}}
  if(i>=0)all[i]=e;else all.push(e);
  ckSaveAll(all);
}
function ckHasContent(e){return !!(e&&(e.mood||e.bed||e.wake||e.phone||e.start||e.move===true||e.focus||e.enjoyed||e.note))}
function ckWorkout(date){return getSess().some(function(s){return s.date===date&&(s.groups||[]).length})}

// Four daily habits. Wake comes from the wake time; movement is ticked
// automatically when a workout is logged that day (overridable).
function ckHabits(e){
  const r=ckReset();
  const target=r&&r.wakeTarget;
  const wake=!!(e.wake&&target&&Math.abs(ckMin(e.wake)-ckMin(target))<=30);
  const auto=ckWorkout(e.date);
  const move=e.move===true||(e.move!==false&&auto);
  return {wake:wake,move:move,moveAuto:auto&&e.move==null,phone:!!e.phone,start:!!e.start};
}
function ckHabitCount(e){const h=ckHabits(e);return (h.wake?1:0)+(h.move?1:0)+(h.phone?1:0)+(h.start?1:0)}

function ckDayN(r){return r?daysBetween(r.start,ckDay())+1:0}
function ckRange(from,to){return ckAll().filter(function(e){return e.date>=from&&e.date<=to})}
function ckMoodStats(es){const m=es.filter(function(e){return e.mood}).map(function(e){return e.mood});return {n:m.length,avg:ckMean(m)}}
function ckWeek(r,k){return ckMoodStats(ckRange(addDays(r.start,7*(k-1)),addDays(r.start,7*k-1)))}

// What the experiment says right now. null = nothing to flag.
function ckStatus(){
  const r=ckReset();if(!r||r.booked)return null;
  const n=ckDayN(r),td=ckDay(),w1=ckWeek(r,1);
  if(n>=CK_DAYS){
    if(r.ack)return null;
    const w4=ckWeek(r,4);
    const enough=w1.n>=3&&w4.n>=3;
    const moved=enough&&(w4.avg-w1.avg)>=CK_MOVED;
    return {kind:moved?'improved':'book',w1:w1,w4:w4,enough:enough};
  }
  if(r.snoozeUntil&&td<r.snoozeUntil)return null;
  const recent=ckAll().filter(function(e){return e.mood&&e.date>=r.start}).sort(function(a,b){return b.date.localeCompare(a.date)}).slice(0,5);
  if(recent.length===5&&recent.every(function(e){return e.mood<=CK_LOW}))return {kind:'early',why:'low'};
  if(n>=10&&w1.n>=3){
    const l7=ckMoodStats(ckRange(addDays(td,-6),td));
    if(l7.n>=4&&l7.avg<=w1.avg-CK_DROP)return {kind:'early',why:'drop',w1:w1,l7:l7};
  }
  return null;
}

function ckHelpLine(){
  return '<p class="flag-help">Want a first conversation before finding someone? Tele-MANAS, India\'s free mental health line, answers in Malayalam: <b class="sel">14416</b></p>';
}
function ckStatusCard(st){
  if(!st)return '';
  const f=function(x){return x==null?'—':x.toFixed(1)};
  if(st.kind==='improved'){
    return '<section class="card tone-green flag"><div class="eyebrow">Day 28</div><h3>It\'s working</h3>'
      +'<p>Week 4 mood averaged '+f(st.w4.avg)+', up from '+f(st.w1.avg)+' in week 1. Keep the habits, and still get the bloodwork done if you haven\'t.</p>'
      +'<div class="row-btns"><button class="btn ghost" onclick="ckAck()">Got it</button><button class="btn" onclick="ckRestart(true)">Run 4 more weeks</button></div></section>';
  }
  if(st.kind==='book'){
    const body=st.enough
      ?'Week 4 mood averaged '+f(st.w4.avg)+' against '+f(st.w1.avg)+' in week 1. That isn\'t a clear change.'
      :'There weren\'t enough check-ins in week 1 or week 4 to show a clear change, so it counts as not moved.';
    return '<section class="card tone-yellow flag"><div class="eyebrow">Day 28</div><h3>Time to book the appointment</h3>'
      +'<p>'+body+' That was the deal: no renegotiating. A doctor or psychologist plus bloodwork is the next step, and the check-in log in your profile makes that first visit easier.</p>'
      +ckHelpLine()
      +'<div class="row-btns"><button class="btn" onclick="ckBooked()">I\'ve booked it</button></div></section>';
  }
  const body=st.why==='low'
    ?'Your last five check-ins were all '+CK_LOW+' or below.'
    :'Your last week averaged '+f(st.l7.avg)+', well below week 1 ('+f(st.w1.avg)+').';
  return '<section class="card tone-yellow flag"><div class="eyebrow">Check-in</div><h3>Don\'t wait for day 28</h3>'
    +'<p>'+body+' That was one of the agreed reasons to book early. It doesn\'t mean the reset failed; it means you deserve more support than habits alone.</p>'
    +ckHelpLine()
    +'<div class="row-btns"><button class="btn ghost" onclick="ckSnooze()">Remind me in 3 days</button><button class="btn" onclick="ckBooked()">I\'ve booked it</button></div></section>';
}
function ckBooked(){const r=Object.assign({},ckReset());r.booked=ckDay();ckSaveReset(r);toast('Booked. That was the hardest step');rerender()}
function ckSnooze(){const r=Object.assign({},ckReset());r.snoozeUntil=addDays(ckDay(),3);ckSaveReset(r);rerender()}
function ckAck(){const r=Object.assign({},ckReset());r.ack=true;ckSaveReset(r);rerender()}

// ── Check-in card used on Today ─────────────────────────
function ckTodayCard(){
  const r=ckReset();
  if(!r)return '<section class="card tone-yellow cta" onclick="go(\'daily\')"><div class="eyebrow">4-week reset</div><h3>Start your daily check-in</h3><p>Sleep, mood and four habits. Under a minute a day.</p><span class="btn sm">Set it up</span></section>';
  const st=ckStatus();
  if(st)return ckStatusCard(st);
  const td=ckDay(),e=ckGet(td),n=ckDayN(r);
  const dayLbl=n<=CK_DAYS?'Day '+n+' of '+CK_DAYS:'Day '+n;
  if(!ckHasContent(e)){
    return '<section class="card tone-yellow cta" onclick="ckOpen(\''+td+'\')"><div class="eyebrow">'+dayLbl+'</div><h3>How was today?</h3><p>Check in: sleep, mood, four habits, focus.</p><span class="btn sm">Check in</span></section>';
  }
  return ckHighlights(e,dayLbl);
}

// Playful highlight shapes (mood heart, sleep moon blob, focus star, habits pill)
function ckHighlights(e,dayLbl){
  const sl=ckSleep(e.bed,e.wake);
  return '<section class="card highlights" onclick="ckOpen(\''+e.date+'\')">'
    +'<div class="card-head"><h3>Today\'s check-in</h3><span class="muted">'+dayLbl+'</span></div>'
    +'<div class="hl-grid">'
    +hlTile('heart','pink',(e.mood||'—'),'/10','Mood')
    +hlTile('blob','blue',ckFmtHrs(sl),'','Sleep')
    +hlTile('star','yellow',ckFmtMin(e.focus),'','Focus')
    +hlTile('pill','green',ckHabitCount(e),'/4','Habits')
    +'</div></section>';
}
function hlTile(shape,tone,val,unit,label){
  const P={
    heart:'<path d="M50 88C50 88 8 62 8 34C8 20 18 10 31 10C40 10 46 15 50 22C54 15 60 10 69 10C82 10 92 20 92 34C92 62 50 88 50 88Z"/>',
    blob:'<path d="M52 8C74 6 94 22 92 46C90 70 74 92 48 90C22 88 6 70 8 46C10 24 30 10 52 8Z"/>',
    star:'<path d="M50 4L61 26L86 18L76 41L96 54L72 62L76 88L54 74L36 94L32 68L6 66L22 46L8 26L34 28Z"/>',
    pill:'<rect x="6" y="28" width="88" height="44" rx="22" transform="rotate(-22 50 50)"/>'
  };
  return '<div class="hl"><svg viewBox="0 0 100 100" class="hl-shape t-'+tone+'" aria-hidden="true">'+P[shape]+'</svg>'
    +'<div class="hl-txt"><b>'+val+'<small>'+unit+'</small></b><span>'+label+'</span></div></div>';
}

// ── Daily tab ──────────────────────────────────────────
function renderDaily(){
  const el=document.getElementById('screen-daily');
  const r=ckReset();
  if(!r){el.innerHTML=ckIntro();return}
  const td=ckDay(),n=ckDayN(r),e=ckGet(td);
  const eyebrow=r.booked?'Reset · appointment booked':(n<=CK_DAYS?'Day '+n+' of '+CK_DAYS:'Day '+n+' · past checkpoint');
  let todayCard;
  if(ckHasContent(e)){
    const h=ckHabits(e);
    todayCard=ckHighlights(e,eyebrow)
      +'<div class="chips wrap">'
      +ckChip('Woke on time',h.wake)+ckChip('Moved'+(h.moveAuto?' (from workout)':''),h.move)+ckChip('Phone away',h.phone)+ckChip('10-minute start',h.start)+ckChip('Enjoyed something',!!e.enjoyed)
      +'</div>'+(e.note?'<p class="note">'+esc(e.note)+'</p>':'');
  } else {
    todayCard='<section class="card tone-yellow cta" onclick="ckOpen(\''+td+'\')"><h3>How was today?</h3><p>Sleep, mood, four habits, focus. Under a minute.</p><span class="btn sm">Check in</span></section>';
  }
  el.innerHTML=''
    +'<header class="page-head"><div><div class="eyebrow">'+eyebrow+'</div><h1>Daily</h1></div>'
    +'<button class="circle" onclick="ckOpen(\''+td+'\')" aria-label="Check in">'+ic('plus')+'</button></header>'
    +'<div class="cols">'
    +'<div class="col">'+ckStatusCard(ckStatus())+todayCard+'</div>'
    +'<div class="col"><h2 class="sec">Last 7 days</h2>'+ckWeekCard(td)
    +'<h2 class="sec">The 4 weeks · average mood</h2>'+ckWeeksGrid(r)+'</div>'
    +'<div class="col"><h2 class="sec">History</h2>'+ckHistory()
    +'<h2 class="sec">Reset settings</h2><div class="list">'
    +listRow('alarm','yellow','Wake target','Waking within 30 min of '+ckFmtTime(r.wakeTarget)+' ticks the habit','ckWakeSheet()')
    +listRow('rotate','pink','Restart the 4 weeks','Keeps your check-ins, makes today day 1','ckRestart(false)')
    +'</div></div>'
    +'</div>';
}
function ckChip(label,on){return '<span class="chip'+(on?' on':'')+'">'+(on?ic('check'):'')+label+'</span>'}

function ckIntro(){
  return '<header class="page-head"><div><div class="eyebrow">4-week experiment</div><h1>Daily</h1></div></header>'
    +'<div class="cols"><div class="col">'
    +'<section class="card tone-yellow"><h3>The reset</h3><p>Four habits, every day:</p>'
    +'<ol class="rules">'
    +'<li>Fixed wake time, weekends too</li>'
    +'<li>Morning light and movement, 20–30 min. A logged workout ticks this for you.</li>'
    +'<li>Phone out of the bedroom and out of work blocks</li>'
    +'<li>One 10-minute start on the most important task</li>'
    +'</ol>'
    +'<p>Twice a week, plan something you enjoy. On day 28 the app compares week 4\'s mood with week 1. If it hasn\'t clearly moved, you book the appointment. No renegotiating.</p>'
    +'<label class="lbl" for="ck-wake-target">Wake target</label>'
    +'<input type="time" class="inp" id="ck-wake-target" value="07:00">'
    +'<button class="btn wide" style="margin-top:14px" onclick="ckStart()">Start today</button>'
    +'</section></div></div>';
}
function ckStart(){
  const v=(document.getElementById('ck-wake-target')||{}).value||'07:00';
  ckSaveReset({start:ckDay(),wakeTarget:v});
  toast('Day 1. Check in tonight');
  rerender();
}
function ckRestart(keepGoing){
  const doIt=function(){
    const r=ckReset()||{};
    ckSaveReset({start:ckDay(),wakeTarget:r.wakeTarget||'07:00'});
    toast('Day 1 again');rerender();
  };
  if(keepGoing){doIt();return}
  askConfirm('Restart the 4 weeks?','Today becomes day 1. Your check-ins stay.','Restart',doIt);
}
function ckWakeSheet(){
  const r=ckReset();
  openSheet('<h3>Wake target</h3>'
    +'<input type="time" class="inp" id="ck-wt" value="'+(r.wakeTarget||'07:00')+'">'
    +'<p class="hint">Pick a time you can hold every day, weekends included.</p>'
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button><button class="btn" onclick="ckSaveWake()">Save</button></div>');
}
function ckSaveWake(){const r=Object.assign({},ckReset());r.wakeTarget=document.getElementById('ck-wt').value||r.wakeTarget;ckSaveReset(r);closeOverlays();toast('Saved');rerender()}

function ckWeekCard(td){
  const days=[];for(let i=6;i>=0;i--)days.push(addDays(td,-i));
  const es=days.map(function(d){return ckGet(d)});
  const DOW=['S','M','T','W','T','F','S'];
  const bars=days.map(function(d,i){
    const e=es[i],m=e&&e.mood;
    const dow=DOW[new Date(d+'T00:00:00').getDay()];
    return '<button class="bar-col" onclick="ckOpen(\''+d+'\')" aria-label="'+fmtD(d)+(m?', mood '+m:'')+'"><span class="bar-val">'+(m||'')+'</span>'
      +'<span class="bar-track">'+(m?'<span class="bar" style="height:'+(m*10)+'%"></span>':'')+'</span>'
      +'<span class="bar-lbl'+(d===td?' td':'')+'">'+dow+'</span></button>';
  }).join('');
  const got=es.filter(Boolean);
  const mood=ckMoodStats(got);
  const sleeps=got.map(function(e){return ckSleep(e.bed,e.wake)}).filter(function(x){return x!=null});
  const wakes=got.map(function(e){return ckMin(e.wake)}).filter(function(x){return x!=null});
  let spread=null;
  if(wakes.length>=2){const mu=ckMean(wakes);spread=Math.round(Math.sqrt(ckMean(wakes.map(function(w){return (w-mu)*(w-mu)}))))}
  const habits=got.reduce(function(n,e){return n+ckHabitCount(e)},0);
  const focus=got.reduce(function(n,e){return n+(parseInt(e.focus,10)||0)},0);
  const enjoyed=got.filter(function(e){return e.enjoyed}).length;
  return '<section class="card tone-pink week"><div class="bars">'+bars+'</div>'
    +'<div class="stat-grid">'
    +stat('Avg mood',mood.avg==null?'—':mood.avg.toFixed(1))
    +stat('Avg sleep',ckFmtHrs(ckMean(sleeps)))
    +stat('Wake spread',spread==null?'—':'±'+spread+'m')
    +stat('Habits',habits+'<small>/28</small>')
    +stat('Focus',ckFmtMin(focus))
    +stat('Enjoyed',enjoyed+'<small>× · aim 2</small>')
    +'</div></section>';
}
function stat(l,v){return '<div class="stat"><span>'+l+'</span><b>'+v+'</b></div>'}
function ckWeeksGrid(r){
  const n=ckDayN(r);
  return '<div class="weeks">'+[1,2,3,4].map(function(k){
    const w=ckWeek(r,k),started=n>7*(k-1);
    return '<div class="wk'+(started?'':' fut')+'"><span>Week '+k+'</span><b>'+(w.avg==null?'—':w.avg.toFixed(1))+'</b><small>'+(started?w.n+' check-in'+(w.n!==1?'s':''):'not yet')+'</small></div>';
  }).join('')+'</div>';
}
function ckHistory(){
  const all=ckAll().filter(ckHasContent).sort(function(a,b){return b.date.localeCompare(a.date)}).slice(0,30);
  if(!all.length)return '<div class="list"><p class="empty">Your check-ins will show up here.</p></div>';
  return '<div class="list">'+all.map(function(e){
    const sl=ckSleep(e.bed,e.wake);
    return '<button class="row" onclick="ckOpen(\''+e.date+'\')"><span class="mood-dot">'+(e.mood||'—')+'</span>'
      +'<span class="row-main"><b>'+fmtD(e.date)+'</b><small>'+ckFmtHrs(sl)+' sleep · '+ckFmtMin(e.focus)+' focus'+(e.enjoyed?' · enjoyed':'')+'</small></span>'
      +ckDots(e)+'</button>';
  }).join('')+'</div>';
}
function ckDots(e){
  const h=ckHabits(e);
  return '<span class="dots" aria-label="'+ckHabitCount(e)+' of 4 habits">'+['wake','move','phone','start'].map(function(k){return '<i class="'+(h[k]?'on':'')+'"></i>'}).join('')+'</span>';
}

// ── Check-in sheet ─────────────────────────────────────
let _ck=null;
function ckOpen(date){
  if(!ckReset()){go('daily');return}
  const ex=ckGet(date);
  _ck=ex?JSON.parse(JSON.stringify(ex)):{date:date};
  ckBuild();
}
function ckBuild(keepScroll){
  const prev=document.querySelector('#ov-ck .modal');const st=prev?prev.scrollTop:0;
  const e=_ck,h=ckHabits(e),r=ckReset();
  const sl=ckSleep(e.bed,e.wake);
  const isToday=e.date===ckDay();
  openModal('ov-ck','<header class="modal-head"><div><div class="eyebrow">'+(isToday?'Today · ':'')+fmtD(e.date)+'</div><h2>Check-in</h2></div>'
    +'<button class="circle" onclick="ckClose()" aria-label="Save and close">'+ic('check')+'</button></header>'
    +'<label class="lbl">Mood today</label>'
    +'<div class="mood">'+[1,2,3,4,5,6,7,8,9,10].map(function(n){return '<button class="'+(e.mood===n?'on':'')+'" onclick="ckSet(\'mood\','+n+')" aria-label="Mood '+n+'">'+n+'</button>'}).join('')+'</div>'
    +'<div class="mood-ends"><span>Very low</span><span>Great</span></div>'
    +'<div class="two">'
    +'<div><label class="lbl" for="ck-bed">Slept at</label><input id="ck-bed" type="time" class="inp" value="'+(e.bed||'')+'" onchange="ckSet(\'bed\',this.value)"></div>'
    +'<div><label class="lbl" for="ck-wake">Woke at</label><input id="ck-wake" type="time" class="inp" value="'+(e.wake||'')+'" onchange="ckSet(\'wake\',this.value)"></div>'
    +'</div>'
    +'<p class="hint">'+(sl!=null?ckFmtHrs(sl)+' sleep. ':'')+'Wake target '+ckFmtTime(r.wakeTarget)+(e.wake?(h.wake?', on time.':', missed.'):'.')+'</p>'
    +'<label class="lbl">Habits</label>'
    +'<div class="toggles">'
    +tgRow('wake','alarm','yellow','Woke on time','Set from your wake time',h.wake,true)
    +tgRow('move','mobility','green','Morning light + movement',h.moveAuto?'Ticked by your logged workout':'A walk outside counts',h.move,false)
    +tgRow('phone','phone','blue','Phone away','Out of the bedroom and out of work blocks',h.phone,false)
    +tgRow('start','zap','pink','10-minute start','On the most important task',h.start,false)
    +'</div>'
    +'<label class="lbl" for="ck-focus">Focused work · <span id="ck-focus-lbl">'+ckFmtMin(e.focus)+'</span></label>'
    +'<input id="ck-focus" type="range" class="range" min="0" max="360" step="15" value="'+(e.focus||0)+'" oninput="document.getElementById(\'ck-focus-lbl\').textContent=ckFmtMin(this.value)" onchange="ckSet(\'focus\',parseInt(this.value,10))">'
    +'<div class="ticks"><span>0</span><span>2h</span><span>4h</span><span>6h</span></div>'
    +'<div class="toggles" style="margin-top:14px">'+tgRow('enjoyed','heart','pink','Did something I enjoyed','Cinema, a good meal, people. Aim for twice a week.',!!e.enjoyed,false)+'</div>'
    +'<label class="lbl" for="ck-note">Note</label>'
    +'<textarea id="ck-note" class="inp" placeholder="Optional: what helped, what got in the way" rows="2" onchange="ckSet(\'note\',this.value.trim(),true)">'+esc(e.note)+'</textarea>'
    +'<button class="btn wide" style="margin-top:16px" onclick="ckClose()">Save check-in</button>',ckClose);
  if(keepScroll){const m=document.querySelector('#ov-ck .modal');if(m)m.scrollTop=st}
}
function tgRow(key,icon,tone,title,sub,on,locked){
  return '<div class="tg-row'+(locked?' locked':'')+'"'+(locked?'':' role="switch" tabindex="0" aria-checked="'+on+'" onclick="ckToggle(\''+key+'\')" onkeydown="if(event.key===\' \'||event.key===\'Enter\'){event.preventDefault();ckToggle(\''+key+'\')}"')+'>'
    +'<span class="dot t-'+tone+'">'+ic(icon)+'</span>'
    +'<span class="tg-main"><b>'+title+'</b><small>'+sub+'</small></span>'
    +'<span class="switch'+(on?' on':'')+'"></span></div>';
}
function ckSet(k,v,silent){
  _ck[k]=v;
  if(ckHasContent(_ck))ckPut(_ck);
  if(!silent&&(k==='mood'||k==='bed'||k==='wake'))ckBuild(true);
}
function ckToggle(k){
  if(k==='move'){const h=ckHabits(_ck);_ck.move=!h.move}
  else _ck[k]=!_ck[k];
  if(ckHasContent(_ck))ckPut(_ck);
  ckBuild(true);
}
function ckClose(){
  if(!_ck)return;
  const note=document.getElementById('ck-note');if(note)_ck.note=note.value.trim();
  const saved=ckHasContent(_ck);
  if(saved)ckPut(_ck);
  _ck=null;closeOverlays();
  if(saved)toast('Checked in');
  rerender();
}

// ── Check-in log report ────────────────────────────────
function ckReportHTML(){
  const r=ckReset();
  const es=ckAll().filter(ckHasContent).sort(function(a,b){return a.date.localeCompare(b.date)});
  if(!es.length)return null;
  const f=function(x){return x==null?'—':x.toFixed(1)};
  let weeks='';
  if(r){
    weeks='<table><thead><tr><th>Week</th><th>Mood avg</th><th>Check-ins</th></tr></thead><tbody>'
      +[1,2,3,4].map(function(k){const w=ckWeek(r,k);return '<tr><td>Week '+k+' (from '+fmtD(addDays(r.start,7*(k-1)))+')</td><td><b>'+f(w.avg)+'</b></td><td>'+w.n+'</td></tr>'}).join('')
      +'</tbody></table>';
  }
  const rows=es.map(function(e){
    const h=ckHabits(e);
    return '<tr><td>'+fmtD(e.date)+'</td><td><b>'+(e.mood||'—')+'</b></td><td>'+ckFmtTime(e.bed)+'</td><td>'+ckFmtTime(e.wake)+'</td><td>'+ckFmtHrs(ckSleep(e.bed,e.wake))+'</td>'
      +'<td>'+['wake','move','phone','start'].map(function(k){return h[k]?'●':'○'}).join(' ')+'</td><td>'+ckFmtMin(e.focus)+'</td><td>'+(e.enjoyed?'Yes':'')+'</td><td class="n">'+esc(e.note)+'</td></tr>';
  }).join('');
  return '<!DOCTYPE html><html><head><meta charset="UTF-8"><title>Daily check-in log</title><style>'
    +'body{font-family:Arial,sans-serif;font-size:12px;color:#111;padding:28px 32px}h1{font-size:22px;margin:0 0 4px}.sub{color:#777;margin-bottom:18px}'
    +'h2{font-size:10px;letter-spacing:.12em;text-transform:uppercase;color:#888;margin:18px 0 8px}'
    +'table{width:100%;border-collapse:collapse}th{background:#111;color:#fff;text-align:left;padding:6px 8px;font-size:9px;letter-spacing:.08em;text-transform:uppercase}'
    +'td{padding:6px 8px;border-bottom:1px solid #EEE;vertical-align:top}td.n{color:#555;font-style:italic;max-width:220px}.k{color:#777;font-size:11px;margin-top:8px}'
    +'</style></head><body><h1>Daily check-in log</h1>'
    +'<div class="sub">'+es.length+' check-ins · '+fmtD(es[0].date)+' → '+fmtD(es[es.length-1].date)+(r?' · wake target '+ckFmtTime(r.wakeTarget):'')+'</div>'
    +(weeks?'<h2>Weekly mood</h2>'+weeks:'')
    +'<h2>Every day</h2><table><thead><tr><th>Date</th><th>Mood</th><th>Slept</th><th>Woke</th><th>Sleep</th><th>Habits</th><th>Focus</th><th>Enjoyed</th><th>Note</th></tr></thead><tbody>'+rows+'</tbody></table>'
    +'<div class="k">Mood is self-rated 1–10. Habits: woke on time · morning movement · phone away · 10-minute start.</div>'
    +'</body></html>';
}

// ══════════════════════════════════════════════════════
// SET3 — screens, navigation, logging
// Load order: icons.js, store.js, coach.js, daily.js, app.js
// ══════════════════════════════════════════════════════

// ── Formatting ─────────────────────────────────────────
function fmtD(iso){return new Date(iso+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short',day:'numeric',month:'short'})}
function fmtDLong(iso){return new Date(iso+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'long'})}
const MONTHS=['January','February','March','April','May','June','July','August','September','October','November','December'];
const DOW_F=['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];

// ── Small UI kit ───────────────────────────────────────
let _tt;
function toast(msg){const el=document.getElementById('toast');el.textContent=msg;el.classList.add('show');clearTimeout(_tt);_tt=setTimeout(function(){el.classList.remove('show')},2200)}
let _ovClose=null;
function closeOverlays(immediate){
  document.querySelectorAll('.ov').forEach(function(o){
    if(immediate||o.classList.contains('closing')||matchMedia('(prefers-reduced-motion: reduce)').matches){o.remove();return}
    o.classList.add('closing');setTimeout(function(){o.remove()},210);
  });
  _ovClose=null;
}
// Drag a sheet down from its top to dismiss it (phones).
function enableDrag(ov){
  const m=ov.querySelector('.modal');if(!m)return;
  let y0=null,dy=0,t0=0;
  m.addEventListener('touchstart',function(e){if(m.scrollTop>0||e.touches.length>1)return;y0=e.touches[0].clientY;dy=0;t0=Date.now()},{passive:true});
  m.addEventListener('touchmove',function(e){
    if(y0==null)return;dy=e.touches[0].clientY-y0;
    if(dy<=0){m.style.transform='';return}
    m.classList.add('dragging');m.style.transform='translateY('+(dy<120?dy:120+(dy-120)*.5)+'px)';
  },{passive:true});
  m.addEventListener('touchend',function(){
    if(y0==null)return;
    const fast=dy>40&&(Date.now()-t0)<250;
    m.classList.remove('dragging');y0=null;
    if(dy>110||fast){ov._bd();return}
    m.classList.add('settle');m.style.transform='';setTimeout(function(){m.classList.remove('settle')},300);
  });
}
function openModal(id,inner,onBackdrop,kind){
  // Re-rendering an open sheet swaps its content in place (no re-animation, scroll kept).
  const open=document.getElementById(id||'ov');
  if(open&&open.classList.contains('ov')&&!open.classList.contains('closing')&&open.classList.contains('is-sheet')===(kind==='sheet')){
    const m=open.querySelector('.modal'),st=m.scrollTop;
    m.innerHTML=inner;m.scrollTop=st;
    _ovClose=onBackdrop||closeOverlays;
    open._bd=onBackdrop||closeOverlays;
    return;
  }
  closeOverlays(true);
  const ov=document.createElement('div');
  ov.className='ov'+(kind==='sheet'?' is-sheet':'');ov.id=id||'ov';
  ov.innerHTML='<div class="modal" role="dialog" aria-modal="true">'+inner+'</div>';
  ov._bd=onBackdrop||closeOverlays;
  ov.addEventListener('click',function(e){if(e.target===ov)ov._bd()});
  _ovClose=onBackdrop||closeOverlays;
  document.body.appendChild(ov);
  enableDrag(ov);
  const f=ov.querySelector('[autofocus]');if(f)setTimeout(function(){f.focus()},60);
}
function openSheet(inner){openModal('ov-sheet','<div class="grab"></div>'+inner,null,'sheet')}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&_ovClose)_ovClose()});
function askConfirm(title,body,yes,onYes,danger){
  openSheet('<h3>'+title+'</h3><p class="hint">'+body+'</p>'
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button>'
    +'<button class="btn'+(danger?' danger':'')+'" id="confirm-yes">'+yes+'</button></div>');
  document.getElementById('confirm-yes').onclick=function(){closeOverlays(true);onYes()};
}
function listRow(icon,tone,title,sub,onclick,badge){
  return '<button class="row" onclick="'+onclick+'"><span class="dot t-'+tone+'">'+ic(icon)+'</span>'
    +'<span class="row-main"><b>'+title+'</b>'+(sub?'<small>'+sub+'</small>':'')+'</span>'
    +(badge!=null?'<span class="badge">'+badge+'</span>':'')
    +'<span class="chev">'+ic('right')+'</span></button>';
}
function groupChip(k){const G=GROUP(k);return G?'<span class="gchip t-'+G.tone+'">'+ic(G.icon)+G.short+'</span>':''}

// ── Router ─────────────────────────────────────────────
let cur='today';
const NAV_OF={today:'today',gym:'gym',history:'history',daily:'daily',profile:'profile',body:'profile'};
let _enterT=null;
function go(tab){
  closeOverlays();
  document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s.id==='screen-'+tab)});
  document.querySelectorAll('[data-tab]').forEach(function(t){const on=t.dataset.tab===NAV_OF[tab];t.classList.toggle('on',on);if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current')});
  cur=tab;document.body.dataset.screen=tab;
  const scr=document.getElementById('screen-'+tab);
  scr.classList.remove('enter');RENDER[tab]();void scr.offsetWidth;scr.classList.add('enter');
  clearTimeout(_enterT);_enterT=setTimeout(function(){scr.classList.remove('enter')},900);
  window.scrollTo(0,0);
}
function rerender(){RENDER[cur]();renderChrome()}

// ── Streak ─────────────────────────────────────────────
function calcStreak(){
  const worked={};getSess().forEach(function(s){if((s.groups||[]).length)worked[s.date]=1});
  const rd=getRestDays();
  let n=0;const d=new Date();
  for(let i=0;i<370;i++){
    const iso=localISO(d);
    if(worked[iso])n++;
    else if(i===0){}
    else if(rd.indexOf(d.getDay())<0)break;
    d.setDate(d.getDate()-1);
  }
  return n;
}

// ── Ring: muscle groups trained in the last 7 days ─────
function ringSVG(){
  const st=coachStats(addDays(today(),1));
  const c=150,r=112,n=GROUPS.length,span=360/n,gap=17;
  let arcs='',icons='',hit=0;
  GROUPS.forEach(function(G,i){
    const a0=-90-span/2+i*span+gap/2,a1=a0+span-gap,am=(a0+a1)/2;
    const rad=function(a){return a*Math.PI/180};
    const x0=c+r*Math.cos(rad(a0)),y0=c+r*Math.sin(rad(a0)),x1=c+r*Math.cos(rad(a1)),y1=c+r*Math.sin(rad(a1));
    const on=st.groups[G.k].n7>0;if(on)hit++;
    const d='M'+x0.toFixed(1)+' '+y0.toFixed(1)+' A'+r+' '+r+' 0 0 1 '+x1.toFixed(1)+' '+y1.toFixed(1);
    arcs+='<g class="seg-g" style="--i:'+i+'" role="button" tabindex="0" aria-label="'+G.label+(on?', trained this week':', not yet this week')+'" onclick="openGroupInsight(\''+G.k+'\')" onkeydown="if(event.key===\'Enter\'||event.key===\' \'){event.preventDefault();openGroupInsight(\''+G.k+'\')}">'
      +'<path d="'+d+'" class="arc '+(on?'s-'+G.tone:'off')+'"></path><path d="'+d+'" class="arc-hit"></path>';
    const xm=c+r*Math.cos(rad(am)),ym=c+r*Math.sin(rad(am));
    arcs+='<svg x="'+(xm-10).toFixed(1)+'" y="'+(ym-10).toFixed(1)+'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ring-ic'+(on?'':' off')+'">'+ICONS[G.icon]+'</svg></g>';
  });
  return {svg:'<svg viewBox="0 0 300 300" class="ring-svg" aria-label="'+hit+' of '+n+' muscle groups trained in the last 7 days">'+arcs+icons+'</svg>',hit:hit,n:n};
}

function openGroupInsight(k){
  const G=GROUP(k),info=GROUP_INFO[k]||{},td=today();
  const st=coachStats(addDays(td,1)),g=st.groups[k];
  const since=g.last?daysBetween(g.last,td):null;
  const from=addDays(td,-6);
  const hits=getSess().filter(function(s){return s.date>=from&&s.date<=td&&(s.groups||[]).indexOf(k)>=0}).sort(function(a,b){return b.date.localeCompare(a.date)});
  let status,line;
  if(since===0){status='Trained today';line='Done for today. Give it about 48 hours before training it hard again.'}
  else if(since===1&&COACH_BLOCKING.indexOf(k)>=0){status='Recovering';line='Trained yesterday. Ready again from tomorrow; light work is fine today.'}
  else if(G.target&&g.n7>=G.target){status='Target met';line='You\'ve hit '+g.n7+' of '+G.target+' this week. Anything more is a bonus.'}
  else if(!G.target){status=g.n7?'Done this week':'Optional';line=g.n7?'Logged '+g.n7+' time'+(g.n7>1?'s':'')+' in the last 7 days.':'No weekly target. Use it on rest days or after a hard session.'}
  else{status='Ready';line=(G.target-g.n7)+' more session'+(G.target-g.n7>1?'s':'')+' to reach '+G.target+' this week.'+(since==null?' Not trained yet.':' Last trained '+agoText(since)+'.')}
  const rec=recommend(td);
  const inRec=rec.groups.indexOf(k)>=0;
  const pct=G.target?Math.min(100,Math.round(g.n7/G.target*100)):(g.n7?100:0);
  const canLog=!getSess().some(function(s){return s.date===td&&(s.groups||[]).indexOf(k)>=0});
  openSheet('<div class="ins-head"><span class="dot big t-'+G.tone+'">'+ic(G.icon)+'</span><div><div class="eyebrow">Last 7 days</div><h3>'+G.label+'</h3></div><span class="st '+(status==='Ready'?'ready':status==='Recovering'?'rec':'on')+'">'+status+'</span></div>'
    +'<div class="ins-count"><b>'+g.n7+'</b><span>'+(G.target?'of '+G.target+' sessions this week':'sessions this week')+'</span></div>'
    +'<div class="meter big"><i class="s-'+G.tone+'" style="width:'+pct+'%"></i></div>'
    +'<p class="ins-line">'+line+'</p>'
    +(hits.length?'<div class="chips wrap">'+hits.map(function(s){return '<span class="chip">'+fmtD(s.date)+'</span>'}).join('')+'</div>':'')
    +'<div class="ins-box"><b>What it is</b><p>'+esc(info.what||'')+'</p><b>Why it matters for you</b><p>'+esc(info.why||'')+'</p>'
    +'<b>Moves to pick from</b><ul>'+(info.moves||[]).map(function(m){return '<li>'+esc(m)+'</li>'}).join('')+'</ul></div>'
    +(inRec?'<p class="hint">'+ic('sparkles')+'Part of today\'s suggestion: '+esc(rec.title.toLowerCase())+'.</p>':'')
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Close</button>'
    +(canLog?'<button class="btn" onclick="closeOverlays();logGroupToday(\''+k+'\')">Log it today</button>':'')+'</div>');
}
function logGroupToday(k){
  const ex=getSess().filter(function(s){return s.date===today()})[0];
  const gs=ex?(ex.groups||[]).slice():[];if(gs.indexOf(k)<0)gs.push(k);
  openLog(today(),gs);
}

// ══════════════════════════════════════════════════════
// TODAY
// ══════════════════════════════════════════════════════
function greeting(){const h=new Date().getHours();return h<4?'Still up':h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function renderToday(){
  const td=today(),p=getProfile(),sessions=getSess();
  const streak=calcStreak();
  const ring=ringSVG();
  const empty=!sessions.length&&!ckAll().length;

  const coach=coachCard(true);

  const restore=empty?'<section class="card tone-blue cta" onclick="go(\'profile\')"><div class="eyebrow">New here</div><h3>Bring your history over</h3><p>In the old app, open Export and download a backup. Then restore it from your profile here.</p><span class="btn sm">Open profile</span></section>':'';

  document.getElementById('screen-today').innerHTML=''
    +'<header class="hello"><div class="eyebrow">'+fmtDLong(td)+'</div><h1>'+greeting()+', '+esc(p.name)+'</h1><p class="muted">How are you feeling today?</p></header>'
    +'<div class="cols">'
    +'<div class="col">'
    +homeTimerCard()
    +'<section class="ring">'+ring.svg
    +'<div class="ring-mid"><b>'+streak+'</b><span>day streak</span><small>'+ring.hit+' of '+ring.n+' groups this week</small></div></section>'
    +'<p class="ring-hint">Tap a segment to see that muscle group\'s week</p>'
    +'<div class="actions"><button class="btn big" onclick="openLog(today())">'+ic('plus')+'Log workout</button>'
    +'<button class="circle" onclick="timerToggle()" aria-label="Workout timer" id="today-timer">'+ic(getTimer()?'stop':'timer')+'</button>'
    +'<button class="circle" onclick="ckOpen(ckDay())" aria-label="Daily check-in">'+ic('daily')+'</button></div>'
    +'</div>'
    +'<div class="col">'+restore+coach+ckTodayCard()+'</div>'
    +'<div class="col">'+calendarCard()+weekGroupsCard(3)+'</div>'
    +'</div>';
}

// ══════════════════════════════════════════════════════
// GYM — timer, coach, weekly coverage
// ══════════════════════════════════════════════════════
function renderGym(){
  const td=today();
  const st=coachStats(addDays(td,1));
  const t=getTimer();
  const timer='<section class="card timer'+(t?' running':'')+'">'
    +'<div><div class="eyebrow">Workout timer</div><b id="timer-big">'+(t?fmtElapsed(timerElapsedMs(t)):'00:00')+'</b>'
    +'<small>'+(t?'Since '+new Date(t.startTs).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'})+' · stops itself at 2h':'Stops itself at 2 hours')+'</small></div>'
    +'<button class="play" onclick="timerToggle()" aria-label="'+(t?'Stop timer':'Start timer')+'">'+ic(t?'stop':'play')+'</button></section>';
  const tiles='<div class="tiles">'
    +tile('yellow','Strength days',st.strengthDays7,STRENGTH_DAYS_TARGET,'last 7 days')
    +tile('blue','Cardio days',st.cardio7,CARDIO_TARGET,'last 7 days')
    +tile('green','Day streak',calcStreak(),null,'rest days don\'t break it')
    +'</div>';
  document.getElementById('screen-gym').innerHTML=''
    +'<header class="page-head"><div><div class="eyebrow">Training</div><h1>Gym</h1></div>'
    +'<button class="circle" onclick="openLog(today())" aria-label="Log workout">'+ic('plus')+'</button></header>'
    +'<div class="cols">'
    +'<div class="col">'+timer+coachCard(false)+'</div>'
    +'<div class="col"><h2 class="sec">This week</h2>'+weekStripCard()+tiles+weekGroupsCard()+'</div>'
    +'<div class="col"><h2 class="sec">Your plan</h2>'+planCard()+baselineCard()+'</div>'
    +'</div>';
}

// ── Coach card (Today: compact, Gym: full) ─────────────
function coachCard(compact){
  const td=today();
  const done=getSess().filter(function(s){return s.date===td&&(s.groups||[]).length})[0];
  if(done){
    const tm=addDays(td,1),next=projectDays(td,2)[tm];
    const dayName=new Date(tm+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long'});
    return '<section class="card tone-pink coach'+(compact?'':' big')+'"><div class="eyebrow">Coach · done for today</div>'
      +'<h3>'+esc(sessTitle(done))+'</h3>'
      +(compact?'':'<div class="chips wrap">'+(done.groups||[]).map(groupChip).join('')+'</div>')
      +'<div class="next-up"><span class="dot t-'+next.plan.tone+'">'+ic(next.plan.icon)+'</span><div><small>Next up · '+dayName+'</small><b>'+esc(next.title)+'</b><p>'+esc(next.reasons[0])+'</p></div></div>'
      +'<div class="row-btns"><button class="btn" onclick="openPlanDay(\''+tm+'\')">'+dayName+'\'s plan</button>'
      +(compact?'':'<button class="btn ghost" onclick="openLog(today())">Edit today</button>')+'</div>'
      +(compact?'':'<button class="link" onclick="openSources()">'+ic('info')+'How the coach decides</button>')
      +'</section>';
  }
  const rec=recommend(td);
  const reasons=compact?rec.reasons.slice(0,1):rec.reasons;
  return '<section class="card tone-pink coach'+(compact?'':' big')+'"><div class="eyebrow">Coach · today</div>'
    +'<h3>'+esc(rec.title)+' <span class="h-sub">'+esc(rec.sub)+'</span></h3>'
    +(compact?'':'<div class="chips wrap">'+rec.groups.map(groupChip).join('')+'</div><div class="why-lbl">Why today</div>')
    +'<ul class="why'+(compact?' compact':'')+'">'+reasons.map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+'</ul>'
    +'<div class="row-btns">'+(rec.key==='rest'?'':'<button class="btn" onclick="logFromRec()">Log this</button>')
    +'<button class="btn ghost" onclick="openPlanDay(today())">See the session</button></div>'
    +(compact?'':'<button class="link" onclick="openSources()">'+ic('info')+'How the coach decides</button>')
    +'</section>';
}

// Simulate the coming days assuming you follow each suggestion.
function projectDays(from,n){
  const sim=getSess().slice(),out={};
  for(let i=0;i<n;i++){
    const iso=addDays(from,i);
    const logged=sim.filter(function(s){return s.date===iso&&(s.groups||[]).length})[0];
    if(logged)continue;
    const rec=recommend(iso,sim);out[iso]=rec;
    if(rec.key!=='rest')sim.push({id:'sim'+i,date:iso,groups:rec.groups,plan:rec.key});
  }
  return out;
}
const STRIP_LBL={lowerA:'Lower A',lowerB:'Lower B',upperA:'Upper A',upperB:'Upper B',full:'Full',cardio:'Cardio',long:'Long',light:'Light',rest:'Rest'};
const STRIP_SHORT={'Lower A':'Leg A','Lower B':'Leg B','Upper A':'Up A','Upper B':'Up B','Lower':'Legs','Upper':'Upper'};
const KIND_LBL={lower:'Lower',upper:'Upper',full:'Full',cardio:'Cardio',walk:'Walk',none:'—'};
function weekStripCard(){
  const days=weekPlan();
  const cells=days.map(function(d){
    const dow=new Date(d.date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'short'}).slice(0,1);
    const num=parseInt(d.date.slice(8),10);
    let tone='off',icon='bed',label='Rest',cls=d.state;
    if(d.session){const k=sessionKind(d.session);const P=d.session.plan&&PLAN[d.session.plan];tone=P?P.tone:(k==='lower'?'yellow':k==='upper'?'pink':k==='full'?'green':'blue');icon=P?P.icon:(k==='lower'?'legs':k==='upper'?'chest':k==='full'?'gym':k==='cardio'?'cardio':'mobility');label=P?STRIP_LBL[d.session.plan]:KIND_LBL[k]}
    else if(d.rec){tone=d.rec.key==='rest'?'off':d.rec.plan.tone;icon=d.rec.plan.icon;label=STRIP_LBL[d.rec.key]}
    else{label='—'}
    return '<button class="wd '+cls+(d.today?' is-today':'')+'" onclick="openPlanDay(\''+d.date+'\')" aria-label="'+fmtD(d.date)+': '+esc(label)+(d.state==='done'?', done':d.state==='planned'?', planned':'')+'">'
      +'<span class="wd-top"><i>'+dow+'</i><b>'+num+'</b></span>'
      +'<span class="wd-dot '+(tone==='off'?'off':'t-'+tone)+'">'+ic(d.state==='done'?'check':icon)+'</span>'
      +'<span class="wd-lbl"><span class="l-long">'+esc(label)+'</span><span class="l-short">'+esc(STRIP_SHORT[label]||label)+'</span></span></button>';
  }).join('');
  return '<section class="card week-strip"><div class="wd-row">'+cells+'</div>'
    +'<p class="small muted wd-note">Ticks are done. Faded days are the plan if you follow it; it adjusts to whatever you actually log.</p></section>';
}
function planCard(){
  const typical=[['Mon','lowerA'],['Tue','upperA'],['Wed','cardio'],['Thu','lowerB'],['Fri','upperB'],['Sat','long'],['Sun','rest']];
  return '<section class="card plan-card"><h3>Upper/lower, 4 + 2 + 1</h3>'
    +'<p class="small">Four strength days, two cardio days, one rest day. Each muscle is trained twice a week with 48 hours between, and every strength day ends with a 15-minute incline walk.</p>'
    +'<div class="plan-week">'+typical.map(function(t){const P=PLAN[t[1]];return '<div class="pw"><span>'+t[0]+'</span><i class="t-'+P.tone+'"></i><b>'+P.title+'</b><small>'+P.sub+'</small></div>'}).join('')+'</div>'
    +'<p class="small">Missed a day? Nothing breaks. The coach just moves to the next session in the rotation.</p>'
    +'<button class="link" onclick="openLiftRules()">'+ic('list')+'How to lift on this plan</button>'
    +'<button class="link" onclick="openSources()">'+ic('bookopen')+'The research behind it</button></section>';
}
function openLiftRules(){
  openSheet('<h3>How to lift on this plan</h3><ol class="rules small-rules">'+PLAN_RULES.map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+'</ol>'
    +'<div class="row-btns"><button class="btn" onclick="closeOverlays()">Got it</button></div>');
}
function openPlanDay(date){
  const td=today();
  const logged=getSess().filter(function(s){return s.date===date&&(s.groups||[]).length})[0];
  const head=function(eyebrow,title,sub,tone,icon){return '<div class="ins-head"><span class="dot big t-'+tone+'">'+ic(icon)+'</span><div><div class="eyebrow">'+eyebrow+'</div><h3>'+esc(title)+(sub?' <span class="h-sub">'+esc(sub)+'</span>':'')+'</h3></div></div>'};
  const movesTable=function(P){
    return '<div class="moves">'+P.moves.map(function(m){return '<div class="mv"><b>'+esc(m[0])+'</b><span>'+esc(m[1])+'</span></div>'}).join('')+'</div>'
      +(P.finish?'<p class="hint">'+ic('cardio')+esc(P.finish)+'</p>':'');
  };
  if(logged){
    const P=logged.plan&&PLAN[logged.plan];
    openSheet(head(fmtDLong(date)+' · done',sessTitle(logged),P?P.sub:'',P?P.tone:'green','check')
      +'<div class="chips wrap">'+(logged.groups||[]).map(groupChip).join('')+'</div>'
      +(logged.notes?'<p class="note-block" style="margin-top:12px">'+esc(logged.notes)+'</p>':'')
      +(P?'<label class="lbl">The plan for this session</label>'+movesTable(P):'')
      +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Close</button>'+(isLocked(date)?'':'<button class="btn" onclick="closeOverlays();openLog(\''+date+'\')">Edit</button>')+'</div>');
    return;
  }
  if(date<td){
    openSheet(head(fmtDLong(date),'Nothing logged','', 'blue','bed')+'<p class="hint">That\'s fine. The plan doesn\'t make you catch up; it continues from your next session.</p><div class="row-btns"><button class="btn" onclick="closeOverlays()">Close</button></div>');
    return;
  }
  const rec=projectDays(td,daysBetween(td,date)+1)[date];
  const P=rec.plan;
  openSheet(head((date===td?'Today':new Date(date+'T00:00:00').toLocaleDateString('en-IN',{weekday:'long',day:'numeric',month:'short'}))+(date===td?'':' · planned'),rec.title,rec.sub,P.tone,P.icon)
    +'<div class="why-lbl">Why '+(date===td?'today':'this day')+'</div><ul class="why">'+rec.reasons.slice(0,3).map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+'</ul>'
    +(date===td?'':'<p class="hint">'+ic('info')+'Assumes you follow the plan until then. It updates as you log.</p>')
    +'<label class="lbl">The session</label>'+movesTable(P)
    +(['lower','upper','full'].indexOf(P.kind)>=0?'<button class="link" onclick="openLiftRules()">'+ic('list')+'How to lift: reps in the tank, rest, moving up</button>':'')
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Close</button>'+(date===td&&rec.key!=='rest'?'<button class="btn" onclick="closeOverlays();logFromRec()">Log this</button>':'')+'</div>');
}
function tile(tone,label,val,target,sub){
  return '<div class="tile t-'+tone+'"><span>'+label+'</span><b>'+val+(target!=null?'<small>/'+target+'</small>':'')+'</b><small>'+sub+'</small></div>';
}
function weekGroupsCard(limit){
  const td=today(),st=coachStats(addDays(td,1));
  let list=GROUPS.filter(function(G){return G.target>0});
  if(limit){
    list=list.slice().sort(function(a,b){return (st.groups[a.k].n7/a.target)-(st.groups[b.k].n7/b.target)}).slice(0,limit);
  }
  const rows=list.map(function(G){
    const g=st.groups[G.k];
    const pct=Math.min(100,Math.round(g.n7/G.target*100));
    const since=g.last?daysBetween(g.last,td):null;
    let status,cls;
    if(since===0){status='Today';cls='on'}
    else if(since===1&&G.strength&&COACH_BLOCKING.indexOf(G.k)>=0){status='Recovering';cls='rec'}
    else if(g.n7>=G.target){status='Done';cls='on'}
    else{status=since==null?'Not yet':'Ready';cls='ready'}
    return '<div class="grow"><span class="dot t-'+G.tone+'">'+ic(G.icon)+'</span>'
      +'<div class="grow-main"><div class="grow-top"><b>'+G.label+'</b><span class="st '+cls+'">'+status+'</span></div>'
      +'<div class="meter"><i class="s-'+G.tone+'" style="width:'+pct+'%"></i></div>'
      +'<small>'+g.n7+' of '+G.target+' this week'+(since!=null?' · last '+(since===0?'today':agoText(since)):'')+'</small></div></div>';
  }).join('');
  return '<section class="card groups">'+(limit?'<div class="card-head"><h3>Needs attention</h3><button class="link" onclick="go(\'gym\')">All groups</button></div>':'')+rows+'</section>';
}
function baselineCard(){
  const B=BASELINE;
  return '<section class="card tone-green baseline"><div class="card-head"><h3>InBody · Jun 2026</h3><span class="muted">Retest week 10–12</span></div>'
    +'<div class="stat-grid">'
    +stat('Weight',B.weight+'<small> kg</small>')+stat('Body fat',B.bodyFat+'<small>%</small>')+stat('Visceral fat','Level '+B.visceral)
    +stat('BMR',B.bmr+'<small> kcal</small>')+stat('Score',B.score+'<small>/100</small>')+stat('Leg muscle',B.legMuscle)
    +'</div><p class="small">Goal: lose fat (target about '+B.target+' kg) while building leg muscle. The coach weights cardio and legs from this.</p></section>';
}
function openSources(){
  openSheet('<h3>How the coach decides</h3>'
    +'<p class="hint">It looks at what you logged in the last 7 days, today\'s check-in and your InBody baseline, then applies these rules from exercise research:</p>'
    +'<div class="sources">'+COACH_SOURCES.map(function(s){return '<div class="src"><b>'+esc(s[0])+'</b><p>'+esc(s[1])+'</p><small>'+esc(s[2])+'</small></div>'}).join('')+'</div>'
    +'<p class="hint">These are general guidelines for healthy adults. If something hurts or you have a medical condition, check with a doctor first.</p>'
    +'<div class="row-btns"><button class="btn" onclick="closeOverlays()">Got it</button></div>');
}

// ══════════════════════════════════════════════════════
// HISTORY — calendar + log
// ══════════════════════════════════════════════════════
let _calMonth=null,_histView='weekly';
function calendarCard(){
  const td=today();
  if(!_calMonth)_calMonth=td.slice(0,7);
  const yr=parseInt(_calMonth.slice(0,4),10),mo=parseInt(_calMonth.slice(5,7),10)-1;
  const byDate={};getSess().forEach(function(s){if((s.groups||[]).length&&!byDate[s.date])byDate[s.date]=s});
  const dim=new Date(yr,mo+1,0).getDate(),sd=(new Date(yr,mo,1).getDay()+6)%7;
  let cells='';
  for(let i=0;i<sd;i++)cells+='<span></span>';
  for(let d=1;d<=dim;d++){
    const iso=yr+'-'+String(mo+1).padStart(2,'0')+'-'+String(d).padStart(2,'0');
    const s=byDate[iso],fut=iso>td;
    const tone=s?(GROUP(s.groups[0])||{tone:'yellow'}).tone:null;
    cells+='<button class="cd'+(s?' t-'+tone:'')+(iso===td?' td':'')+(fut?' fut':'')+'"'+((fut||(!s&&isLocked(iso)))?' disabled':' onclick="openLog(\''+iso+'\')"')+' aria-label="'+fmtD(iso)+(s?', '+esc(sessTitle(s)):'')+'">'+d+'</button>';
  }
  const canNext=_calMonth<td.slice(0,7);
  return '<section class="card cal"><div class="card-head"><button class="circle sm" onclick="calShift(-1)" aria-label="Previous month">'+ic('left')+'</button>'
    +'<span class="pill-label">'+MONTHS[mo]+' '+yr+'</span>'
    +'<button class="circle sm flip" onclick="calShift(1)" aria-label="Next month"'+(canNext?'':' disabled')+'>'+ic('left')+'</button></div>'
    +'<div class="cal-grid">'+['MO','TU','WE','TH','FR','SA','SU'].map(function(l){return '<span class="cw">'+l+'</span>'}).join('')+cells+'</div></section>';
}
function calShift(n){
  const y=parseInt(_calMonth.slice(0,4),10),m=parseInt(_calMonth.slice(5,7),10)-1+n;
  const d=new Date(y,m,1);_calMonth=d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0');
  if(_calMonth>today().slice(0,7))_calMonth=today().slice(0,7);
  rerender();
}
function isoWeekKey(dateStr){
  const d=new Date(dateStr+'T00:00:00');const day=(d.getDay()+6)%7;d.setDate(d.getDate()-day);return localISO(d);
}
function renderHistory(){
  const sessions=getSess().slice().sort(function(a,b){return b.date.localeCompare(a.date)});
  const groups={};
  sessions.forEach(function(s){
    const key=_histView==='weekly'?isoWeekKey(s.date):s.date.slice(0,7);
    if(!groups[key]){
      let label;
      if(_histView==='weekly'){const end=addDays(key,6);label=new Date(key+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})+' – '+new Date(end+'T00:00:00').toLocaleDateString('en-IN',{day:'numeric',month:'short'})}
      else label=new Date(s.date+'T00:00:00').toLocaleDateString('en-IN',{month:'long',year:'numeric'});
      groups[key]={label:label,items:[]};
    }
    groups[key].items.push(s);
  });
  const keys=Object.keys(groups).sort().reverse();
  const hist=!sessions.length?'<div class="list"><p class="empty">No workouts yet. Tap + to log your first one.</p></div>'
    :keys.map(function(k){
      const g=groups[k];
      return '<div class="period"><div class="period-head"><b>'+g.label+'</b><span>'+g.items.length+' session'+(g.items.length!==1?'s':'')+'</span></div>'
        +'<div class="list">'+g.items.map(sessRow).join('')+'</div></div>';
    }).join('');
  document.getElementById('screen-history').innerHTML=''
    +'<header class="page-head"><div><div class="eyebrow">'+sessions.length+' sessions logged</div><h1>History</h1></div>'
    +'<button class="circle" onclick="openLog(today())" aria-label="Log workout">'+ic('plus')+'</button></header>'
    +'<div class="cols pair">'
    +'<div class="col">'+calendarCard()+'</div>'
    +'<div class="col"><div class="seg" role="tablist"><button role="tab" aria-selected="'+(_histView==='weekly')+'" class="'+(_histView==='weekly'?'on':'')+'" onclick="_histView=\'weekly\';renderHistory()">Weekly</button><button role="tab" aria-selected="'+(_histView==='monthly')+'" class="'+(_histView==='monthly'?'on':'')+'" onclick="_histView=\'monthly\';renderHistory()">Monthly</button></div>'+hist+'</div>'
    +'</div>';
}
function sessRow(s){
  const G=GROUP((s.groups||[])[0])||{tone:'yellow',icon:'gym'};
  const extra=[];
  if(s.durationMin)extra.push(s.durationMin+' min');
  if(s.legacy&&s.legacy.length)extra.push(s.legacy.length+' exercises in old log');
  return '<button class="row sess" onclick="openSess(\''+s.id+'\')"><span class="dot t-'+G.tone+'">'+ic(G.icon)+'</span>'
    +'<span class="row-main"><small>'+fmtD(s.date)+'</small><b>'+esc(sessTitle(s))+'</b>'
    +((s.groups||[]).length>1?'<span class="mini-chips">'+s.groups.map(function(k){const g=GROUP(k);return g?'<i class="t-'+g.tone+'">'+g.short+'</i>':''}).join('')+'</span>':'')
    +(s.notes?'<small class="note-sm">'+esc(s.notes)+'</small>':'')
    +(extra.length?'<small>'+extra.join(' · ')+'</small>':'')+'</span>'
    +'<span class="chev">'+ic('right')+'</span></button>';
}

// ══════════════════════════════════════════════════════
// WORKOUT LOGGER — pick what you trained, that's it
// ══════════════════════════════════════════════════════
let _s=null,_sEditing=false;
// A day locks once it's over (4am the next morning, same as check-ins).
function isLocked(date){return date<ckDay()}
function openLog(date,preset,planKey){
  const ex=getSess().filter(function(s){return s.date===date})[0];
  if(isLocked(date)){
    if(ex){openSess(ex.id);return}
    toast(fmtD(date)+' is over, so it can\'t be logged now');return;
  }
  if(ex&&!preset){openSess(ex.id);return}
  _s=ex?JSON.parse(JSON.stringify(ex)):{id:uid(),date:date,groups:[],notes:''};
  if(preset)_s.groups=preset.slice();
  if(planKey)_s.plan=planKey;
  _sEditing=!!ex;
  buildLog();
}
function openSess(id){
  const f=getSess().filter(function(s){return s.id===id})[0];if(!f)return;
  _s=JSON.parse(JSON.stringify(f));_sEditing=true;buildLog();
}
function logFromRec(){const r=recommend(today());openLog(today(),r.groups,r.key)}
function buildLockedLog(){
  const s=_s;
  openModal('ov-log','<header class="modal-head"><div><div class="eyebrow">'+fmtDLong(s.date)+'</div><h2>'+esc(sessTitle(s))+'</h2></div>'
    +'<button class="circle" onclick="closeOverlays()" aria-label="Close">'+ic('x')+'</button></header>'
    +'<div class="chips wrap">'+(s.groups||[]).map(groupChip).join('')+'</div>'
    +(s.durationMin?'<p class="hint">'+ic('timer')+' '+s.durationMin+' min'+(s.durationCapped?' (timer capped at 2 hours)':'')+'</p>':'')
    +(s.notes?'<label class="lbl">Notes</label><p class="note-block">'+esc(s.notes)+'</p>':'')
    +(s.legacy&&s.legacy.length?'<p class="hint">From the old log: '+esc(s.legacy.join(', '))+'</p>':'')
    +'<p class="locked-line">'+ic('lock')+'This day is over, so the workout is locked.</p>'
    +'<div class="row-btns"><button class="btn" onclick="closeOverlays()">Close</button></div>');
}
function buildLog(){
  if(isLocked(_s.date)){buildLockedLog();return}
  const isToday=_s.date===today();
  const rec=isToday?recommend(_s.date):null;
  const sug=rec?rec.groups:[];
  const quick=['lowerA','upperA','lowerB','upperB','full','cardio','long'].map(function(k){return '<button class="chip'+(_s.plan===k?' on':'')+'" data-plan="'+k+'" onclick="logPreset(\''+k+'\')">'+PLAN[k].title+'</button>'}).join('');
  const tiles=GROUPS.map(function(G){
    const on=_s.groups.indexOf(G.k)>=0,s=sug.indexOf(G.k)>=0;
    return '<button class="gtile'+(on?' on t-'+G.tone:'')+'" data-k="'+G.k+'" data-sug="'+(s?1:0)+'" aria-pressed="'+on+'" onclick="logToggle(\''+G.k+'\')">'
      +'<span class="dot t-'+G.tone+'">'+ic(G.icon)+'</span><b>'+G.label+'</b>'
      +(s&&!on?'<em>Suggested</em>':'')+(on?'<span class="tick">'+ic('check')+'</span>':'')+'</button>';
  }).join('');
  openModal('ov-log','<header class="modal-head"><div><div class="eyebrow">'+(isToday?'Today · ':'')+fmtD(_s.date)+'</div><h2>'+(_s.plan&&PLAN[_s.plan]?esc(PLAN[_s.plan].title):(_sEditing?'Edit workout':'What did you train?'))+'</h2></div>'
    +'<button class="circle" onclick="saveLog()" aria-label="Save">'+ic('check')+'</button></header>'
    +'<label class="lbl">Quick picks</label><div class="chips scroll">'+quick+'</div>'
    +'<label class="lbl">Muscle groups</label><div class="gtiles">'+tiles+'</div>'
    +(_s.durationMin?'<p class="hint">'+ic('timer')+' Timer: '+_s.durationMin+' min'+(_s.durationCapped?' (capped at 2 hours)':'')+'</p>':'')
    +'<p class="hint">'+ic('lock')+'You can edit this until the day ends. After that it\'s locked.</p>'
    +(_s.legacy&&_s.legacy.length?'<p class="hint">From the old log: '+esc(_s.legacy.join(', '))+'</p>':'')
    +'<label class="lbl" for="log-notes">Notes</label><textarea id="log-notes" class="inp" rows="'+Math.min(7,Math.max(2,Math.ceil((_s.notes||'').length/38)))+'" placeholder="Optional: how it felt, what to change next time">'+esc(_s.notes)+'</textarea>'
    +'<div class="row-btns">'+(_sEditing?'<button class="btn ghost danger-text" onclick="deleteLog()">'+ic('trash')+'Delete</button>':'')+'<button class="btn" onclick="saveLog()">Save workout</button></div>');
}
function logKeepNotes(){const n=document.getElementById('log-notes');if(n)_s.notes=n.value}
function logToggle(k){
  logKeepNotes();const i=_s.groups.indexOf(k);if(i>=0)_s.groups.splice(i,1);else _s.groups.push(k);
  if(_s.plan&&PLAN[_s.plan]&&sessionKind({groups:_s.groups})!==PLAN[_s.plan].kind)delete _s.plan;
  // Update in place so the tile transitions instead of the sheet redrawing.
  const G=GROUP(k),btn=document.querySelector('#ov-log .gtile[data-k="'+k+'"]');
  if(!btn){buildLog();return}
  const on=_s.groups.indexOf(k)>=0;
  btn.classList.toggle('on',on);btn.classList.toggle('t-'+G.tone,on);btn.setAttribute('aria-pressed',on);
  const tick=btn.querySelector('.tick'),em=btn.querySelector('em');
  if(on){if(em)em.remove();if(!tick)btn.insertAdjacentHTML('beforeend','<span class="tick">'+ic('check')+'</span>')}
  else{if(tick)tick.remove();if(btn.dataset.sug==='1'&&!em)btn.insertAdjacentHTML('beforeend','<em>Suggested</em>')}
  document.querySelectorAll('#ov-log .chips.scroll .chip').forEach(function(c){c.classList.toggle('on',c.dataset.plan===_s.plan)});
  const h=document.querySelector('#ov-log .modal-head h2');
  if(h)h.textContent=_s.plan&&PLAN[_s.plan]?PLAN[_s.plan].title:(_sEditing?'Edit workout':'What did you train?');
}
function logPreset(key){logKeepNotes();_s.groups=PLAN[key].groups.slice();_s.plan=key;buildLog()}
function saveLog(){
  if(isLocked(_s.date)){closeOverlays();toast('That day is locked');return}
  logKeepNotes();
  _s.notes=(_s.notes||'').trim();
  if(!_s.groups.length){toast('Pick at least one group');return}
  const all=getSess().slice();
  let i=-1;for(let j=0;j<all.length;j++){if(all[j].id===_s.id){i=j;break}}
  if(i>=0)all[i]=_s;else all.push(_s);
  putSess(all);
  closeOverlays();_s=null;
  toast('Workout saved');rerender();
}
function deleteLog(){
  const id=_s.id;if(isLocked(_s.date))return;
  askConfirm('Delete this workout?','This removes it from your history and streak.','Delete',function(){
    putSess(getSess().filter(function(s){return s.id!==id}));_s=null;toast('Deleted');rerender();
  },true);
}

// ══════════════════════════════════════════════════════
// TIMER — survives closing the app; adds minutes to the day's session
// ══════════════════════════════════════════════════════
let _timerInt=null;
function getTimer(){return sGet('timer',null)}
function fmtElapsed(ms){
  const t=Math.floor(ms/1000),h=Math.floor(t/3600),m=Math.floor((t%3600)/60),s=t%60;
  return (h?String(h).padStart(2,'0')+':':'')+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0');
}
// The timer stops itself at TIMER_MAX_MIN (2h) so a forgotten timer can't
// log a whole day. Checked every second, on boot and when the app returns.
function timerToggle(){getTimer()?stopTimer(false):startTimer()}
function startTimer(){sSet('timer',{startTs:Date.now(),date:today()});toast('Timer started. It stops itself at 2 hours');tickTimer();rerender()}
function timerElapsedMs(t){return Math.min(Date.now()-t.startTs,TIMER_MAX_MIN*60000)}
function stopTimer(auto){
  const t=getTimer();if(!t)return;
  const mins=Math.max(1,Math.round(timerElapsedMs(t)/60000));
  sSet('timer',null);clearInterval(_timerInt);
  const all=getSess().slice();
  const s=all.filter(function(x){return x.date===t.date})[0];
  const lead=auto?'Timer hit 2 hours and stopped. ':'';
  if(s){
    s.durationMin=Math.min(TIMER_MAX_MIN,(s.durationMin||0)+mins);if(auto)s.durationCapped=true;
    putSess(all);toast(lead+sessTitle(s)+': '+s.durationMin+' min');rerender();
  } else if(!isLocked(t.date)){
    rerender();
    _s={id:uid(),date:t.date,groups:[],notes:'',durationMin:mins,durationCapped:!!auto};_sEditing=false;buildLog();
    toast(lead+'Pick what you trained');
  } else {
    rerender();toast(lead+'Nothing was logged that day, so the time was dropped');
  }
}
function timerCheck(){
  const t=getTimer();
  if(t&&Date.now()-t.startTs>=TIMER_MAX_MIN*60000){stopTimer(true);return true}
  return false;
}
function timerPaint(){
  const t=getTimer();if(!t)return;
  const ms=timerElapsedMs(t),txt=fmtElapsed(ms);
  const left=Math.max(0,Math.ceil((TIMER_MAX_MIN*60000-ms)/60000));
  ['timer-big','side-timer','top-timer-t','home-timer-t'].forEach(function(id){const el=document.getElementById(id);if(el)el.textContent=txt});
  const hl=document.getElementById('home-timer-left');if(hl)hl.textContent=left+' min until it stops itself';
  const bar=document.getElementById('home-timer-bar');if(bar)bar.style.width=Math.min(100,ms/(TIMER_MAX_MIN*600))+'%';
}
function tickTimer(){
  clearInterval(_timerInt);
  if(timerCheck()||!getTimer()){renderChrome();return}
  timerPaint();
  _timerInt=setInterval(function(){
    if(!getTimer()){clearInterval(_timerInt);renderChrome();return}
    if(timerCheck())return;
    timerPaint();
  },1000);
}
document.addEventListener('visibilitychange',function(){if(!document.hidden&&getTimer())tickTimer()});
function homeTimerCard(){
  const t=getTimer();if(!t)return '';
  const ms=timerElapsedMs(t);
  return '<section class="card timer home-timer running">'
    +'<div class="ht-main"><div class="eyebrow">Workout running</div><b id="home-timer-t">'+fmtElapsed(ms)+'</b>'
    +'<small id="home-timer-left">'+Math.max(0,Math.ceil((TIMER_MAX_MIN*60000-ms)/60000))+' min until it stops itself</small>'
    +'<div class="ht-bar"><i id="home-timer-bar" style="width:'+Math.min(100,ms/(TIMER_MAX_MIN*600))+'%"></i></div></div>'
    +'<button class="play" onclick="stopTimer(false)" aria-label="Stop timer">'+ic('stop')+'</button></section>';
}

// ══════════════════════════════════════════════════════
// PROFILE — body, reports, backup, settings
// ══════════════════════════════════════════════════════
function syncText(){
  if(S.mode==='cloud'&&!S.err)return {icon:'cloud',t:'Saved to your Claude account',s:'Private to you, on every device'};
  if(S.mode==='cloud'&&S.err)return {icon:'cloudoff',t:'Couldn\'t reach your account',s:'Saved on this device; it will retry'};
  return {icon:'cloudoff',t:'Saved on this device only',s:'Download a backup now and then'};
}
function renderProfile(){
  const p=getProfile(),sess=getSess(),mets=getMets(),cks=ckAll().filter(ckHasContent);
  const first=sess.map(function(s){return s.date}).sort()[0];
  const sy=syncText();
  const rd=getRestDays();
  const r=ckReset();
  document.getElementById('screen-profile').innerHTML=''
    +'<header class="page-head"><button class="circle dashed" onclick="go(\'today\')" aria-label="Back">'+ic('left')+'</button></header>'
    +'<div class="cols pair">'
    +'<div class="col">'
    +'<section class="who"><div class="avatar">'+esc((p.name||'?').charAt(0).toUpperCase())+'<button class="spark" onclick="nameSheet()" aria-label="Edit name">'+ic('pencil')+'</button></div>'
    +'<div><h1>'+esc(p.name)+'</h1><div class="facts">'
    +'<span><b>'+sess.length+'</b>sessions</span><span><b>'+cks.length+'</b>check-ins</span><span><b>'+(first?new Date(first+'T00:00:00').toLocaleDateString('en-IN',{month:'short',year:'numeric'}):'—')+'</b>since</span>'
    +'</div></div></section>'
    +'<div class="idbar"><span>InBody baseline · '+BASELINE.weight+' kg · '+BASELINE.bodyFat+'% fat</span><span>Target '+BASELINE.target+' kg</span></div>'
    +'<h2 class="sec">Body</h2><div class="list">'
    +listRow('scale','yellow','Body measurements','Weight, waist and your InBody baseline','go(\'body\')',mets.length||null)
    +'</div>'
    +'<h2 class="sec">Settings</h2><div class="list">'
    +listRow('pencil','pink','Your name',esc(p.name),'nameSheet()')
    +listRow('bed','blue','Rest days',rd.length?rd.map(function(d){return DOW_F[d].slice(0,3)}).join(', '):'None set','restDaysSheet()')
    +(r?listRow('alarm','yellow','Wake target',ckFmtTime(r.wakeTarget),'ckWakeSheet()'):'')
    +'</div>'
    +'</div>'
    +'<div class="col">'
    +'<h2 class="sec">Reports</h2><div class="list">'
    +listRow('file','green','Training log for Claude','A Markdown file to attach in a chat and ask for analysis','reportTraining()',sess.length||null)
    +listRow('file','pink','Check-in log','A printable page with mood, sleep and habits','reportCheckins()',cks.length||null)
    +'</div>'
    +'<h2 class="sec">Backup</h2><div class="list">'
    +'<div class="row static"><span class="dot t-blue">'+ic(sy.icon)+'</span><span class="row-main"><b>'+sy.t+'</b><small>'+sy.s+'</small></span></div>'
    +listRow('download','green','Download backup','Everything in one file','downloadBackup()')
    +listRow('upload','yellow','Restore from backup','Merges a backup in, including one from the old app','triggerRestore()')
    +'</div>'
    +'<input type="file" id="restore-file" accept="application/json,.json" hidden onchange="handleRestore(this)">'
    +'</div></div>';
}
function nameSheet(){
  openSheet('<h3>Your name</h3><input id="name-inp" class="inp" value="'+esc(getProfile().name)+'" autofocus autocomplete="given-name">'
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button><button class="btn" onclick="saveName()">Save</button></div>');
}
function saveName(){const v=document.getElementById('name-inp').value.trim();if(!v){toast('Enter a name');return}const p=getProfile();p.name=v;putProfile(p);closeOverlays();toast('Saved');rerender()}
let _rd=null;
function restDaysSheet(){
  _rd=getRestDays().slice();
  const draw=function(){
    openSheet('<h3>Rest days</h3><p class="hint">Days you normally skip. They won\'t break your streak, and the coach suggests rest on them.</p>'
      +'<div class="dow">'+['S','M','T','W','T','F','S'].map(function(s,i){return '<button class="'+(_rd.indexOf(i)>=0?'on':'')+'" aria-pressed="'+(_rd.indexOf(i)>=0)+'" aria-label="'+DOW_F[i]+'" onclick="toggleRd('+i+')">'+s+'</button>'}).join('')+'</div>'
      +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button><button class="btn" onclick="saveRd()">Save</button></div>');
  };
  window.toggleRd=function(i){const j=_rd.indexOf(i);if(j>=0)_rd.splice(j,1);else _rd.push(i);draw()};
  draw();
}
function saveRd(){putRestDays(_rd.slice().sort());closeOverlays();toast('Rest days saved');rerender()}

// ── Body ───────────────────────────────────────────────
function renderBody(){
  const mets=getMets().slice().sort(function(a,b){return b.date.localeCompare(a.date)});
  const lat=mets[0]||null;
  const lostW=(lat&&lat.weight)?(parseFloat(lat.weight)-BASELINE.weight).toFixed(1):null;
  const prev=mets[1]||null;
  const dW=(lat&&prev&&lat.weight&&prev.weight)?(parseFloat(lat.weight)-parseFloat(prev.weight)).toFixed(1):null;
  const dWa=(lat&&prev&&lat.waist&&prev.waist)?(parseFloat(lat.waist)-parseFloat(prev.waist)).toFixed(1):null;
  const delta=function(v,u){if(v==null)return '';const n=parseFloat(v);return '<small class="'+(n<=0?'good':'bad')+'">'+(n>0?'+':'')+v+' '+u+'</small>'};
  const hist=!mets.length?'<p class="empty">No measurements yet.</p>':mets.slice(0,24).map(function(m){
    return '<div class="row static"><span class="row-main"><b>'+fmtD(m.date)+'</b></span><span class="vals">'+(m.weight?'<b>'+m.weight+'</b><small>kg</small>':'')+(m.waist?'<b>'+m.waist+'</b><small>cm</small>':'')+'</span></div>';
  }).join('');
  document.getElementById('screen-body').innerHTML=''
    +'<header class="page-head"><button class="circle dashed" onclick="go(\'profile\')" aria-label="Back to profile">'+ic('left')+'</button><div class="grow1"><div class="eyebrow">Profile</div><h1>Body</h1></div>'
    +'<button class="circle" onclick="openMet()" aria-label="Log measurement">'+ic('plus')+'</button></header>'
    +'<div class="cols pair"><div class="col">'
    +'<div class="tiles two">'
    +'<div class="tile t-yellow"><span>Weight</span><b>'+(lat&&lat.weight?lat.weight+'<small> kg</small>':'—')+'</b>'+(dW?delta(dW,'kg'):'<small>since last</small>')+'</div>'
    +'<div class="tile t-blue"><span>Waist</span><b>'+(lat&&lat.waist?lat.waist+'<small> cm</small>':'—')+'</b>'+(dWa?delta(dWa,'cm'):'<small>since last</small>')+'</div>'
    +'</div>'
    +(lostW!=null?'<p class="hint">'+(parseFloat(lostW)<=0?Math.abs(lostW)+' kg down':lostW+' kg up')+' since the June baseline of '+BASELINE.weight+' kg. Target about '+BASELINE.target+' kg.</p>':'')
    +'<button class="btn wide" onclick="openMet()">Log measurement</button>'
    +baselineCard()
    +'</div><div class="col"><h2 class="sec">History</h2><div class="list">'+hist+'</div></div></div>';
}
function openMet(){
  openSheet('<h3>Log measurement</h3>'
    +'<label class="lbl" for="m-date">Date</label><input type="date" class="inp" id="m-date" value="'+today()+'" max="'+today()+'">'
    +'<div class="two"><div><label class="lbl" for="m-wt">Weight (kg)</label><input type="number" inputmode="decimal" step="0.1" class="inp" id="m-wt" placeholder="74.8"></div>'
    +'<div><label class="lbl" for="m-wa">Waist (cm)</label><input type="number" inputmode="decimal" step="0.5" class="inp" id="m-wa" placeholder="96"></div></div>'
    +'<p class="hint">Weigh in the morning before eating. Measure the waist at navel level after a normal breath out.</p>'
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button><button class="btn" onclick="saveMet()">Save</button></div>');
}
function saveMet(){
  const date=document.getElementById('m-date').value,wt=document.getElementById('m-wt').value,wa=document.getElementById('m-wa').value;
  if(!wt&&!wa){toast('Enter weight or waist');return}
  const all=getMets().filter(function(m){return m.date!==date});
  all.push({date:date,weight:wt||null,waist:wa||null});
  putMets(all);closeOverlays();toast('Saved');rerender();
}

// ── Reports & backup ───────────────────────────────────
async function deliver(filename,data,mime){
  if(window.claude&&typeof window.claude.use==='function'){
    let dl=null;try{dl=await window.claude.use('downloads')}catch(e){}
    if(dl){
      try{await dl.save({filename:filename,data:data});toast('Saved '+filename);return}
      catch(e){if(e&&(e.code==='declined'))return;if(e&&e.code==='rate_limited'){toast('One save at a time. Try again in a moment');return}}
    }
  }
  try{
    const blob=new Blob([data],{type:mime||'text/plain'});
    const url=URL.createObjectURL(blob);
    const a=document.createElement('a');a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();
    setTimeout(function(){URL.revokeObjectURL(url)},1500);
    toast('Downloaded '+filename);
  }catch(e){toast('Downloads aren\'t available here')}
}
function reportTraining(){
  const sess=getSess().slice().sort(function(a,b){return a.date.localeCompare(b.date)});
  if(!sess.length){toast('No workouts yet');return}
  const mets=getMets().slice().sort(function(a,b){return a.date.localeCompare(b.date)});
  const st=coachStats(addDays(today(),1));
  const B=BASELINE;
  let md='# SET3 training log\n\nExported '+fmtDLong(today())+' · '+sess.length+' sessions · '+fmtD(sess[0].date)+' to '+fmtD(sess[sess.length-1].date)+'\n\n';
  md+='## Baseline (InBody, June 2026)\n\n- Weight '+B.weight+' kg, target about '+B.target+' kg\n- Body fat '+B.bodyFat+'%, visceral fat level '+B.visceral+'\n- BMR '+B.bmr+' kcal, InBody score '+B.score+'/100, leg muscle '+B.legMuscle.toLowerCase()+'\n\n';
  md+='## Last 7 days\n\n- Strength days: '+st.strengthDays7+' of '+STRENGTH_DAYS_TARGET+'\n- Days with cardio: '+st.cardio7+' of '+CARDIO_TARGET+'\n';
  GROUPS.forEach(function(G){if(G.target)md+='- '+G.label+': '+st.groups[G.k].n7+' of '+G.target+'\n'});
  md+='\n## Sessions\n\n| Date | Session | Trained | Minutes | Notes |\n|---|---|---|---|---|\n';
  sess.forEach(function(s){md+='| '+fmtD(s.date)+' '+s.date.slice(0,4)+' | '+sessTitle(s)+' | '+(s.groups||[]).map(function(k){return GROUP(k)?GROUP(k).label:k}).join(', ')+' | '+(s.durationMin||'')+' | '+(s.notes||'').replace(/\|/g,'/').replace(/\n/g,' ')+' |\n'});
  if(mets.length){md+='\n## Body measurements\n\n| Date | Weight (kg) | Waist (cm) |\n|---|---|---|\n';mets.forEach(function(m){md+='| '+m.date+' | '+(m.weight||'')+' | '+(m.waist||'')+' |\n'})}
  md+='\n---\nSuggested prompt: "Here is my SET3 training log. Analyse my progress: what\'s improving, what needs attention, and what I should focus on for the next 4 weeks."\n';
  deliver('set3-training-log-'+today()+'.md',md,'text/markdown');
}
function reportCheckins(){
  const html=ckReportHTML();
  if(!html){toast('No check-ins yet');return}
  deliver('checkin-log-'+today()+'.html',html,'text/html');
}
function downloadBackup(){
  const data={schema:4,app:'SET3',exportedAt:new Date().toISOString(),sessions:getSess(),mets:getMets(),restDays:getRestDays(),daily:ckAll(),reset:ckReset(),profile:sGet('profile',null)};
  deliver('set3-backup-'+today()+'.json',JSON.stringify(data,null,2),'application/json');
}
function triggerRestore(){const i=document.getElementById('restore-file');if(i)i.click()}
function handleRestore(input){
  const file=input.files&&input.files[0];if(!file)return;
  const rd=new FileReader();
  rd.onload=function(ev){
    let data;
    try{data=JSON.parse(ev.target.result)}catch(e){toast('That file isn\'t a SET3 backup');return}
    if(!data||!Array.isArray(data.sessions)){toast('That file isn\'t a SET3 backup');return}
    const byId={};getSess().forEach(function(s){byId[s.id]=s});
    let added=0;
    data.sessions.forEach(function(s){if(s&&s.id&&s.date&&!byId[s.id]){byId[s.id]=s;added++}});
    S.cache.sessions=Object.values(byId);migrateSessions();putSess(S.cache.sessions);
    const byDate={};getMets().forEach(function(m){byDate[m.date]=m});
    (data.mets||[]).forEach(function(m){if(m&&m.date&&!byDate[m.date])byDate[m.date]=m});
    putMets(Object.values(byDate));
    const byDay={};ckAll().forEach(function(e){byDay[e.date]=e});
    let ckAdded=0;(data.daily||[]).forEach(function(e){if(e&&e.date&&!byDay[e.date]){byDay[e.date]=e;ckAdded++}});
    ckSaveAll(Object.values(byDay));
    if(data.restDays&&data.restDays.length&&!getRestDays().length)putRestDays(data.restDays);
    if(data.reset&&!ckReset())ckSaveReset(data.reset);
    if(data.profile&&!sGet('profile',null))putProfile(data.profile);
    toast('Restored '+added+' workouts'+(ckAdded?' and '+ckAdded+' check-ins':''));
    rerender();
  };
  rd.readAsText(file);input.value='';
}

// ── Add menu (center +) ────────────────────────────────
function openAdd(){
  const t=getTimer();
  openSheet('<h3>Add</h3><div class="list flat">'
    +listRow('gym','pink','Workout','Pick the muscle groups you trained','closeOverlays();openLog(today())')
    +listRow('daily','yellow','Daily check-in','Sleep, mood, habits, focus','closeOverlays();ckOpen(ckDay())')
    +listRow('scale','green','Body measurement','Weight and waist','closeOverlays();openMet()')
    +listRow('timer','blue',t?'Stop workout timer':'Start workout timer',t?'Adds the minutes to today':'Stops itself at 2 hours','closeOverlays();timerToggle()')
    +'</div>');
}

// ── Chrome (sidebar + nav badges) ──────────────────────
function renderChrome(){
  const t=getTimer();
  const side=document.getElementById('side-extra');
  if(side){
    const sy=syncText();
    side.innerHTML=(t?'<button class="side-timer" onclick="go(\'gym\')">'+ic('timer')+'<span id="side-timer">'+fmtElapsed(timerElapsedMs(t))+'</span></button>':'')
      +'<div class="side-sync">'+ic(sy.icon)+'<span>'+sy.t+'</span></div>';
  }
  const tb=document.getElementById('tab-gym');if(tb)tb.classList.toggle('live',!!t);
  const tp=document.getElementById('top-timer');
  if(tp){tp.hidden=!t;if(t){const el=document.getElementById('top-timer-t');if(el)el.textContent=fmtElapsed(timerElapsedMs(t))}}
  const av=document.getElementById('top-avatar');if(av)av.textContent=(getProfile().name||'?').charAt(0).toUpperCase();
}
function onSyncChange(changed){if(changed)rerender();else renderChrome()}

// ── Boot ───────────────────────────────────────────────
const RENDER={today:renderToday,gym:renderGym,history:renderHistory,daily:renderDaily,profile:renderProfile,body:renderBody};
if('serviceWorker' in navigator&&!window.SET3_WEB&&!(window.claude&&window.claude.use)&&location.protocol!=='file:'){navigator.serviceWorker.register('sw.js').catch(function(){})}
go('today');
tickTimer();
renderChrome();
initCloud();

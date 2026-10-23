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
function closeOverlays(){document.querySelectorAll('.ov').forEach(function(o){o.remove()});_ovClose=null}
function openModal(id,inner,onBackdrop,kind){
  // Re-rendering an open sheet swaps its content in place (no re-animation, scroll kept).
  const open=document.getElementById(id||'ov');
  if(open&&open.classList.contains('ov')&&open.classList.contains('is-sheet')===(kind==='sheet')){
    const m=open.querySelector('.modal'),st=m.scrollTop;
    m.innerHTML=inner;m.scrollTop=st;
    _ovClose=onBackdrop||closeOverlays;
    open._bd=onBackdrop||closeOverlays;
    return;
  }
  closeOverlays();
  const ov=document.createElement('div');
  ov.className='ov'+(kind==='sheet'?' is-sheet':'');ov.id=id||'ov';
  ov.innerHTML='<div class="modal" role="dialog" aria-modal="true">'+inner+'</div>';
  ov._bd=onBackdrop||closeOverlays;
  ov.addEventListener('click',function(e){if(e.target===ov)ov._bd()});
  _ovClose=onBackdrop||closeOverlays;
  document.body.appendChild(ov);
  const f=ov.querySelector('[autofocus]');if(f)setTimeout(function(){f.focus()},60);
}
function openSheet(inner){openModal('ov-sheet','<div class="grab"></div>'+inner,null,'sheet')}
document.addEventListener('keydown',function(e){if(e.key==='Escape'&&_ovClose)_ovClose()});
function askConfirm(title,body,yes,onYes,danger){
  openSheet('<h3>'+title+'</h3><p class="hint">'+body+'</p>'
    +'<div class="row-btns"><button class="btn ghost" onclick="closeOverlays()">Cancel</button>'
    +'<button class="btn'+(danger?' danger':'')+'" id="confirm-yes">'+yes+'</button></div>');
  document.getElementById('confirm-yes').onclick=function(){closeOverlays();onYes()};
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
function go(tab){
  closeOverlays();
  document.querySelectorAll('.screen').forEach(function(s){s.classList.toggle('active',s.id==='screen-'+tab)});
  document.querySelectorAll('[data-tab]').forEach(function(t){const on=t.dataset.tab===NAV_OF[tab];t.classList.toggle('on',on);if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current')});
  cur=tab;RENDER[tab]();
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
    arcs+='<path d="M'+x0.toFixed(1)+' '+y0.toFixed(1)+' A'+r+' '+r+' 0 0 1 '+x1.toFixed(1)+' '+y1.toFixed(1)+'" class="arc '+(on?'s-'+G.tone:'off')+'"><title>'+G.label+(on?': trained this week':': not yet this week')+'</title></path>';
    const xm=c+r*Math.cos(rad(am)),ym=c+r*Math.sin(rad(am));
    icons+='<svg x="'+(xm-10).toFixed(1)+'" y="'+(ym-10).toFixed(1)+'" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ring-ic'+(on?'':' off')+'">'+ICONS[G.icon]+'</svg>';
  });
  return {svg:'<svg viewBox="0 0 300 300" class="ring-svg" role="img" aria-label="'+hit+' of '+n+' groups trained in the last 7 days">'+arcs+icons+'</svg>',hit:hit,n:n};
}

// ══════════════════════════════════════════════════════
// TODAY
// ══════════════════════════════════════════════════════
function greeting(){const h=new Date().getHours();return h<4?'Still up':h<12?'Good morning':h<17?'Good afternoon':'Good evening'}
function renderToday(){
  const td=today(),p=getProfile(),sessions=getSess();
  const streak=calcStreak();
  const ring=ringSVG();
  const todays=sessions.filter(function(s){return s.date===td});
  const rec=recommend(td);
  const empty=!sessions.length&&!ckAll().length;

  const coach=todays.length
    ?'<section class="card tone-pink coach"><div class="eyebrow">Coach</div><h3>Done today: '+esc(sessionLabel(todays[0].groups))+'</h3>'
      +'<p>Tomorrow looks like <b>'+esc(recommend(addDays(td,1)).title.toLowerCase())+'</b>. Recovery is part of the plan.</p>'
      +'<div class="row-btns"><button class="btn" onclick="go(\'gym\')">Open gym</button></div></section>'
    :'<section class="card tone-pink coach"><div class="eyebrow">Coach · today</div><h3>'+esc(rec.title)+'</h3>'
      +'<p>'+esc(rec.reasons[0])+'</p>'
      +'<div class="row-btns"><button class="btn" onclick="logFromRec()">Log this</button><button class="btn ghost" onclick="go(\'gym\')">Why this</button></div></section>';

  const restore=empty?'<section class="card tone-blue cta" onclick="go(\'profile\')"><div class="eyebrow">New here</div><h3>Bring your history over</h3><p>In the old app, open Export and download a backup. Then restore it from your profile here.</p><span class="btn sm">Open profile</span></section>':'';

  document.getElementById('screen-today').innerHTML=''
    +'<header class="hello"><div class="eyebrow">'+fmtDLong(td)+'</div><h1>'+greeting()+', '+esc(p.name)+'</h1><p class="muted">How are you feeling today?</p></header>'
    +'<div class="cols">'
    +'<div class="col">'
    +'<section class="ring" onclick="go(\'gym\')">'+ring.svg
    +'<div class="ring-mid"><b>'+streak+'</b><span>day streak</span><small>'+ring.hit+' of '+ring.n+' groups this week</small></div></section>'
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
  const td=today(),rec=recommend(td);
  const st=coachStats(addDays(td,1));
  const todays=getSess().filter(function(s){return s.date===td});
  const t=getTimer();
  const timer='<section class="card timer'+(t?' running':'')+'">'
    +'<div><div class="eyebrow">Workout timer</div><b id="timer-big">'+(t?fmtElapsed(Date.now()-t.startTs):'00:00')+'</b>'
    +'<small>'+(t?'Running since '+new Date(t.startTs).toLocaleTimeString('en-IN',{hour:'numeric',minute:'2-digit'}):'Adds the time to today\'s session')+'</small></div>'
    +'<button class="play" onclick="timerToggle()" aria-label="'+(t?'Stop timer':'Start timer')+'">'+ic(t?'stop':'play')+'</button></section>';

  const done=todays.length?'<p class="done-line">'+ic('check')+'Logged today: <b>'+esc(sessionLabel(todays[0].groups))+'</b></p>':'';
  const coach='<section class="card tone-pink coach big">'
    +'<div class="eyebrow">Coach · '+(todays.length?'already trained today':'today')+'</div>'
    +'<h3>'+esc(rec.title)+'</h3>'
    +(rec.groups.length?'<div class="chips wrap">'+rec.groups.map(groupChip).join('')+'</div>':'')
    +(rec.template?'<p class="eg"><b>Example:</b> '+esc(rec.template.eg)+'</p>':'')
    +'<ul class="why">'+rec.reasons.map(function(r){return '<li>'+esc(r)+'</li>'}).join('')+'</ul>'
    +(rec.alt?'<p class="alt">Or: '+esc(rec.alt)+'</p>':'')
    +done
    +'<div class="row-btns"><button class="btn" onclick="logFromRec()">Log this</button><button class="btn ghost" onclick="openLog(today())">Something else</button></div>'
    +'<button class="link" onclick="openSources()">'+ic('info')+'How the coach decides</button>'
    +'</section>';

  const tiles='<div class="tiles">'
    +tile('yellow','Strength days',st.strengthDays7,STRENGTH_DAYS_TARGET,'last 7 days')
    +tile('blue','Cardio sessions',st.cardio7,CARDIO_TARGET,'last 7 days')
    +tile('green','Day streak',calcStreak(),null,'rest days don\'t break it')
    +'</div>';

  document.getElementById('screen-gym').innerHTML=''
    +'<header class="page-head"><div><div class="eyebrow">Training</div><h1>Gym</h1></div>'
    +'<button class="circle" onclick="openLog(today())" aria-label="Log workout">'+ic('plus')+'</button></header>'
    +'<div class="cols">'
    +'<div class="col">'+timer+coach+'</div>'
    +'<div class="col"><h2 class="sec">This week</h2>'+tiles+weekGroupsCard()+'</div>'
    +'<div class="col"><h2 class="sec">Your baseline</h2>'+baselineCard()+'</div>'
    +'</div>';
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
    cells+='<button class="cd'+(s?' t-'+tone:'')+(iso===td?' td':'')+(fut?' fut':'')+'"'+(fut?' disabled':' onclick="openLog(\''+iso+'\')"')+' aria-label="'+fmtD(iso)+(s?', '+esc(sessionLabel(s.groups)):'')+'">'+d+'</button>';
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
    +'<span class="row-main"><small>'+fmtD(s.date)+'</small><b>'+esc(sessionLabel(s.groups))+'</b>'
    +((s.groups||[]).length>1?'<span class="mini-chips">'+s.groups.map(function(k){const g=GROUP(k);return g?'<i class="t-'+g.tone+'">'+g.short+'</i>':''}).join('')+'</span>':'')
    +(s.notes?'<small class="note-sm">'+esc(s.notes)+'</small>':'')
    +(extra.length?'<small>'+extra.join(' · ')+'</small>':'')+'</span>'
    +'<span class="chev">'+ic('right')+'</span></button>';
}

// ══════════════════════════════════════════════════════
// WORKOUT LOGGER — pick what you trained, that's it
// ══════════════════════════════════════════════════════
let _s=null,_sEditing=false;
function openLog(date,preset){
  const ex=getSess().filter(function(s){return s.date===date})[0];
  if(ex&&!preset){openSess(ex.id);return}
  _s=ex?JSON.parse(JSON.stringify(ex)):{id:uid(),date:date,groups:[],notes:''};
  if(preset)_s.groups=preset.slice();
  _sEditing=!!ex;
  buildLog();
}
function openSess(id){
  const f=getSess().filter(function(s){return s.id===id})[0];if(!f)return;
  _s=JSON.parse(JSON.stringify(f));_sEditing=true;buildLog();
}
function logFromRec(){openLog(today(),recommend(today()).groups)}
function buildLog(){
  const isToday=_s.date===today();
  const rec=isToday?recommend(_s.date):null;
  const sug=rec?rec.groups:[];
  const quick=TEMPLATES.map(function(t){return '<button class="chip" onclick="logPreset(\''+t.k+'\')">'+t.label+'</button>'}).join('')
    +'<button class="chip" onclick="logPresetGroups([\'cardio\'])">Cardio only</button>';
  const tiles=GROUPS.map(function(G){
    const on=_s.groups.indexOf(G.k)>=0,s=sug.indexOf(G.k)>=0;
    return '<button class="gtile'+(on?' on t-'+G.tone:'')+'" aria-pressed="'+on+'" onclick="logToggle(\''+G.k+'\')">'
      +'<span class="dot t-'+G.tone+'">'+ic(G.icon)+'</span><b>'+G.label+'</b>'
      +(s&&!on?'<em>Suggested</em>':'')+(on?'<span class="tick">'+ic('check')+'</span>':'')+'</button>';
  }).join('');
  openModal('ov-log','<header class="modal-head"><div><div class="eyebrow">'+(isToday?'Today · ':'')+fmtD(_s.date)+'</div><h2>'+(_sEditing?'Edit workout':'What did you train?')+'</h2></div>'
    +'<button class="circle" onclick="saveLog()" aria-label="Save">'+ic('check')+'</button></header>'
    +'<label class="lbl" for="log-date">Date</label><input id="log-date" type="date" class="inp" value="'+_s.date+'" max="'+today()+'" onchange="logDate(this.value)">'
    +'<label class="lbl">Quick picks</label><div class="chips scroll">'+quick+'</div>'
    +'<label class="lbl">Muscle groups</label><div class="gtiles">'+tiles+'</div>'
    +(_s.durationMin?'<p class="hint">'+ic('timer')+' Timer: '+_s.durationMin+' min</p>':'')
    +(_s.legacy&&_s.legacy.length?'<p class="hint">From the old log: '+esc(_s.legacy.join(', '))+'</p>':'')
    +'<label class="lbl" for="log-notes">Notes</label><textarea id="log-notes" class="inp" rows="2" placeholder="Optional: how it felt, what to change next time">'+esc(_s.notes)+'</textarea>'
    +'<div class="row-btns">'+(_sEditing?'<button class="btn ghost danger-text" onclick="deleteLog()">'+ic('trash')+'Delete</button>':'')+'<button class="btn" onclick="saveLog()">Save workout</button></div>');
}
function logKeepNotes(){const n=document.getElementById('log-notes');if(n)_s.notes=n.value}
function logToggle(k){logKeepNotes();const i=_s.groups.indexOf(k);if(i>=0)_s.groups.splice(i,1);else _s.groups.push(k);buildLog()}
function logPreset(tk){const t=TEMPLATES.filter(function(x){return x.k===tk})[0];logPresetGroups(t.groups)}
function logPresetGroups(gs){logKeepNotes();_s.groups=gs.slice();buildLog()}
function logDate(v){
  logKeepNotes();
  if(!v||v>today())return;
  const ex=getSess().filter(function(s){return s.date===v&&s.id!==_s.id})[0];
  if(ex){toast('Opened the workout already logged that day');openSess(ex.id);return}
  _s.date=v;buildLog();
}
function saveLog(){
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
  const id=_s.id;
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
function timerToggle(){getTimer()?stopTimer():startTimer()}
function startTimer(){sSet('timer',{startTs:Date.now(),date:today()});toast('Timer started');tickTimer();rerender()}
function stopTimer(){
  const t=getTimer();if(!t)return;
  const mins=Math.max(1,Math.round((Date.now()-t.startTs)/60000));
  sSet('timer',null);
  const all=getSess().slice();
  const s=all.filter(function(x){return x.date===t.date})[0];
  if(s){s.durationMin=(s.durationMin||0)+mins;putSess(all);toast(mins+' min added to '+sessionLabel(s.groups).toLowerCase());rerender()}
  else{
    rerender();
    _s={id:uid(),date:t.date,groups:[],notes:'',durationMin:mins};_sEditing=false;buildLog();
    toast(mins+' min. Pick what you trained');
  }
}
function tickTimer(){
  clearInterval(_timerInt);
  if(!getTimer()){renderChrome();return}
  _timerInt=setInterval(function(){
    const t=getTimer();
    if(!t){clearInterval(_timerInt);renderChrome();return}
    const txt=fmtElapsed(Date.now()-t.startTs);
    const big=document.getElementById('timer-big');if(big)big.textContent=txt;
    const side=document.getElementById('side-timer');if(side)side.textContent=txt;
  },1000);
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
  md+='## Last 7 days\n\n- Strength days: '+st.strengthDays7+' of '+STRENGTH_DAYS_TARGET+'\n- Cardio sessions: '+st.cardio7+' of '+CARDIO_TARGET+'\n';
  GROUPS.forEach(function(G){if(G.target)md+='- '+G.label+': '+st.groups[G.k].n7+' of '+G.target+'\n'});
  md+='\n## Sessions\n\n| Date | Trained | Minutes | Notes |\n|---|---|---|---|\n';
  sess.forEach(function(s){md+='| '+fmtD(s.date)+' '+s.date.slice(0,4)+' | '+(s.groups||[]).map(function(k){return GROUP(k)?GROUP(k).label:k}).join(', ')+' | '+(s.durationMin||'')+' | '+(s.notes||'').replace(/\|/g,'/').replace(/\n/g,' ')+' |\n'});
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
    +listRow('timer','blue',t?'Stop workout timer':'Start workout timer',t?'Adds the minutes to today':'Counts while the app is closed','closeOverlays();timerToggle()')
    +'</div>');
}

// ── Chrome (sidebar + nav badges) ──────────────────────
function renderChrome(){
  const t=getTimer();
  const side=document.getElementById('side-extra');
  if(side){
    const sy=syncText();
    side.innerHTML=(t?'<button class="side-timer" onclick="go(\'gym\')">'+ic('timer')+'<span id="side-timer">'+fmtElapsed(Date.now()-t.startTs)+'</span></button>':'')
      +'<div class="side-sync">'+ic(sy.icon)+'<span>'+sy.t+'</span></div>';
  }
  const tb=document.getElementById('tab-gym');if(tb)tb.classList.toggle('live',!!t);
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

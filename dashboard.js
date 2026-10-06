/* LectureLens dashboard — phase 1: shell, routing, theme, Dashboard Home */
const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];
const ls={get:k=>{try{return JSON.parse(localStorage.getItem(k))}catch(e){return null}},set:(k,v)=>{try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};

/* ---------- user (shares the Home page's login key) ---------- */
const me=ls.get('ll_me')||{name:'Allfi'};
const safe=s=>String(s).replace(/[<>&]/g,'');
$('#meName').textContent=$('#gName').textContent=safe(me.name);
$('#ava').textContent=safe(me.name)[0].toUpperCase();

/* ---------- time-based greeting ---------- */
const h=new Date().getHours();
$('#greet').textContent=h<12?'সুপ্রভাত':h<17?'শুভ অপরাহ্ন':h<20?'শুভ সন্ধ্যা':'শুভ রাত্রি';

/* ---------- routing ---------- */
const TITLES={dash:'Dashboard',upload:'Upload & Processing',work:'Lecture Workspace',lib:'My Library',search:'Search & AI Assistant',quiz:'Quiz & Flashcards',notes:'Notes & Highlights',stats:'Analytics',prof:'Profile'};
function go(v){
  $$('.view').forEach(x=>x.classList.toggle('on',x.id==='v-'+v));
  $$('.ni').forEach(x=>x.classList.toggle('on',x.dataset.v===v));
  $('#ttl').textContent=TITLES[v];closeSb();scrollTo({top:0});
  const el=$('#v-'+v);
  if(!el.children.length)el.innerHTML=`<div class="card ph-box"><h3>${TITLES[v]}</h3><p>এই section পরের phase-এ আসছে।</p></div>`;
  history.replaceState(null,'','#'+v);
}
document.addEventListener('click',e=>{const t=e.target.closest('[data-go],[data-v]');if(t)go(t.dataset.go||t.dataset.v)});
function closeSb(){$('#sb').classList.remove('open');$('#scrim').classList.remove('on')}
$('#hb').onclick=()=>{$('#sb').classList.toggle('open');$('#scrim').classList.toggle('on')};
$('#scrim').onclick=closeSb;

/* ---------- theme (persisted) ---------- */
function theme(t){document.documentElement.dataset.theme=t;$('#thm').textContent=t==='dark'?'☀':'☾';ls.set('ll_theme',t)}
theme(ls.get('ll_theme')||'light');
$('#thm').onclick=()=>theme(document.documentElement.dataset.theme==='dark'?'light':'dark');

/* ---------- toast ---------- */
function toast(m){const t=document.createElement('div');t.className='card';t.style.cssText='padding:12px 18px;font-size:15px;margin-top:8px';t.textContent=m;$('#toast').appendChild(t);setTimeout(()=>t.remove(),2600)}

/* ---------- stat count-up ---------- */
$$('[data-n]').forEach(el=>{const to=+el.dataset.n,dec=String(to).includes('.')?1:0;let s=null;
  const f=t=>{s=s||t;const p=Math.min(1,(t-s)/900);el.textContent=(to*p).toFixed(dec);if(p<1)requestAnimationFrame(f)};requestAnimationFrame(f)});

/* ---------- processing pipeline (64% / Done / Queued) ---------- */
const JOBS=[{t:'L08 — Deadlocks',s:'run',p:64},{t:'L07 — CPU Scheduling',s:'done',p:100},{t:'L09 — Page Replacement',s:'q',p:0}];
$('#jobs').innerHTML=JOBS.map(j=>`<div class="job"><div><b>${j.t}</b>${j.s==='run'?`<div class="bar"><i style="width:${j.p}%"></i></div>`:''}</div>
<span class="chip ${j.s==='run'?'w':j.s==='done'?'':'m'}">${j.s==='run'?j.p+'%':j.s==='done'?'Done':'Queued'}</span></div>`).join('');

/* ---------- recent summaries (Bangla previews → Workspace) ---------- */
const SUMS=[['L07','CPU scheduling-এর তিনটি algorithm — FCFS, SJF ও Round Robin — তুলনা করা হয়েছে।'],
['L06','Deadlock-এর চারটি শর্ত (mutual exclusion, hold & wait…) আলোচনা করা হয়েছে।'],
['L05','Process state diagram ও context switching-এর খরচ ব্যাখ্যা করা হয়েছে।']];
$('#sums').innerHTML=SUMS.map(s=>`<div class="sm-l"><span class="chip" style="height:fit-content">${s[0]}</span><span class="bn">${s[1]}</span></div>`).join('');

/* ---------- export (real TXT download) ---------- */
$('#exp').onclick=()=>{const txt='LectureLens — Recent summaries\n\n'+SUMS.map(s=>`[${s[0]}] ${s[1]}`).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([txt],{type:'text/plain;charset=utf-8'}));a.download='lecturelens-summaries.txt';a.click();toast('TXT exported ✓')};

go((location.hash||'#dash').slice(1) in TITLES?(location.hash||'#dash').slice(1):'dash');

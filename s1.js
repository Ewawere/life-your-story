/* ===== utils ===== */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const gbp=n=>{n=Math.round(n*100)/100;return '£'+(n%1?n.toFixed(2):n.toLocaleString('en-US'))};
let S=null, modalOpen=false;
function store(){try{if(S)localStorage.setItem('lys01',JSON.stringify(S))}catch(e){}}
function loadSave(){try{return JSON.parse(localStorage.getItem('lys01'))}catch(e){return null}}
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display='none',2200)}
function modal(h,close){$('mb').innerHTML=h+(close?'<button class="o" onclick="closeM()">Close</button>':'');$('modal').style.display='flex';modalOpen=true;$('mb').scrollTop=0}
function closeM(){$('modal').style.display='none';modalOpen=false}

/* ===== sound (audio.js) — free WebAudio, no files ===== */
let AC=null,amb=null;
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')try{AC.resume()}catch(e){}return AC}
function beep(f,d,t,v){if(!AC||(S&&S.muted))return;try{const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t||'sine';o.frequency.value=f;g.gain.value=v||.06;o.connect(g);g.connect(AC.destination);g.gain.setTargetAtTime(0,n+d*.6,d*.15);o.start(n);o.stop(n+d)}catch(e){}}
const SFX={ok:()=>{beep(660,.12);setTimeout(()=>beep(880,.16),110)},bad:()=>beep(180,.25,'square',.04),tap:()=>beep(520,.06),door:()=>{beep(220,.1,'triangle');setTimeout(()=>beep(330,.12,'triangle'),90)},chime:()=>[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.2),i*110))};
function startAmbient(){if(!AC||amb)return;try{const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}const src=AC.createBufferSource();src.buffer=b;src.loop=true;const g=AC.createGain();g.gain.value=0;src.connect(g);g.connect(AC.destination);src.start();amb=g}catch(e){}}
addEventListener('pointerdown',()=>{audio();startAmbient()},{once:true});

/* ===== family system (family.js) ===== */
const FN={m:['James','Oliver','Daniel','Mohammed','Arjun','Lucas','Tomasz'],f:['Emma','Sophie','Aisha','Priya','Chloe','Maria','Hannah']},
SUR=['Smith','Taylor','Khan','Patel','Jones','Evans','Brown','Walker'],
JOBS={Low:['shop assistant','bus driver','care worker','security guard','delivery driver'],Middle:['teacher','nurse','civil servant','shop owner','mechanic'],Wealthy:['company director','surgeon','property developer','bank executive']},
TRAITS=['strict','generous','hardworking','easy-going','ambitious','always worried about money','very encouraging'],
EXPECT=['wants you to finish school with strong grades','needs you to help at home and with the family shop','wants you to find your own path'],
HOUSE={Low:'Rented two-room flat',Middle:'Rented three-bedroom flat',Wealthy:'Large family house'};
const CFG={probs:[['Low',.35],['Middle',.45],['Wealthy',.20]]}; // configurable class odds
function genFamily(){
  let r=Math.random(),cls='Wealthy',a=0;for(const [c,p] of CFG.probs){a+=p;if(r<a){cls=c;break}}
  const two=Math.random()<({Low:.5,Middle:.7,Wealthy:.85}[cls]);
  const rg={Low:[14,24],Middle:[30,60],Wealthy:[80,200]}[cls];
  const income=rnd(rg[0],rg[1])*100;
  const spend={Low:[.78,.95],Middle:[.55,.78],Wealthy:[.35,.55]}[cls];
  const expenses=Math.round(income*(spend[0]+Math.random()*(spend[1]-spend[0])));
  const sur=pick(SUR),g=[],jobs=shuf(JOBS[cls]);
  for(let i=0;i<(two?2:1);i++){const sx=Math.random()<.5?'m':'f';g.push({name:pick(FN[sx])+' '+sur,job:jobs[i],trait:pick(TRAITS)})}
  const sibs=[];for(let i=rnd(0,3);i>0;i--)sibs.push({name:pick([...FN.m,...FN.f]),age:rnd(6,24)});
  return{cls,sur,guardians:g,sibs,income,expenses,house:HOUSE[cls],expect:pick(EXPECT),pocket:{Low:20,Middle:50,Wealthy:150}[cls]};
}
function famHTML(){const f=S.fam;
  return `<h3>The ${f.sur} family</h3><table>
  <tr><td>Background</td><td>${f.cls}-income household</td></tr>
  <tr><td>Home</td><td>${f.house}</td></tr><tr><td>Address</td><td>${addr(0,-8)}</td></tr>
  ${f.guardians.map((g,i)=>`<tr><td>Guardian ${i+1}</td><td>${g.name}, ${g.job} (${g.trait})</td></tr>`).join('')}
  <tr><td>Siblings</td><td>${f.sibs.length?f.sibs.map(s=>s.name+' ('+s.age+')').join(', '):'None'}</td></tr>
  <tr><td>Monthly income</td><td>${gbp(f.income)}</td></tr>
  <tr><td>Monthly expenses</td><td>${gbp(f.expenses)}</td></tr>
  <tr><td>Left over</td><td>${gbp(f.income-f.expenses)}</td></tr>
  <tr><td>Expectation</td><td>Family ${f.expect}</td></tr></table>`}


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

/* NOTE: truncated mid-push - full g1 continues in next update */
console.warn('g1 partial');

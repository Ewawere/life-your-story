/* ===== sound (audio.js) — free WebAudio, no files ===== */
let AC=null,amb=null;
function audio(){if(!AC){try{AC=new(window.AudioContext||window.webkitAudioContext)()}catch(e){}}if(AC&&AC.state==='suspended')try{AC.resume()}catch(e){}return AC}
function beep(f,d,t,v){if(!AC||(S&&S.muted))return;try{const o=AC.createOscillator(),g=AC.createGain(),n=AC.currentTime;o.type=t||'sine';o.frequency.value=f;g.gain.value=v||.06;o.connect(g);g.connect(AC.destination);g.gain.setTargetAtTime(0,n+d*.6,d*.15);o.start(n);o.stop(n+d)}catch(e){}}
const SFX={ok:()=>{beep(660,.12);setTimeout(()=>beep(880,.16),110)},bad:()=>beep(180,.25,'square',.04),tap:()=>beep(520,.06),door:()=>{beep(220,.1,'triangle');setTimeout(()=>beep(330,.12,'triangle'),90)},chime:()=>[523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.2),i*110))};
function startAmbient(){if(!AC||amb)return;try{const b=AC.createBuffer(1,AC.sampleRate*2,AC.sampleRate),d=b.getChannelData(0);let l=0;for(let i=0;i<d.length;i++){l=(l+.02*(Math.random()*2-1))/1.02;d[i]=l*3.5}const src=AC.createBufferSource();src.buffer=b;src.loop=true;const g=AC.createGain();g.gain.value=0;src.connect(g);g.connect(AC.destination);src.start();amb=g}catch(e){}}
addEventListener('pointerdown',()=>{audio();startAmbient()},{once:true});

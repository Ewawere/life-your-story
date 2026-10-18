/* ===== needs, mood and life events (needs.js) ===== */
const cl=v=>Math.max(0,Math.min(100,v)),gain=(k,v)=>{S.need[k]=cl(S.need[k]+v)};
const mood=()=>{const N=S.need;return(N.hunger+N.fun+N.social+N.hygiene)/4},ML=m=>m<25?'Miserable':m<45?'Low':m<70?'OK':'Great',mm=()=>{const m=mood();return m<35?.75:m>=70?1.15:1};
const weakest=()=>SUBJ.slice().sort((a,b)=>S.know[a]-S.know[b])[0];
const EVS=[
{t:'Class materials',d:'Your teacher asks for £15 for class materials.',o:[['Pay £15',()=>{if(S.cash<15){gain('social',-5);return 'You cannot afford it, so you ask a parent. It feels awkward.'}S.cash-=15;const b=pick(SUBJ);S.know[b]=Math.min(100,S.know[b]+2);return 'You paid and got the notes. '+b+' +2.'}],['Ask a parent',()=>{gain('social',-5);return 'Your parent helps, but you feel a little awkward.'}]]},
{t:'Power cut',d:'The light is gone and the room is hot and dark.',o:[['Study by candlelight',()=>{const b=weakest();S.know[b]=Math.min(100,S.know[b]+3);S.energy=Math.max(0,S.energy-10);gain('fun',-5);S.t+=60;return 'You squint at your notes. '+b+' +3, energy -10.'}],['Rest until it passes',()=>{S.energy=Math.min(100,S.energy+15);gain('fun',-10);S.t+=60;return 'You rest in the dark. Energy +15.'}]]},
{t:'Football tonight',d:'Jack waves from the fence: "We need one more player tonight!"',o:[['Join them',()=>{gain('fun',30);gain('social',15);S.energy=Math.max(0,S.energy-15);S.t+=90;const r=rel('jack');r.f=Math.min(100,r.f+5);return 'Great game! Fun +30, social +15, Jack friendship +5.'}],['Stay in',()=>'You stay home.']]},
{t:'Family dinner',d:'Your family calls you to eat together.',o:[['Join dinner',()=>{gain('hunger',50);gain('social',15);S.t+=40;return 'A warm meal with your family. Hunger +50, social +15.'}],['Skip it',()=>{gain('social',-5);return 'You skip it. Your family notices.'}]]}];
let curEv=null;
function lifeEvent(){curEv=pick(EVS);SFX.chime();modal(`<h3>${curEv.t}</h3><p>${curEv.d}</p>`+curEv.o.map((o,i)=>`<button class="o" onclick="evPick(${i})">${o[0]}</button>`).join(''))}
function evPick(i){const m=curEv.o[i][1]();S.evT=S.t+rnd(240,480);store();modal(`<h3>${curEv.t}</h3><p>${m}</p>`,true)}

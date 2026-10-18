/* ===== weather, age and skills (life.js) ===== */
let WX=null; // test hook: true/false forces rain, null = natural
const rainyDay=d=>WX!==null?WX:(Math.imul(d+7,2654435761)>>>0)%100<30;
const raining=()=>{const h=hr();return h>=13&&h<19&&rainyDay(day())};
const YEAR=14,age=()=>16+Math.floor(day()/YEAR); // one year = 14 game days
function birthday(){
  const gift={Low:20,Middle:50,Wealthy:150}[S.fam.cls],fr=NP.filter(n=>rel(n.id).f>=40);
  S.cash+=gift;fr.forEach(n=>{const r=rel(n.id);r.f=Math.min(100,r.f+3)});gain('fun',25);gain('social',15);SFX.chime();store();
  modal(`<h3>Happy birthday, ${S.name}!</h3><p>You are now <b>${S.age}</b>.</p><p>Your family bakes a cake and gives you <b>${gbp(gift)}</b>. Fun +25, social +15.</p>`+(fr.length?`<p>${fr.map(n=>n.name).join(', ')} remembered and sent wishes. Friendship +3.</p>`:'<p class="m">No neighbour knows you well enough yet to remember.</p>'),true);
}
function busMenu(){modal(`<h3>Bus stop</h3><p class="m">You are in ${areaOf(P.position.x).n}. Single fare ${gbp(2)}, about 20 minutes.</p>`+DIST.map((d,i)=>d.n===areaOf(P.position.x).n?'':`<button class="o" onclick="ride(${i})">Take the bus to ${d.n}</button>`).join(''),true)}
function ride(i){if(S.cash<2){toast('You need £2 for the fare');SFX.bad();return}S.cash-=2;S.t+=20;const d=DIST[i];P.position.set(d.ox+6,0,-.6);S.area=d.n;closeM();toast('Arrived in '+d.n);SFX.door();store()}
function cook(){
  if(S.cash<2){toast('You need £2 for ingredients');SFX.bad();return}
  S.cash-=2;const c=S.sk.cook,h=30+Math.round(c*.4);gain('hunger',h);gain('fun',5);S.sk.cook=Math.min(100,c+4*(1-c/120));S.t+=30;SFX.ok();toast('You cooked. Hunger +'+h+' · Cooking skill '+Math.round(S.sk.cook));store();
}
function workout(){
  if(S.energy<20){toast('Too tired to exercise');SFX.bad();return}
  const f=S.sk.fit;S.sk.fit=Math.min(100,f+3*(1-f/120));S.energy-=12;gain('hygiene',-10);gain('fun',10);S.t+=40;SFX.ok();toast('Good workout! Fitness '+Math.round(S.sk.fit));store();
}

/* ===== shop, home decoration and wardrobe (economy.js) ===== */
const ITEMS=[['Hot meal',6,()=>{gain('hunger',45);S.t+=15}],['Snack',1.5,()=>{gain('hunger',15);gain('fun',10);S.t+=5}],['Cold drink',2,()=>{gain('fun',15);gain('hunger',5)}]],SHIRT=15;
function shopMenu(){
  const h=hr();if(h<7||h>=21){modal("<h3>Singh's Corner Shop</h3><p>Open every day 07:00–21:00.</p>",true);return}
  modal(`<h3>Singh's Corner Shop</h3><p class="m">${addr(0,15)} · Your cash: ${gbp(S.cash)}</p>`+ITEMS.map((it,i)=>`<button class="o" onclick="buy(${i})">${it[0]} <span class="m">· ${gbp(it[1])}</span></button>`).join('')+
   `<p class="m">Shirts: ${gbp(SHIRT)} each</p>`+COLORS.map(c=>`<button class="o" style="border-left:16px solid ${c}" onclick="shirt('${c}')">${S.shirts.includes(c)?(S.color===c?'Wearing now':'Wear this'):'Buy shirt'}</button>`).join(''),true);
}
function buy(i){const it=ITEMS[i];if(S.cash<it[1]){toast('Not enough cash');SFX.bad();return}S.cash-=it[1];it[2]();SFX.ok();store();toast(it[0]+' bought');shopMenu()}
function shirt(c){if(!S.shirts.includes(c)){if(S.cash<SHIRT){toast('Not enough cash');SFX.bad();return}S.cash-=SHIRT;S.shirts.push(c)}S.color=c;buildPlayer();SFX.ok();store();shopMenu()}
const DECO={plant:['Potted plant',12,1],rug:['Rug',30,1],lamp:['Floor lamp',20,1],poster:['Wall poster',8,1],armchair:['Armchair',45,2],bookshelf:['Bookshelf',35,1],fishtank:['Fish tank',40,2],wallart:['Framed art',14,1],speaker:['Speaker',25,1],mirror:['Mirror',16,1]};
const WALLS=['#f3ead7','#cfe3c8','#cfe3f2','#f4d6d6','#b9c6d6'],FLOORS=['#d8b98a','#7a5a3a','#b8bcc2'];
const comfort=()=>Math.min(6,(S.deco||[]).reduce((a,k)=>a+(DECO[k]?DECO[k][2]:1),0));
function decoMenu(){const sp=(k,L)=>`<div>${L.map(c=>`<span class="sw${S.paint[k]===c?' on':''}" style="background:${c}" onclick="paint('${k}','${c}')"></span>`).join('')}</div>`;
  modal(`<h3>Decorate your home</h3><p class="m">Cash ${gbp(S.cash)} · Comfort ${comfort()}/6. Comfort slows how fast fun drops. Selling refunds half.</p>`+Object.keys(DECO).map(k=>{const o=S.deco.includes(k);return `<button class="o" onclick="${o?'sellDeco':'buyDeco'}('${k}')">${DECO[k][0]} <span class="m">· ${o?'owned · Sell for '+gbp(DECO[k][1]/2):gbp(DECO[k][1])}</span></button>`}).join('')+`<p class="m">Wall colour (${gbp(15)})</p>${sp('wall',WALLS)}<p class="m">Floor (${gbp(15)})</p>${sp('floor',FLOORS)}`,true)}
function buyDeco(k){if(S.cash<DECO[k][1]){toast('Not enough cash');SFX.bad();return}S.cash-=DECO[k][1];S.deco.push(k);renderDeco();SFX.ok();store();decoMenu()}
function sellDeco(k){S.deco=S.deco.filter(x=>x!==k);S.cash+=DECO[k][1]/2;renderDeco();SFX.tap();store();decoMenu()}
function paint(k,c){if(S.paint[k]===c)return;if(S.cash<15){toast('Not enough cash');SFX.bad();return}S.cash-=15;S.paint[k]=c;renderDeco();SFX.ok();store();decoMenu()}
let decoG=null;
function renderDeco(){if(decoG)INN.remove(decoG);decoG=new THREE.Group();INN.add(decoG);const D=S.deco||[],L=c=>new THREE.MeshLambertMaterial({color:c});
  if(S.paint){HFL.material.color.set(S.paint.floor);HW.forEach(w=>w.material.color.set(S.paint.wall))}
  if(D.includes('rug'))box(decoG,4,.04,3,0x4a6fa5,0,.07,.4);
  if(D.includes('plant')){cyl(decoG,.3,.25,.5,0x9c5a2a,-4.4,.25,-1.5);const l=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),L(0x2f8f3e));l.position.set(-4.4,.9,-1.5);decoG.add(l)}
  if(D.includes('lamp')){cyl(decoG,.05,.05,1.8,0x333333,4.4,.9,3.2);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,.3,8),L(0xfff3c4));sh.position.set(4.4,1.9,3.2);decoG.add(sh)}
  if(D.includes('poster'))box(decoG,1.6,1.2,.05,0x1d7874,-4.7,2.2,-2.5);
  if(D.includes('armchair')){box(decoG,1.2,.5,1.2,0x8b4513,3.5,.3,2.5);box(decoG,1.2,.8,.3,0x8b4513,3.5,.9,3.1)}
  if(D.includes('bookshelf')){box(decoG,1.4,2.2,.4,0x5c3a21,-4.5,1.1,1.5);box(decoG,1.2,.05,.35,0x8b5a2b,-4.5,.6,1.5);box(decoG,1.2,.05,.35,0x8b5a2b,-4.5,1.2,1.5);box(decoG,1.2,.05,.35,0x8b5a2b,-4.5,1.8,1.5)}
  if(D.includes('fishtank')){box(decoG,1.2,.8,.5,0x88ccee,4.2,.5,-1.5);box(decoG,1.1,.05,.4,0x2266aa,4.2,.15,-1.5)}
  if(D.includes('wallart'))box(decoG,1.4,1,.05,0xc9a46c,4.7,2.2,-3);
  if(D.includes('speaker')){box(decoG,.4,.6,.3,0x222222,-4.5,.4,3.5);box(decoG,.3,.3,.2,0x444444,-4.5,.9,3.5)}
  if(D.includes('mirror'))box(decoG,.8,1.2,.05,0xaaccff,4.7,2.2,1.5);
}

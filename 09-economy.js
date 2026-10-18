/* ===== shop, home decoration and wardrobe (economy.js) ===== */
const ITEMS=[['Hot meal',6,()=>{gain('hunger',45);S.t+=15}],['Snack',1.5,()=>{gain('hunger',15);gain('fun',10);S.t+=5}],['Cold drink',2,()=>{gain('fun',15);gain('hunger',5)}]],SHIRT=15;
function shopMenu(){
  const h=hr();if(h<7||h>=21){modal("<h3>Singh's Corner Shop</h3><p>Open every day 07:00–21:00.</p>",true);return}
  modal(`<h3>Singh's Corner Shop</h3><p class="m">Your cash: ${gbp(S.cash)}</p>`+ITEMS.map((it,i)=>`<button class="o" onclick="buy(${i})">${it[0]} <span class="m">· ${gbp(it[1])}</span></button>`).join('')+
   `<p class="m">Shirts: ${gbp(SHIRT)} each</p>`+COLORS.map(c=>`<button class="o" style="border-left:16px solid ${c}" onclick="shirt('${c}')">${S.shirts.includes(c)?(S.color===c?'Wearing now':'Wear this'):'Buy shirt'}</button>`).join(''),true);
}
function buy(i){const it=ITEMS[i];if(S.cash<it[1]){toast('Not enough cash');SFX.bad();return}S.cash-=it[1];it[2]();SFX.ok();store();toast(it[0]+' bought');shopMenu()}
function shirt(c){if(!S.shirts.includes(c)){if(S.cash<SHIRT){toast('Not enough cash');SFX.bad();return}S.cash-=SHIRT;S.shirts.push(c)}S.color=c;buildPlayer();SFX.ok();store();shopMenu()}
const DECO={plant:['Potted plant',12],rug:['Rug',30],lamp:['Floor lamp',20],poster:['Wall poster',8]};
function decoMenu(){modal(`<h3>Decorate your home</h3><p class="m">Cash ${gbp(S.cash)} · Comfort ${S.deco.length}/4. Each item slows how fast your fun drops.</p>`+Object.keys(DECO).map(k=>{const o=S.deco.includes(k);return `<button class="o" ${o?'disabled style="opacity:.5"':''} onclick="buyDeco('${k}')">${DECO[k][0]} <span class="m">· ${o?'owned':gbp(DECO[k][1])}</span></button>`}).join(''),true)}
function buyDeco(k){if(S.cash<DECO[k][1]){toast('Not enough cash');SFX.bad();return}S.cash-=DECO[k][1];S.deco.push(k);renderDeco();SFX.ok();store();decoMenu()}
let decoG=null;
function renderDeco(){if(decoG)INN.remove(decoG);decoG=new THREE.Group();INN.add(decoG);const D=S.deco||[];
  if(D.includes('rug'))box(decoG,4,.04,3,0x4a6fa5,0,.07,.4);
  if(D.includes('plant')){cyl(decoG,.3,.25,.5,0x9c5a2a,-4.4,.25,-1.5);const l=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),new THREE.MeshLambertMaterial({color:0x2f8f3e}));l.position.set(-4.4,.9,-1.5);decoG.add(l)}
  if(D.includes('lamp')){cyl(decoG,.05,.05,1.8,0x333333,4.4,.9,3.7,6);const l=new THREE.Mesh(new THREE.SphereGeometry(.35,8,6),new THREE.MeshBasicMaterial({color:0xfff0b0}));l.position.set(4.4,2,3.7);decoG.add(l)}
  if(D.includes('poster'))box(decoG,1.6,1.2,.05,0xe76f51,0,2.5,-4.85)}

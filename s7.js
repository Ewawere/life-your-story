/* ===== shop, home decoration and wardrobe (economy.js) ===== */
const GROC=[['Eggs',2,'eggs'],['Bread',1.5,'bread'],['Rice',2.5,'rice'],['Vegetables',2,'veg'],['Chicken',4,'chicken'],['Pasta',2,'pasta'],['Milk',1.5,'milk'],['Fruit',2,'fruit']];
const ITEMS=[['Snack',1.5,()=>{gain('hunger',15);gain('fun',10);S.t+=5}],['Cold drink',2,()=>{gain('fun',15);gain('hunger',5)}]],SHIRT=15;
function shopMenu(){
  const h=hr();if(h<7||h>=21){modal("<h3>Singh's Corner Shop</h3><p>Open every day 07:00–21:00.</p>",true);return}
  S.food=S.food||{};
  const stock=Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+': '+S.food[k]).join(', ')||'empty';
  let html='<h3>Singh\'s Corner Shop</h3><p class="m">'+addr(0,15)+' · Cash: '+gbp(S.cash)+'<br>Your fridge: '+stock+'</p><p class="m"><b>Groceries</b> (cook at home)</p>';
  GROC.forEach((g,i)=>{html+='<button class="o" onclick="buyGroc('+i+')">'+g[0]+' <span class="m">· '+gbp(g[1])+'</span></button>'});
  html+='<p class="m"><b>Ready to eat</b></p>';
  ITEMS.forEach((it,i)=>{html+='<button class="o" onclick="buy('+i+')">'+it[0]+' <span class="m">· '+gbp(it[1])+'</span></button>'});
  html+='<p class="m">Shirts: '+gbp(SHIRT)+' each</p>';
  COLORS.forEach(c=>{html+='<button class="o" style="border-left:16px solid '+c+'" onclick="shirt(\''+c+'\')">'+(S.shirts.includes(c)?(S.color===c?'Wearing now':'Wear this'):'Buy shirt')+'</button>'});
  modal(html,true);
}
function buyGroc(i){const g=GROC[i];if(S.cash<g[1]){toast('Not enough cash');SFX.bad();return}S.cash-=g[1];S.food=S.food||{};S.food[g[2]]=(S.food[g[2]]||0)+1;SFX.ok();store();toast(g[0]+' added to fridge');shopMenu()}
function buy(i){const it=ITEMS[i];if(S.cash<it[1]){toast('Not enough cash');SFX.bad();return}S.cash-=it[1];it[2]();SFX.ok();store();toast(it[0]+' bought');shopMenu()}
function shirt(c){if(!S.shirts.includes(c)){if(S.cash<SHIRT){toast('Not enough cash');SFX.bad();return}S.cash-=SHIRT;S.shirts.push(c)}S.color=c;buildPlayer();SFX.ok();store();shopMenu()}

const DECO={plant:['Potted plant',12,1],rug:['Rug',30,1],lamp:['Floor lamp',20,1],poster:['Wall poster',8,1],armchair:['Armchair',45,2],bookshelf:['Bookshelf',35,1],fishtank:['Fish tank',40,2],wallart:['Framed art',14,1],speaker:['Speaker',25,1],mirror:['Mirror',16,1]};
const WALLS=['#f3ead7','#cfe3c8','#cfe3f2','#f4d6d6','#b9c6d6'],FLOORS=['#d8b98a','#7a5a3a','#b8bcc2'];
const comfort=()=>Math.min(6,(S.deco||[]).reduce((a,k)=>a+(DECO[k]?DECO[k][2]:1),0));
function decoMenu(){const sp=(k,L)=>'<div>'+L.map(c=>'<span class="sw'+(S.paint[k]===c?' on':'')+'" style="background:'+c+'" onclick="paint(\''+k+'\',\''+c+'\')"></span>').join('')+'</div>';
  modal('<h3>Decorate your home</h3><p class="m">Cash '+gbp(S.cash)+' · Comfort '+comfort()+'/6</p>'+Object.keys(DECO).map(k=>{const o=S.deco.includes(k);return '<button class="o" onclick="'+(o?'sellDeco':'buyDeco')+'(\''+k+'\')">'+DECO[k][0]+' <span class="m">· '+(o?'owned · Sell '+gbp(DECO[k][1]/2):gbp(DECO[k][1]))+'</span></button>'}).join('')+'<p class="m">Wall ('+gbp(15)+')</p>'+sp('wall',WALLS)+'<p class="m">Floor ('+gbp(15)+')</p>'+sp('floor',FLOORS),true)}
function buyDeco(k){if(S.cash<DECO[k][1]){toast('Not enough cash');SFX.bad();return}S.cash-=DECO[k][1];S.deco.push(k);renderDeco();SFX.ok();store();decoMenu()}
function sellDeco(k){S.deco=S.deco.filter(x=>x!==k);S.cash+=DECO[k][1]/2;renderDeco();SFX.tap();store();decoMenu()}
function paint(k,c){if(S.paint[k]===c)return;if(S.cash<15){toast('Not enough cash');SFX.bad();return}S.cash-=15;S.paint[k]=c;renderDeco();SFX.ok();store();decoMenu()}
let decoG=null;
/* FIX: wall pieces are thin along x (they sit flat on the side walls) and furniture is placed clear of the fridge, sofa, bed, desk and shower */
function renderDeco(){if(decoG)INN.remove(decoG);decoG=new THREE.Group();INN.add(decoG);const D=S.deco||[],L=c=>new THREE.MeshLambertMaterial({color:c});
  if(S.paint){HFL.material.color.set(S.paint.floor);HW.forEach(w=>w.material.color.set(S.paint.wall))}
  if(D.includes('rug'))box(decoG,4,.04,3,0x4a6fa5,0,.07,.4);
  if(D.includes('plant')){cyl(decoG,.3,.25,.5,0x9c5a2a,-4.4,.25,-1.5);const l=new THREE.Mesh(new THREE.SphereGeometry(.5,8,6),L(0x2f8f3e));l.position.set(-4.4,.9,-1.5);decoG.add(l)}
  if(D.includes('lamp')){cyl(decoG,.05,.05,1.8,0x333333,4.4,.9,3.7);const sh=new THREE.Mesh(new THREE.CylinderGeometry(.35,.4,.3,8),L(0xfff3c4));sh.position.set(4.4,1.9,3.7);decoG.add(sh)}
  if(D.includes('poster'))box(decoG,1.6,1.2,.05,0x1d7874,0,2.5,-4.85);
  if(D.includes('armchair')){box(decoG,1.3,.8,1.2,0x8e5cd9,2.6,.4,3.3);box(decoG,1.3,.9,.3,0x7a4cc0,2.6,.9,3.8)}
  if(D.includes('bookshelf')){box(decoG,.35,2.4,1.8,0x7a4a2a,-4.8,1.2,-2.6);box(decoG,.2,.35,1.5,0xe76f51,-4.65,1.6,-2.6)}
  if(D.includes('fishtank')){box(decoG,1,.7,.6,0x6b4226,1.4,.35,-4.6);box(decoG,.9,.5,.5,0x88ccee,1.4,.95,-4.6)}
  if(D.includes('wallart'))box(decoG,.06,1,1.4,0xc9a46c,-4.9,2.5,-.2);
  if(D.includes('speaker')){box(decoG,.5,1,.5,0x222222,-4.5,.5,2.9);box(decoG,.3,.3,.2,0x444444,-4.5,1.15,2.9)}
  if(D.includes('mirror'))box(decoG,.06,1.6,.9,0xaaccff,4.9,2.3,1.5);
}


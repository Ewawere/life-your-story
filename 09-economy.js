/* ===== shop, home decoration and wardrobe (economy.js) ===== */
const GROC=[['Eggs',2,'eggs'],['Bread',1.5,'bread'],['Rice',2.5,'rice'],['Vegetables',2,'veg'],['Chicken',4,'chicken'],['Pasta',2,'pasta'],['Milk',1.5,'milk'],['Fruit',2,'fruit']];
const ITEMS=[['Snack',1.5,()=>{gain('hunger',15);gain('fun',10);S.t+=5}],['Cold drink',2,()=>{gain('fun',15);gain('hunger',5)}]],SHIRT=15;
function shopMenu(){
  const h=hr();if(h<7||h>=21){modal("<h3>Singh's Corner Shop</h3><p>Open every day 07:00–21:00.</p>",true);return}
  S.food=S.food||{};
  const stock=Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+': '+S.food[k]).join(', ')||'empty';
  let html='<h3>Singh\'s Corner Shop</h3><p class="m">'+addr(0,15)+' · Cash: '+gbp(S.cash)+'<br>Your fridge: '+stock+'</p>';
  html+='<p class="m"><b>Groceries</b> (cook at home)</p>';
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
// ===== Player work jobs, chores, betting (phone) =====
const WORK_JOBS=[
  {id:'shop',name:'Shop assistant',pay:12,mins:8,energy:12,hours:[15,20],desc:'Stack shelves at Singh\'s.'},
  {id:'deliver',name:'Food delivery',pay:15,mins:10,energy:18,hours:[16,21],desc:'Deliver meals around town.'},
  {id:'tutor',name:'Tutor a neighbour kid',pay:18,mins:12,energy:10,hours:[16,19],needFriend:30,desc:'Help with homework. Need a friend.'},
  {id:'carwash',name:'Car wash',pay:10,mins:6,energy:14,hours:[10,18],desc:'Wash cars near the bus stop.'}
];
function jobsMenu(){
  const h=hr();
  S.jobDay=S.jobDay||{};
  let html='<h3>Jobs</h3><p class="m">Cash '+gbp(S.cash)+' · Energy '+Math.round(S.energy)+'</p>';
  WORK_JOBS.forEach((j,i)=>{
    const done=S.jobDay[j.id]===day();
    const open=h>=j.hours[0]&&h<j.hours[1];
    let lock='';
    if(done)lock=' (done today)';
    else if(!open)lock=' (open '+j.hours[0]+':00–'+j.hours[1]+':00)';
    else if(j.needFriend&&!NP.some(n=>rel(n.id).f>=j.needFriend))lock=' (need a friend first)';
    const ok=!done&&open&&!(j.needFriend&&!NP.some(n=>rel(n.id).f>=j.needFriend));
    html+='<button class="o" onclick="startJob('+i+')" '+(ok?'':'style="opacity:.45"')+'><b>'+j.name+'</b> · '+gbp(j.pay)+'<br><span class="m">'+j.desc+lock+'</span></button>';
  });
  html+='<button class="o" onclick="phone()">Back</button>';
  modal(html,true);
}
function startJob(i){
  const j=WORK_JOBS[i];const h=hr();
  S.jobDay=S.jobDay||{};
  if(S.jobDay[j.id]===day()){toast('Already did that today');SFX.bad();return}
  if(h<j.hours[0]||h>=j.hours[1]){toast('Not available now');SFX.bad();return}
  if(j.needFriend&&!NP.some(n=>rel(n.id).f>=j.needFriend)){toast('Need a friend first');SFX.bad();return}
  if(S.energy<j.energy){toast('Too tired');SFX.bad();return}
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  closeM();
  ACT={icon:'£',label:j.name,endMs:performance.now()+j.mins*1000,done:()=>{
    S.cash+=j.pay;S.energy=Math.max(0,S.energy-j.energy);S.t+=j.mins*2;S.jobDay[j.id]=day();
    gain('social',j.id==='tutor'?6:2);
    toast(j.name+': earned '+gbp(j.pay));SFX.chime();store();
  }};
  toast('Working: '+j.name+'...');updateActUI();
}
function choresMenu(){
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  S.choreDay=S.choreDay||{};
  const list=[{id:'dishes',name:'Wash the dishes',pay:3,s:4,energy:4},{id:'trash',name:'Take out the bins',pay:2,s:3,energy:5},{id:'vacuum',name:'Vacuum the lounge',pay:4,s:5,energy:8},{id:'laundry',name:'Do the laundry',pay:5,s:6,energy:7}];
  let html='<h3>Chores</h3><p class="m">Mum pays a little for help around the house.</p>';
  list.forEach((c,i)=>{const done=S.choreDay[c.id]===day();html+='<button class="o" onclick="doChore('+i+')" '+(done?'style="opacity:.45"':'')+'>'+c.name+' · '+gbp(c.pay)+(done?' (done)':'')+'</button>'});
  html+='<button class="o" onclick="closeM()">Close</button>';
  modal(html,true);
}
function doChore(i){
  const list=[{id:'dishes',name:'Wash the dishes',pay:3,s:4,energy:4},{id:'trash',name:'Take out the bins',pay:2,s:3,energy:5},{id:'vacuum',name:'Vacuum the lounge',pay:4,s:5,energy:8},{id:'laundry',name:'Do the laundry',pay:5,s:6,energy:7}];
  const c=list[i];S.choreDay=S.choreDay||{};
  if(S.choreDay[c.id]===day()){toast('Already done today');SFX.bad();return}
  if(S.energy<c.energy){toast('Too tired');SFX.bad();return}
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  closeM();
  ACT={icon:'Home',label:c.name,endMs:performance.now()+c.s*1000,done:()=>{
    S.cash+=c.pay;S.energy=Math.max(0,S.energy-c.energy);S.t+=c.s;S.choreDay[c.id]=day();
    toast(c.name+' done. Mum gave you '+gbp(c.pay));SFX.ok();store();
  }};
  toast(c.name+'...');updateActUI();
}
function betMenu(){
  modal('<h3>Betting</h3><p class="m">Cash '+gbp(S.cash)+'. For fun — the house has a small edge.</p>'+
    '<button class="o" onclick="betCoinMenu()">Coin flip (x1.9)</button>'+
    '<button class="o" onclick="betNumMenu()">Pick a number 1–5 (x4)</button>'+
    '<button class="o" onclick="betMatchMenu()">Street match bet (x2.2)</button>'+
    '<button class="o" onclick="phone()">Back</button>',true);
}
function betCoinMenu(){
  modal('<h3>Coin flip</h3><p class="m">Stake:</p>'+
    [2,5,10,20].map(a=>'<button class="o" onclick="betCoin('+a+',1)">Heads · '+gbp(a)+'</button><button class="o" onclick="betCoin('+a+',0)">Tails · '+gbp(a)+'</button>').join('')+
    '<button class="o" onclick="betMenu()">Back</button>',true);
}
function betCoin(amt,pick){
  if(S.cash<amt){toast('Not enough cash');SFX.bad();return}
  S.cash-=amt;
  const flip=Math.random()<0.5?1:0;
  if(flip===pick){const winAmt=Math.round(amt*1.9*100)/100;S.cash+=winAmt;toast('It was '+(flip?'Heads':'Tails')+'! You win '+gbp(winAmt));SFX.chime()}
  else{toast('It was '+(flip?'Heads':'Tails')+'. You lost '+gbp(amt));SFX.bad()}
  S.t+=1;store();betCoinMenu();
}
function betNumMenu(){
  modal('<h3>Pick 1–5</h3><p class="m">Win pays x4. Stake '+gbp(5)+'.</p>'+
    [1,2,3,4,5].map(n=>'<button class="o" onclick="betNum('+n+')">'+n+'</button>').join('')+
    '<button class="o" onclick="betMenu()">Back</button>',true);
}
function betNum(n){
  const amt=5;if(S.cash<amt){toast('Not enough cash');SFX.bad();return}
  S.cash-=amt;const r=1+Math.floor(Math.random()*5);
  if(r===n){S.cash+=20;toast('It was '+r+'! You win '+gbp(20));SFX.chime()}
  else{toast('It was '+r+'. Lost '+gbp(amt));SFX.bad()}
  S.t+=1;store();betNumMenu();
}
function betMatchMenu(){
  modal('<h3>Street match</h3><p class="m">Maple FC vs Riverside. Stake '+gbp(8)+'. Win pays x2.2</p>'+
    '<button class="o" onclick="betMatch(0)">Maple FC win</button>'+
    '<button class="o" onclick="betMatch(1)">Draw</button>'+
    '<button class="o" onclick="betMatch(2)">Riverside win</button>'+
    '<button class="o" onclick="betMenu()">Back</button>',true);
}
function betMatch(pick){
  const amt=8;if(S.cash<amt){toast('Not enough cash');SFX.bad();return}
  S.cash-=amt;
  const roll=Math.random();const res=roll<0.4?0:roll<0.65?1:2;
  const names=['Maple FC win','Draw','Riverside win'];
  if(res===pick){const w=Math.round(amt*2.2*100)/100;S.cash+=w;toast(names[res]+'! You win '+gbp(w));SFX.chime()}
  else{toast('Result: '+names[res]+'. Lost '+gbp(amt));SFX.bad()}
  S.t+=2;store();betMatchMenu();
}

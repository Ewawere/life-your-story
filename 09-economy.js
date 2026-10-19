/* ===== shop, home decoration and wardrobe (economy.js) ===== */
const GROC=[['Eggs',2,'eggs','🥚'],['Bread',1.5,'bread','🍞'],['Rice',2.5,'rice','🍚'],['Vegetables',2,'veg','🥦'],['Chicken',4,'chicken','🍗'],['Pasta',2,'pasta','🍝'],['Milk',1.5,'milk','🥛'],['Fruit',2,'fruit','🍎']];
const ITEMS=[['Snack',1.5,()=>{gain('hunger',15);gain('fun',10);S.t+=5},'🍪'],['Cold drink',2,()=>{gain('fun',15);gain('hunger',5)},'🥤']],SHIRT=15;
const VEHICLES=[
  {id:'bike',name:'Bicycle',price:40,desc:'Parked by your door.',img:'🚲'},
  {id:'car',name:'Used car',price:220,desc:'On the street outside home.',img:'🚗'},
  {id:'plane',name:'Light plane',price:900,desc:'On the riverside field.',img:'✈️'}
];
function picBox(inner,bg){return '<div style="width:72px;height:72px;border-radius:14px;background:'+(bg||'#0e2230')+';display:flex;align-items:center;justify-content:center;font-size:40px;flex:none;border:1px solid #ffffff22">'+inner+'</div>'}
function shirtPic(c){return '<div style="width:72px;height:72px;border-radius:14px;background:#0e2230;display:flex;align-items:center;justify-content:center;flex:none;border:1px solid #ffffff22"><div style="width:44px;height:36px;background:'+c+';border-radius:6px 6px 8px 8px;position:relative;box-shadow:0 2px 0 #0003"><div style="position:absolute;left:-10px;top:0;width:12px;height:16px;background:'+c+';border-radius:6px 0 0 8px"></div><div style="position:absolute;right:-10px;top:0;width:12px;height:16px;background:'+c+';border-radius:0 6px 8px 0"></div><div style="position:absolute;left:12px;top:-6px;width:20px;height:10px;background:'+c+';border-radius:8px 8px 0 0"></div></div></div>'}
function shopMenu(){
  const h=hr();if(h<7||h>=21){modal("<h3>Singh's Corner Shop</h3><p>Open every day 07:00–21:00.</p>",true);return}
  S.food=S.food||{};S.shirts=S.shirts||[];S.vehicles=S.vehicles||[];
  const stock=Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+': '+S.food[k]).join(', ')||'empty';
  let html='<h3>Singh\'s Corner Shop</h3><p class="m">'+addr(0,15)+' · Cash: '+gbp(S.cash)+'<br>Fridge: '+stock+'</p>';
  html+='<p class="m"><b>Groceries</b></p>';
  GROC.forEach((g,i)=>{
    html+='<button class="o" onclick="buyGroc('+i+')" style="display:flex;align-items:center;gap:12px;text-align:left">'+picBox(g[3])+'<div><b>'+g[0]+'</b><br><span class="m">'+gbp(g[1])+' · for cooking</span></div></button>';
  });
  html+='<p class="m"><b>Ready to eat</b></p>';
  ITEMS.forEach((it,i)=>{
    html+='<button class="o" onclick="buy('+i+')" style="display:flex;align-items:center;gap:12px;text-align:left">'+picBox(it[3])+'<div><b>'+it[0]+'</b><br><span class="m">'+gbp(it[1])+'</span></div></button>';
  });
  html+='<p class="m"><b>Shirts</b> · '+gbp(SHIRT)+' — shown on your character</p>';
  COLORS.forEach(c=>{
    const owned=S.shirts.includes(c), on=S.color===c;
    const label=on?'Wearing now':owned?'Wear this':('Buy · '+gbp(SHIRT));
    html+='<button class="o" onclick="shirt(\''+c+'\')" style="display:flex;align-items:center;gap:12px;text-align:left;border-color:'+(on?'#fff':owned?'#5fd08a':'#ffffff2a')+'">'+shirtPic(c)+'<div><b>T-shirt</b><br><span class="m">'+label+'</span></div></button>';
  });
  html+='<p class="m"><b>Vehicles</b> — appear outside when owned</p>';
  VEHICLES.forEach((v,i)=>{
    const owned=S.vehicles.includes(v.id);
    html+='<button class="o" onclick="buyVehicle('+i+')" style="display:flex;align-items:center;gap:12px;text-align:left">'+picBox(v.img)+'<div><b>'+v.name+'</b><br><span class="m">'+(owned?'Owned — look outside home':gbp(v.price)+' · '+v.desc)+'</span></div></button>';
  });
  modal(html,true);
}
function buyVehicle(i){
  const v=VEHICLES[i];S.vehicles=S.vehicles||[];
  if(S.vehicles.includes(v.id)){toast('You already own this — look outside your home');return}
  if(S.cash<v.price){toast('Not enough cash');SFX.bad();return}
  S.cash-=v.price;S.vehicles.push(v.id);renderVehicles();SFX.chime();store();
  toast('Bought '+v.name+'! Step outside to see it.');shopMenu();
}
let vehG=null;
function renderVehicles(){
  if(typeof OUT==='undefined')return;
  if(vehG){OUT.remove(vehG);vehG=null}
  vehG=new THREE.Group();OUT.add(vehG);
  const own=S.vehicles||[];
  if(own.includes('bike')){
    box(vehG,.08,.08,1.1,0x222222,-2.2,.45,-3.2);box(vehG,.08,.08,1.1,0x222222,-1.5,.45,-3.2);
    const w1=new THREE.Mesh(new THREE.TorusGeometry(.35,.04,8,16),new THREE.MeshLambertMaterial({color:0x111111}));w1.position.set(-2.2,.35,-3.2);w1.rotation.y=Math.PI/2;vehG.add(w1);
    const w2=w1.clone();w2.position.x=-1.5;vehG.add(w2);
    box(vehG,1.1,.08,.08,0x3a86ff,-1.85,.7,-3.2);
  }
  if(own.includes('car')){
    box(vehG,3.2,.7,1.6,0x2a6f97,-6,.55,1.2);box(vehG,1.8,.55,1.5,0x1a4a66,-5.6,1.15,1.2);
    [[-7,-.2],[-7,.2],[-5,-.2],[-5,.2]].forEach(([x,z])=>{
      const w=new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.2,10),new THREE.MeshLambertMaterial({color:0x111}));w.rotation.z=Math.PI/2;w.position.set(x,.28,1.2+z);vehG.add(w);
    });
  }
  if(own.includes('plane')){
    box(vehG,4,.5,1.2,0xf0f0f0,90,.5,-26);box(vehG,1.2,.4,3.5,0xd1332b,90,.7,-26);
    box(vehG,.3,1.2,.8,0x333,92,.9,-26);box(vehG,1.5,.15,.4,0x333,88,.9,-26);
  }
}
function buyGroc(i){const g=GROC[i];if(S.cash<g[1]){toast('Not enough cash');SFX.bad();return}S.cash-=g[1];S.food=S.food||{};S.food[g[2]]=(S.food[g[2]]||0)+1;SFX.ok();store();toast(g[0]+' added to fridge');shopMenu()}
function buy(i){const it=ITEMS[i];if(S.cash<it[1]){toast('Not enough cash');SFX.bad();return}S.cash-=it[1];it[2]();SFX.ok();store();toast(it[0]+' bought');shopMenu()}
function shirt(c){if(!S.shirts.includes(c)){if(S.cash<SHIRT){toast('Not enough cash');SFX.bad();return}S.cash-=SHIRT;S.shirts.push(c)}S.color=c;buildPlayer();SFX.ok();store();toast('Wearing new shirt');shopMenu()}
const DECO={plant:['Potted plant',12,1],rug:['Rug',30,1],lamp:['Floor lamp',20,1],poster:['Wall poster',8,1],armchair:['Armchair',45,2],bookshelf:['Bookshelf',35,1],fishtank:['Fish tank',40,2],wallart:['Framed art',14,1],speaker:['Speaker',25,1],mirror:['Mirror',16,1]};
const WALLS=['#f3ead7','#cfe3c8','#cfe3f2','#f4d6d6','#b9c6d6'],FLOORS=['#d8b98a','#7a5a3a','#b8bcc2'];
const comfort=()=>Math.min(6,(S.deco||[]).reduce((a,k)=>a+(DECO[k]?DECO[k][2]:1),0));
function decoMenu(){const sp=(k,L)=>'<div>'+L.map(c=>'<span class="sw'+(S.paint[k]===c?' on':'')+'" style="background:'+c+'" onclick="paint(\''+k+'\',\''+c+'\')"></span>').join('')+'</div>';
  const I={plant:'🪴',rug:'🟫',lamp:'💡',poster:'🖼️',armchair:'🪑',bookshelf:'📚',fishtank:'🐠',wallart:'🎨',speaker:'🔊',mirror:'🪞'};
  let html='<h3>Decorate your home</h3><p class="m">Cash '+gbp(S.cash)+' · Comfort '+comfort()+'/6 — items appear in your house</p>';
  Object.keys(DECO).forEach(k=>{
    const o=S.deco.includes(k), d=DECO[k];
    html+='<button class="o" onclick="'+(o?'sellDeco':'buyDeco')+'(\''+k+'\')" style="display:flex;align-items:center;gap:12px;text-align:left">'+picBox(I[k]||'🏠')+'<div><b>'+d[0]+'</b><br><span class="m">'+(o?'Owned · Sell '+gbp(d[1]/2):gbp(d[1]))+'</span></div></button>';
  });
  html+='<p class="m">Wall ('+gbp(15)+')</p>'+sp('wall',WALLS)+'<p class="m">Floor ('+gbp(15)+')</p>'+sp('floor',FLOORS);
  modal(html,true);
}
function buyDeco(k){if(S.cash<DECO[k][1]){toast('Not enough cash');SFX.bad();return}S.cash-=DECO[k][1];S.deco.push(k);renderDeco();SFX.ok();store();toast(DECO[k][0]+' placed in your home');decoMenu()}
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
const WORK_JOBS=[
  {id:'shop',name:'Shop assistant',pay:6,mins:12,energy:22,hours:[16,19],mind:12,desc:'Stack shelves. Needs Mind 12 (study to level up).'},
  {id:'deliver',name:'Food delivery',pay:8,mins:14,energy:28,hours:[17,20],fit:18,desc:'Bike deliveries. Needs Fitness 18 (workout).'},
  {id:'tutor',name:'Tutor a neighbour kid',pay:10,mins:15,energy:16,hours:[17,19],mind:28,needFriend:40,desc:'Teach homework. Mind 28 + a friend (40+).'},
  {id:'carwash',name:'Car wash',pay:5,mins:10,energy:24,hours:[11,15],fit:10,desc:'Physical work. Needs Fitness 10.'}
];
function mindSkill(){S.sk=S.sk||{cook:0,fit:0,mind:0};const k=S.know||{};const avg=((k.Maths||0)+(k.English||0)+(k.Science||0))/3;return Math.min(100,Math.round((S.sk.mind||0)*0.7+avg*0.3))}
function fitSkill(){S.sk=S.sk||{cook:0,fit:0,mind:0};return Math.round(S.sk.fit||0)}
function jobsMenu(){
  const h=hr();
  S.jobDay=S.jobDay||{};
  let html='<h3>Jobs</h3><p class="m">Cash '+gbp(S.cash)+' · Energy '+Math.round(S.energy)+'<br>Mind '+mindSkill()+' · Fitness '+fitSkill()+' · One job per day.</p>';
  WORK_JOBS.forEach((j,i)=>{
    const done=S.jobDay[j.id]===day()||S.jobDay._any===day();
    const open=h>=j.hours[0]&&h<j.hours[1];
    const mindOk=!j.mind||mindSkill()>=j.mind;
    const fitOk=!j.fit||fitSkill()>=j.fit;
    const frOk=!j.needFriend||NP.some(n=>rel(n.id).f>=j.needFriend);
    let lock='';
    if(S.jobDay._any===day())lock=' (already worked today)';
    else if(done)lock=' (done today)';
    else if(!open)lock=' (open '+j.hours[0]+':00–'+j.hours[1]+':00)';
    else if(!mindOk)lock=' (Mind '+mindSkill()+'/'+j.mind+' — study more)';
    else if(!fitOk)lock=' (Fitness '+fitSkill()+'/'+j.fit+' — work out)';
    else if(!frOk)lock=' (need a friend first)';
    const ok=!done&&open&&mindOk&&fitOk&&frOk;
    html+='<button class="o" onclick="startJob('+i+')" '+(ok?'':'style="opacity:.45"')+'><b>'+j.name+'</b> · '+gbp(j.pay)+'<br><span class="m">'+j.desc+lock+'</span></button>';
  });
  html+='<button class="o" onclick="phone()">Back</button>';
  modal(html,true);
}
function startJob(i){
  const j=WORK_JOBS[i];const h=hr();
  S.jobDay=S.jobDay||{};
  if(S.jobDay._any===day()){toast('You already worked today. Rest up.');SFX.bad();return}
  if(S.jobDay[j.id]===day()){toast('Already did that today');SFX.bad();return}
  if(h<j.hours[0]||h>=j.hours[1]){toast('Not available now');SFX.bad();return}
  if(j.mind&&mindSkill()<j.mind){toast('Mind skill too low — study at your desk or library');SFX.bad();return}
  if(j.fit&&fitSkill()<j.fit){toast('Fitness too low — exercise at home');SFX.bad();return}
  if(j.needFriend&&!NP.some(n=>rel(n.id).f>=j.needFriend)){toast('Need a friend first');SFX.bad();return}
  if(S.energy<j.energy){toast('Too tired — need more energy');SFX.bad();return}
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  closeM();
  ACT={icon:'£',label:j.name,endMs:performance.now()+j.mins*1000,done:()=>{
    S.cash+=j.pay;S.energy=Math.max(0,S.energy-j.energy);S.t+=j.mins*3;S.jobDay[j.id]=day();S.jobDay._any=day();
    gain('social',j.id==='tutor'?4:1);gain('fun',-5);
    toast(j.name+': earned '+gbp(j.pay)+' (tired)');SFX.chime();store();
  }};
  toast('Working: '+j.name+'...');updateActUI();
}
function choresMenu(){
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  S.choreDay=S.choreDay||{};
  const list=[{id:'dishes',name:'Wash the dishes',pay:1,s:6,energy:8},{id:'trash',name:'Take out the bins',pay:1,s:5,energy:10},{id:'vacuum',name:'Vacuum the lounge',pay:2,s:8,energy:12},{id:'laundry',name:'Do the laundry',pay:2,s:9,energy:14}];
  let html='<h3>Chores</h3><p class="m">Mum pays a little. Max 2 chores per day.</p>';
  list.forEach((c,i)=>{const done=S.choreDay[c.id]===day();html+='<button class="o" onclick="doChore('+i+')" '+(done?'style="opacity:.45"':'')+'>'+c.name+' · '+gbp(c.pay)+(done?' (done)':'')+'</button>'});
  html+='<button class="o" onclick="closeM()">Close</button>';
  modal(html,true);
}
function doChore(i){
  const list=[{id:'dishes',name:'Wash the dishes',pay:1,s:6,energy:8},{id:'trash',name:'Take out the bins',pay:1,s:5,energy:10},{id:'vacuum',name:'Vacuum the lounge',pay:2,s:8,energy:12},{id:'laundry',name:'Do the laundry',pay:2,s:9,energy:14}];
  const c=list[i];S.choreDay=S.choreDay||{};
  const count=Object.keys(S.choreDay).filter(k=>k[0]!=='_'&&S.choreDay[k]===day()).length;
  if(count>=2){toast('Mum: That is enough chores for today.');SFX.bad();return}
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

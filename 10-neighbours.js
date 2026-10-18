/* ===== neighbours (relationships.js) ===== */
const mkN=(id,name,pers,likes,dis,ox,rx,rz,color,hair,skin)=>({id,name,pers,likes,dis,door:[ox+rx,rz<3?-5:12],lane:rz<3?-2.4:8.6,cx:ox+rx,ph:(id.length*1.7+ox/30)%6,color,hair,skin});
const NP=[
mkN('emily','Emily','Cheerful student who loves a good joke.','joke','comp',0,-14,-8,0xe76f51,0x111111,0xf1c8a5),
mkN('oliver','Oliver','Hardworking and serious. Enjoys hearing about your day.','day','joke',0,14,-8,0x2a9d8f,0x4a2c17,0xe8b998),
mkN('priya','Priya','Shy and thoughtful. Kind words make her smile.','comp','chat',0,-14,15,0x8e5cd9,0x1d1410,0xa06a45),
mkN('jack','Jack','Chatty and curious. Always knows the street news.','chat','day',0,14,15,0xf4a261,0xb5651d,0xf1c8a5),
mkN('sophie','Sophie','Sporty and energetic. Loves hearing about your day.','day','chat',-90,-14,-8,0x1d7874,0x4a2c17,0xf1c8a5),
mkN('mohammed','Mohammed','Calm and generous. Enjoys a friendly chat.','chat','joke',-90,14,-8,0x355070,0x1d1410,0xa06a45),
mkN('lucas','Lucas','Funny and outgoing. Always joking around.','joke','day',-90,-14,15,0xe56b6f,0x1a1a1a,0xc68642),
mkN('hannah','Hannah','Bookish and quiet. Appreciates a kind word.','comp','joke',-90,14,15,0x6d597a,0xb5651d,0xf1c8a5),
mkN('mei','Mei','Ambitious student. Likes to hear how your day went.','day','chat',90,-14,-8,0xb56576,0x111111,0xe8b998),
mkN('tomasz','Tomasz','Practical and dry-humoured. Loves a good joke.','joke','comp',90,14,-8,0x588157,0xb5651d,0xf1c8a5),
mkN('fatima','Fatima','Warm and welcoming. Loves neighbourhood news.','chat','day',90,-14,15,0xe09f3e,0x2b1d14,0xa06a45),
mkN('daniel','Daniel','Easy-going musician. Appreciates a compliment.','comp','chat',90,14,15,0x3d5a80,0x4a2c17,0xf1c8a5)];
function nstate(n){const h=hr(),wd=day()%7;if(h<7||h>=22)return'sleep';if(h>=19)return'home';if(wd<5&&h>=8&&h<14)return'away';return raining()?'home':'out'}
const TOP={greet:['Say hello',3,'Hello! Good to see you.'],chat:['Chat about the neighbourhood',4,'You talk about the street and the weather.'],day:['Ask about their day',5,'You ask how the day has gone.'],joke:['Tell a joke',5,'You tell a joke from school.'],comp:['Give a compliment',4,'You say something kind about their style.']};
const FL=f=>f<20?'Stranger':f<40?'Acquaintance':f<70?'Friend':'Close friend';
function rel(id){S.rel=S.rel||{};return S.rel[id]||(S.rel[id]={f:0,d:{}})}
function talk(id,msg){
  const n=NP.find(x=>x.id===id),r=rel(id),f=Math.round(r.f);
  modal(`<h3>${n.name}</h3><p class="m">${n.pers}</p><p>${FL(f)} · ${f}/100</p><span class="bar" style="width:100%"><i style="width:${f}%"></i></span><p>${msg||n.name+' smiles at you.'}</p>`+
    Object.keys(TOP).map(k=>{const dn=r.d[k]===day();return `<button class="o" ${dn?'disabled style="opacity:.5"':''} onclick="topic('${id}','${k}')">${TOP[k][0]}${dn?' (done today)':''}</button>`}).join('')+
    (f>=40?`<p class="m">${n.name}: "Come over any evening between 19:00 and 22:00."</p>`:`<p class="m">Friendship grows slowly. Reach 40 to be invited over.</p>`),true);
}
function topic(id,k){
  const n=NP.find(x=>x.id===id),r=rel(id),T=TOP[k];if(r.d[k]===day()){talk(id);return}
  let g=T[1]*(1-r.f/150)*mm(),res=T[2];gain('social',8);
  if(n.likes===k){g+=2;res+=` ${n.name} really enjoys this.`}else if(n.dis===k){g=-1;res+=` ${n.name} seems uncomfortable.`}else res+=` ${n.name} responds politely.`;
  r.f=Math.max(0,Math.min(100,r.f+g));r.d[k]=day();S.t+=10;S.energy=Math.max(0,S.energy-1);store();talk(id,`${res} (${g>=0?'+':''}${g.toFixed(1)})`);
}
function visitDoor(n){
  const f=rel(n.id).f;
  if(f<40)toast(`You don't know ${n.name} well enough yet. Chat when you see them outside.`);
  else if(nstate(n)!=='home')toast(`${n.name} is home between 19:00 and 22:00, or when it rains.`);
  else{setScene(true,n.id);P.position.set(0,0,3);toast(`${n.name} welcomes you in`);store()}
}
function leaveVisit(){const n=NP.find(x=>x.id===S.vis),d=n.door;setScene(false);P.position.set(d[0],0,d[1]+(d[1]<3?1.6:-1.6));toast('You head back outside');store()}
function shared(n,k,g,msg){const r=rel(n.id);if(r.d[k]===day()){toast('You already did that today.');return}r.d[k]=day();r.f=Math.min(100,r.f+g);S.t+=30;if(k==='snack'){gain('hunger',25);gain('social',12)}else{gain('fun',25);gain('social',8)}toast(msg+' Friendship +'+g);store()}
function A_V(){const n=NP.find(x=>x.id===S.vis);return[
  {x:0,z:-1.5,r:2.2,label:'Talk to '+n.name,fn:()=>talk(n.id)},
  {x:-3,z:-2.8,label:'Browse bookshelf',fn:()=>{if(S.readDay===day()){toast('You already read today.');return}S.readDay=day();const b=pick(SUBJ);S.know[b]=Math.min(100,S.know[b]+1);S.t+=20;toast('You read a book. '+b+' +1');store()}},
  {x:3,z:-1.6,label:'Share a snack',fn:()=>shared(n,'snack',6,'You shared a snack and laughed.')},
  {x:4,z:.7,label:'Watch TV together',fn:()=>shared(n,'tv',5,'You watched TV together.')},
  {x:0,z:3.6,label:'Leave',fn:leaveVisit}]}

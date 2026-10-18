/* ===== neighbours (relationships.js) ===== */
const mkN=(id,name,pers,likes,dis,ox,rx,rz,color,hair,skin,ph,o)=>({id,name,pers,likes,dis,door:[ox+rx,rz<3?-5:12],lane:rz<3?-2.4:8.6,cx:ox+rx,ph,o,color,hair,skin});
const PI=Math.PI,NP=[
mkN('emily','Emily','Cheerful student who loves a good joke.','joke','comp',0,-14,-8,0xe76f51,0x111111,0xf1c8a5,0,{style:'long'}),
mkN('oliver','Oliver','Hardworking and serious. Enjoys hearing about your day.','day','joke',0,14,-8,0x2a9d8f,0x4a2c17,0xe8b998,PI,{style:'short',glasses:1}),
mkN('priya','Priya','Shy and thoughtful. Kind words make her smile.','comp','chat',0,-14,15,0x8e5cd9,0x1d1410,0xa06a45,.5,{style:'bun',dress:1}),
mkN('jack','Jack','Chatty and curious. Always knows the street news.','chat','day',0,14,15,0xf4a261,0xb5651d,0xf1c8a5,.5+PI,{style:'cap',hat:0x2255aa}),
mkN('sophie','Sophie','Sporty and energetic. Loves hearing about your day.','day','chat',-90,-14,-8,0x1d7874,0x4a2c17,0xf1c8a5,1,{style:'bun'}),
mkN('mohammed','Mohammed','Calm and generous. Enjoys a friendly chat.','chat','joke',-90,14,-8,0x355070,0x1d1410,0xa06a45,1+PI,{style:'short',glasses:1}),
mkN('lucas','Lucas','Funny and outgoing. Always joking around.','joke','day',-90,-14,15,0xe56b6f,0x1a1a1a,0xc68642,1.5,{style:'curly'}),
mkN('hannah','Hannah','Bookish and quiet. Appreciates a kind word.','comp','joke',-90,14,15,0x6d597a,0xb5651d,0xf1c8a5,1.5+PI,{style:'long',glasses:1,dress:1}),
mkN('mei','Mei','Ambitious student. Likes to hear how your day went.','day','chat',90,-14,-8,0xb56576,0x111111,0xe8b998,2,{style:'long'}),
mkN('tomasz','Tomasz','Practical and dry-humoured. Loves a good joke.','joke','comp',90,14,-8,0x588157,0xb5651d,0xf1c8a5,2+PI,{style:'short'}),
mkN('fatima','Fatima','Warm and welcoming. Loves neighbourhood news.','chat','day',90,-14,15,0xe09f3e,0x2b1d14,0xa06a45,2.5,{style:'bun',dress:1}),
mkN('daniel','Daniel','Easy-going musician. Appreciates a compliment.','comp','chat',90,14,15,0x3d5a80,0x4a2c17,0xf1c8a5,2.5+PI,{style:'curly',glasses:1})];
function nstate(n){const h=hr(),wd=day()%7;if(h<7||h>=22)return'sleep';if(h>=19)return'home';if(wd<5&&h>=8&&h<14)return'away';return raining()?'home':'out'}
const TOP={greet:['Say hello',3,'Hello! Good to see you.'],chat:['Chat about the neighbourhood',4,'You talk about the street and the weather.'],day:['Ask about their day',5,'You ask how the day has gone.'],joke:['Tell a joke',5,'You tell a joke from school.'],comp:['Give a compliment',4,'You say something kind about their style.']};
const FL=f=>f<20?'Stranger':f<40?'Acquaintance':f<70?'Friend':'Close friend';
function rel(id){S.rel=S.rel||{};return S.rel[id]||(S.rel[id]={f:0,d:{}})}
const hx=c=>'#'+(+c).toString(16).padStart(6,'0');
TOP.gift=['Give a small gift (£3)',5];TOP.advice=['Ask for advice',2];
const YOU={greet:'Hello! How are you?',chat:'Have you noticed how busy the street is lately?',day:'How has your day been so far?',joke:'Want to hear a joke?',comp:'I really like your style, you know.',gift:'I got you a little something.',advice:'Can I ask your advice about something?'};
const LINES={greet:['Hello again, {p}!','Lovely to see you.','Oh hey, {p}. How are things?'],chat:['Honestly, the street has been so busy lately.','Did you see the new bus times? Nobody told us.','I love how friendly this neighbourhood is.'],day:["Not bad, {p}. Plenty to do, but I can't complain.",'Long one, honestly. Thanks for asking though.','Pretty good! Better now that you asked.'],joke:['Ha! That one was good.','*laughs* Oh no, that is terrible. Tell me another.','You should do stand-up, {p}.'],comp:["Aw, thank you. That is really kind.",'You think so? That made my day.',"Stop it, you'll make me blush!"],gift:['Oh, you did not have to! Thank you so much.','That is so thoughtful, {p}.']};
const INTRO=[['Oh, hello.','Hi... do I know you?'],['Hey!','Oh, hi {p}!'],['{p}! Great to see you!','Hey you!']];
const LIKE=['They light up at this.','Clearly their favourite kind of chat.'],DIS=['They seem uncomfortable with that.','That made them uncomfortable.'];
const ADV={Maths:'Practise a little each day, even ten minutes helps.',English:'Read a bit every evening. It really helps.',Science:'Ask why things work. That is how it sticks.'};
function talk(id,msg,you){
  const n=NP.find(x=>x.id===id),r=rel(id),f=Math.round(r.f),face=r.m==='like'?'😄':r.m==='dis'?'😕':f>=70?'😊':'🙂';
  modal(`<div style="display:flex;gap:12px;align-items:center"><div style="flex:none;width:60px;height:60px;border-radius:50%;background:${hx(n.skin)};border:5px solid ${hx(n.color)};display:flex;align-items:center;justify-content:center;font-size:28px">${face}</div><div><h3 style="margin:0">${n.name}</h3><div class="m">${n.pers}<br>${addr(n.door[0],n.door[1])}</div></div></div><p>${FL(f)} · ${f}/100</p><span class="bar" style="width:100%"><i style="width:${f}%"></i></span>${you?`<div class="you">You: "${you}"</div>`:''}<div class="sp">${msg||n.name+' smiles at you.'}</div>`+
    Object.keys(TOP).map(k=>{const dn=r.d[k]===day();return `<button class="o" ${dn?'disabled style="opacity:.5"':''} onclick="topic('${id}','${k}')">${TOP[k][0]}${dn?' (done today)':''}</button>`}).join('')+
    (f>=40?`<p class="m">${n.name}: "Come over any evening between 19:00 and 22:00."</p>`:`<p class="m">Friendship grows slowly. Reach 40 to be invited over.</p>`),true);
}
function topic(id,k){
  const n=NP.find(x=>x.id===id),r=rel(id),T=TOP[k],p=S.name;if(r.d[k]===day()){talk(id);return}
  if(k==='gift'&&S.cash<3){toast('Not enough cash');SFX.bad();return}
  if(k==='advice'&&r.f<20){talk(id,`${n.name}: "We don't know each other well enough for that yet."`,YOU[k]);return}
  const tier=r.f<20?0:r.f<40?1:2;let g=T[1]*(1-r.f/150)*mm(),res;
  if(k==='gift'){S.cash-=3;g+=2}
  if(k==='advice'){const b=weakest();S.know[b]=Math.min(100,S.know[b]+1);res=`${pick(INTRO[tier])} ${ADV[b]} (${b} +1)`;r.m=''}
  else if(n.likes===k){g+=2;res=`${pick(INTRO[tier])} ${pick(LINES[k])} ${pick(LIKE)}`;r.m='like'}
  else if(n.dis===k){g=-1;res=`... ${pick(DIS)}`;r.m='dis'}
  else{res=`${pick(INTRO[tier])} ${pick(LINES[k])}`;r.m=''}
  res=res.replace(/\{p\}/g,p);
  r.f=Math.max(0,Math.min(100,r.f+g));r.d[k]=day();gain('social',8);S.t+=10;S.energy=Math.max(0,S.energy-1);store();
  talk(id,`${res} (${g>=0?'+':''}${g.toFixed(1)})`,YOU[k]);
}
/* speech bubbles, neighbour-to-neighbour chat, gossip, texts */
const BUB=[];let camT={x:0,y:1.4,z:0},mvSp=0;
function say(who,text,ms){const i=BUB.findIndex(b=>b.who===who);if(i>=0){if(BUB[i].el)BUB[i].el.remove();BUB.splice(i,1)}BUB.push({who,text:text.replace(/\{p\}/g,S.name),until:performance.now()+(ms||3800),el:null})}
function toScreen(x,y,z){const c=cam.position,t=camT,fx=t.x-c.x,fy=t.y-c.y,fz=t.z-c.z,fl=Math.hypot(fx,fy,fz),f=[fx/fl,fy/fl,fz/fl],rl=Math.hypot(f[2],f[0]),r=[-f[2]/rl,0,f[0]/rl],u=[-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]],d=[x-c.x,y-c.y,z-c.z],X=d[0]*r[0]+d[2]*r[2],Y=d[0]*u[0]+d[1]*u[1]+d[2]*u[2],Z=d[0]*f[0]+d[1]*f[1]+d[2]*f[2];if(Z<.5)return null;const th=Math.tan(PI/6),nx=X/(Z*th*cam.aspect),ny=Y/(Z*th);return[(nx*.5+.5)*innerWidth,(.5-ny*.5)*innerHeight,Math.abs(nx)<1.15&&Math.abs(ny)<1.15]}
function updateBubbles(now){const box=$('bub');for(let i=BUB.length-1;i>=0;i--){const b=BUB[i];if(now>b.until){if(b.el)b.el.remove();BUB.splice(i,1);continue}
  const w=b.who,pos=w==='me'?P.position:w.g.position,vis=w==='me'||(w.g.visible&&!S.inside);
  if(!b.el){b.el=document.createElement('div');b.el.className='b';b.el.textContent=b.text;box.appendChild(b.el)}
  const sp=vis&&!modalOpen?toScreen(pos.x,pos.y+2.6,pos.z):null;if(sp&&sp[2]){b.el.style.display='block';b.el.style.left=sp[0]+'px';b.el.style.top=sp[1]+'px'}else b.el.style.display='none'}}
const GREET=[['Hello there!','Morning!','Hi!'],['Hey {p}!','Oh hi {p}, got a minute?'],['{p}! Come say hi!','Hey {p}! Over here!']];
const NCH={joke:'Did you hear the one about the bus driver?',chat:'Any news on the street today?',day:'How has your day been so far?',comp:'Love your jacket today!'},NRE=['Ha, brilliant!','Oh really? Tell me more.',"Can't complain!",'You always know what to say.'];
const PAIRS=[['emily','oliver'],['priya','jack'],['sophie','mohammed'],['lucas','hannah'],['mei','tomasz'],['fatima','daniel']];
function chatter(){PAIRS.forEach(([a,b])=>{const A=NP.find(x=>x.id===a),B=NP.find(x=>x.id===b);if(!A.g.visible||!B.g.visible)return;if(Math.hypot(A.g.position.x-B.g.position.x,A.g.position.z-B.g.position.z)>3.6)return;
  S.chat=S.chat||{};const k=a+b;if(S.t-(S.chat[k]==null?-999:S.chat[k])<180)return;S.chat[k]=S.t;
  say(A,NCH[A.likes]);setTimeout(()=>say(B,pick(NRE)),1800);
  if(rel(a).f>=50&&rel(b).f<30){rel(b).f=Math.min(30,rel(b).f+1);setTimeout(()=>say(A,'{p} is really nice. You should say hi!'),3600);store()}})}
const TXT={joke:['Heard a great joke today. Ask me about it!','Remind me to tell you a joke next time!'],chat:['Fancy a chat on the street later?','So much news on the street today!'],day:['How is your day going?','Hope your day is going well!'],comp:['Thinking of you. Hope you are doing well!','Just wanted to say you are a lovely neighbour.']};
function texting(){const fr=NP.filter(n=>rel(n.id).f>=25);if(!fr.length)return;const n=pick(fr);S.inbox=(S.inbox||[]).concat([{id:n.id,text:pick(TXT[n.likes]),t:S.t}]).slice(-6);toast('📱 New message from '+n.name);SFX.chime();store()}
function pMsgs(){const L=S.inbox||[];modal('<h3>Messages</h3>'+(L.length?L.map((m,i)=>`<button class="o" onclick="pMsg(${i})"><b>${NP.find(n=>n.id===m.id).name}</b><br><span class="m">${m.text}</span></button>`).join(''):'<p class="m">No new messages.</p>')+'<button class="o" onclick="phone()">Back</button>',true)}
function pMsg(i){const m=S.inbox[i],n=NP.find(x=>x.id===m.id);modal(`<h3>${n.name}</h3><div class="sp">${m.text}</div><button class="o" onclick="reply(${i},1)">Sounds great!</button><button class="o" onclick="reply(${i},0)">Sorry, I'm busy right now</button>`,true)}
function reply(i,k){const m=S.inbox[i],r=rel(m.id);S.inbox.splice(i,1);if(k){r.f=Math.min(100,r.f+2);gain('social',5);toast('Reply sent. Friendship +2')}else toast('Reply sent.');S.t+=2;store();pMsgs()}
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

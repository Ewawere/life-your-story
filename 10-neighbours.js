/* ===== neighbours (relationships.js) ===== */
const mkN=(id,name,pers,likes,dis,ox,rx,rz,color,hair,skin,ph,o)=>({id,name,pers,likes,dis,door:[ox+rx,rz<3?rz+3:rz-3],lane:rz<3?rz+5.6:rz-6.4,cx:ox+rx,ph,o,color,hair,skin,rz});
const PI=Math.PI;
const FIRST=['Amy','Ben','Chloe','David','Emma','Finn','Grace','Harry','Isla','Jake','Kate','Leo','Mia','Noah','Olivia','Paul','Quinn','Ruby','Sam','Tara','Uma','Victor','Willow','Xavier','Yara','Zane','Aisha','Bilal','Carla','Derek','Elena','Farah','George','Hana','Ian','Jade','Kofi','Luna','Marcus','Nina','Omar','Priya','Ravi','Sara','Tom','Ula','Vince','Winnie','Yusuf','Zoe','Ada','Boris','Cora','Dina','Eli','Faye','Gabe','Holly','Ivan','June','Ken','Lara','Mo','Nia','Owen','Pia','Rex','Sia','Ted','Val','Wes','Xena','Yan','Zara','Anika','Bruno','Celine','Dante','Esme','Felix','Gina','Hugo','Iris','Joel','Kim','Louis','Mara','Nate','Opal','Pete','Rosa','Sean','Tina','Uri','Vera','Will','Yvette','Zack','Amara','Bea'];
const LAST=['Smith','Jones','Patel','Khan','Brown','Wilson','Taylor','Lee','Martin','Clark','Walker','Hall','Young','King','Wright','Lopez','Hill','Green','Adams','Baker','Carter','Evans','Mitchell','Roberts','Turner','Phillips','Campbell','Parker','Edwards','Collins','Stewart','Morris','Rogers','Reed','Cook','Morgan','Bell','Murphy','Bailey','Rivera','Cooper','Richardson','Cox','Howard','Ward','Torres','Peterson','Gray','Ramirez','James'];
const PERS=[['Cheerful and outgoing.','joke','comp'],['Hardworking and serious.','day','joke'],['Shy but kind.','comp','chat'],['Loves neighbourhood gossip.','chat','day'],['Sporty and energetic.','day','chat'],['Calm and thoughtful.','chat','joke'],['Playful joker.','joke','comp'],['Quiet book lover.','comp','day'],['Ambitious student.','day','chat'],['Practical and direct.','chat','joke'],['Warm and welcoming.','chat','day'],['Easy-going musician.','comp','chat']];
const COLS=[0xe76f51,0x2a9d8f,0x8e5cd9,0xf4a261,0x1d7874,0x355070,0xe9c46a,0x9b5de5,0xb56576,0x577590,0xe09f3e,0x3d5a80,0xd62828,0x023e8a,0x2d6a4f,0x9c6644,0x7b2cbf,0xfb8500];
const NPC_SKINS=[0xf1c8a5,0xe8b998,0xa06a45,0x8d5a3b,0xc68642,0xffdbac];
const NPC_HAIRS=[0x111111,0x1d1410,0x4a2c17,0xb5651d,0x2b1d14,0x6b4423,0xf2c94c];
const STYLES=['spiky','short','long','bun','curly','cap'];
const SLOTS=[];
const DISTS_OX=[-90,0,90];
const RXS=[-42,-28,-14,0,14,28,42];
const RZS=[-22,-8,15,28];
DISTS_OX.forEach(ox=>{RXS.forEach(rx=>{RZS.forEach(rz=>{if(ox===0&&rx===0&&rz===-8)return;SLOTS.push([ox,rx,rz]);});});});
const NP=[];
for(let i=0;i<100&&i<SLOTS.length;i++){
  const [ox,rx,rz]=SLOTS[i];
  const fn=FIRST[i%FIRST.length], ln=LAST[(i*7)%LAST.length];
  const id='n'+i+'_'+fn.toLowerCase();
  const p=PERS[i%PERS.length];
  const color=COLS[i%COLS.length], skin=NPC_SKINS[i%NPC_SKINS.length], hair=NPC_HAIRS[i%NPC_HAIRS.length];
  const style=STYLES[i%STYLES.length];
  const o={style};if(style==='cap')o.hat=0x2255aa;if(i%5===2)o.glasses=1;if(i%7===3)o.dress=1;
  const ph=(i*0.37)%(PI*2);
  NP.push(mkN(id,fn+' '+ln[0]+'.',p[0],p[1],p[2],ox,rx,rz,color,hair,skin,ph,o));
}
const OG=['Emily','Oliver','Priya','Jack','Sophie','Mohammed','Lucas','Hannah','Mei','Tomasz','Fatima','Daniel'];
for(let i=0;i<12;i++)NP[i].name=OG[i];
const FEM_NAMES=new Set(['Amy','Chloe','Emma','Grace','Isla','Kate','Mia','Olivia','Quinn','Ruby','Tara','Uma','Willow','Yara','Aisha','Carla','Elena','Farah','Hana','Jade','Luna','Nina','Priya','Sara','Ula','Winnie','Zoe','Ada','Cora','Dina','Faye','Holly','June','Lara','Nia','Opal','Pia','Sia','Tina','Val','Vera','Xena','Yvette','Zara','Anika','Celine','Esme','Gina','Iris','Kim','Mara','Rosa','Amara','Bea','Sophie','Hannah','Mei','Fatima','Emily']);
NP.forEach((n,i)=>{n.gender=FEM_NAMES.has(n.name.split(' ')[0])?'female':'male';n.o=n.o||{};n.o.gender=n.gender;if(n.gender==='female'){if(!['long','bun','curly'].includes(n.o.style))n.o.style=(i%3===0?'long':i%3===1?'bun':'curly');n.o.dress=n.o.dress||(i%2===0);}else{if(n.o.style==='long'||n.o.style==='bun')n.o.style=i%3===0?'spiky':'short';}});
function nstate(n){const h=hr();if(h>=22||h<7)return'sleep';if(h>=9&&h<14&&!raining())return'away';if(h>=19||raining())return'home';return'out'}
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
  const n=NP.find(x=>x.id===id),r=rel(id);r.met=1;const f=Math.round(r.f),face=r.m==='like'?'😄':r.m==='dis'?'😕':f>=70?'😊':'🙂';
  modal(`<div style="display:flex;gap:12px;align-items:center"><div style="flex:none;width:60px;height:60px;border-radius:50%;background:${hx(n.skin)};border:5px solid ${hx(n.color)};display:flex;align-items:center;justify-content:center;font-size:28px">${face}</div><div><h3 style="margin:0">${n.name}</h3><div class="m">${n.pers}<br>${addr(n.door[0],n.door[1])}</div></div></div><p>${FL(f)} · ${f}/100</p><span class="bar" style="width:100%"><i style="width:${f}%"></i></span>${you?`<div class="you">You: "${you}"</div>`:''}<div class="sp">${msg||n.name+' smiles at you.'}</div>`+
    Object.keys(TOP).map(k=>{const dn=r.d[k]===day();return `<button class="o" ${dn?'disabled style="opacity:.5"':''} onclick="topic('${id}','${k}')">${TOP[k][0]}${dn?' (done today)':''}</button>`}).join('')+
    (f>=40?`<p class="m">${n.name}: "Come over any evening between 19:00 and 22:00."</p>`:`<p class="m">Friendship grows slowly. Reach 40 to be invited over.</p>`)+
    (f>=15?`<button class="o" onclick="closeM();openChat('${id}')">Message ${n.name}</button>`:'')+
    `<button class="o" onclick="closeM()">Leave</button>`,true);
  store();
}
function topic(id,k){
  const n=NP.find(x=>x.id===id),r=rel(id);r.met=1;const T=TOP[k],p=S.name;if(r.d[k]===day()){talk(id);return}
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
const BUB=[];let camT={x:0,y:1.4,z:0},mvSp=0;
function say(who,text,ms){const i=BUB.findIndex(b=>b.who===who);if(i>=0){if(BUB[i].el)BUB[i].el.remove();BUB.splice(i,1)}BUB.push({who,text:text.replace(/\{p\}/g,S.name),until:performance.now()+(ms||3800),el:null})}
function toScreen(x,y,z){const c=cam.position,t=camT,fx=t.x-c.x,fy=t.y-c.y,fz=t.z-c.z,fl=Math.hypot(fx,fy,fz),f=[fx/fl,fy/fl,fz/fl],rl=Math.hypot(f[2],f[0]),r=[-f[2]/rl,0,f[0]/rl],u=[-r[2]*f[1],r[2]*f[0]-r[0]*f[2],r[0]*f[1]],d=[x-c.x,y-c.y,z-c.z],X=d[0]*r[0]+d[2]*r[2],Y=d[0]*u[0]+d[1]*u[1]+d[2]*u[2],Z=d[0]*f[0]+d[1]*f[1]+d[2]*f[2];if(Z<.5)return null;const th=Math.tan(PI/6),nx=X/(Z*th*cam.aspect),ny=Y/(Z*th);return[(nx*.5+.5)*innerWidth,(.5-ny*.5)*innerHeight,Math.abs(nx)<1.15&&Math.abs(ny)<1.15]}
function updateBubbles(now){const box=$('bub');for(let i=BUB.length-1;i>=0;i--){const b=BUB[i];if(now>b.until){if(b.el)b.el.remove();BUB.splice(i,1);continue}
  const w=b.who,pos=w==='me'?P.position:w.g.position,vis=w==='me'||(w.g&&w.g.visible&&!S.inside);
  if(!b.el){b.el=document.createElement('div');b.el.className='b';b.el.textContent=b.text;box.appendChild(b.el)}
  const sp=vis&&!modalOpen?toScreen(pos.x,pos.y+2.6,pos.z):null;if(sp&&sp[2]){b.el.style.display='block';b.el.style.left=sp[0]+'px';b.el.style.top=sp[1]+'px'}else b.el.style.display='none'}}
const GREET=[['Hello there!','Morning!','Hi!'],['Hey {p}!','Oh hi {p}, got a minute?'],['{p}! Come say hi!','Hey {p}! Over here!']];
const NCH={joke:'Want to hear the one about the bus driver?',chat:'Any news on the street today?',day:'How has your day been so far?',comp:'Love your jacket today!'},NRE=['Ha, brilliant!','Oh really? Tell me more.',"Can't complain!",'You always know what to say.'];
const PAIRS=[['n0_amy','n1_ben'],['n2_chloe','n3_david'],['n4_emma','n5_finn'],['n6_grace','n7_harry']];
function chatter(){PAIRS.forEach(([a,b])=>{const A=NP.find(x=>x.id===a),B=NP.find(x=>x.id===b);if(!A||!B||!A.g||!B.g||!A.g.visible||!B.g.visible)return;if(Math.hypot(A.g.position.x-B.g.position.x,A.g.position.z-B.g.position.z)>3.6)return;
  S.chat=S.chat||{};const k=a+b;if(S.t-(S.chat[k]==null?-999:S.chat[k])<180)return;S.chat[k]=S.t;
  say(A,NCH[A.likes]);setTimeout(()=>say(B,pick(NRE)),1800);
  if(rel(a).f>=50&&rel(b).f<30){rel(b).f=Math.min(30,rel(b).f+1);setTimeout(()=>say(A,'{p} is really nice. You should say hi!'),3600);store()}})}
const TXT={joke:['Heard a great joke today. Ask me about it!','Remind me to tell you a joke next time!'],chat:['Fancy a chat on the street later?','So much news on the street today!'],day:['How is your day going?','Hope your day is going well!'],comp:['Thinking of you. Hope you are doing well!','Just wanted to say you are a lovely neighbour.']};
function texting(){
  const fr=NP.filter(n=>rel(n.id).f>=20);if(!fr.length)return;
  const n=pick(fr);
  S.inbox=S.inbox||[];S.chatLog=S.chatLog||{};S.chatLog[n.id]=S.chatLog[n.id]||[];
  const msg=pick(TXT[n.likes]||TXT.chat);
  S.inbox.push({id:n.id,text:msg,t:S.t});
  S.chatLog[n.id].push({from:'them',t:msg});
  if(S.inbox.length>8)S.inbox=S.inbox.slice(-8);
  toast('New message from '+n.name);SFX.chime();store();
}
function pMsgs(){
  S.chatLog=S.chatLog||{};S.inbox=S.inbox||[];
  const ids=[...new Set([...S.inbox.map(m=>m.id),...Object.keys(S.chatLog)])].filter(id=>{const r=rel(id);return r.met||r.f>0});
  let html='<h3>Messages</h3>';
  if(!ids.length)html+='<p class="m">No chats yet. Meet neighbours outside first, then message them!</p>';
  else{
    ids.forEach(id=>{
      const n=NP.find(x=>x.id===id);if(!n)return;
      const unread=S.inbox.filter(m=>m.id===id).length;
      const last=(S.chatLog[id]||[]).slice(-1)[0];
      const preview=last?(last.t.length>36?last.t.slice(0,36)+'...':last.t):'Start chatting';
      html+='<button class="o" onclick="openChat(\''+id+'\')"><b>'+n.name+'</b>'+(unread?' <span style="background:#e11;color:#fff;border-radius:10px;padding:1px 7px;font-size:11px">'+unread+'</span>':'')+'<br><span class="m">'+preview+'</span></button>';
    });
  }
  html+='<button class="o" onclick="phone()">Back</button>';
  modal(html,true);
}
function openChat(id){
  S.chatLog=S.chatLog||{};S.chatLog[id]=S.chatLog[id]||[];S.inbox=S.inbox||[];
  S.inbox.filter(m=>m.id===id).forEach(m=>{
    if(!S.chatLog[id].some(x=>x.from==='them'&&x.t===m.text))S.chatLog[id].push({from:'them',t:m.text});
  });
  S.inbox=S.inbox.filter(m=>m.id!==id);
  const n=NP.find(x=>x.id===id),r=rel(id),log=S.chatLog[id].slice(-10);
  let html='<h3>'+n.name+'</h3><p class="m">'+FL(Math.round(r.f))+' · '+Math.round(r.f)+'/100</p>';
  html+='<div style="max-height:240px;overflow-y:auto;margin:8px 0;padding:4px 0">';
  if(!log.length)html+='<p class="m">No messages yet. Say something!</p>';
  log.forEach(m=>{
    const mine=m.from==='me';
    html+='<div style="display:flex;justify-content:'+(mine?'flex-end':'flex-start')+';margin:5px 0">';
    html+='<span style="background:'+(mine?'#3a6ea5':'#2a2f42')+';color:#fff;padding:8px 12px;border-radius:14px;max-width:78%;font-size:13px;line-height:1.35">'+m.t+'</span></div>';
  });
  html+='</div>';
  html+='<button class="o" onclick="sendChat(\''+id+'\',0)">How are you?</button>';
  html+='<button class="o" onclick="sendChat(\''+id+'\',1)">Want to hang out?</button>';
  html+='<button class="o" onclick="sendChat(\''+id+'\',2)">Tell a joke</button>';
  html+='<button class="o" onclick="sendChat(\''+id+'\',3)">Any neighbourhood news?</button>';
  html+='<button class="o" onclick="pMsgs()">Back</button>';
  modal(html,true);store();
}
function sendChat(id,k){
  const n=NP.find(x=>x.id===id),r=rel(id);
  S.chatLog=S.chatLog||{};S.chatLog[id]=S.chatLog[id]||[];
  const you=['Hey, how are you doing?','Want to hang out later?','Want to hear a joke?','Any news on the street?'][k];
  S.chatLog[id].push({from:'me',t:you});
  let reply;
  if(r.f<12){reply=['Uh... do I know you?','Sorry, who is this?','Maybe we should meet outside first.','Not sure I can help with that.'][k];}
  else if(k===0){reply=pick(["I'm good, thanks for asking!","Pretty busy but hanging in there.","Better now that you texted!","Not bad. How about you?"]);}
  else if(k===1){reply=r.f>=40?pick(["Yeah, that would be nice!","Sure, come find me outside.","I'd like that. After 7?"]):pick(["Maybe when we know each other a bit better.","Hmm, not sure yet. Let's chat more first."]);}
  else if(k===2){reply=n.likes==='joke'?pick(["Haha yes! Tell me!","Go on then, make me laugh.","You always have good ones."]):pick(["Haha okay...","That was terrible, tell another!","You should do stand-up someday."]);}
  else {reply=n.likes==='chat'?pick(["Actually yes — the bus times changed again.","Street is busy today. Lots of people out.","Nothing huge, just the usual."]):pick(["Not really, been quiet.","I haven't heard much.","You usually know more than me!"]);}
  S.chatLog[id].push({from:'them',t:reply});
  const gainF=r.f<12?1:(k===1&&r.f>=40?4:3);
  r.f=Math.min(100,r.f+gainF);
  gain('social',4);S.t+=2;SFX.chime();store();
  openChat(id);
}
function pMsg(i){const m=(S.inbox||[])[i];if(m)openChat(m.id);else pMsgs()}
function reply(i,k){const m=(S.inbox||[])[i];if(m)openChat(m.id);else pMsgs()}
function visitDoor(n){
  const f=rel(n.id).f;
  if(f<40)toast('You do not know '+n.name+' well enough yet. Chat when you see them outside.');
  else if(nstate(n)!=='home')toast(n.name+' is home between 19:00 and 22:00, or when it rains.');
  else{S.vis=n.id;setScene(true,n.id);P.position.set(0,0,2);toast('Visiting '+n.name);store()}
}
function leaveVisit(){const n=NP.find(x=>x.id===S.vis);setScene(false);P.position.set(n?n.door[0]:0,0,n?n.door[1]+(n.door[1]<0?-1:1):0);S.vis=null;toast('Back outside');store()}
function A_V(){return[{x:0,z:3.2,label:'Leave',fn:leaveVisit},{x:0,z:-1.5,r:2.5,label:'Chat with host',fn:()=>talk(S.vis)}]}

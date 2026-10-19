/* ===== 2D world (canvas) — polished ===== */
const cnv=$('c'), ctx=cnv.getContext('2d');
let W=innerWidth, H=innerHeight, camX=0, camY=0, zoom=1;
function resize(){W=innerWidth;H=innerHeight;cnv.width=W*devicePixelRatio;cnv.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener('resize',resize);resize();

const R={setSize(){},render(){}}, sc={}, cam={position:{x:0,y:0,z:0},lookAt(){},aspect:1,updateProjectionMatrix(){}};
const outRects=[], inRects=[], acts=[], movers=[];
const OUT={visible:true}, INN={visible:false}, INN2={visible:false};

function hexColor(c){
  if(typeof c==='string')return c;
  if(typeof c==='number')return '#'+c.toString(16).padStart(6,'0');
  return '#888';
}
function shade(hex, amt){
  hex=hexColor(hex).replace('#','');
  if(hex.length===3)hex=hex.split('').map(x=>x+x).join('');
  let r=parseInt(hex.slice(0,2),16),g=parseInt(hex.slice(2,4),16),b=parseInt(hex.slice(4,6),16);
  r=Math.max(0,Math.min(255,r+amt));g=Math.max(0,Math.min(255,g+amt));b=Math.max(0,Math.min(255,b+amt));
  return '#'+((1<<24)+(r<<16)+(g<<8)+b).toString(16).slice(1);
}

function drawPerson(ctx,x,y,opt){
  opt=opt||{};
  const s=opt.scale||1;
  const skin=hexColor(opt.skin||'#c68642');
  const hair=hexColor(opt.hair||'#1d1410');
  const color=hexColor(opt.color||'#2e86ab');
  const female=opt.gender==='female';
  const style=opt.style||'spiky';
  const bodyH=female?13:14;

  ctx.save();
  ctx.translate(x,y);
  ctx.scale(s,s);

  ctx.fillStyle='rgba(0,0,0,.2)';
  ctx.beginPath();ctx.ellipse(0,20,16,5,0,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=female?'#3d2f52':'#2a3142';
  ctx.fillRect(-8,6,7,13);
  ctx.fillRect(1,6,7,13);
  ctx.fillStyle='#1a1a1a';
  ctx.fillRect(-9,17,9,3.5);
  ctx.fillRect(0,17,9,3.5);

  ctx.fillStyle=color;
  if(female){
    ctx.beginPath();
    ctx.moveTo(-10,6);ctx.lineTo(10,6);ctx.lineTo(12,-7);ctx.lineTo(-12,-7);
    ctx.closePath();ctx.fill();
    ctx.fillStyle=shade(color,-25);
    ctx.beginPath();
    ctx.moveTo(-10,6);ctx.lineTo(10,6);ctx.lineTo(8,1);ctx.lineTo(-8,1);
    ctx.closePath();ctx.fill();
  } else {
    ctx.fillRect(-10,-7,20,bodyH);
    ctx.strokeStyle=shade(color,-30);
    ctx.lineWidth=1;
    ctx.beginPath();ctx.moveTo(0,-5);ctx.lineTo(0,5);ctx.stroke();
  }

  ctx.fillStyle=color;
  ctx.fillRect(-14,-5,5,13);
  ctx.fillRect(9,-5,5,13);
  ctx.fillStyle=skin;
  ctx.beginPath();ctx.arc(-11.5,9,2.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(11.5,9,2.8,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=skin;
  ctx.fillRect(-3,-10,6,5);

  ctx.fillStyle=skin;
  ctx.beginPath();ctx.ellipse(0,-20,15,16,0,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=hair;
  if(style==='long'){
    ctx.beginPath();ctx.ellipse(0,-18,16,14,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(-15,-18,8,26);
    ctx.fillRect(7,-18,8,26);
    ctx.beginPath();ctx.ellipse(-11,6,5,8,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(11,6,5,8,0,0,Math.PI*2);ctx.fill();
  }

  ctx.fillStyle=hair;
  if(style==='spiky'||style==='short'||style==='cap'){
    ctx.beginPath();ctx.arc(0,-22,16,Math.PI,0);ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-14,-18);ctx.quadraticCurveTo(-6,-10,0,-15);
    ctx.quadraticCurveTo(6,-10,14,-18);ctx.lineTo(14,-22);ctx.lineTo(-14,-22);
    ctx.closePath();ctx.fill();
    if(style==='spiky'){
      [[-14,-30],[-7,-36],[0,-38],[7,-36],[14,-30],[-18,-24],[18,-24]].forEach(([sx,sy])=>{
        ctx.beginPath();
        ctx.moveTo(sx*0.5,-20);ctx.lineTo(sx,sy);ctx.lineTo(sx*0.3+5,-20);
        ctx.closePath();ctx.fill();
      });
    }
    if(style==='cap'){
      ctx.fillStyle='#2255aa';
      ctx.beginPath();ctx.ellipse(0,-28,17,8,0,0,Math.PI*2);ctx.fill();
      ctx.fillRect(-17,-28,34,6);
      ctx.fillStyle='#1a4080';
      ctx.fillRect(-20,-25,10,4);
    }
  } else if(style==='bun'){
    ctx.beginPath();ctx.arc(0,-22,16,Math.PI,0);ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-14,-18);ctx.quadraticCurveTo(-6,-10,0,-15);
    ctx.quadraticCurveTo(6,-10,14,-18);ctx.fill();
    ctx.beginPath();ctx.arc(0,-36,8,0,Math.PI*2);ctx.fill();
    ctx.fillStyle=shade(hair,30);
    ctx.beginPath();ctx.arc(-2,-38,2.5,0,Math.PI*2);ctx.fill();
  } else if(style==='curly'){
    [[-12,-28],[-4,-32],[4,-32],[12,-28],[-16,-22],[16,-22],[0,-26]].forEach(([sx,sy])=>{
      ctx.beginPath();ctx.arc(sx,sy,8,0,Math.PI*2);ctx.fill();
    });
    ctx.beginPath();
    ctx.moveTo(-14,-18);ctx.quadraticCurveTo(-6,-10,0,-15);
    ctx.quadraticCurveTo(6,-10,14,-18);ctx.fill();
  } else {
    ctx.beginPath();ctx.arc(0,-22,16,Math.PI,0);ctx.fill();
  }

  ctx.fillStyle=skin;
  ctx.beginPath();ctx.ellipse(-15,-20,3,4,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(15,-20,3,4,0,0,Math.PI*2);ctx.fill();

  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.ellipse(-6,-20,5.2,6.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(6,-20,5.2,6.2,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3d5a80';
  ctx.beginPath();ctx.arc(-6,-19.5,3.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(6,-19.5,3.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(-6,-19.5,1.7,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(6,-19.5,1.7,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-4.8,-21,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(7.2,-21,1.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(-7,-18,0.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-18,0.8,0,Math.PI*2);ctx.fill();

  ctx.strokeStyle=shade(hair,-20);
  ctx.lineWidth=1.6;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-11,-27);ctx.quadraticCurveTo(-6,-29,-1,-27);ctx.stroke();
  ctx.beginPath();ctx.moveTo(1,-27);ctx.quadraticCurveTo(6,-29,11,-27);ctx.stroke();

  ctx.strokeStyle='#b85a5a';
  ctx.lineWidth=1.3;
  ctx.beginPath();ctx.arc(0,-13,3.2,0.2,Math.PI-0.2);ctx.stroke();

  if(female){
    ctx.fillStyle='rgba(255,120,140,.28)';
    ctx.beginPath();ctx.ellipse(-11,-16,3.5,2,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(11,-16,3.5,2,0,0,Math.PI*2);ctx.fill();
  }

  if(opt.glasses){
    ctx.strokeStyle='#222';ctx.lineWidth=1.2;
    ctx.beginPath();ctx.ellipse(-6,-20,6,6.5,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(6,-20,6,6.5,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(-0.2,-20);ctx.lineTo(0.2,-20);ctx.stroke();
  }

  ctx.restore();
}

const SCALE=10;
const houses=[];
const DIST=[
  {n:'Hillcrest Gardens',code:'HG',st:['Hillcrest Rise','Orchard Lane'],ox:-90,col:'#86a55a'},
  {n:'Maple Close',code:'MC',st:['Maple Close','Elm Road'],ox:0,col:'#6fb35a'},
  {n:'Riverside Terrace',code:'RT',st:['River Walk','Wharf Street'],ox:90,col:'#7ab8a0'}
];
const areaOf=x=>DIST.find(d=>Math.abs(x-d.ox)<=50)||DIST[1];
const addr=(x,z)=>{const d=areaOf(x);const cols=[-42,-28,-14,0,14,28,42];let i=cols.indexOf(Math.round(x-d.ox));if(i<0)i=3;const no=z<3;return (no?2*(i+1):2*i+1)+' '+(d.st[no?0:1]||d.n)+', '+d.n};

const HP=[[-42,-22],[-28,-22],[-14,-22],[0,-22],[14,-22],[28,-22],[42,-22],[-42,-8],[-28,-8],[-14,-8],[0,-8],[14,-8],[28,-8],[42,-8],[-42,15],[-28,15],[-14,15],[0,15],[14,15],[28,15],[42,15],[-42,28],[-28,28],[-14,28],[0,28],[14,28],[28,28],[42,28]];
const HOUSE_COLS=['#f5d5a8','#c5dff5','#d4f0c4','#f5c8d8','#e5d8f5','#e0c4a8','#d4b896','#f0e0a0'];
DIST.forEach(d=>{
  HP.forEach(([rx,rz],i)=>{
    if(d.ox===0&&rx===0&&rz===-8)return;
    const x=d.ox+rx,z=rz;
    houses.push({x,z,w:8,d:6,col:HOUSE_COLS[i%HOUSE_COLS.length],roof:shade(HOUSE_COLS[i%HOUSE_COLS.length],-60),label:''});
    outRects.push([x,z,8,6]);
  });
});
houses.push({x:0,z:-8,w:8,d:6,col:'#ffe0a8',roof:'#c45a30',home:1});
outRects.push([0,-8,8,6]);
houses.push({x:28,z:-8,w:10,d:7,col:'#8ec5f0',roof:'#274c77',label:'📚',special:1});
outRects.push([28,-8,10,7]);
houses.push({x:-28,z:15,w:10,d:7,col:'#d4c0f0',roof:'#5a3d8a',label:'🎓',special:1});
outRects.push([-28,15,10,7]);
houses.push({x:0,z:15,w:8,d:6,col:'#f4a261',roof:'#9c4a1a',label:'🛒',special:1});
outRects.push([0,15,8,6]);
inRects.push([0,-4.4,1.4,.6],[4.3,-.1,.8,.9],[-3,-4,2.6,1.2],[3,-3.5,1.8,3.0],[4,2,.9,1.0],[-3.5,1.5,2.6,1.0]);

const P={position:{x:0,z:5},facing:0,walk:0};
let pOpt={color:'#2e86ab',hair:'#1d1410',skin:'#c68642',style:'spiky',gender:'male'};

function buildPlayer(){
  pOpt={
    color:hexColor(S.color),
    hair:hexColor(S.hair),
    skin:hexColor(S.skin),
    style:S.style||'spiky',
    gender:S.gender||'male',
    glasses:!!S.glasses
  };
}
function buildHost(n){}

NP.forEach(n=>{
  n.g={position:{x:n.door[0],z:n.lane},visible:true,facing:0};
  n.o=n.o||{};
  n.drawOpt={
    color:hexColor(n.color),
    hair:hexColor(n.hair),
    skin:hexColor(n.skin),
    style:(n.o&&n.o.style)||'short',
    gender:n.gender||'male',
    glasses:!!(n.o&&n.o.glasses)
  };
});

movers.push({o:{position:{x:-40,z:4.4}},v:6,ax:'x',min:-150,max:150,wrap:1,kind:'car'});

function setScene(inside,vis){
  if(typeof SFX!=='undefined'&&SFX.door)SFX.door();
  S.inside=inside;S.vis=vis||null;
  const hn=S.vis&&NP.find(x=>x.id===S.vis);
  if(S.vis&&!hn)S.vis=null;
  OUT.visible=!inside;INN.visible=inside&&!S.vis;INN2.visible=inside&&!!S.vis;
}
function enterHome(){setScene(true);P.position.x=0;P.position.z=2.2;toast('Inside your home');store()}
function leaveHome(){setScene(false);P.position.x=0;P.position.z=-3.4;toast('Back outside');store()}

const A_OUT=[
  {x:0,z:-4,r:4.5,label:'Enter home',fn:enterHome},
  {x:28,z:-3.4,r:4.5,label:'Enter library',fn:libraryMenu},
  {x:-28,z:10.8,r:4.5,label:'University admissions',fn:uniMenu},
  {x:0,z:11,r:4.5,label:'Enter shop',fn:shopMenu},
  ...DIST.map(d=>({x:d.ox+6,z:-1,r:2.4,label:'Bus stop',fn:busMenu})),
  ...NP.map(n=>({x:n.door[0],z:n.door[1],r:3.5,label:n.name+"'s house",fn:()=>visitDoor(n)}))
];
const A_IN=[
  {x:-3,z:-2.8,label:'Study desk',fn:deskMenu},
  {x:3,z:-1.6,label:'Sleep until morning',fn:()=>{S.energy=100;S.t=S.t%1440<420?Math.floor(S.t/1440)*1440+420:(Math.floor(S.t/1440)+1)*1440+420;gain('hunger',-25);gain('hygiene',-10);gain('fun',-5);S.nt=S.t;toast('You slept well. It is 07:00.');store()}},
  {x:-3,z:.2,r:2.2,label:'Watch TV',fn:tvMenu},
  {x:2.8,z:-.1,r:1.9,label:'Take a shower',fn:()=>{gain('hygiene',70);S.t+=15;toast('Fresh and clean. Hygiene +70');store()}},
  {x:4,z:.7,label:'Check fridge',fn:()=>{S.food=S.food||{};const s=Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+'x'+S.food[k]).join(', ')||'empty';toast('Fridge: '+s)}},
  {x:-3.2,z:3.2,r:1.7,label:'Decorate home',fn:decoMenu},
  {x:-2,z:2,r:1.5,label:'Do chores',fn:choresMenu},
  {x:0,z:-3.2,r:1.6,label:'Cook a meal',fn:cookMenu},
  {x:0,z:-.9,r:1.5,label:'Exercise',fn:workout},
  {x:0,z:3.6,label:'Leave home',fn:leaveHome}
];

const marker={rotation:{y:0},position:{y:5.8}};
const mk2=[{rotation:{y:0},position:{y:5.8}},{rotation:{y:0},position:{y:5.8}},{rotation:{y:0},position:{y:5.8}}];
const WM={color:{setHex(){}}};
function anim(){}

function w2s(wx,wz){
  return {x:(wx-camX)*SCALE+W/2, y:(wz-camY)*SCALE+H/2};
}
function toScreen(x,y,z){
  const s=w2s(x,z);
  return [s.x, s.y-42, true];
}

function drawHouse(h){
  const p=w2s(h.x,h.z);
  const pw=h.w*SCALE, pd=h.d*SCALE;
  ctx.fillStyle='rgba(0,0,0,.12)';
  ctx.beginPath();ctx.ellipse(p.x,p.y+pd/2+4,pw*0.55,8,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=h.roof||'#8a4030';
  ctx.beginPath();
  ctx.moveTo(p.x-pw/2-6,p.y-pd/2);
  ctx.lineTo(p.x,p.y-pd/2-16);
  ctx.lineTo(p.x+pw/2+6,p.y-pd/2);
  ctx.closePath();ctx.fill();
  ctx.fillStyle=h.col;
  ctx.fillRect(p.x-pw/2,p.y-pd/2,pw,pd);
  ctx.fillStyle='rgba(0,0,0,.08)';
  ctx.fillRect(p.x,p.y-pd/2,pw/2,pd);
  ctx.fillStyle='#6b3e26';
  ctx.fillRect(p.x-7,p.y+pd/2-22,14,22);
  ctx.fillStyle='#d4a017';
  ctx.beginPath();ctx.arc(p.x+4,p.y+pd/2-11,1.8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#9fd4f5';
  ctx.fillRect(p.x-pw/2+8,p.y-8,12,12);
  ctx.fillRect(p.x+pw/2-20,p.y-8,12,12);
  ctx.strokeStyle='rgba(255,255,255,.5)';ctx.lineWidth=1;
  ctx.strokeRect(p.x-pw/2+8,p.y-8,12,12);
  ctx.strokeRect(p.x+pw/2-20,p.y-8,12,12);
  if(h.home){
    ctx.fillStyle='rgba(0,0,0,.45)';
    ctx.fillRect(p.x-22,p.y-pd/2-28,44,14);
    ctx.fillStyle='#ffd23f';
    ctx.font='bold 11px system-ui,sans-serif';
    ctx.textAlign='center';
    ctx.fillText('YOUR HOME',p.x,p.y-pd/2-18);
  }
  if(h.label){
    ctx.font='22px system-ui';
    ctx.textAlign='center';
    ctx.fillText(h.label,p.x,p.y-4);
  }
}

function drawTree(wx,wz){
  const p=w2s(wx,wz);
  ctx.fillStyle='rgba(0,0,0,.12)';
  ctx.beginPath();ctx.ellipse(p.x,p.y+6,12,4,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#5c3a1e';
  ctx.fillRect(p.x-3,p.y-10,6,18);
  ctx.fillStyle='#2d8a3e';
  ctx.beginPath();ctx.arc(p.x,p.y-18,16,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3aa34f';
  ctx.beginPath();ctx.arc(p.x-8,p.y-14,10,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(p.x+8,p.y-14,10,0,Math.PI*2);ctx.fill();
}

function drawIndoor(){
  ctx.fillStyle='#e8c99a';
  const origin=w2s(0,0);
  const room=10*SCALE;
  ctx.fillRect(origin.x-room/2,origin.y-room/2,room,room);
  ctx.strokeStyle='rgba(0,0,0,.06)';ctx.lineWidth=1;
  for(let i=-5;i<=5;i++){
    ctx.beginPath();ctx.moveTo(origin.x+i*SCALE,origin.y-room/2);ctx.lineTo(origin.x+i*SCALE,origin.y+room/2);ctx.stroke();
    ctx.beginPath();ctx.moveTo(origin.x-room/2,origin.y+i*SCALE);ctx.lineTo(origin.x+room/2,origin.y+i*SCALE);ctx.stroke();
  }
  ctx.strokeStyle='#c9a46c';ctx.lineWidth=6;
  ctx.strokeRect(origin.x-room/2,origin.y-room/2,room,room);
  ctx.fillStyle='#5b7c99';
  ctx.fillRect(origin.x-28,origin.y-10,56,40);
  ctx.fillStyle='#4a6a85';
  ctx.fillRect(origin.x-22,origin.y-4,44,28);

  const items=[
    ['🛏',3,-1.6,'Bed'],['📺',-3,.2,'TV'],['🚿',2.8,-.1,'Shower'],
    ['📚',-3,-2.8,'Desk'],['🍳',0,-3.2,'Kitchen'],['💪',0,-.9,'Gym']
  ];
  items.forEach(([icon,x,z,label])=>{
    const p=w2s(x,z);
    ctx.fillStyle='rgba(255,255,255,.7)';
    ctx.fillRect(p.x-20,p.y-18,40,36);
    ctx.font='26px system-ui';ctx.textAlign='center';
    ctx.fillText(icon,p.x,p.y+4);
    ctx.fillStyle='#445';ctx.font='10px system-ui';
    ctx.fillText(label,p.x,p.y+16);
  });
  if(S&&S.vis){
    const n=NP.find(x=>x.id===S.vis);
    if(n){
      const p=w2s(0,-1.5);
      drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.35});
    }
  }
}

function drawWorld(){
  const rn=S&&typeof raining==='function'&&raining();
  if(S&&S.inside){
    ctx.fillStyle='#dfeef5';
    ctx.fillRect(0,0,W,H);
    drawIndoor();
  } else {
    ctx.fillStyle=rn?'#5a7a6a':'#6dbf5a';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle=rn?'rgba(255,255,255,.04)':'rgba(255,255,255,.06)';
    for(let i=0;i<40;i++){
      const gx=((i*97+camX*3)%W+W)%W;
      const gy=((i*53+camY*3)%H+H)%H;
      ctx.fillRect(gx,gy,2,2);
    }

    const road=w2s(0,3.2);
    ctx.fillStyle='#555b66';
    ctx.fillRect(0,road.y-3.2*SCALE,W,6.4*SCALE);
    ctx.fillStyle='#6a707a';
    ctx.fillRect(0,road.y-3.2*SCALE,W,3);
    ctx.fillRect(0,road.y+3.2*SCALE-3,W,3);
    ctx.strokeStyle='#f0e6a0';ctx.lineWidth=2;ctx.setLineDash([14,12]);
    ctx.beginPath();ctx.moveTo(0,road.y);ctx.lineTo(W,road.y);ctx.stroke();
    ctx.setLineDash([]);

    ctx.fillStyle='#c8c4b8';
    ctx.fillRect(0,road.y-3.2*SCALE-8,W,8);
    ctx.fillRect(0,road.y+3.2*SCALE,W,8);

    const drawList=[];
    houses.forEach(h=>drawList.push({z:h.z,type:'house',h}));
    for(let i=0;i<14;i++){
      const tx=-54+i*9, tz=(i%2?-26:30);
      drawList.push({z:tz,type:'tree',x:tx,tz});
    }
    NP.forEach(n=>{
      if(n.g&&n.g.visible)drawList.push({z:n.g.position.z,type:'npc',n});
    });
    movers.forEach(m=>drawList.push({z:m.o.position.z,type:'car',m}));
    if(S)drawList.push({z:P.position.z,type:'player'});
    drawList.sort((a,b)=>a.z-b.z);

    drawList.forEach(item=>{
      if(item.type==='house')drawHouse(item.h);
      else if(item.type==='tree')drawTree(item.x,item.tz);
      else if(item.type==='npc'){
        const n=item.n;
        const p=w2s(n.g.position.x,n.g.position.z);
        if(p.x<-50||p.x>W+50||p.y<-50||p.y>H+50)return;
        drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.15});
        if(S&&Math.hypot(n.g.position.x-P.position.x,n.g.position.z-P.position.z)<10){
          ctx.fillStyle='rgba(0,0,0,.5)';
          ctx.fillRect(p.x-28,p.y-52,56,14);
          ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.textAlign='center';
          ctx.fillText(n.name.split(' ')[0],p.x,p.y-42);
        }
      } else if(item.type==='car'){
        const m=item.m;
        const p=w2s(m.o.position.x,m.o.position.z);
        ctx.fillStyle='rgba(0,0,0,.15)';
        ctx.beginPath();ctx.ellipse(p.x,p.y+10,22,6,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#d1332b';
        ctx.fillRect(p.x-20,p.y-10,40,18);
        ctx.fillStyle='#f5f5f5';
        ctx.fillRect(p.x-10,p.y-16,20,10);
        ctx.fillStyle='#222';
        ctx.beginPath();ctx.arc(p.x-12,p.y+8,4,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(p.x+12,p.y+8,4,0,Math.PI*2);ctx.fill();
      } else if(item.type==='player'){
        const p=w2s(P.position.x,P.position.z);
        drawPerson(ctx,p.x,p.y,{...pOpt,scale:1.3});
      }
    });

    if(rn){
      ctx.strokeStyle='rgba(200,220,255,.35)';
      ctx.lineWidth=1.5;
      for(let i=0;i<50;i++){
        const rx=(i*47+performance.now()/8)%W;
        const ry=(i*31+performance.now()/5)%H;
        ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+10);ctx.stroke();
      }
    }
  }
}

function renderVehicles(){}
function renderDeco(){}

/* ===== 2D world — Lagos Life inspired cartoon style ===== */
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
function roundRect(x,y,w,h,r){
  r=Math.min(r,w/2,h/2);
  ctx.beginPath();
  ctx.moveTo(x+r,y);ctx.arcTo(x+w,y,x+w,y+h,r);ctx.arcTo(x+w,y+h,x,y+h,r);
  ctx.arcTo(x,y+h,x,y,r);ctx.arcTo(x,y,x+w,y,r);ctx.closePath();
}

function drawPerson(ctx,x,y,opt){
  opt=opt||{};
  const s=opt.scale||1;
  const skin=hexColor(opt.skin||'#c68642');
  const hair=hexColor(opt.hair||'#1d1410');
  const color=hexColor(opt.color||'#e4572e');
  const female=opt.gender==='female';
  const style=opt.style||'spiky';

  ctx.save();
  ctx.translate(x,y);
  ctx.scale(s,s);

  ctx.fillStyle='rgba(0,0,0,.18)';
  ctx.beginPath();ctx.ellipse(0,22,18,6,0,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=female?'#2b2140':'#1e2a3a';
  roundRect(-9,8,8,14,3);ctx.fill();
  roundRect(1,8,8,14,3);ctx.fill();
  ctx.fillStyle='#f5f5f5';
  roundRect(-10,19,10,4,2);ctx.fill();
  roundRect(0,19,10,4,2);ctx.fill();
  ctx.fillStyle='#222';
  ctx.fillRect(-10,21,10,2);ctx.fillRect(0,21,10,2);

  ctx.fillStyle=color;
  if(female){
    ctx.beginPath();
    ctx.moveTo(-12,8);ctx.lineTo(12,8);ctx.lineTo(14,-8);ctx.lineTo(-14,-8);
    ctx.closePath();ctx.fill();
    ctx.fillStyle=shade(color,40);
    ctx.fillRect(-12,-2,24,3);
  } else {
    roundRect(-11,-8,22,17,4);ctx.fill();
    ctx.fillStyle=shade(color,-30);
    ctx.beginPath();ctx.moveTo(-4,-8);ctx.lineTo(0,-3);ctx.lineTo(4,-8);ctx.fill();
  }

  ctx.fillStyle=color;
  roundRect(-16,-6,6,14,3);ctx.fill();
  roundRect(10,-6,6,14,3);ctx.fill();
  ctx.fillStyle=skin;
  ctx.beginPath();ctx.arc(-13,9,3.2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(13,9,3.2,0,Math.PI*2);ctx.fill();

  ctx.fillStyle=skin;
  ctx.fillRect(-4,-12,8,6);

  ctx.fillStyle=skin;
  ctx.beginPath();ctx.ellipse(0,-22,17,18,0,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='rgba(0,0,0,.12)';ctx.lineWidth=1.5;
  ctx.beginPath();ctx.ellipse(0,-22,17,18,0,0,Math.PI*2);ctx.stroke();

  ctx.fillStyle=hair;
  if(style==='long'||style==='curly'){
    ctx.beginPath();ctx.ellipse(0,-20,18,16,0,0,Math.PI*2);ctx.fill();
    if(style==='long'){
      ctx.fillRect(-17,-20,9,28);ctx.fillRect(8,-20,9,28);
    } else {
      [[-14,-30],[-6,-34],[2,-34],[10,-30],[-18,-24],[16,-24]].forEach(([sx,sy])=>{
        ctx.beginPath();ctx.arc(sx,sy,9,0,Math.PI*2);ctx.fill();
      });
    }
  }
  ctx.beginPath();ctx.arc(0,-26,18,Math.PI,0);ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-16,-20);ctx.quadraticCurveTo(-6,-12,0,-17);
  ctx.quadraticCurveTo(6,-12,16,-20);ctx.lineTo(16,-28);ctx.lineTo(-16,-28);
  ctx.closePath();ctx.fill();
  if(style==='spiky'){
    [[-12,-34],[-4,-40],[4,-40],[12,-34]].forEach(([sx,sy])=>{
      ctx.beginPath();ctx.moveTo(sx*.4,-24);ctx.lineTo(sx,sy);ctx.lineTo(sx*.2+6,-24);ctx.closePath();ctx.fill();
    });
  }
  if(style==='bun'){
    ctx.beginPath();ctx.arc(0,-40,9,0,Math.PI*2);ctx.fill();
  }
  if(style==='cap'){
    ctx.fillStyle='#1a5fb4';
    ctx.beginPath();ctx.ellipse(0,-32,18,9,0,0,Math.PI*2);ctx.fill();
    ctx.fillRect(-18,-32,36,7);
  }

  ctx.fillStyle=skin;
  ctx.beginPath();ctx.ellipse(-17,-22,3.5,4.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(17,-22,3.5,4.5,0,0,Math.PI*2);ctx.fill();

  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.ellipse(-7,-22,6,7,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(7,-22,6,7,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2a3a5c';
  ctx.beginPath();ctx.arc(-7,-21.5,3.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(7,-21.5,3.8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(-7,-21.5,2,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(7,-21.5,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-5.5,-23.5,1.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(8.5,-23.5,1.8,0,Math.PI*2);ctx.fill();

  ctx.strokeStyle=shade(hair,-15);ctx.lineWidth=2;ctx.lineCap='round';
  ctx.beginPath();ctx.moveTo(-12,-30);ctx.quadraticCurveTo(-7,-32,-2,-30);ctx.stroke();
  ctx.beginPath();ctx.moveTo(2,-30);ctx.quadraticCurveTo(7,-32,12,-30);ctx.stroke();

  ctx.strokeStyle='#c45a5a';ctx.lineWidth=1.6;
  ctx.beginPath();ctx.arc(0,-14,4,0.2,Math.PI-0.2);ctx.stroke();

  ctx.fillStyle='rgba(255,110,130,.3)';
  ctx.beginPath();ctx.ellipse(-12,-17,4,2.2,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(12,-17,4,2.2,0,0,Math.PI*2);ctx.fill();

  if(opt.glasses){
    ctx.strokeStyle='#222';ctx.lineWidth=1.4;
    ctx.beginPath();ctx.ellipse(-7,-22,7,7.5,0,0,Math.PI*2);ctx.stroke();
    ctx.beginPath();ctx.ellipse(7,-22,7,7.5,0,0,Math.PI*2);ctx.stroke();
  }

  ctx.restore();
}

const SCALE=11;
const houses=[];
const DIST=[
  {n:'Hillcrest Gardens',code:'HG',st:['Hillcrest Rise','Orchard Lane'],ox:-90,col:'#86a55a'},
  {n:'Maple Close',code:'MC',st:['Maple Close','Elm Road'],ox:0,col:'#6fb35a'},
  {n:'Riverside Terrace',code:'RT',st:['River Walk','Wharf Street'],ox:90,col:'#7ab8a0'}
];
const areaOf=x=>DIST.find(d=>Math.abs(x-d.ox)<=50)||DIST[1];
const addr=(x,z)=>{const d=areaOf(x);const cols=[-42,-28,-14,0,14,28,42];let i=cols.indexOf(Math.round(x-d.ox));if(i<0)i=3;const no=z<3;return (no?2*(i+1):2*i+1)+' '+(d.st[no?0:1]||d.n)+', '+d.n};

const HP=[[-42,-22],[-28,-22],[-14,-22],[0,-22],[14,-22],[28,-22],[42,-22],[-42,-8],[-28,-8],[-14,-8],[0,-8],[14,-8],[28,-8],[42,-8],[-42,15],[-28,15],[-14,15],[0,15],[14,15],[28,15],[42,15],[-42,28],[-28,28],[-14,28],[0,28],[14,28],[28,28],[42,28]];
const HOUSE_COLS=['#f7c948','#5dade2','#58d68d','#f1948a','#bb8fce','#f5b041','#76d7c4','#ec7063','#85c1e9','#f8c471'];
const ROOF_COLS=['#7b3f1d','#5d4e37','#8b4513','#6b3a2a','#4a3728'];
DIST.forEach(d=>{
  HP.forEach(([rx,rz],i)=>{
    if(d.ox===0&&rx===0&&rz===-8)return;
    const x=d.ox+rx,z=rz;
    houses.push({x,z,w:8,d:6,col:HOUSE_COLS[i%HOUSE_COLS.length],roof:ROOF_COLS[i%ROOF_COLS.length],label:''});
    outRects.push([x,z,8,6]);
  });
});
houses.push({x:0,z:-8,w:8,d:6,col:'#f7c948',roof:'#8b3a1a',home:1});
outRects.push([0,-8,8,6]);
houses.push({x:28,z:-8,w:10,d:7,col:'#5dade2',roof:'#1a5276',label:'📚',special:1});
outRects.push([28,-8,10,7]);
houses.push({x:-28,z:15,w:10,d:7,col:'#bb8fce',roof:'#4a235a',label:'🎓',special:1});
outRects.push([-28,15,10,7]);
houses.push({x:0,z:15,w:8,d:6,col:'#e67e22',roof:'#6e2c00',label:'🛒',special:1});
outRects.push([0,15,8,6]);
inRects.push([0,-4.4,1.4,.6],[4.3,-.1,.8,.9],[-3,-4,2.6,1.2],[3,-3.5,1.8,3.0],[4,2,.9,1.0],[-3.5,1.5,2.6,1.0]);

const P={position:{x:0,z:5},facing:0,walk:0};
let pOpt={color:'#e4572e',hair:'#1d1410',skin:'#c68642',style:'spiky',gender:'male'};

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

function w2s(wx,wz){return {x:(wx-camX)*SCALE+W/2, y:(wz-camY)*SCALE+H/2}}
function toScreen(x,y,z){const s=w2s(x,z);return [s.x, s.y-48, true]}

function drawHouse(h){
  const p=w2s(h.x,h.z);
  const pw=h.w*SCALE, pd=h.d*SCALE;
  ctx.fillStyle='rgba(0,0,0,.15)';
  ctx.beginPath();ctx.ellipse(p.x+4,p.y+pd/2+6,pw*0.55,9,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=h.roof||'#7b3f1d';
  ctx.beginPath();
  ctx.moveTo(p.x-pw/2-8,p.y-pd/2+2);
  ctx.lineTo(p.x,p.y-pd/2-18);
  ctx.lineTo(p.x+pw/2+8,p.y-pd/2+2);
  ctx.closePath();ctx.fill();
  ctx.strokeStyle='rgba(255,255,255,.12)';ctx.lineWidth=1;
  ctx.beginPath();ctx.moveTo(p.x-pw/4,p.y-pd/2-6);ctx.lineTo(p.x+pw/4,p.y-pd/2-6);ctx.stroke();
  ctx.fillStyle=h.col;
  ctx.fillRect(p.x-pw/2,p.y-pd/2,pw,pd);
  ctx.fillStyle='rgba(0,0,0,.1)';
  ctx.fillRect(p.x,p.y-pd/2,pw/2,pd);
  ctx.fillStyle='#5c3317';
  roundRect(p.x-8,p.y+pd/2-24,16,24,2);ctx.fill();
  ctx.fillStyle='#f1c40f';
  ctx.beginPath();ctx.arc(p.x+4,p.y+pd/2-12,2,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#aed6f1';
  ctx.fillRect(p.x-pw/2+8,p.y-10,14,14);
  ctx.fillRect(p.x+pw/2-22,p.y-10,14,14);
  ctx.strokeStyle='#fff';ctx.lineWidth=2;
  ctx.strokeRect(p.x-pw/2+8,p.y-10,14,14);
  ctx.strokeRect(p.x+pw/2-22,p.y-10,14,14);
  if(h.home){
    ctx.fillStyle='rgba(0,0,0,.5)';
    roundRect(p.x-28,p.y-pd/2-34,56,16,6);ctx.fill();
    ctx.fillStyle='#f1c40f';
    ctx.font='bold 12px system-ui,sans-serif';
    ctx.textAlign='center';
    ctx.fillText('YOUR HOME',p.x,p.y-pd/2-22);
  }
  if(h.label){
    ctx.font='24px system-ui';
    ctx.textAlign='center';
    ctx.fillText(h.label,p.x,p.y);
  }
}

function drawTree(wx,wz){
  const p=w2s(wx,wz);
  ctx.fillStyle='rgba(0,0,0,.12)';
  ctx.beginPath();ctx.ellipse(p.x,p.y+8,14,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#6e3b1e';
  ctx.fillRect(p.x-3.5,p.y-8,7,18);
  ctx.fillStyle='#1e8449';
  ctx.beginPath();ctx.arc(p.x,p.y-18,17,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#27ae60';
  ctx.beginPath();ctx.arc(p.x-9,p.y-14,11,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(p.x+9,p.y-14,11,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#2ecc71';
  ctx.beginPath();ctx.arc(p.x,p.y-26,10,0,Math.PI*2);ctx.fill();
}

function drawIndoor(){
  ctx.fillStyle='#e8c99a';
  const origin=w2s(0,0);
  const room=10*SCALE;
  ctx.fillRect(origin.x-room/2,origin.y-room/2,room,room);
  ctx.fillStyle='#fdebd0';
  ctx.fillRect(origin.x-room/2,origin.y-room/2,room,14);
  ctx.strokeStyle='#c9a46c';ctx.lineWidth=6;
  ctx.strokeRect(origin.x-room/2,origin.y-room/2,room,room);
  ctx.fillStyle='#c0392b';
  roundRect(origin.x-32,origin.y-8,64,44,8);ctx.fill();
  ctx.fillStyle='#e74c3c';
  roundRect(origin.x-24,origin.y-2,48,32,6);ctx.fill();

  const items=[
    ['🛏',3,-1.6,'Bed'],['📺',-3,.2,'TV'],['🚿',2.8,-.1,'Shower'],
    ['📚',-3,-2.8,'Desk'],['🍳',0,-3.2,'Kitchen'],['💪',0,-.9,'Gym']
  ];
  items.forEach(([icon,x,z,label])=>{
    const p=w2s(x,z);
    ctx.fillStyle='#fff';
    roundRect(p.x-22,p.y-20,44,40,10);ctx.fill();
    ctx.font='28px system-ui';ctx.textAlign='center';
    ctx.fillText(icon,p.x,p.y+2);
    ctx.fillStyle='#555';ctx.font='10px system-ui';
    ctx.fillText(label,p.x,p.y+16);
  });
  if(S&&S.vis){
    const n=NP.find(x=>x.id===S.vis);
    if(n){
      const p=w2s(0,-1.5);
      drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.4});
    }
  }
}

function drawWorld(){
  const rn=S&&typeof raining==='function'&&raining();
  if(S&&S.inside){
    ctx.fillStyle='#d5f5e3';
    ctx.fillRect(0,0,W,H);
    drawIndoor();
  } else {
    ctx.fillStyle=rn?'#5d8a6a':'#5dba5a';
    ctx.fillRect(0,0,W,H);
    ctx.fillStyle=rn?'rgba(120,90,50,.12)':'rgba(180,140,60,.1)';
    for(let i=0;i<25;i++){
      const gx=((i*91+camX*2)%W+W)%W;
      const gy=((i*57+camY*2)%H+H)%H;
      ctx.beginPath();ctx.ellipse(gx,gy,18,8,0,0,Math.PI*2);ctx.fill();
    }

    const road=w2s(0,3.2);
    ctx.fillStyle='#4a4e56';
    ctx.fillRect(0,road.y-3.2*SCALE,W,6.4*SCALE);
    ctx.fillStyle='#f1c40f';
    ctx.fillRect(0,road.y-3.2*SCALE,W,3);
    ctx.fillRect(0,road.y+3.2*SCALE-3,W,3);
    ctx.strokeStyle='#f7dc6f';ctx.lineWidth=2;ctx.setLineDash([16,12]);
    ctx.beginPath();ctx.moveTo(0,road.y);ctx.lineTo(W,road.y);ctx.stroke();
    ctx.setLineDash([]);
    ctx.fillStyle='#d5d0c4';
    ctx.fillRect(0,road.y-3.2*SCALE-10,W,10);
    ctx.fillRect(0,road.y+3.2*SCALE,W,10);

    const drawList=[];
    houses.forEach(h=>drawList.push({z:h.z,type:'house',h}));
    for(let i=0;i<14;i++){
      const tx=-54+i*9, tz=(i%2?-26:30);
      drawList.push({z:tz,type:'tree',x:tx,tz});
    }
    NP.forEach(n=>{if(n.g&&n.g.visible)drawList.push({z:n.g.position.z,type:'npc',n})});
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
        drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.2});
        if(S&&Math.hypot(n.g.position.x-P.position.x,n.g.position.z-P.position.z)<10){
          ctx.fillStyle='rgba(0,0,0,.55)';
          roundRect(p.x-30,p.y-56,60,16,6);ctx.fill();
          ctx.fillStyle='#fff';ctx.font='bold 12px system-ui';ctx.textAlign='center';
          ctx.fillText(n.name.split(' ')[0],p.x,p.y-44);
        }
      } else if(item.type==='car'){
        const m=item.m;
        const p=w2s(m.o.position.x,m.o.position.z);
        ctx.fillStyle='rgba(0,0,0,.15)';
        ctx.beginPath();ctx.ellipse(p.x,p.y+12,24,7,0,0,Math.PI*2);ctx.fill();
        ctx.fillStyle='#f1c40f';
        roundRect(p.x-22,p.y-12,44,20,5);ctx.fill();
        ctx.fillStyle='#1a5276';
        roundRect(p.x-12,p.y-18,24,10,3);ctx.fill();
        ctx.fillStyle='#222';
        ctx.beginPath();ctx.arc(p.x-14,p.y+10,5,0,Math.PI*2);ctx.fill();
        ctx.beginPath();ctx.arc(p.x+14,p.y+10,5,0,Math.PI*2);ctx.fill();
      } else if(item.type==='player'){
        const p=w2s(P.position.x,P.position.z);
        drawPerson(ctx,p.x,p.y,{...pOpt,scale:1.35});
      }
    });

    if(rn){
      ctx.strokeStyle='rgba(220,235,255,.4)';
      ctx.lineWidth=1.5;
      for(let i=0;i<55;i++){
        const rx=(i*47+performance.now()/8)%W;
        const ry=(i*31+performance.now()/5)%H;
        ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-2,ry+11);ctx.stroke();
      }
    }
  }
}

function renderVehicles(){}
function renderDeco(){}

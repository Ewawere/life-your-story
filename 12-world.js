/* ===== 2D world (canvas) ===== */
const cnv=$('c'), ctx=cnv.getContext('2d');
let W=innerWidth, H=innerHeight, camX=0, camY=0, zoom=1;
function resize(){W=innerWidth;H=innerHeight;cnv.width=W*devicePixelRatio;cnv.height=H*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)}
addEventListener('resize',resize);resize();

const R={setSize(){},render(){}}, sc={}, cam={position:{x:0,y:0,z:0},lookAt(){},aspect:1,updateProjectionMatrix(){}};
let yaw=0;

const outRects=[], inRects=[], acts=[], movers=[];
const OUT={visible:true}, INN={visible:false}, INN2={visible:false};

function drawPerson(ctx,x,y,opt){
  opt=opt||{};
  const scale=opt.scale||1;
  const skin=opt.skin||'#c68642';
  const hair=opt.hair||'#1d1410';
  const color=opt.color||'#2e86ab';
  const female=opt.gender==='female';
  const style=opt.style||'spiky';
  ctx.save();
  ctx.translate(x,y);
  ctx.scale(scale,scale);
  ctx.fillStyle='rgba(0,0,0,.18)';
  ctx.beginPath();ctx.ellipse(0,18,14,5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=female?'#4a3a5c':'#2c3344';
  ctx.fillRect(-7,6,5,12);ctx.fillRect(2,6,5,12);
  ctx.fillStyle='#1a1a1a';
  ctx.fillRect(-8,16,7,3);ctx.fillRect(1,16,7,3);
  ctx.fillStyle=color;
  if(female){
    ctx.beginPath();
    ctx.moveTo(-9,6);ctx.lineTo(9,6);ctx.lineTo(11,-6);ctx.lineTo(-11,-6);
    ctx.closePath();ctx.fill();
  } else {
    ctx.fillRect(-9,-6,18,14);
  }
  ctx.fillStyle=color;
  ctx.fillRect(-13,-4,4,12);
  ctx.fillRect(9,-4,4,12);
  ctx.fillStyle=skin;
  ctx.beginPath();ctx.arc(-11,9,2.5,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(11,9,2.5,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=skin;
  ctx.beginPath();ctx.arc(0,-18,14,0,Math.PI*2);ctx.fill();
  ctx.fillStyle=hair;
  if(style==='spiky'||style==='short'){
    ctx.beginPath();ctx.arc(0,-20,15,Math.PI,0);ctx.fill();
    const spikes=[[-12,-28],[-6,-34],[0,-36],[6,-34],[12,-28],[-16,-22],[16,-22]];
    spikes.forEach(([sx,sy])=>{
      ctx.beginPath();
      ctx.moveTo(sx*.6,-18);ctx.lineTo(sx,sy);ctx.lineTo(sx*.4+4,-18);
      ctx.closePath();ctx.fill();
    });
    ctx.beginPath();ctx.moveTo(-10,-18);ctx.quadraticCurveTo(-4,-10,0,-14);ctx.quadraticCurveTo(4,-10,10,-18);ctx.fill();
  } else if(style==='long'){
    ctx.beginPath();ctx.arc(0,-20,15,Math.PI,0);ctx.fill();
    ctx.fillRect(-14,-18,8,22);ctx.fillRect(6,-18,8,22);
  } else if(style==='bun'){
    ctx.beginPath();ctx.arc(0,-20,15,Math.PI,0);ctx.fill();
    ctx.beginPath();ctx.arc(0,-34,7,0,Math.PI*2);ctx.fill();
  } else if(style==='curly'){
    [[-10,-26],[0,-30],[10,-26],[-14,-20],[14,-20]].forEach(([sx,sy])=>{
      ctx.beginPath();ctx.arc(sx,sy,7,0,Math.PI*2);ctx.fill();
    });
  } else {
    ctx.beginPath();ctx.arc(0,-20,15,Math.PI,0);ctx.fill();
  }
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.ellipse(-5,-18,4.5,5.5,0,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.ellipse(5,-18,4.5,5.5,0,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#3d5a80';
  ctx.beginPath();ctx.arc(-5,-17.5,2.8,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-17.5,2.8,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#111';
  ctx.beginPath();ctx.arc(-5,-17.5,1.4,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(5,-17.5,1.4,0,Math.PI*2);ctx.fill();
  ctx.fillStyle='#fff';
  ctx.beginPath();ctx.arc(-4,-19,1.1,0,Math.PI*2);ctx.fill();
  ctx.beginPath();ctx.arc(6,-19,1.1,0,Math.PI*2);ctx.fill();
  ctx.strokeStyle='#b85a5a';ctx.lineWidth=1.2;
  ctx.beginPath();ctx.arc(0,-12,3,0.15,Math.PI-0.15);ctx.stroke();
  if(female){
    ctx.fillStyle='rgba(255,120,140,.25)';
    ctx.beginPath();ctx.ellipse(-9,-14,3,1.5,0,0,Math.PI*2);ctx.fill();
    ctx.beginPath();ctx.ellipse(9,-14,3,1.5,0,0,Math.PI*2);ctx.fill();
  }
  ctx.restore();
}

function hexColor(c){
  if(typeof c==='string')return c;
  if(typeof c==='number')return '#'+c.toString(16).padStart(6,'0');
  return '#888';
}

const SCALE=8;
const houses=[];
const DIST=[
  {n:'Hillcrest Gardens',code:'HG',st:['Hillcrest Rise','Orchard Lane'],ox:-90,col:'#86a55a'},
  {n:'Maple Close',code:'MC',st:['Maple Close','Elm Road'],ox:0,col:'#6fb35a'},
  {n:'Riverside Terrace',code:'RT',st:['River Walk','Wharf Street'],ox:90,col:'#7ab8a0'}
];
const areaOf=x=>DIST.find(d=>Math.abs(x-d.ox)<=50)||DIST[1];
const addr=(x,z)=>{const d=areaOf(x);const cols=[-42,-28,-14,0,14,28,42];let i=cols.indexOf(Math.round(x-d.ox));if(i<0)i=3;const no=z<3;return (no?2*(i+1):2*i+1)+' '+(d.st[no?0:1]||d.n)+', '+d.n};

const HP=[[-42,-22],[-28,-22],[-14,-22],[0,-22],[14,-22],[28,-22],[42,-22],[-42,-8],[-28,-8],[-14,-8],[0,-8],[14,-8],[28,-8],[42,-8],[-42,15],[-28,15],[-14,15],[0,15],[14,15],[28,15],[42,15],[-42,28],[-28,28],[-14,28],[0,28],[14,28],[28,28],[42,28]];
const HOUSE_COLS=['#ffd9a0','#b9d9ff','#d9f2b9','#f2c6d9','#e3d3ff','#c9a27e','#b08968'];
DIST.forEach(d=>{
  HP.forEach(([rx,rz],i)=>{
    if(d.ox===0&&rx===0&&rz===-8)return;
    const x=d.ox+rx,z=rz;
    houses.push({x,z,w:8,d:6,col:HOUSE_COLS[i%HOUSE_COLS.length],roof:'#b5523b',label:''});
    outRects.push([x,z,8,6]);
  });
});
houses.push({x:0,z:-8,w:8,d:6,col:'#ffd9a0',roof:'#b5523b',home:1});
outRects.push([0,-8,8,6]);
houses.push({x:28,z:-8,w:10,d:7,col:'#6fa8dc',roof:'#274c77',label:'📚'});
outRects.push([28,-8,10,7]);
houses.push({x:-28,z:15,w:10,d:7,col:'#c9b6e8',roof:'#5a3d8a',label:'🎓'});
outRects.push([-28,15,10,7]);
houses.push({x:0,z:15,w:8,d:6,col:'#f4a261',roof:'#9c4a1a',label:'🛒'});
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
    gender:S.gender||'male'
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
    gender:n.gender||'male'
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
  return {
    x:(wx-camX)*SCALE+W/2,
    y:(wz-camY)*SCALE+H/2
  };
}
function toScreen(x,y,z){
  const s=w2s(x,z);
  return [s.x, s.y-36, true];
}

function drawHouse(h){
  const p=w2s(h.x,h.z);
  const pw=h.w*SCALE, pd=h.d*SCALE;
  ctx.fillStyle=h.roof||'#8a4030';
  ctx.fillRect(p.x-pw/2-2,p.y-pd/2-8,pw+4,10);
  ctx.fillStyle=h.col;
  ctx.fillRect(p.x-pw/2,p.y-pd/2,pw,pd);
  ctx.fillStyle='#6b4226';
  ctx.fillRect(p.x-6,p.y+pd/2-18,12,18);
  ctx.fillStyle='#9fd0f0';
  ctx.fillRect(p.x-pw/2+6,p.y-6,10,10);
  ctx.fillRect(p.x+pw/2-16,p.y-6,10,10);
  if(h.home){
    ctx.fillStyle='#ffd23f';
    ctx.font='bold 12px system-ui';
    ctx.textAlign='center';
    ctx.fillText('HOME',p.x,p.y-pd/2-12);
  }
  if(h.label){
    ctx.font='20px system-ui';
    ctx.textAlign='center';
    ctx.fillText(h.label,p.x,p.y);
  }
}

function drawIndoor(){
  ctx.fillStyle='#d8b98a';
  const origin=w2s(0,0);
  ctx.fillRect(origin.x-5*SCALE,origin.y-5*SCALE,10*SCALE,10*SCALE);
  ctx.strokeStyle='#c9a46c';ctx.lineWidth=4;
  ctx.strokeRect(origin.x-5*SCALE,origin.y-5*SCALE,10*SCALE,10*SCALE);
  const items=[['🛏',3,-1.6],['📺',-3,.2],['🚿',2.8,-.1],['📚',-3,-2.8],['🍳',0,-3.2],['💪',0,-.9]];
  items.forEach(([icon,x,z])=>{
    const p=w2s(x,z);
    ctx.font='28px system-ui';ctx.textAlign='center';
    ctx.fillText(icon,p.x,p.y);
  });
  if(S.vis){
    const n=NP.find(x=>x.id===S.vis);
    if(n){
      const p=w2s(0,-1.5);
      drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.3});
    }
  }
}

function drawWorld(){
  const rn=typeof raining==='function'&&raining();
  ctx.fillStyle=rn?'#5a7a8a':(S&&S.inside?'#cfe3ee':'#87c96e');
  ctx.fillRect(0,0,W,H);

  if(S&&S.inside){
    drawIndoor();
  } else {
    const road=w2s(0,3);
    ctx.fillStyle='#4a4f57';
    ctx.fillRect(0,road.y-3*SCALE,W,6*SCALE);
    ctx.strokeStyle='#f0f0f0';ctx.lineWidth=2;ctx.setLineDash([12,10]);
    ctx.beginPath();ctx.moveTo(0,road.y);ctx.lineTo(W,road.y);ctx.stroke();
    ctx.setLineDash([]);

    houses.forEach(drawHouse);

    for(let i=0;i<12;i++){
      const tx=-48+i*9, tz=(i%2?-24:28);
      const p=w2s(tx,tz);
      ctx.fillStyle='#6b4226';ctx.fillRect(p.x-3,p.y-8,6,16);
      ctx.fillStyle='#2f8f3e';
      ctx.beginPath();ctx.arc(p.x,p.y-14,14,0,Math.PI*2);ctx.fill();
    }

    NP.forEach(n=>{
      if(!n.g||!n.g.visible)return;
      const p=w2s(n.g.position.x,n.g.position.z);
      if(p.x<-40||p.x>W+40||p.y<-40||p.y>H+40)return;
      drawPerson(ctx,p.x,p.y,{...n.drawOpt,scale:1.1});
      if(S&&Math.hypot(n.g.position.x-P.position.x,n.g.position.z-P.position.z)<8){
        ctx.fillStyle='#fff';ctx.font='11px system-ui';ctx.textAlign='center';
        ctx.fillText(n.name,p.x,p.y-40);
      }
    });

    movers.forEach(m=>{
      if(m.kind!=='car')return;
      const p=w2s(m.o.position.x,m.o.position.z);
      ctx.fillStyle='#d1332b';
      ctx.fillRect(p.x-16,p.y-8,32,16);
      ctx.fillStyle='#f5f5f5';
      ctx.fillRect(p.x-8,p.y-12,16,8);
    });
  }

  if(S){
    const p=w2s(P.position.x,P.position.z);
    drawPerson(ctx,p.x,p.y,{...pOpt,scale:1.25});
  }
}

function renderVehicles(){}
function renderDeco(){}

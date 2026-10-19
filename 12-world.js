/* ===== 3D world (world/) ===== */
let R=null;
try{R=new THREE.WebGLRenderer({canvas:$('c'),antialias:false});R.setPixelRatio(Math.min(devicePixelRatio||1,2));}catch(e){console.warn('WebGL unavailable',e)}
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,200);
const hemi=new THREE.HemisphereLight(0xffffff,0x557755,.9),sun=new THREE.DirectionalLight(0xffffff,.6);
sun.position.set(10,20,10);sc.add(hemi,sun);
sc.background=new THREE.Color(0x9ad3ff);const OUT=new THREE.Group(),INN=new THREE.Group();sc.add(OUT,INN);
function box(g,w,h,d,c,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m}
function cyl(g,rt,rb,h,c,x,y,z,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||8),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m}
function person(color,hair,skin,o){
  // Anime-styled proportions: big head, large eyes, slim body
  o=o||{};skin=skin||0x8d5a3b;hair=hair||0x1d1410;
  const g=new THREE.Group(),L=c=>new THREE.MeshLambertMaterial({color:c}),pants=o.pants||0x2c3344;
  const sub=(x,y,z)=>{const q=new THREE.Group();q.position.set(x,y,z);g.add(q);return q};
  const sph=(q,r,c,x,y,z,seg)=>{const m=new THREE.Mesh(new THREE.SphereGeometry(r,seg||14,seg||12),L(c));m.position.set(x,y,z);q.add(m);return m};
  // Slim legs + shoes
  const lL=sub(-.14,.78,0),lR=sub(.14,.78,0);
  [lL,lR].forEach(q=>{cyl(q,.09,.08,.7,pants,0,-.34,0,8);box(q,.2,.1,.34,0x1a1a1a,0,-.74,.05)});
  // Slim torso + hips
  const torso=sub(0,0,0);
  cyl(torso,.24,.28,.95,color,0,.98,0,12);
  cyl(torso,.26,.26,.18,pants,0,.5,0,10);
  // Neck
  cyl(torso,.07,.08,.14,skin,0,1.55,0,8);
  if(o.dress)cyl(torso,.28,.42,.7,color,0,.55,0,12);
  // Slim arms
  const aL=sub(-.38,1.4,0),aR=sub(.38,1.4,0);
  [aL,aR].forEach(q=>{cyl(q,.07,.06,.6,color,0,-.3,0,8);sph(q,.075,skin,0,-.64,0,10)});
  // Big anime head
  const head=sub(0,1.86,0);
  sph(head,.4,skin,0,0,0,16);
  // Small ears
  [-.38,.38].forEach(x=>sph(head,.06,skin,x,0,0,8));
  // Large eyes with white, iris, pupil, shine
  [-.13,.13].forEach(x=>{
    sph(head,.09,0xffffff,x,.04,.34,12);
    sph(head,.055,0x3d5a80,x,.04,.38,10);
    sph(head,.028,0x111122,x,.04,.41,8);
    sph(head,.02,0xffffff,x+.02,.07,.42,6);
  });
  // Thin brows
  [-.13,.13].forEach(x=>box(head,.12,.015,.02,hair,x,.16,.35));
  // Tiny nose + small mouth
  sph(head,.025,skin,0,-.02,.38,8);
  box(head,.07,.018,.015,0xb85a5a,0,-.14,.36);
  // Voluminous anime hair
  const st=o.style||'short';
  if(st!=='bald'){
    const cap=new THREE.Mesh(new THREE.SphereGeometry(.42,16,12,0,Math.PI*2,0,Math.PI*0.55),L(st==='cap'?(o.hat||0x2255aa):hair));
    cap.position.y=.08;head.add(cap);
    if(st!=='cap'){
      [[-.12,.2,.32],[.12,.2,.32],[0,.22,.34],[-.22,.12,.28],[.22,.12,.28]].forEach(([x,y,z])=>sph(head,.1,hair,x,y,z,8));
    }
  }
  if(st==='long'){
    box(head,.85,1.0,.28,hair,0,-.35,-.2);
    [[-.32,-.2],[.32,-.2],[-.2,-.5],[.2,-.5]].forEach(([x,y])=>sph(head,.16,hair,x,y,-.1,8));
  }
  if(st==='bun'){
    sph(head,.18,hair,0,.48,-.05,12);
    sph(head,.12,hair,0,.58,-.05,10);
  }
  if(st==='curly'){
    [[-.22,.22],[.22,.22],[0,.32],[-.3,.08],[.3,.08],[0,.15],[-.18,.3],[.18,.3],[-.25,.18],[.25,.18]].forEach(([x,y])=>sph(head,.15,hair,x,y+.05,0,8));
  }
  if(st==='cap'){
    box(head,.48,.05,.32,o.hat||0x2255aa,0,.14,.3);
    cyl(head,.24,.24,.14,o.hat||0x2255aa,0,.2,0,12);
  }
  if(o.glasses)[-.13,.13].forEach(x=>{const t=new THREE.Mesh(new THREE.TorusGeometry(.1,.014,6,16),L(0x222222));t.position.set(x,.04,.36);head.add(t)});
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,.02,14),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.2}));
  sh.position.y=.02;g.add(sh);
  g.userData={lL,lR,aL,aR,torso,head};
  return g;
}
function anim(g,sp,t){const u=g&&g.userData;if(!u||!u.lL)return;const a=Math.sin(t*9)*.7*sp;u.lL.rotation.x=a;u.lR.rotation.x=-a;u.aL.rotation.x=-a*.8;u.aR.rotation.x=a*.8;u.head.rotation.y=Math.sin(t*1.3)*.15*(1-sp);u.torso.scale.y=1+Math.sin(t*2.2)*.012}

const outRects=[],inRects=[],acts=[],movers=[];
box(OUT,320,.1,110,0x6fb35a,0,-.05,0);box(OUT,320,.12,6,0x4a4f57,0,0,3);
for(let x=-150;x<150;x+=6)box(OUT,2.5,.14,.25,0xf0f0f0,x,0,3);
const WM=new THREE.MeshBasicMaterial({color:0x9fd0f0});const wn=(x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.2,.12),WM);m.position.set(x,y,z);OUT.add(m)};
[[0,-8,0xffd9a0]].forEach(([x,z,c])=>{box(OUT,8,4,6,c,x,2,z);box(OUT,9,1,7,0xb5523b,x,4.5,z);outRects.push([x,z,8,6]);const fz=z+3;box(OUT,1.4,2.4,.2,0x6b4226,x,1.2,fz+.05);[-2.4,2.4].forEach(d=>wn(x+d,2.4,fz+.07));});
box(OUT,10,4,7,0x6fa8dc,28,2,-8);box(OUT,11,1,8,0x274c77,28,4.5,-8);outRects.push([28,-8,10,7]);box(OUT,1.8,2.6,.2,0x2b2b2b,28,1.3,-4.45);box(OUT,4,.06,3,0x3a86ff,28,.09,-3.4);
box(OUT,10,4,7,0xc9b6e8,-28,2,15);box(OUT,11,1,8,0x5a3d8a,-28,4.5,15);outRects.push([-28,15,10,7]);box(OUT,1.8,2.6,.2,0x2b2b2b,-28,1.3,11.55);box(OUT,4,.06,3,0x9b5de5,-28,.09,10.4);
Array.from({length:20},(_,i)=>-140+i*14).forEach(x=>{cyl(OUT,.08,.1,4,0x333333,x,2,-.9,6);const b=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),new THREE.MeshBasicMaterial({color:0xfff2b0}));b.position.set(x,4.1,-.9);OUT.add(b)});
box(OUT,8,4,6,0xf4a261,0,2,15);box(OUT,9,1,7,0x9c4a1a,0,4.5,15);outRects.push([0,15,8,6]);box(OUT,1.4,2.4,.2,0x6b4226,0,1.2,11.95);box(OUT,4,.06,3,0xf4a261,0,.09,10.6);box(OUT,6,.8,.3,0xfff1d0,0,3.3,11.8);
const DIST=[{n:'Hillcrest Gardens',code:'HG',st:['Hillcrest Rise','Orchard Lane'],ox:-90,gr:0x86a55a,wall:[0xc9a27e,0xb08968,0xd8c3a5,0xa68a64,0xbfa58a],roof:0x6b3f2a},{n:'Maple Close',code:'MC',st:['Maple Close','Elm Road'],ox:0},{n:'Riverside Terrace',code:'RT',st:['River Walk','Wharf Street'],ox:90,gr:0x7ab8a0,wall:[0xf4f1ea,0xdfe9f2,0xe8e0f0,0xd7ecec,0xfbe9d0],roof:0x3b6ea5}];
const areaOf=x=>DIST.find(d=>Math.abs(x-d.ox)<=50)||DIST[1];
const addr=(x,z)=>{const d=areaOf(x);const cols=[-42,-28,-14,0,14,28,42];let i=cols.indexOf(Math.round(x-d.ox));if(i<0)i=3;const no=z<3;return (no?2*(i+1):2*i+1)+' '+(d.st[no?0:1]||d.n)+', '+d.n};
function house(x,z,c,roof){box(OUT,8,4,6,c,x,2,z);box(OUT,9,1,7,roof,x,4.5,z);outRects.push([x,z,8,6]);const fz=z<3?z+3:z-3,sg=z<3?1:-1;box(OUT,1.4,2.4,.2,0x6b4226,x,1.2,fz+.05*sg);[-2.4,2.4].forEach(d=>wn(x+d,2.4,fz+.07*sg))}
const HP=[[-42,-22],[-28,-22],[-14,-22],[0,-22],[14,-22],[28,-22],[42,-22],[-42,-8],[-28,-8],[-14,-8],[0,-8],[14,-8],[28,-8],[42,-8],[-42,15],[-28,15],[-14,15],[0,15],[14,15],[28,15],[42,15],[-42,28],[-28,28],[-14,28],[0,28],[14,28],[28,28],[42,28]];
DIST.forEach(d=>{if(d.gr)box(OUT,100,.04,100,d.gr,d.ox,.01,3);const walls=d.wall||[0xffd9a0,0xb9d9ff,0xd9f2b9,0xf2c6d9,0xe3d3ff],roof=d.roof||0xb5523b;HP.forEach(([rx,rz],i)=>{if(d.ox===0&&rx===0&&rz===-8)return;house(d.ox+rx,rz,walls[i%walls.length],roof)});for(let i=0;i<9;i++){const x=d.ox-48+i*12,z=i%2?-30:34;cyl(OUT,.2,.25,1.6,0x6b4226,x,.8,z,6);const l=new THREE.Mesh(new THREE.SphereGeometry(1.3,8,6),new THREE.MeshLambertMaterial({color:0x2f8f3e}));l.position.set(x,2.4,z);OUT.add(l)}});
box(OUT,80,.05,6,0x4aa3df,90,.03,-30);outRects.push([90,-30,80,6]);
DIST.forEach(d=>{box(OUT,2.6,.2,1.2,0x555555,d.ox+6,2.3,-2);box(OUT,.15,2.2,1,0x555555,d.ox+4.8,1.1,-2);box(OUT,.15,2.2,1,0x555555,d.ox+7.2,1.1,-2);box(OUT,2.2,.9,.1,0xd1332b,d.ox+6,1.2,-2.5)});
const mk2=[box(OUT,1.2,1.2,1.2,0xf4a261,0,5.8,12),box(OUT,1.2,1.2,1.2,0x3a86ff,28,5.8,-5),box(OUT,1.2,1.2,1.2,0x9b5de5,-28,5.8,12)];
const marker=box(OUT,1.2,1.2,1.2,0xffd23f,0,5.8,-5);box(OUT,4,.06,3,0xffd23f,0,.09,-3.6);
for(let i=0;i<18;i++){const x=-48+i*5.5+(i%3),z=(i%2?-24:28)+(i%4);cyl(OUT,.2,.25,1.6,0x6b4226,x,.8,z,6);const l=new THREE.Mesh(new THREE.SphereGeometry(1.3,8,6),new THREE.MeshLambertMaterial({color:0x2f8f3e}));l.position.set(x,2.4,z);OUT.add(l);}
const car=new THREE.Group();box(car,3,.8,1.6,0xd1332b,0,.6,0);box(car,1.6,.7,1.4,0xf5f5f5,0,1.3,0);car.position.set(-40,0,4.4);OUT.add(car);movers.push({o:car,v:6,ax:'x',min:-150,max:150,wrap:1});
[[0x7a4bd1,-2.4,2,0,16],[0x1fa37a,8.5,-2.2,-30,30]].forEach(([c,z,v,mn,mx])=>{const n=person(c);n.position.set(mn,0,z);OUT.add(n);movers.push({o:n,v,ax:'x',min:mn,max:mx,walk:1})});

NP.forEach(n=>{n.g=person(n.color,n.hair,n.skin,n.o);OUT.add(n.g)});
const HFL=box(INN,10,.1,10,0xd8b98a,0,-.05,0),HW=[box(INN,10,4,.2,0xf3ead7,0,2,-5),box(INN,.2,4,10,0xf3ead7,-5,2,0),box(INN,.2,4,10,0xf3ead7,5,2,0)];
box(INN,1.8,.04,1.2,0x2e8b57,0,.07,4.2);
box(INN,3,1,1.4,0x8a5a2b,-3,.5,-4);box(INN,.9,.06,.6,0x333,-3,1.05,-4.1);
box(INN,2.2,.6,3.6,0x3d6fb6,3,.3,-3.5);box(INN,1.6,.2,.6,0xffffff,3,.7,-4.9);
box(INN,1.2,2.4,1.2,0xf4f4f4,4,1.2,2);
box(INN,3,.8,1.2,0x9b3d3d,-3.5,.4,1.5);box(INN,.15,1.2,2,0x111827,-4.85,1.8,1.5);box(INN,.8,1,.4,0x7a5230,-3.8,.5,4.2);box(INN,1.6,1,.8,0xd9d9d9,0,.5,-4.4);box(INN,.5,.06,.5,0x333333,0,1.03,-4.4);box(INN,1,2.2,1.1,0xbfe3f2,4.3,1.1,-.1);
inRects.push([0,-4.4,1.4,.6],[4.3,-.1,.8,.9],[-3,-4,2.6,1.2],[3,-3.5,1.8,3.0],[4,2,.9,1.0],[-3.5,1.5,2.6,1.0]);

const INN2=new THREE.Group(),hostG=new THREE.Group();sc.add(INN2);INN2.add(hostG);INN2.visible=false;
box(INN2,10,.1,10,0xc9a46c,0,-.05,0);box(INN2,10,4,.2,0xdcefe8,0,2,-5);box(INN2,.2,4,10,0xdcefe8,-5,2,0);box(INN2,.2,4,10,0xdcefe8,5,2,0);box(INN2,1.8,.04,1.2,0xb5523b,0,.07,4.2);
box(INN2,3,2.2,.8,0x7a4a2a,-3,1.1,-4.3);box(INN2,2.4,.9,1.6,0x9c6b3f,3,.45,-3.5);box(INN2,1.2,1,1.2,0x333344,4,.5,2);box(INN2,1,.7,.1,0x111111,4,1.35,2);box(INN2,3,.8,1.2,0x2a7f62,-3.5,.4,1.5);
function buildHost(n){while(hostG.children.length)hostG.remove(hostG.children[0]);hostG.add(person(n.color,n.hair,n.skin,n.o));hostG.position.set(0,0,-1.8)}
const P=new THREE.Group();sc.add(P);let pBody=null;
function buildPlayer(){while(P.children.length)P.remove(P.children[0]);P.add(person(new THREE.Color(S.color),S.hair,S.skin,{style:S.style||'short'}))}
function setScene(inside,vis){SFX.door();S.inside=inside;S.vis=vis||null;const hn=S.vis&&NP.find(x=>x.id===S.vis);if(S.vis&&!hn)S.vis=null;OUT.visible=!inside;INN.visible=inside&&!S.vis;INN2.visible=inside&&!!S.vis;if(S.vis)buildHost(hn);
  if(inside)sc.background=new THREE.Color(0xcfe3ee)}
function enterHome(){setScene(true);P.position.set(0,0,2.2);toast('Inside your home');store()}
function leaveHome(){setScene(false);P.position.set(0,0,-3.4);toast('Back outside');store()}

const A_OUT=[{x:0,z:-4,r:4.5,label:'Enter home',fn:enterHome},{x:28,z:-3.4,r:4.5,label:'Enter library',fn:libraryMenu},{x:-28,z:10.8,r:4.5,label:'University admissions',fn:uniMenu},{x:0,z:11,r:4.5,label:'Enter shop',fn:shopMenu},...DIST.map(d=>({x:d.ox+6,z:-1,r:2.4,label:'Bus stop',fn:busMenu})),...NP.map(n=>({x:n.door[0],z:n.door[1],r:3.5,label:n.name+"'s house",fn:()=>visitDoor(n)}))];
const A_IN=[{x:-3,z:-2.8,label:'Study desk',fn:deskMenu},
 {x:3,z:-1.6,label:'Sleep until morning',fn:()=>{S.energy=100;S.t=S.t%1440<420?Math.floor(S.t/1440)*1440+420:(Math.floor(S.t/1440)+1)*1440+420;gain('hunger',-25);gain('hygiene',-10);gain('fun',-5);S.nt=S.t;toast('You slept well. It is 07:00.');store()}},
 {x:-3,z:.2,r:2.2,label:'Watch TV',fn:tvMenu},
 {x:2.8,z:-.1,r:1.9,label:'Take a shower',fn:()=>{gain('hygiene',70);S.t+=15;toast('Fresh and clean. Hygiene +70');store()}},
 {x:4,z:.7,label:'Check fridge',fn:()=>{S.food=S.food||{};const s=Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+'x'+S.food[k]).join(', ')||'empty';toast('Fridge: '+s)}},
 {x:-3.2,z:3.2,r:1.7,label:'Decorate home',fn:decoMenu},
 {x:-2,z:2,r:1.5,label:'Do chores',fn:choresMenu},
 {x:0,z:-3.2,r:1.6,label:'Cook a meal',fn:cookMenu},
 {x:0,z:-.9,r:1.5,label:'Exercise',fn:workout},
 {x:0,z:3.6,label:'Leave home',fn:leaveHome}];

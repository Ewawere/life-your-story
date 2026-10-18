/* ===== 3D world (world/) ===== */
const R=new THREE.WebGLRenderer({canvas:$('c'),antialias:false});
R.setPixelRatio(Math.min(devicePixelRatio||1,2));
const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(60,1,.1,200);
const hemi=new THREE.HemisphereLight(0xffffff,0x557755,.9),sun=new THREE.DirectionalLight(0xffffff,.6);
sun.position.set(10,20,10);sc.add(hemi,sun);
sc.background=new THREE.Color(0x9ad3ff);const OUT=new THREE.Group(),INN=new THREE.Group();sc.add(OUT,INN);
function box(g,w,h,d,c,x,y,z){const m=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m}
function cyl(g,rt,rb,h,c,x,y,z,seg){const m=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||8),new THREE.MeshLambertMaterial({color:c}));m.position.set(x,y,z);g.add(m);return m}
function person(color,hair,skin){const g=new THREE.Group();skin=skin||0x8d5a3b;hair=hair||0x1d1410;const L=c=>new THREE.MeshLambertMaterial({color:c});
  cyl(g,.35,.4,1.1,color,0,.95,0);cyl(g,.14,.14,.8,0x33384a,-.17,.4,0,6);cyl(g,.14,.14,.8,0x33384a,.17,.4,0,6);cyl(g,.09,.09,.8,skin,-.46,1,0,6);cyl(g,.09,.09,.8,skin,.46,1,0,6);
  const h=new THREE.Mesh(new THREE.SphereGeometry(.3,12,10),L(skin));h.position.y=1.8;g.add(h);
  const cap=new THREE.Mesh(new THREE.SphereGeometry(.33,12,8,0,Math.PI*2,0,Math.PI/2),L(hair));cap.position.y=1.86;g.add(cap);
  [-.11,.11].forEach(x=>{const e=new THREE.Mesh(new THREE.SphereGeometry(.04,6,6),L(0x111111));e.position.set(x,1.82,.27);g.add(e)});
  const sh=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,.02,12),new THREE.MeshBasicMaterial({color:0,transparent:true,opacity:.25}));sh.position.y=.02;g.add(sh);return g}

const outRects=[],inRects=[],acts=[],movers=[];
// neighbourhood
box(OUT,290,.1,90,0x6fb35a,0,-.05,0);box(OUT,290,.12,6,0x4a4f57,0,0,3);
for(let x=-136;x<136;x+=6)box(OUT,2.5,.14,.25,0xf0f0f0,x,0,3);
const WM=new THREE.MeshBasicMaterial({color:0x9fd0f0});const wn=(x,y,z)=>{const m=new THREE.Mesh(new THREE.BoxGeometry(1.4,1.2,.12),WM);m.position.set(x,y,z);OUT.add(m)};
const HC=[0xffd9a0,0xb9d9ff,0xd9f2b9,0xf2c6d9,0xe3d3ff];
[[0,-8,0xffd9a0],[-14,-8,0xb9d9ff],[14,-8,0xd9f2b9],[-14,15,0xf2c6d9],[14,15,0xe3d3ff],[-28,-8,0xffe6a8],[28,15,0xc9e8e0]].forEach(([x,z,c])=>{
  box(OUT,8,4,6,c,x,2,z);box(OUT,9,1,7,0xb5523b,x,4.5,z);outRects.push([x,z,8,6]);
  const fz=z<3?z+3:z-3;box(OUT,1.4,2.4,.2,0x6b4226,x,1.2,fz+(z<3?.05:-.05));const sg=z<3?1:-1;[-2.4,2.4].forEach(d=>wn(x+d,2.4,fz+.07*sg));[-3.2,3.2].forEach((d,i)=>{const f=new THREE.Mesh(new THREE.SphereGeometry(.28,6,6),new THREE.MeshLambertMaterial({color:i?0xff6b9a:0xffd23f}));f.position.set(x+d,.3,fz+sg);OUT.add(f)});});
box(OUT,10,4,7,0x6fa8dc,28,2,-8);box(OUT,11,1,8,0x274c77,28,4.5,-8);outRects.push([28,-8,10,7]);box(OUT,1.8,2.6,.2,0x2b2b2b,28,1.3,-4.45);box(OUT,4,.06,3,0x3a86ff,28,.09,-3.4);
box(OUT,10,4,7,0xc9b6e8,-28,2,15);box(OUT,11,1,8,0x5a3d8a,-28,4.5,15);outRects.push([-28,15,10,7]);box(OUT,1.8,2.6,.2,0x2b2b2b,-28,1.3,11.55);box(OUT,4,.06,3,0x9b5de5,-28,.09,10.4);
Array.from({length:16},(_,i)=>-120+i*16).forEach(x=>{cyl(OUT,.08,.1,4,0x333333,x,2,-.9,6);const b=new THREE.Mesh(new THREE.SphereGeometry(.3,8,6),new THREE.MeshBasicMaterial({color:0xfff2b0}));b.position.set(x,4.1,-.9);OUT.add(b)});
box(OUT,8,4,6,0xf4a261,0,2,15);box(OUT,9,1,7,0x9c4a1a,0,4.5,15);outRects.push([0,15,8,6]);box(OUT,1.4,2.4,.2,0x6b4226,0,1.2,11.95);box(OUT,4,.06,3,0xf4a261,0,.09,10.6);box(OUT,6,.8,.3,0xfff1d0,0,3.3,11.8);
const DIST=[{n:'Hillcrest Gardens',ox:-90,gr:0x86a55a,wall:[0xc9a27e,0xb08968,0xd8c3a5,0xa68a64,0xbfa58a],roof:0x6b3f2a},{n:'Maple Close',ox:0},{n:'Riverside Terrace',ox:90,gr:0x7ab8a0,wall:[0xf4f1ea,0xdfe9f2,0xe8e0f0,0xd7ecec,0xfbe9d0],roof:0x3b6ea5}];
const areaOf=x=>DIST.find(d=>Math.abs(x-d.ox)<=45)||DIST[1];
function house(x,z,c,roof){box(OUT,8,4,6,c,x,2,z);box(OUT,9,1,7,roof,x,4.5,z);outRects.push([x,z,8,6]);const fz=z<3?z+3:z-3,sg=z<3?1:-1;box(OUT,1.4,2.4,.2,0x6b4226,x,1.2,fz+.05*sg);[-2.4,2.4].forEach(d=>wn(x+d,2.4,fz+.07*sg))}
const HP=[[-28,-8],[-14,-8],[0,-8],[14,-8],[28,-8],[-28,15],[-14,15],[0,15],[14,15],[28,15]];
DIST.filter(d=>d.ox).forEach(d=>{box(OUT,84,.04,84,d.gr,d.ox,.01,0);HP.forEach(([rx,rz],i)=>house(d.ox+rx,rz,d.wall[i%5],d.roof));
  for(let i=0;i<7;i++){const x=d.ox-36+i*12,z=i%2?-22:24;cyl(OUT,.2,.25,1.6,0x6b4226,x,.8,z,6);const l=new THREE.Mesh(new THREE.SphereGeometry(1.3,8,6),new THREE.MeshLambertMaterial({color:0x2f8f3e}));l.position.set(x,2.4,z);OUT.add(l)}});
box(OUT,80,.05,6,0x4aa3df,90,.03,-30);outRects.push([90,-30,80,6]);
DIST.forEach(d=>{box(OUT,2.6,.2,1.2,0x555555,d.ox+6,2.3,-2);box(OUT,.15,2.2,1,0x555555,d.ox+4.8,1.1,-2);box(OUT,.15,2.2,1,0x555555,d.ox+7.2,1.1,-2);box(OUT,2.2,.9,.1,0xd1332b,d.ox+6,1.2,-2.5)});
const mk2=[box(OUT,1.2,1.2,1.2,0xf4a261,0,5.8,12),box(OUT,1.2,1.2,1.2,0x3a86ff,28,5.8,-5),box(OUT,1.2,1.2,1.2,0x9b5de5,-28,5.8,12)];
const marker=box(OUT,1.2,1.2,1.2,0xffd23f,0,5.8,-5);box(OUT,4,.06,3,0xffd23f,0,.09,-3.6);
for(let i=0;i<14;i++){const x=-36+i*5.5+(i%3),z=(i%2?-20:24)+(i%4);cyl(OUT,.2,.25,1.6,0x6b4226,x,.8,z,6);const l=new THREE.Mesh(new THREE.SphereGeometry(1.3,8,6),new THREE.MeshLambertMaterial({color:0x2f8f3e}));l.position.set(x,2.4,z);OUT.add(l);}
// life in the street: a car and two walkers (placeholder traffic/NPCs)
const car=new THREE.Group();box(car,3,.8,1.6,0xd1332b,0,.6,0);box(car,1.6,.7,1.4,0xf5f5f5,0,1.3,0);car.position.set(-40,0,4.4);OUT.add(car);movers.push({o:car,v:6,ax:'x',min:-138,max:138,wrap:1});
[[0x7a4bd1,-2.4,2,0,16],[0x1fa37a,8.5,-2.2,-30,30]].forEach(([c,z,v,mn,mx])=>{const n=person(c);n.position.set(mn,0,z);OUT.add(n);movers.push({o:n,v,ax:'x',min:mn,max:mx,walk:1})});

NP.forEach(n=>{n.g=person(n.color,n.hair,n.skin);OUT.add(n.g)});
// home interior
box(INN,10,.1,10,0xd8b98a,0,-.05,0);box(INN,10,4,.2,0xf3ead7,0,2,-5);box(INN,.2,4,10,0xf3ead7,-5,2,0);box(INN,.2,4,10,0xf3ead7,5,2,0);
box(INN,1.8,.04,1.2,0x2e8b57,0,.07,4.2);
box(INN,3,1,1.4,0x8a5a2b,-3,.5,-4);box(INN,.9,.06,.6,0x333,-3,1.05,-4.1);        // desk + laptop
box(INN,2.2,.6,3.6,0x3d6fb6,3,.3,-3.5);box(INN,1.6,.2,.6,0xffffff,3,.7,-4.9);       // bed
box(INN,1.2,2.4,1.2,0xf4f4f4,4,1.2,2);                                            // fridge
box(INN,3,.8,1.2,0x9b3d3d,-3.5,.4,1.5);box(INN,.15,1.2,2,0x111827,-4.85,1.8,1.5);box(INN,.8,1,.4,0x7a5230,-3.8,.5,4.2);box(INN,1.6,1,.8,0xd9d9d9,0,.5,-4.4);box(INN,.5,.06,.5,0x333333,0,1.03,-4.4);box(INN,1,2.2,1.1,0xbfe3f2,4.3,1.1,-.1);                                            // sofa
inRects.push([0,-4.4,1.6,.8],[4.3,-.1,1,1.1],[-3,-4,3,1.4],[3,-3.5,2.2,3.6],[4,2,1.2,1.2],[-3.5,1.5,3,1.2]);

const INN2=new THREE.Group(),hostG=new THREE.Group();sc.add(INN2);INN2.add(hostG);INN2.visible=false;
box(INN2,10,.1,10,0xc9a46c,0,-.05,0);box(INN2,10,4,.2,0xdcefe8,0,2,-5);box(INN2,.2,4,10,0xdcefe8,-5,2,0);box(INN2,.2,4,10,0xdcefe8,5,2,0);box(INN2,1.8,.04,1.2,0xb5523b,0,.07,4.2);
box(INN2,3,2.2,.8,0x7a4a2a,-3,1.1,-4.3);box(INN2,2.4,.9,1.6,0x9c6b3f,3,.45,-3.5);box(INN2,1.2,1,1.2,0x333344,4,.5,2);box(INN2,1,.7,.1,0x111111,4,1.35,2);box(INN2,3,.8,1.2,0x2a7f62,-3.5,.4,1.5);
function buildHost(n){while(hostG.children.length)hostG.remove(hostG.children[0]);hostG.add(person(n.color,n.hair,n.skin));hostG.position.set(0,0,-1.8)}
const P=new THREE.Group();sc.add(P);let pBody=null;
function buildPlayer(){while(P.children.length)P.remove(P.children[0]);P.add(person(new THREE.Color(S.color),S.hair,S.skin))}
function setScene(inside,vis){SFX.door();S.inside=inside;S.vis=vis||null;const hn=S.vis&&NP.find(x=>x.id===S.vis);if(S.vis&&!hn)S.vis=null;OUT.visible=!inside;INN.visible=inside&&!S.vis;INN2.visible=inside&&!!S.vis;if(S.vis)buildHost(hn);
  if(inside)sc.background=new THREE.Color(0xcfe3ee)}
function enterHome(){setScene(true);P.position.set(0,0,3);toast('Inside your home');store()}
function leaveHome(){setScene(false);P.position.set(0,0,-3.4);toast('Back outside');store()}

// interactables
const A_OUT=[{x:0,z:-4,r:4.5,label:'Enter home',fn:enterHome},{x:28,z:-3.4,r:4.5,label:'Enter school',fn:schoolMenu},{x:-28,z:10.8,r:4.5,label:'University admissions',fn:uniMenu},{x:0,z:11,r:4.5,label:'Enter shop',fn:shopMenu},...[[-28,-5],[28,12]].map(([x,z])=>({x,z,r:3,label:'Neighbour\'s house',fn:()=>toast('Not your home. Yours has the yellow mat and marker.')})),...DIST.map(d=>({x:d.ox+6,z:-1,r:2.4,label:'Bus stop',fn:busMenu})),...DIST.filter(d=>d.ox).flatMap(d=>HP.filter(([rx,rz])=>!NP.some(n=>n.cx===d.ox+rx&&n.door[1]===(rz<3?-5:12))).map(([rx,rz])=>({x:d.ox+rx,z:rz<3?-5:12,r:3,label:"Neighbour's house",fn:()=>toast('A private home. Meet the neighbours outside first.')}))),...NP.map(n=>({x:n.door[0],z:n.door[1],r:3.5,label:n.name+"'s house",fn:()=>visitDoor(n)}))];
const A_IN=[{x:-3,z:-2.8,label:'Study desk',fn:deskMenu},
 {x:3,z:-1.6,label:'Sleep until morning',fn:()=>{S.energy=100;S.t=S.t%1440<420?Math.floor(S.t/1440)*1440+420:(Math.floor(S.t/1440)+1)*1440+420;gain('hunger',-25);gain('hygiene',-10);gain('fun',-5);S.nt=S.t;toast('You slept well. It is 07:00.');store()}},
 {x:-3,z:.2,r:2.2,label:'Relax and watch TV',fn:()=>{const cz=raining()?10:0;gain('fun',30+cz);S.t+=30;toast('You relax with some TV. Fun +'+(30+cz)+(cz?' (cosy rainy day)':'');store()}},
 {x:2.8,z:-.1,r:1.9,label:'Take a shower',fn:()=>{gain('hygiene',70);S.t+=15;toast('Fresh and clean. Hygiene +70');store()}},
 {x:4,z:.7,label:'Eat a meal',fn:()=>{S.energy=Math.min(100,S.energy+15);S.t+=20;gain('hunger',40);toast('Your family fed you. Hunger +40, energy +15');store()}},
 {x:-3.2,z:3.2,r:1.7,label:'Decorate home',fn:decoMenu},
 {x:0,z:-3.2,r:1.6,label:'Cook a meal (£2)',fn:cook},
 {x:0,z:-.9,r:1.5,label:'Exercise',fn:workout},
 {x:0,z:3.6,label:'Leave home',fn:leaveHome}];

/* ===== 2D top-down pixel renderer =====
   Same scene graph as the 3D game, but boxes/cylinders/spheres are drawn as pixel-art blocks on a 2D canvas
   (3/4 top-down view, like Pokémon / Stardew). No external library needed. */
const THREE=(()=>{
 const K=.72,HH=.82,PI2=Math.PI*2;
 const hc=h=>'#'+(h&0xffffff).toString(16).padStart(6,'0'),SC={};
 const sh=(hex,f)=>{const k=hex+'|'+f;if(SC[k])return SC[k];const m=s=>{const c=(hex>>s)&255;return Math.max(0,Math.min(255,Math.round(f>1?c+(255-c)*(f-1):c*f)))};return SC[k]='rgb('+m(16)+','+m(8)+','+m(0)+')'};
 class Color{constructor(c){this.hex=0;this.set(c==null?0:c)}
  set(c){if(c&&c.isColor)this.hex=c.hex;else if(typeof c==='string')this.hex=parseInt(c.replace('#',''),16)||0;else this.hex=(c|0)&0xffffff;return this}
  setHex(h){this.hex=h&0xffffff;return this}getHex(){return this.hex}copy(c){this.hex=c.hex;return this}
  lerp(c,t){const a=this.hex,b=c.hex,m=s=>Math.round(((a>>s)&255)+(((b>>s)&255)-((a>>s)&255))*t);this.hex=(m(16)<<16)|(m(8)<<8)|m(0);return this}
  get isColor(){return true}}
 class V3{constructor(x,y,z){this.x=x||0;this.y=y||0;this.z=z||0}set(x,y,z){this.x=x;this.y=y;this.z=z;return this}}
 class Obj{constructor(){this.position=new V3();this.rotation=new V3();this.scale=new V3(1,1,1);this.children=[];this.parent=null;this.visible=true;this.matrixAutoUpdate=true;this.userData={}}
  add(...a){a.forEach(c=>{if(c.parent)c.parent.remove(c);c.parent=this;this.children.push(c)});return this}
  remove(c){const i=this.children.indexOf(c);if(i>=0){this.children.splice(i,1);c.parent=null;c._w=null}return this}
  updateMatrix(){}updateMatrixWorld(){}lookAt(x,y,z){this.target={x,y,z}}}
 class Mat{constructor(o,basic){o=o||{};this.color=new Color(o.color);this.opacity=o.opacity==null?1:o.opacity;this.transparent=!!o.transparent;this.basic=basic}clone(){return new this.constructor({color:this.color,opacity:this.opacity,transparent:this.transparent})}}
 class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m;this.isMesh=true}}
 class WebGLRenderer{
  constructor(o){this.canvas=o.canvas;this.ctx=this.canvas.getContext('2d');this.PS=2;this.U=9;this.K=K;this.HH=HH;this.ox=0;this.oy=0;this.pat={}}
  setPixelRatio(){}
  setSize(w,h){const c=this.canvas;c.width=Math.max(1,Math.ceil(w/this.PS));c.height=Math.max(1,Math.ceil(h/this.PS));this.ctx.imageSmoothingEnabled=false}
  pattern(hex){let p=this.pat[hex];if(p)return p;const c=document.createElement('canvas');c.width=c.height=16;const x=c.getContext('2d');x.fillStyle=hc(hex);x.fillRect(0,0,16,16);x.fillStyle=sh(hex,.9);for(let i=0;i<10;i++)x.fillRect((i*7+3)%16,(i*11+5)%16,1,1);x.fillStyle=sh(hex,1.1);for(let i=0;i<6;i++)x.fillRect((i*5+9)%16,(i*13+2)%16,1,1);return this.pat[hex]=this.ctx.createPattern(c,'repeat')}
  render(scene,cam){
   const ctx=this.ctx,W=this.canvas.width,H=this.canvas.height,inside=typeof S!=='undefined'&&S&&S.inside,U=this.U=inside?16:9,tg=cam.target||{x:0,y:0,z:0};
   this.ox=W/2-tg.x*U;this.oy=H*.6-tg.z*K*U;const ox=this.ox,oy=this.oy;
   try{yaw=0}catch(e){}
   ctx.fillStyle=hc(scene.background?scene.background.hex:0x9ad3ff);ctx.fillRect(0,0,W,H);
   const floors=[],objs=[],emis=[];
   const add=(c,x,y,z)=>{const g=c.geometry,m=c.material,hw=(g.w?g.w:g.r*2)*U/2+4,sx=x*U+ox;if(sx+hw<0||sx-hw>W)return;const sy=(z*K-y*HH)*U+oy;if(sy<-160||sy>H+160)return;
    const it={g,m,x,y,z,sx,sy};if(m.transparent){it.key=z-.4;objs.push(it);return}
    if(g.t==='b'){it.top=y+g.h/2;if(it.top<=.25&&g.h<=.3){floors.push(it);return}it.key=z+g.d/2}else it.key=z;objs.push(it);if(m.basic)emis.push(it)};
   const walk=(p,px,py,pz)=>{const rx=p.rotation.x,sy=p.scale.y||1,cs=rx?Math.cos(rx):1,sn=rx?Math.sin(rx):0;
    for(const c of p.children){if(c.visible===false)continue;
     if(c.isMesh){let x,y,z;if(c._w){x=c._w[0];y=c._w[1];z=c._w[2]}else{const ly=c.position.y*sy,lz=c.position.z;x=px+c.position.x;y=py+ly*cs-lz*sn;z=pz+ly*sn+lz*cs;if(c.matrixAutoUpdate===false)c._w=[x,y,z]}add(c,x,y,z)}
     else{const ly=c.position.y*sy,lz=c.position.z;walk(c,px+c.position.x,py+ly*cs-lz*sn,pz+ly*sn+lz*cs)}}};
   walk(scene,0,0,0);
   floors.sort((a,b)=>a.top-b.top);objs.sort((a,b)=>a.key-b.key||a.y-b.y);
   for(const it of floors){const g=it.g,w=g.w*U,x0=Math.round(it.x*U+ox-w/2),y0=Math.round((((it.z-g.d/2)*K)-it.top*HH)*U+oy),y1=Math.round((((it.z+g.d/2)*K)-it.top*HH)*U+oy),hx=it.m.color.hex;
    if(w>50){ctx.fillStyle=this.pattern(hx);try{it.m.__p=1;const p=this.pat[hx];if(p.setTransform)p.setTransform(new DOMMatrix([1,0,0,1,Math.round(ox),Math.round(oy)]))}catch(e){}}else ctx.fillStyle=hc(hx);
    ctx.fillRect(x0,y0,Math.round(w),Math.max(1,y1-y0))}
   const draw=(it,glow)=>{const g=it.g,m=it.m,hx=m.color.hex,sx=it.sx,sy=it.sy;
    if(m.transparent){ctx.fillStyle='rgba(0,0,0,'+m.opacity+')';ctx.beginPath();ctx.ellipse(sx,(it.z*K-it.y*HH)*U+oy,g.r*U,g.r*U*K*.55,0,0,PI2);ctx.fill();return}
    if(g.t==='b'){const w=Math.max(1,Math.round(g.w*U)),x0=Math.round(sx-g.w*U/2),yt=(it.z-g.d/2)*K-(it.y+g.h/2)*HH,yf=(it.z+g.d/2)*K-(it.y+g.h/2)*HH,yb=(it.z+g.d/2)*K-(it.y-g.h/2)*HH;
     const t0=Math.round(yt*U+oy),t1=Math.round(yf*U+oy),b1=Math.round(yb*U+oy);
     ctx.fillStyle=glow?hc(hx):sh(hx,1.14);ctx.fillRect(x0,t0,w,Math.max(1,t1-t0));ctx.fillStyle=glow?hc(hx):hc(hx);ctx.fillRect(x0,t1,w,Math.max(1,b1-t1));
     if(!glow&&(b1-t0)>3){ctx.strokeStyle='rgba(0,0,0,.3)';ctx.lineWidth=1;ctx.strokeRect(x0+.5,t0+.5,w-1,Math.max(1,b1-t0-1))}return}
    if(g.t==='c'){const r=Math.max(.6,g.r*U),top=(it.z*K-(it.y+g.h/2)*HH)*U+oy,bot=(it.z*K-(it.y-g.h/2)*HH)*U+oy;ctx.fillStyle=hc(hx);ctx.fillRect(Math.round(sx-r),Math.round(top),Math.max(1,Math.round(r*2)),Math.max(1,Math.round(bot-top)));
     if(r>1.8){ctx.fillStyle=sh(hx,1.15);ctx.beginPath();ctx.ellipse(sx,top,r,Math.max(.6,r*.45),0,0,PI2);ctx.fill()}return}
    if(g.t==='s'){const r=Math.max(.6,g.r*U);ctx.fillStyle=hc(hx);ctx.beginPath();if(g.half)ctx.arc(sx,sy,r,Math.PI,PI2);else ctx.arc(sx,sy,r,0,PI2);ctx.closePath();ctx.fill();
     if(!glow&&r>2.6){ctx.strokeStyle='rgba(0,0,0,.28)';ctx.lineWidth=1;ctx.stroke()}return}
    if(g.t==='t'){ctx.strokeStyle=hc(hx);ctx.lineWidth=Math.max(1,g.tube*U*2);ctx.beginPath();ctx.arc(sx,sy,g.r*U,0,PI2);ctx.stroke()}};
   for(const it of objs)draw(it,false);
   const hemi=scene.children.find(c=>c.isHemi),dark=hemi?Math.max(0,Math.min(.6,(.82-hemi.intensity)*.85)):0;
   if(dark>.04){ctx.fillStyle='rgba(8,12,40,'+dark+')';ctx.fillRect(0,0,W,H);
    for(const it of emis){if(it.g.t==='s'&&dark>.12){const gr=ctx.createRadialGradient(it.sx,it.sy,0,it.sx,it.sy,16);gr.addColorStop(0,'rgba(255,236,160,.55)');gr.addColorStop(1,'rgba(255,236,160,0)');ctx.fillStyle=gr;ctx.fillRect(it.sx-16,it.sy-16,32,32)}draw(it,true)}}
  }}
 return{Color,Group:class extends Obj{},Scene:class extends Obj{constructor(){super();this.background=null}},PerspectiveCamera:class extends Obj{constructor(){super();this.aspect=1;this.target={x:0,y:0,z:0}}updateProjectionMatrix(){}},
  HemisphereLight:class extends Obj{constructor(){super();this.intensity=.9;this.isHemi=true}},DirectionalLight:class extends Obj{constructor(){super();this.intensity=.6}},
  Mesh,MeshLambertMaterial:class extends Mat{constructor(o){super(o,false)}},MeshBasicMaterial:class extends Mat{constructor(o){super(o,true)}},
  BoxGeometry:class{constructor(w,h,d){this.t='b';this.w=w;this.h=h;this.d=d}},CylinderGeometry:class{constructor(a,b,h){this.t='c';this.r=(a+b)/2;this.h=h}},
  SphereGeometry:class{constructor(r,a,b,c,d,e,f){this.t='s';this.r=r;this.half=f!==undefined&&f<2}},TorusGeometry:class{constructor(r,t){this.t='t';this.r=r;this.tube=t}},WebGLRenderer};
})();

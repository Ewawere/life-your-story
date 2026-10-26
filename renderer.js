/* ===== 2D top-down pixel renderer =====
   Same scene graph as the 3D game, but boxes/cylinders/spheres are drawn as pixel-art blocks on a 2D canvas
   (3/4 top-down view, like Pokémon / Stardew). No external library needed. */
const THREE=(()=>{
 const K=.72,HH=.82,PI2=Math.PI*2;
 const hc=h=>'#'+(h&0xffffff).toString(16).padStart(6,'0'),SC={};
 const sh=(hex,f)=>{const k=hex+'|'+f;if(SC[k])return SC[k];const m=s=>{const c=(hex>>s)&255;return Math.max(0,Math.min(255,Math.round(f>1?c+(255-c)*(f-1)*.5:c*f)))};const r=m(16),g=m(8),b=m(0);return SC[k]='#'+((1<<24)|(r<<16)|(g<<8)|b).toString(16).slice(1)};
 class Obj{constructor(){this.children=[];this.position={x:0,y:0,z:0};this.rotation={x:0,y:0,z:0};this.scale={x:1,y:1,z:1};this.visible=true;this.parent=null}
  add(o){if(o.parent)o.parent.remove(o);o.parent=this;this.children.push(o)}
  remove(o){const i=this.children.indexOf(o);if(i>=0){this.children.splice(i,1);o.parent=null}}
  clear(){while(this.children.length)this.remove(this.children[0])}
 }
 class Mat{constructor(o,basic){o=o||{};this.color=o.color||0xffffff;this.emissive=o.emissive||0;this.transparent=!!o.transparent;this.opacity=o.opacity==null?1:o.opacity;this.basic=!!basic}
  get isColor(){return false}}
 class Mesh extends Obj{constructor(g,m){super();this.geometry=g;this.material=m}}
 class WebGLRenderer{constructor(o){this.canvas=o&&o.canvas||document.createElement('canvas');this.ctx=this.canvas.getContext('2d');this.U=22;this.K=K;this.HH=HH;this.ox=0;this.oy=0}
  setPixelRatio(){}
  setSize(w,h){const d=Math.min(devicePixelRatio||1,2);this.canvas.width=Math.max(1,w*d|0);this.canvas.height=Math.max(1,h*d|0);this.canvas.style.width=w+'px';this.canvas.style.height=h+'px'}
  render(scene,cam){
   const ctx=this.ctx,W=this.canvas.width,H=this.canvas.height;ctx.clearRect(0,0,W,H);
   const bg=scene.background;if(bg){ctx.fillStyle=typeof bg==='object'&&bg.isColor?hc(bg.getHex?bg.getHex():bg):hc(bg);ctx.fillRect(0,0,W,H)}
   const U=this.U,ox=W*.5,oy=H*.62;this.ox=ox;this.oy=oy;
   const objs=[],emis=[];
   const walk=(o,px,py,pz)=>{
    if(!o||o.visible===false)return;
    const x=px+(o.position?o.position.x:0),y=py+(o.position?o.position.y:0),z=pz+(o.position?o.position.z:0);
    if(o.geometry&&o.material){const sx=x*U+ox,sy=(z*K-y*HH)*U+oy;const it={o,x,y,z,sx,sy,g:o.geometry,m:o.material,depth:z*100-y};objs.push(it);if(o.material.emissive)emis.push(it)}
    if(o.children)for(const c of o.children)walk(c,x,y,z);
   };
   walk(scene,0,0,0);
   objs.sort((a,b)=>a.depth-b.depth);
   const draw=(it,glow)=>{
    const g=it.g,m=it.m,sx=it.sx,sy=it.sy;let hx=typeof m.color==='object'&&m.color.getHex?m.color.getHex():m.color;
    if(typeof hx!=='number')hx=0xffffff;
    ctx.globalAlpha=m.transparent?m.opacity:1;
    if(g.t==='b'){const w=g.w*U,d=g.d*U*K,h=g.h*U*HH;const x0=sx-w/2,y0=sy-h/2;ctx.fillStyle=hc(hx);
     ctx.fillRect(Math.round(x0),Math.round(y0-d*.15),Math.max(1,Math.round(w)),Math.max(1,Math.round(h+d*.15)));
     ctx.fillStyle=sh(hx,.75);ctx.fillRect(Math.round(x0),Math.round(y0+h*.7),Math.max(1,Math.round(w)),Math.max(1,Math.round(h*.3+d*.1)));
     if(!glow&&w>3){ctx.strokeStyle='rgba(0,0,0,.22)';ctx.lineWidth=1;ctx.strokeRect(Math.round(x0)+.5,Math.round(y0-d*.15)+.5,Math.max(1,Math.round(w)-1),Math.max(1,Math.round(h+d*.15)-1))}return}
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
 return{Color:class{constructor(c){this.c=c||0;this.isColor=true}getHex(){return this.c}set(c){this.c=c;return this}clone(){return new this.constructor(this.c)}lerp(o,t){const a=this.c,b=o.c||o;const ar=a>>16&255,ag=a>>8&255,ab=a&255,br=b>>16&255,bg=b>>8&255,bb=b&255;this.c=((ar+(br-ar)*t)|0)<<16|((ag+(bg-ag)*t)|0)<<8|((ab+(bb-ab)*t)|0);return this}},
  Group:class extends Obj{},Scene:class extends Obj{constructor(){super();this.background=null}},PerspectiveCamera:class extends Obj{constructor(){super();this.aspect=1;this.target={x:0,y:0,z:0}}updateProjectionMatrix(){},lookAt(x,y,z){this.target={x,y,z}}},
  HemisphereLight:class extends Obj{constructor(){super();this.intensity=.9;this.isHemi=true}},DirectionalLight:class extends Obj{constructor(){super();this.intensity=.6}},
  Mesh,MeshLambertMaterial:class extends Mat{constructor(o){super(o,false)}},MeshBasicMaterial:class extends Mat{constructor(o){super(o,true)}},
  BoxGeometry:class{constructor(w,h,d){this.t='b';this.w=w;this.h=h;this.d=d}},CylinderGeometry:class{constructor(a,b,h){this.t='c';this.r=(a+b)/2;this.h=h}},
  SphereGeometry:class{constructor(r,a,b,c,d,e,f){this.t='s';this.r=r;this.half=f!==undefined&&f<2}},TorusGeometry:class{constructor(r,t){this.t='t';this.r=r;this.tube=t}},WebGLRenderer};
})();

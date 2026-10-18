/* ===== main loop (main.js) ===== */
const blocked=(x,z,rs)=>rs.some(r=>Math.abs(x-r[0])<r[2]/2+.4&&Math.abs(z-r[1])<r[3]/2+.4);
function resize(){if(R && R.setSize){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}}
addEventListener('resize',resize);try{resize()}catch(e){}
let last=performance.now(),saveT=0;
function update(dt){
  movers.forEach(m=>{m.o.position[m.ax]+=m.v*dt;if(m.wrap){if(m.o.position[m.ax]>m.max)m.o.position[m.ax]=m.min}else if(m.o.position[m.ax]>m.max||m.o.position[m.ax]<m.min){m.v=-m.v}
    if(m.walk)m.o.rotation.y=m.v>0?Math.PI/2:-Math.PI/2});
  marker.rotation.y+=dt*2;mk2.forEach((m,i)=>{m.rotation.y+=dt*2;m.position.y=5.8+Math.sin(performance.now()/400+i)*.3});marker.position.y=5.8+Math.sin(performance.now()/400)*.3;
  if(!S){cam.position.set(10,8,16);cam.lookAt(0,2,-4);return}
  if(!modalOpen){
    S.t+=dt*2;S.energy=Math.max(0,S.energy-dt*(.07+(!S.inside&&raining()?.06:0))*(1-(S.sk?S.sk.fit:0)/250));
    let ix=jx+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),iy=jy+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
    const mag=Math.min(1,Math.hypot(ix,iy));mvSp=mag>.1?mag:0;
    if(mag>.1){
      const sp=(S.energy<5?3:5)*mag,fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw);
      const mx=(rx*ix+fx*-iy)/Math.max(.001,Math.hypot(ix,iy)),mz=(rz*ix+fz*-iy)/Math.max(.001,Math.hypot(ix,iy));
      const rs=S.inside?inRects:outRects,lim=S.inside?4.4:128,lz=S.inside?4.4:38;
      let nx=P.position.x+mx*sp*dt,nz=P.position.z+mz*sp*dt;
      nx=Math.max(-lim,Math.min(lim,nx));nz=Math.max(-lz,Math.min(lz,nz));
      if(!blocked(nx,P.position.z,rs))P.position.x=nx;if(!blocked(P.position.x,nz,rs))P.position.z=nz;
      P.rotation.y=Math.atan2(mx,mz);P.position.y=Math.abs(Math.sin(performance.now()/110))*.08;
    }
    saveT+=dt;if(saveT>10){saveT=0;S.x=P.position.x;S.z=P.position.z;store()}
  }
  // day / night
  const h=(S.t/60)%24,k=h>=7&&h<18?1:(h>=5&&h<7)?(h-5)/2:(h>=18&&h<20)?1-(h-18)/2:0;
  const rn=raining();if(!S.inside){sc.background=new THREE.Color(0x0b1030).lerp(new THREE.Color(0x9ad3ff),k);if(rn)sc.background.lerp(new THREE.Color(0x6e7b86),.65)}
  $('rain').style.display=rn&&!S.inside?'block':'none';
  hemi.intensity=.35+.55*k-(rn?.15:0);sun.intensity=.15+.5*k;
  $('hc').textContent=DN[day()%7]+' '+String(Math.floor(h)).padStart(2,'0')+':'+String(Math.floor(S.t%60)).padStart(2,'0');
  const now=performance.now(),tt=now/1000;if(modalOpen)mvSp=0;
  NP.forEach(n=>{const st=nstate(n);n.g.visible=st==='out';if(st!=='out'){n.k=0;n.appr=0}if(st==='out'){const a=S.t*.006+n.ph,bx=n.cx+16*Math.sin(a),k0=n.k||0;n.k=k0+(((now<(n.appr||0)&&!S.inside)?1:0)-k0)*Math.min(1,dt*1.5);
    n.g.position.set(bx+(P.position.x+1.4-bx)*n.k,0,n.lane+(P.position.z+.4-n.lane)*n.k);
    n.g.rotation.y=n.k>.5?Math.atan2(P.position.x-n.g.position.x,P.position.z-n.g.position.z):(Math.cos(a)>0?1.57:-1.57);anim(n.g,n.k>.97?0:1,tt+n.ph)}});
  anim(P.children[0],mvSp,tt);if(S.vis)anim(hostG.children[0],0,tt);if(!S.inside)chatter();updateBubbles(now);
  if(!S.inside){const ar=areaOf(P.position.x).n;if(S.area==null)S.area=ar;else if(ar!==S.area){S.area=ar;toast('Welcome to '+ar)}}
  if(!S.inside&&!modalOpen)NP.forEach(n=>{if(n.g.visible&&Math.hypot(n.g.position.x-P.position.x,n.g.position.z-P.position.z)<9){const r=rel(n.id);if((r.say==null?-999:r.say)<S.t-240){r.say=S.t;n.appr=performance.now()+7000;say(n,pick(GREET[r.f<20?0:r.f<40?1:2]))}}});
  if(S.msgT==null)S.msgT=S.t+240;if(S.t>=S.msgT&&!modalOpen&&!S.vis){S.msgT=S.t+rnd(240,420);texting()}
  $('phoneBtn').textContent=(S.inbox||[]).length?'📱●':'📱';
  if(S.vis&&hr()>=22){toast('It is late. Time to go home.');leaveVisit()}
  WM.color.setHex(k>.5?0x9fd0f0:0xffd77a);
  {const N=S.need,el=Math.min(240,S.t-(S.nt==null?S.t:S.nt));S.nt=S.t;if(el>0){N.hunger=cl(N.hunger-.1*el);N.fun=cl(N.fun-.07*el*(1-.1*comfort()));N.social=cl(N.social-.05*el);N.hygiene=cl(N.hygiene-.06*el);if(N.hunger<=0)S.energy=Math.max(0,S.energy-.04*el)}
  $('nd').textContent='🍽'+Math.round(N.hunger)+' 🎮'+Math.round(N.fun)+' 💬'+Math.round(N.social)+' 🚿'+Math.round(N.hygiene)+' · '+ML(mood())+' '+(rn?'🌧':'☀️')}
  if(!modalOpen&&!S.vis&&hr()>=7&&hr()<21&&S.t>=(S.evT==null?1e9:S.evT))lifeEvent();
  {const wk=Math.floor(day()/7);if(S.al==null)S.al=wk;if(wk>S.al){S.al=wk;const a={Low:15,Middle:30,Wealthy:80}[S.fam.cls];S.cash+=a;toast('Your family gave you '+gbp(a)+' pocket money for the week.');SFX.chime();store()}}
  {const a=age();if(S.age==null)S.age=a;if(a>S.age&&!modalOpen&&!S.vis){S.age=a;birthday()}}
  if(amb)amb.gain.value=S.muted?0:(S.inside?.01:(rn?.07:.04));
  $('he').style.width=Math.round(S.energy)+'%';
  // nearest interactable
  const list=S.inside?(S.vis?A_V():A_IN):A_OUT.concat(NP.filter(n=>n.g.visible).map(n=>({x:n.g.position.x,z:n.g.position.z,r:2.6,label:'Talk to '+n.name,fn:()=>talk(n.id)})));near=null;let bd=99;
  list.forEach(a=>{const d=Math.hypot(a.x-P.position.x,a.z-P.position.z);if(d<(a.r||2.8)&&d<bd){bd=d;near=a}});
  const ab=$('act');if(near&&!modalOpen){ab.style.display='block';ab.textContent=near.label}else ab.style.display='none';
  $('hint').textContent=S.inside?'Walk to the desk to study and take an exam':(S.area||'Maple Close')+' · Yellow: home · Blue: school · Purple: university · Orange: shop';
  // camera
  const d=S.inside?7:9,hh=S.inside?7:6;
  camT={x:P.position.x,y:1.4,z:P.position.z};cam.position.set(P.position.x+Math.sin(yaw)*d,hh,P.position.z+Math.cos(yaw)*d);cam.lookAt(P.position.x,1.4,P.position.z);
}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);if(R && R.render)R.render(sc,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
addEventListener('pagehide',()=>{if(S){S.x=P.position.x;S.z=P.position.z;store()}});
newLifeScreen();

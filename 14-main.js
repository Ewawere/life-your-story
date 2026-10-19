/* ===== main loop 2D — movement & feel ===== */
const blocked=(x,z,rs,pad=.28)=>rs.some(r=>Math.abs(x-r[0])<r[2]/2+pad&&Math.abs(z-r[1])<r[3]/2+pad);
let last=performance.now(),saveT=0,mvSp=0;
let camT={x:0,y:1.4,z:0};
let camLagX=0, camLagY=0, facingSmooth=0;

function update(dt){
  movers.forEach(m=>{
    m.o.position[m.ax]+=m.v*dt;
    if(m.wrap){if(m.o.position[m.ax]>m.max)m.o.position[m.ax]=m.min;if(m.o.position[m.ax]<m.min)m.o.position[m.ax]=m.max}
    else if(m.o.position[m.ax]>m.max||m.o.position[m.ax]<m.min)m.v=-m.v;
  });

  if(!S){camX=0;camY=-4;drawWorld();return}

  if(!modalOpen){
    S.t+=dt*2;
    if(typeof tickAct==='function')tickAct();
    S.energy=Math.max(0,S.energy-dt*(.07+(!S.inside&&raining()?.06:0))*(1-(S.sk?S.sk.fit:0)/250));

    let ix=jx+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0);
    let iy=jy+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
    let mag=Math.hypot(ix,iy);
    if(mag>1){ix/=mag;iy/=mag;mag=1}
    mvSp=mag>.08?mag:0;

    if(mag>.08){
      const fitBoost=1+((S.sk&&S.sk.fit)||0)/400;
      const base=S.energy<8?3.0:5.2;
      const sp=base*mag*fitBoost;
      const rs=S.inside?inRects:outRects;
      const ox=P.position.x, oz=P.position.z;
      let nx=ox+ix*sp*dt;
      let nz=oz+iy*sp*dt;

      const hitX=blocked(nx,oz,rs);
      const hitZ=blocked(ox,nz,rs);
      if(!hitX)P.position.x=nx;
      if(!hitZ)P.position.z=nz;
      if(hitX&&hitZ){
        const hx=ox+ix*sp*dt*.5, hz=oz+iy*sp*dt*.5;
        if(!blocked(hx,oz,rs))P.position.x=hx;
        if(!blocked(P.position.x,hz,rs))P.position.z=hz;
      }

      if(Math.abs(ix)>Math.abs(iy))P.facing=ix>0?3:1;
      else P.facing=iy>0?0:2;
      facingSmooth+=( (ix||iy?Math.atan2(ix,iy):facingSmooth) - facingSmooth)*.15;
      P.walk=(P.walk||0)+mag*dt*10;
    } else {
      P.walk=(P.walk||0)*.85;
    }

    if(!S.inside){
      P.position.x=Math.max(-150,Math.min(150,P.position.x));
      P.position.z=Math.max(-40,Math.min(40,P.position.z));
    } else {
      P.position.x=Math.max(-4.4,Math.min(4.4,P.position.x));
      P.position.z=Math.max(-4.4,Math.min(4.4,P.position.z));
    }
  }

  const look=mvSp>0.1?1.2:0;
  const tx=P.position.x+(jx||0)*look;
  const tz=P.position.z+(jy||0)*look;
  camLagX+=(tx-camLagX)*Math.min(1,8*dt);
  camLagY+=(tz-camLagY)*Math.min(1,8*dt);
  camX+=(camLagX-camX)*Math.min(1,6*dt);
  camY+=(camLagY-camY)*Math.min(1,6*dt);
  camT={x:P.position.x,y:1.4,z:P.position.z};

  const h=hr(), rn=raining();
  $('rain').style.display=rn&&!S.inside?'block':'none';

  NP.forEach(n=>{
    if(!n.g)return;
    const st=nstate(n);
    if(st==='sleep'||st==='away'){n.g.visible=false;return}
    n.g.visible=!S.inside;
    if(!S.inside&&st==='out'){
      n.g.position.x=n.cx+Math.sin(S.t/38+n.ph)*3.2;
      n.g.position.z=n.lane+Math.cos(S.t/52+n.ph)*.9;
    } else if(st==='home'){
      n.g.position.x=n.door[0];
      n.g.position.z=n.door[1];
    }
  });

  if(!S.inside){const a=areaOf(P.position.x);S.area=a.n}

  NP.forEach(n=>{
    if(!n.g||!n.g.visible)return;
    if(Math.hypot(n.g.position.x-P.position.x,n.g.position.z-P.position.z)<9){
      const r=rel(n.id);
      if((r.say==null?-999:r.say)<S.t-240){r.say=S.t;say(n,pick(GREET[r.f<20?0:r.f<40?1:2]))}
    }
  });

  if(S.msgT==null)S.msgT=S.t+240;
  if(S.t>=S.msgT&&!modalOpen&&!S.vis){S.msgT=S.t+rnd(240,420);texting()}
  $('phoneBtn').textContent=(S.inbox||[]).length?'📱':'📱';
  if(S.vis&&hr()>=22){toast('It is late. Time to go home.');leaveVisit()}

  {const N=S.need,el=Math.min(240,S.t-(S.nt==null?S.t:S.nt));S.nt=S.t;
    if(el>0){N.hunger=cl(N.hunger-.1*el);N.fun=cl(N.fun-.07*el*(1-.1*comfort()));N.social=cl(N.social-.05*el);N.hygiene=cl(N.hygiene-.06*el);if(N.hunger<=0)S.energy=Math.max(0,S.energy-.04*el)}
    $('nd').textContent='🍽'+Math.round(N.hunger)+' 🎮'+Math.round(N.fun)+' 💬'+Math.round(N.social)+' 🚿'+Math.round(N.hygiene)+' · '+ML(mood())+' '+(rn?'🌧':'☀️')}

  if(!modalOpen&&!S.vis&&hr()>=7&&hr()<21&&S.t>=(S.evT==null?1e9:S.evT))lifeEvent();
  {const wk=Math.floor(day()/7);if(S.al==null)S.al=wk;if(wk>S.al){S.al=wk;const a={Low:15,Middle:30,Wealthy:80}[S.fam.cls];S.cash+=a;toast('Your family gave you '+gbp(a)+' pocket money for the week.');SFX.chime();store()}}
  {const a=age();if(S.age==null)S.age=a;if(a>S.age&&!modalOpen&&!S.vis){S.age=a;birthday()}}

  if(typeof amb!=='undefined'&&amb)amb.gain.value=S.muted?0:(S.inside?.01:(rn?.07:.04));
  $('he').style.width=Math.round(S.energy)+'%';
  $('hc').textContent=gbp(S.cash)+' · '+String(Math.floor(S.t/60)%24).padStart(2,'0')+':'+String(Math.floor(S.t)%60).padStart(2,'0');

  const list=S.inside?(S.vis?A_V():A_IN):A_OUT.concat(NP.filter(n=>n.g&&n.g.visible).map(n=>({x:n.g.position.x,z:n.g.position.z,r:2.8,label:'Talk to '+n.name,fn:()=>talk(n.id)})));
  near=null;let bd=99;
  list.forEach(a=>{const d=Math.hypot(a.x-P.position.x,a.z-P.position.z);if(d<(a.r||3.0)&&d<bd){bd=d;near=a}});
  const ab=$('act');
  if(near&&!modalOpen){ab.style.display='block';ab.textContent=near.label}else ab.style.display='none';

  $('hint').textContent=S.inside?'Walk to icons · bed, TV, desk, kitchen, shower':(S.area||'Maple Close')+' · HOME is yellow · 📚 library · 🎓 uni · 🛒 shop';

  if(typeof updateBubbles==='function')updateBubbles(performance.now());
  if(typeof chatter==='function'&&Math.random()<.01)chatter();

  saveT+=dt;if(saveT>8){saveT=0;S.x=P.position.x;S.z=P.position.z;store()}
}

function loop(now){
  const dt=Math.min(.05,(now-last)/1000);last=now;
  update(dt);
  drawWorld();
  requestAnimationFrame(loop);
}
requestAnimationFrame(loop);
addEventListener('pagehide',()=>{if(S){S.x=P.position.x;S.z=P.position.z;store()}});
newLifeScreen();

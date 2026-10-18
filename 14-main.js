/* ===== main loop (main.js) ===== */
const blocked=(x,z,rs)=>rs.some(r=>Math.abs(x-r[0])<r[2]/2+.4&&Math.abs(z-r[1])<r[3]/2+.4);
function resize(){if(R && R.setSize){R.setSize(innerWidth,innerHeight,false);cam.aspect=innerWidth/innerHeight;cam.updateProjectionMatrix()}}
addEventListener('resize',resize);try{resize()}catch(e){}
let last=performance.now(),saveT=0;
function update(dt){
  if(typeof movers!=='undefined')movers.forEach(m=>{m.o.position[m.ax]+=m.v*dt;if(m.wrap){if(m.o.position[m.ax]>m.max)m.o.position[m.ax]=m.min}else if(m.o.position[m.ax]>m.max||m.o.position[m.ax]<m.min){m.v=-m.v}
    if(m.walk)m.o.rotation.y=m.v>0?Math.PI/2:-Math.PI/2});
  if(typeof marker!=='undefined'){marker.rotation.y+=dt*2;mk2.forEach((m,i)=>{m.rotation.y+=dt*2;m.position.y=5.8+Math.sin(performance.now()/400+i)*.3});marker.position.y=5.8+Math.sin(performance.now()/400)*.3;}
  if(!S){if(typeof cam!=='undefined'){cam.position.set(10,8,16);cam.lookAt(0,2,-4)};return}
  if(!modalOpen){
    S.t+=dt*2;S.energy=Math.max(0,S.energy-dt*(.07+(!S.inside&&raining()?.06:0))*(1-(S.sk?S.sk.fit:0)/250));
    let ix=jx+(keys.d||keys.arrowright?1:0)-(keys.a||keys.arrowleft?1:0),iy=jy+(keys.s||keys.arrowdown?1:0)-(keys.w||keys.arrowup?1:0);
    const mag=Math.min(1,Math.hypot(ix,iy));mvSp=mag>.1?mag:0;
    if(mag>.1 && typeof P!=='undefined'){
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
  // day / night and rest of update from original...
  if(typeof R!=='undefined' && R.render) R.render(sc,cam);
}
function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
addEventListener('pagehide',()=>{if(S && typeof P!=='undefined'){S.x=P.position.x;S.z=P.position.z;store()}});
if(typeof newLifeScreen==='function')newLifeScreen();

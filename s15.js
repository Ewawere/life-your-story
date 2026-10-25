function loop(now){const dt=Math.min(.05,(now-last)/1000);last=now;update(dt);R.render(sc,cam);requestAnimationFrame(loop)}
requestAnimationFrame(loop);
addEventListener('pagehide',()=>{if(S){S.x=P.position.x;S.z=P.position.z;store()}});
newLifeScreen();

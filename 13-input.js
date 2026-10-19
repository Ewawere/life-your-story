/* ===== input 2D ===== */
let jx=0,jy=0,yaw=0,lookId=null,lx=0;
(function(){const j=$('joy'),k=$('knob');let id=null;
 const set=e=>{const r=j.getBoundingClientRect(),cx=r.left+60,cy=r.top+60;let dx=e.clientX-cx,dy=e.clientY-cy;const d=Math.hypot(dx,dy),m=45;if(d>m){dx*=m/d;dy*=m/d}k.style.left=(40+dx)+'px';k.style.top=(40+dy)+'px';jx=dx/m;jy=dy/m};
 j.onpointerdown=e=>{id=e.pointerId;try{j.setPointerCapture(id)}catch(_){}set(e)};j.onpointermove=e=>{if(e.pointerId===id)set(e)};
 j.onpointerup=j.onpointercancel=()=>{id=null;jx=jy=0;k.style.left=k.style.top='40px'};
})();
const keys={};addEventListener('keydown',e=>keys[e.key.toLowerCase()]=1);addEventListener('keyup',e=>keys[e.key.toLowerCase()]=0);
let near=null;$('act').onclick=()=>{if(near&&!modalOpen){SFX.tap();near.fn()}};

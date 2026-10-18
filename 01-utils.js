/* ===== utils ===== */
const $=id=>document.getElementById(id);
const rnd=(a,b)=>a+Math.floor(Math.random()*(b-a+1));
const pick=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>{a=a.slice();for(let i=a.length-1;i>0;i--){const j=rnd(0,i);[a[i],a[j]]=[a[j],a[i]]}return a};
const gbp=n=>{n=Math.round(n*100)/100;return '£'+(n%1?n.toFixed(2):n.toLocaleString('en-US'))};
let S=null, modalOpen=false;
function store(){try{if(S)localStorage.setItem('lys01',JSON.stringify(S))}catch(e){}}
function loadSave(){try{return JSON.parse(localStorage.getItem('lys01'))}catch(e){return null}}
function toast(t){const e=$('toast');e.textContent=t;e.style.display='block';clearTimeout(toast.h);toast.h=setTimeout(()=>e.style.display='none',2200)}
function modal(h,close){$('mb').innerHTML=h+(close?'<button class="o" onclick="closeM()">Close</button>':'');$('modal').style.display='flex';modalOpen=true;$('mb').scrollTop=0}
function closeM(){$('modal').style.display='none';modalOpen=false}

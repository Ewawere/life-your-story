(async function(){
  let b='';
  for(let i=0;i<7;i++){
    const r=await fetch('s12.p'+i+'.txt');
    if(!r.ok) throw new Error('s12.p'+i+' failed');
    b+=await r.text();
  }
  const s=document.createElement('script');
  s.textContent=atob(b);
  document.body.appendChild(s);
})().catch(e=>{console.error(e);alert('Failed to load s12: '+e.message)});

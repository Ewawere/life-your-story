(async function(){
  let b='';
  for(let i=0;i<7;i++){
    const r=await fetch('s13.p'+i+'.txt');
    if(!r.ok) throw new Error('s13.p'+i+' failed');
    b+=await r.text();
  }
  const s=document.createElement('script');
  s.textContent=atob(b);
  document.body.appendChild(s);
})().catch(e=>{console.error(e);alert('Failed to load s13: '+e.message)});

(async function(){
  let b='';
  for(let i=0;i<8;i++){
    const r=await fetch('s5.p'+i+'.txt');
    if(!r.ok) throw new Error('s5.p'+i+' failed');
    b+=await r.text();
  }
  const s=document.createElement('script');
  s.textContent=atob(b);
  document.body.appendChild(s);
})().catch(e=>{console.error(e);alert('Failed to load s5: '+e.message)});

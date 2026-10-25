(async function(){
  let b='';
  for(let i=0;i<8;i++){
    const r=await fetch('s9.p'+i+'.txt');
    if(!r.ok) throw new Error('s9.p'+i+' failed');
    b+=await r.text();
  }
  (0,eval)(atob(b));
})().catch(e=>{console.error(e);alert('Failed to load s9: '+e.message)});

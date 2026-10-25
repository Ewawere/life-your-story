(async function(){
  let b='';
  for(let i=0;i<7;i++){
    const r=await fetch('s12.p'+i+'.txt');
    if(!r.ok) throw new Error('s12.p'+i+' failed');
    b+=await r.text();
  }
  (0,eval)(atob(b));
})().catch(e=>{console.error(e);alert('Failed to load s12: '+e.message)});

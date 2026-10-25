/* Sequential loader for base64-split modules (s5,s9,s10,s12,s13,s14) */
(async function(){
  async function loadB64(name, n){
    let b='';
    for(let i=0;i<n;i++){
      const r=await fetch(name+'.p'+i+'.txt');
      if(!r.ok) throw new Error('Failed '+name+'.p'+i);
      b+=await r.text();
    }
    (0,eval)(atob(b));
  }
  try{
    await loadB64('s5',8);
    // s6,s7,s8 are normal scripts loaded after this file via dynamic inject
    const next=['s6.js','s7.js','s8.js'];
    for(const src of next){
      await new Promise((res,rej)=>{
        const s=document.createElement('script');
        s.src=src;s.onload=res;s.onerror=()=>rej(new Error(src));
        document.body.appendChild(s);
      });
    }
    await loadB64('s9',8);
    await loadB64('s10',8);
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='s11.js';s.onload=res;s.onerror=()=>rej(new Error('s11'));
      document.body.appendChild(s);
    });
    await loadB64('s12',7);
    await loadB64('s13',7);
    await loadB64('s14',8);
    await new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src='s15.js';s.onload=res;s.onerror=()=>rej(new Error('s15'));
      document.body.appendChild(s);
    });
    const s2=document.createElement('script');
    s2.src='screen-2d.js';
    document.body.appendChild(s2);
  }catch(e){
    console.error(e);
    alert('Failed to load game: '+e.message);
  }
})();

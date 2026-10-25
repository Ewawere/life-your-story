/* Sequential loader for base64-split modules — injects as real scripts so const/let are global */
(async function(){
  function inject(code){
    const s=document.createElement('script');
    s.textContent=code;
    document.body.appendChild(s);
  }
  async function loadB64(name, n){
    let b='';
    for(let i=0;i<n;i++){
      const r=await fetch(name+'.p'+i+'.txt');
      if(!r.ok) throw new Error('Failed '+name+'.p'+i);
      b+=await r.text();
    }
    inject(atob(b));
  }
  function loadSrc(src){
    return new Promise((res,rej)=>{
      const s=document.createElement('script');
      s.src=src;
      s.onload=res;
      s.onerror=()=>rej(new Error(src));
      document.body.appendChild(s);
    });
  }
  try{
    await loadB64('s5',8);
    for(const src of ['s6.js','s7.js','s8.js']) await loadSrc(src);
    await loadB64('s9',8);
    await loadB64('s10',8);
    await loadSrc('s11.js');
    await loadB64('s12',7);
    await loadB64('s13',7);
    await loadB64('s14',8);
    await loadSrc('s15.js');
    await loadSrc('screen-2d.js');
  }catch(e){
    console.error(e);
    alert('Failed to load game: '+e.message);
  }
})();

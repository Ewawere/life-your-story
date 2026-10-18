/* ===== education actions (education.js) ===== */
const lvl=k=>k<35?1:k<70?2:3;
function pickQs(pool,n,l){const seen=S.seen||(S.seen={});return pool.map(q=>[(seen[q.q]?9:0)+Math.abs(q.d-l)*3+Math.random(),q]).sort((a,b)=>a[0]-b[0]).slice(0,n).map(x=>x[1])}
function markSeen(log){S.seen=S.seen||{};log.forEach(l=>S.seen[l.q]=1)}
function deskMenu(){
  modal(`<h3>Study desk</h3><p class="m">Energy ${Math.round(S.energy)}%. Studying costs energy. Pick a subject, or test yourself.</p>`+
    SUBJ.map(s=>`<button class="o" onclick="study('${s}')">Study ${s} <span class="m">· knowledge ${S.know[s]}/100</span></button>`).join('')+
    `<button class="o go" onclick="exam()">Take timed exam (6 questions, 90 s)</button>`,true);
}
function study(sub){
  if(S.energy<15){modal('<h3>Too tired</h3><p>You need to eat or sleep before studying.</p>',true);return}
  const qs=pickQs(QB.filter(q=>q.s===sub),3,lvl(S.know[sub]));
  quiz('Study: '+sub,qs,0,true,log=>{
    const right=log.filter(l=>l.ok).length;markSeen(log);
    S.know[sub]=Math.min(100,S.know[sub]+Math.round((right*4+(3-right))*mm()));S.energy=Math.max(0,S.energy-12);S.t+=45;store();
    modal(`<h3>Session finished</h3><p>${right} of 3 correct. ${sub} knowledge is now ${S.know[sub]}/100.</p><p class="m">Right answers teach you more than wrong ones.</p><button class="o go" onclick="study('${sub}')">Study ${sub} again</button><button class="o" onclick="deskMenu()">Back to desk</button><button class="o" onclick="closeM()">Close</button>`);
  });
}
function exam(){
  if(S.energy<20){modal('<h3>Too tired</h3><p>You need at least 20% energy for an exam.</p>',true);return}
  const qs=shuf(QB).slice(0,6);
  quiz('Mock exam',qs,90,false,log=>{
    const right=log.filter(l=>l.ok).length,pct=Math.round(right/6*100),g=grade(pct);
    S.exams.unshift({pct,g,right,at:Math.floor(S.t)});S.exams=S.exams.slice(0,10);S.energy=Math.max(0,S.energy-15);S.t+=90;store();
    modal(`<p class="m">Mock exam result</p><div class="big">${g}</div><p><b>${right}/6</b> correct (${pct}%)</p>`+
      log.map(l=>`<p><b style="color:${l.ok?'var(--ok)':'var(--no)'}">${l.ok?'Right':'Wrong'}</b> · ${l.q}<br><span class="m">${l.ok?'You answered: '+l.pick:'You answered: '+l.pick+'. Correct: '+l.right+'. '+l.e}</span></p>`).join('')+
      `<button class="o go" onclick="exam()">Try another exam</button><button class="o" onclick="closeM()">Close</button>`);
  });
}

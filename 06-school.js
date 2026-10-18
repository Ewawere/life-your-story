/* ===== school + university (education.js) ===== */
const TT=['Maths','English','Science','Maths','English'],DN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const day=()=>Math.floor(S.t/1440),hr=()=>(S.t%1440)/60;
function schoolMenu(){
  const d=day()%7,h=hr();let st='';
  if(d>4)st='School is closed at weekends.';else if(h<8||h>=14)st='School runs 08:00–14:00. Come back during school hours.';else if(S.lastSch===day())st='You already attended today. See you tomorrow.';else if(S.energy<15)st='You are too tired for class. Eat or sleep first.';
  modal(`<h3>Greenfield Secondary School</h3><p class="m">${addr(28,-8)} · Lessons attended: ${S.att}</p><table>${TT.map((x,i)=>`<tr><td>${DN[i]}</td><td>${x}${i===d?' <b>(today)</b>':''}</td></tr>`).join('')}</table>`+(st?`<p>${st}</p>`:`<button class="o go" onclick="lesson()">Attend today's ${TT[d]} lesson</button>`),true);
}
function lesson(){
  const sub=TT[day()%7],qs=pickQs(QB.filter(q=>q.s===sub),4,lvl(S.know[sub]));
  quiz('Class: '+sub,qs,0,true,log=>{const r=log.filter(l=>l.ok).length;markSeen(log);
    S.know[sub]=Math.min(100,S.know[sub]+Math.round((r*3+(4-r))*mm()));S.att++;S.lastSch=day();S.energy=Math.max(0,S.energy-15);S.t+=120;store();
    modal(`<h3>Lesson finished</h3><p>${r} of 4 correct. ${sub} knowledge: ${S.know[sub]}/100.</p><p class="m">Lessons attended: ${S.att}</p>`,true)});
}
const CRS={Medicine:{c:72,f:9000,s:['Science']},Engineering:{c:66,f:7500,s:['Maths','Science']},Law:{c:64,f:6500,s:['English']},Business:{c:58,f:5500,s:['Maths','English']}};
function uniMenu(){
  let st='';if(S.att<3)st='To be eligible, attend at least 3 school lessons first ('+S.att+'/3).';else if(S.lastApp===day())st='Admissions has closed for today. Come back tomorrow.';
  modal(`<h3>Unity University admissions</h3><p class="m">Entrance exam: 8 hard questions in 150 s. Places are competitive and the cut-off changes every year. In-game courses are not real qualifications.</p>`+(st?`<p>${st}</p>`:Object.keys(CRS).map(k=>`<button class="o" onclick="apply('${k}')">${k} <span class="m">· tuition ${gbp(CRS[k].f)}/yr</span></button>`).join('')),true);
}
function apply(k){
  const C=CRS[k];if(S.energy<30){modal('<h3>Too tired</h3><p>You need at least 30% energy for an entrance exam.</p>',true);return}
  quiz(k+' entrance exam',pickQs(QB.filter(q=>C.s.includes(q.s)),8,3),150,false,log=>{
    const r=log.filter(l=>l.ok).length,kav=C.s.reduce((a,x)=>a+S.know[x],0)/C.s.length;
    const score=Math.round(r/8*100*.7+kav*.3),cut=C.c+rnd(-4,6),m=score-cut,low=S.fam.cls==='Low',ok=m>=0;
    const sch=!ok?'None':m>=(low?8:12)?'Full':m>=(low?3:6)?'Half':'None';
    const fee=sch==='Full'?0:sch==='Half'?C.f/2:C.f,afford=(S.fam.income-S.fam.expenses)*12;
    S.apps.unshift({k,score,cut,ok,sch});S.apps=S.apps.slice(0,8);S.lastApp=day();S.energy=Math.max(0,S.energy-20);S.t+=150;markSeen(log);store();
    modal(`<p class="m">${k} application</p><div class="big">${ok?'Admitted':'Not admitted'}</div><p>Entrance exam: <b>${r}/8</b><br>Your admission score: <b>${score}</b><br>This year's cut-off: <b>${cut}</b></p><p class="m">${rnd(300,900)} applicants competed for ${rnd(40,80)} places.</p>`+
    (ok?`<p>Scholarship: <b>${sch==='Full'?'Full tuition':sch==='Half'?'50% of tuition':'None'}</b>${low&&sch!=='None'?' (need-based consideration applied)':''}</p><p>Tuition to pay: <b>${gbp(fee)}</b> per year. ${fee>afford?'Your family cannot cover this from monthly savings alone. Look for part-time work or a stronger scholarship.':'Your family can cover this.'}</p><p class="m">University life arrives in a later stage.</p>`:`<p>You missed the cut-off by ${-m} point${-m===1?'':'s'}. Study more and apply again tomorrow.</p>`)+
    '<button class="o" onclick="uniMenu()">Back to admissions</button><button class="o" onclick="closeM()">Close</button>');});
}

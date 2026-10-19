/* ===== university (education.js) ===== */
const DN=['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const day=()=>Math.floor(S.t/1440),hr=()=>(S.t%1440)/60;
function libraryMenu(){
  const h=hr();
  if(h<8||h>=20){modal("<h3>Maple Public Library</h3><p class=\"m\">"+addr(28,-8)+"</p><p>Open 08:00–20:00.</p>",true);return}
  modal("<h3>Maple Public Library</h3><p class=\"m\">"+addr(28,-8)+" · Quiet study space</p><p>Revise Maths, English or Science before university applications.</p><button class=\"o go\" onclick=\"deskMenu()\">Study here</button><button class=\"o\" onclick=\"closeM()\">Leave</button>",true);
}
function schoolMenu(){libraryMenu()}
const CRS={Medicine:{c:72,f:9000,s:['Science']},Engineering:{c:66,f:7500,s:['Maths','Science']},Law:{c:64,f:6500,s:['English']},Business:{c:58,f:5500,s:['Maths','English']}};
function uniMenu(){
  let st='';
  if(S.lastApp===day())st='Admissions has closed for today. Come back tomorrow.';
  let html='<h3>Unity University admissions</h3><p class="m">'+addr(-28,15)+'</p>';
  html+='<p class="m">Age 18+. Apply straight to a course. Entrance exam: 8 hard questions in 150 s. Competitive places. Not real qualifications.</p>';
  if(st)html+='<p>'+st+'</p>';
  else Object.keys(CRS).forEach(k=>{html+='<button class="o" onclick="apply(\''+k+'\')">'+k+' <span class="m">· tuition '+gbp(CRS[k].f)+'/yr</span></button>'});
  html+='<button class="o" onclick="closeM()">Leave</button>';
  modal(html,true);
}
function apply(k){
  const C=CRS[k];if(S.energy<30){modal('<h3>Too tired</h3><p>You need at least 30% energy for an entrance exam.</p>',true);return}
  if(S.lastApp===day()){toast('Already applied today');return}
  quiz(k+' entrance exam',pickQs(QB.filter(q=>C.s.includes(q.s)),8,3),150,false,log=>{
    const r=log.filter(l=>l.ok).length,kav=C.s.reduce((a,x)=>a+S.know[x],0)/C.s.length;
    const score=Math.round(r/8*100*.7+kav*.3),cut=C.c+rnd(-4,6),m=score-cut,low=S.fam.cls==='Low',ok=m>=0;
    const sch=!ok?'None':m>=(low?8:12)?'Full':m>=(low?3:6)?'Half':'None';
    const fee=sch==='Full'?0:sch==='Half'?C.f/2:C.f,afford=(S.fam.income-S.fam.expenses)*12;
    S.apps=S.apps||[];S.apps.unshift({k,score,cut,ok,sch});S.apps=S.apps.slice(0,8);S.lastApp=day();S.energy=Math.max(0,S.energy-20);S.t+=150;markSeen(log);store();
    let res='<p class="m">'+k+' application</p><div class="big">'+(ok?'Admitted':'Not admitted')+'</div>';
    res+='<p>Entrance exam: <b>'+r+'/8</b><br>Your admission score: <b>'+score+'</b><br>This year\'s cut-off: <b>'+cut+'</b></p>';
    res+='<p class="m">'+rnd(300,900)+' applicants competed for '+rnd(40,80)+' places.</p>';
    if(ok){
      res+='<p>Scholarship: <b>'+(sch==='Full'?'Full tuition':sch==='Half'?'50% of tuition':'None')+'</b>'+(low&&sch!=='None'?' (need-based consideration applied)':'')+'</p>';
      res+='<p>Tuition to pay: <b>'+gbp(fee)+'</b> per year. '+(fee>afford?'Your family cannot cover this alone — work or aim for a better scholarship.':'Your family can cover this.')+'</p>';
      res+='<p class="m">Campus life expands in a later update.</p>';
    }else{
      res+='<p>Missed by '+(-m)+' point'+(-m===1?'':'s')+'. Study at the library and try again tomorrow.</p>';
    }
    res+='<button class="o" onclick="uniMenu()">Back to admissions</button><button class="o" onclick="closeM()">Close</button>';
    modal(res);
  });
}

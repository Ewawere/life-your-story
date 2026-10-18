/* ===== family system (family.js) ===== */
const FN={m:['James','Oliver','Daniel','Mohammed','Arjun','Lucas','Tomasz'],f:['Emma','Sophie','Aisha','Priya','Chloe','Maria','Hannah']},
SUR=['Smith','Taylor','Khan','Patel','Jones','Evans','Brown','Walker'],
JOBS={Low:['shop assistant','bus driver','care worker','security guard','delivery driver'],Middle:['teacher','nurse','civil servant','shop owner','mechanic'],Wealthy:['company director','surgeon','property developer','bank executive']},
TRAITS=['strict','generous','hardworking','easy-going','ambitious','always worried about money','very encouraging'],
EXPECT=['wants you to finish school with strong grades','needs you to help at home and with the family shop','wants you to find your own path'],
HOUSE={Low:'Rented two-room flat',Middle:'Rented three-bedroom flat',Wealthy:'Large family house'};
const CFG={probs:[['Low',.35],['Middle',.45],['Wealthy',.20]]}; // configurable class odds
function genFamily(){
  let r=Math.random(),cls='Wealthy',a=0;for(const [c,p] of CFG.probs){a+=p;if(r<a){cls=c;break}}
  const two=Math.random()<({Low:.5,Middle:.7,Wealthy:.85}[cls]);
  const rg={Low:[14,24],Middle:[30,60],Wealthy:[80,200]}[cls];
  const income=rnd(rg[0],rg[1])*100;
  const spend={Low:[.78,.95],Middle:[.55,.78],Wealthy:[.35,.55]}[cls];
  const expenses=Math.round(income*(spend[0]+Math.random()*(spend[1]-spend[0])));
  const sur=pick(SUR),g=[],jobs=shuf(JOBS[cls]);
  for(let i=0;i<(two?2:1);i++){const sx=Math.random()<.5?'m':'f';g.push({name:pick(FN[sx])+' '+sur,job:jobs[i],trait:pick(TRAITS)})}
  const sibs=[];for(let i=rnd(0,3);i>0;i--)sibs.push({name:pick([...FN.m,...FN.f]),age:rnd(6,24)});
  return{cls,sur,guardians:g,sibs,income,expenses,house:HOUSE[cls],expect:pick(EXPECT),pocket:{Low:20,Middle:50,Wealthy:150}[cls]};
}
function famHTML(){const f=S.fam;
  return `<h3>The ${f.sur} family</h3><table>
  <tr><td>Background</td><td>${f.cls}-income household</td></tr>
  <tr><td>Home</td><td>${f.house}</td></tr>
  ${f.guardians.map((g,i)=>`<tr><td>Guardian ${i+1}</td><td>${g.name}, ${g.job} (${g.trait})</td></tr>`).join('')}
  <tr><td>Siblings</td><td>${f.sibs.length?f.sibs.map(s=>s.name+' ('+s.age+')').join(', '):'None'}</td></tr>
  <tr><td>Monthly income</td><td>${gbp(f.income)}</td></tr>
  <tr><td>Monthly expenses</td><td>${gbp(f.expenses)}</td></tr>
  <tr><td>Left over</td><td>${gbp(f.income-f.expenses)}</td></tr>
  <tr><td>Expectation</td><td>Family ${f.expect}</td></tr></table>`}

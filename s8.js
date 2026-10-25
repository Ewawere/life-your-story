/* ===== jobs and chores =====
   FIX: a shift now takes 2-3 hours of game time, tires and feeds-on you, pays £15-25, and you can work at most 2 shifts a day. */
const MAX_SHIFTS=2;
const WORK_JOBS=[
{id:'shop',name:'Shop assistant',pay:20,secs:8,gmin:180,energy:22,hours:[15,20],desc:"Stack shelves at Singh's."},
{id:'deliver',name:'Food delivery',pay:22,secs:10,gmin:180,energy:25,hours:[16,21],desc:'Deliver meals around town.'},
{id:'tutor',name:'Tutor a neighbour kid',pay:25,secs:12,gmin:120,energy:15,hours:[16,19],needFriend:30,desc:'Help with homework. Need a friend.'},
{id:'carwash',name:'Car wash',pay:15,secs:6,gmin:120,energy:20,hours:[10,18],desc:'Wash cars near the bus stop.'}];
const shiftsToday=()=>(S.shiftDay&&S.shiftDay.d===day())?S.shiftDay.n:0;
const friendOK=j=>!j.needFriend||NP.some(n=>rel(n.id).f>=j.needFriend);
function jobsMenu(){
  const h=hr();S.jobDay=S.jobDay||{};
  let html='<h3>Jobs</h3><p class="m">Cash '+gbp(S.cash)+' · Energy '+Math.round(S.energy)+' · Shifts today '+shiftsToday()+'/'+MAX_SHIFTS+'</p>';
  WORK_JOBS.forEach((j,i)=>{
    const done=S.jobDay[j.id]===day(),open=h>=j.hours[0]&&h<j.hours[1];let lock='';
    if(done)lock=' (done today)';else if(!open)lock=' (open '+j.hours[0]+':00–'+j.hours[1]+':00)';else if(!friendOK(j))lock=' (need a friend first)';else if(shiftsToday()>=MAX_SHIFTS)lock=' (you have worked enough today)';
    const ok=!done&&open&&friendOK(j)&&shiftsToday()<MAX_SHIFTS;
    html+='<button class="o" onclick="startJob('+i+')" '+(ok?'':'style="opacity:.45"')+'><b>'+j.name+'</b> · '+gbp(j.pay)+' · '+(j.gmin/60)+'h<br><span class="m">'+j.desc+lock+'</span></button>';
  });
  modal(html+'<button class="o" onclick="phone()">Back</button>',true);
}
function startJob(i){
  const j=WORK_JOBS[i],h=hr();S.jobDay=S.jobDay||{};
  if(S.jobDay[j.id]===day()){toast('Already did that today');SFX.bad();return}
  if(shiftsToday()>=MAX_SHIFTS){toast('You have worked enough today');SFX.bad();return}
  if(h<j.hours[0]||h>=j.hours[1]){toast('Not available now');SFX.bad();return}
  if(!friendOK(j)){toast('Need a friend first');SFX.bad();return}
  if(S.energy<j.energy){toast('Too tired');SFX.bad();return}
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  closeM();
  ACT={icon:'£',label:j.name,endMs:performance.now()+j.secs*1000,done:()=>{
    S.cash+=j.pay;S.energy=Math.max(0,S.energy-j.energy);S.t+=j.gmin;S.jobDay[j.id]=day();
    S.shiftDay={d:day(),n:shiftsToday()+1};gain('hunger',-12);gain('fun',-8);gain('social',j.id==='tutor'?6:2);
    toast(j.name+': earned '+gbp(j.pay));SFX.chime();store()}};
  toast('Working: '+j.name+'...');updateActUI();
}
const CHORES=[{id:'dishes',name:'Wash the dishes',pay:3,s:4,energy:4},{id:'trash',name:'Take out the bins',pay:2,s:3,energy:5},{id:'vacuum',name:'Vacuum the lounge',pay:4,s:5,energy:8},{id:'laundry',name:'Do the laundry',pay:5,s:6,energy:7}];
function choresMenu(){
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  S.choreDay=S.choreDay||{};
  let html='<h3>Chores</h3><p class="m">Your family pays a little for help around the house.</p>';
  CHORES.forEach((c,i)=>{const done=S.choreDay[c.id]===day();html+='<button class="o" onclick="doChore('+i+')" '+(done?'style="opacity:.45"':'')+'>'+c.name+' · '+gbp(c.pay)+(done?' (done)':'')+'</button>'});
  modal(html+'<button class="o" onclick="closeM()">Close</button>',true);
}
function doChore(i){
  const c=CHORES[i];S.choreDay=S.choreDay||{};
  if(S.choreDay[c.id]===day()){toast('Already done today');SFX.bad();return}
  if(S.energy<c.energy){toast('Too tired');SFX.bad();return}
  if(typeof ACT!=='undefined'&&ACT){toast('You are already busy');return}
  closeM();
  ACT={icon:'Home',label:c.name,endMs:performance.now()+c.s*1000,done:()=>{
    S.cash+=c.pay;S.energy=Math.max(0,S.energy-c.energy);S.t+=c.s*4;S.choreDay[c.id]=day();
    toast(c.name+' done. You earned '+gbp(c.pay));SFX.ok();store()}};
  toast(c.name+'...');updateActUI();
}
/* Betting removed: simulated gambling can push the game into an adult age rating and the game is meant to be safe for 16-year-olds. */

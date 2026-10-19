/* ===== weather, age and skills (life.js) ===== */
let WX=null;
const rainyDay=d=>WX!==null?WX:(Math.imul(d+7,2654435761)>>>0)%100<28;
const rainStart=d=>11+((Math.imul(d+13,2654435761)>>>0)%100)%6;
const raining=()=>{const h=hr();if(!rainyDay(day()))return false;const s=rainStart(day());return h>=s&&h<s+2};
const YEAR=14,age=()=>16+Math.floor(day()/YEAR);
function birthday(){
  const gift={Low:20,Middle:50,Wealthy:150}[S.fam.cls],fr=NP.filter(n=>rel(n.id).f>=40);
  S.cash+=gift;fr.forEach(n=>{const r=rel(n.id);r.f=Math.min(100,r.f+3)});gain('fun',25);gain('social',15);SFX.chime();store();
  modal('<h3>Happy birthday, '+S.name+'!</h3><p>You are now <b>'+S.age+'</b>.</p><p>Your family bakes a cake and gives you <b>'+gbp(gift)+'</b>. Fun +25, social +15.</p>'+(fr.length?'<p>'+fr.map(n=>n.name).join(', ')+' remembered and sent wishes. Friendship +3.</p>':'<p class="m">No neighbour knows you well enough yet to remember.</p>'),true);
}
const nstat=n=>({sleep:'asleep',away:'at school or work until 14:00',home:'at home',out:'out walking in '+areaOf(n.cx).n})[nstate(n)];
function phone(){
  const app=(icon,label,fn,badge)=>{
    const b=badge?'<span style="position:absolute;top:-4px;right:-4px;background:#e11;color:#fff;font-size:10px;min-width:16px;height:16px;border-radius:8px;display:flex;align-items:center;justify-content:center;font-weight:700">'+badge+'</span>':'';
    return '<div onclick="'+fn+'" style="display:flex;flex-direction:column;align-items:center;gap:6px;cursor:pointer;position:relative"><div style="width:56px;height:56px;border-radius:14px;background:linear-gradient(145deg,#3a3f55,#2a2f42);display:flex;align-items:center;justify-content:center;font-size:26px;box-shadow:0 4px 12px #0004;position:relative">'+icon+b+'</div><span style="font-size:11px;color:#e8eaf0;font-weight:500">'+label+'</span></div>';
  };
  const nMsg=(S.inbox||[]).length||0;
  const html='<div style="background:linear-gradient(180deg,#1a1e2e 0%,#0f1219 100%);border-radius:28px;padding:20px 16px 28px;max-width:280px;margin:0 auto;box-shadow:0 20px 50px #0008,inset 0 0 0 2px #ffffff10">'+
    '<div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:18px;padding:0 6px">'+
      '<span style="font-size:13px;font-weight:600;color:#fff">'+String(Math.floor((S.t/60)%24)).padStart(2,'0')+':'+String(Math.floor(S.t%60)).padStart(2,'0')+'</span>'+
      '<span style="font-size:11px;color:#8b93a7">'+gbp(S.cash)+'</span>'+
    '</div>'+
    '<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:18px 12px;justify-items:center;margin-bottom:20px">'+
      app('💬','Messages','pMsgs()',nMsg||null)+
      app('👤','Contacts','pContacts()')+
      app('🗺️','Maps','pMap()')+
      app('🍔','Food','pFood()')+
      app('💼','Jobs','jobsMenu()')+
      app('🏠','Home','closeM();enterHome()')+
      app('🚌','Bus','closeM();busMenu()')+
    '</div>'+
    '<div style="text-align:center"><div onclick="closeM()" style="width:40%;height:5px;background:#ffffff30;border-radius:3px;margin:0 auto;cursor:pointer"></div></div>'+
  '</div>';
  modal(html,true);
}
function pContacts(){modal('<h3>Contacts</h3>'+NP.slice().sort((a,b)=>rel(b.id).f-rel(a.id).f).map(n=>'<button class="o" onclick="pContact(\''+n.id+'\')">'+n.name+' <span class="m">· '+FL(Math.round(rel(n.id).f))+' · '+areaOf(n.cx).n+'</span></button>').join('')+'<button class="o" onclick="phone()">Back</button>',true)}
function pContact(id,msg){const n=NP.find(x=>x.id===id),f=Math.round(rel(id).f);modal('<h3>'+n.name+'</h3><p class="m">'+addr(n.door[0],n.door[1])+'<br>'+FL(f)+' · '+f+'/100</p>'+(msg?'<p><b>'+n.name+':</b> '+msg+'</p>':'')+'<button class="o" onclick="pText(\''+id+'\',0)">Text: What are you up to?</button><button class="o" onclick="pText(\''+id+'\',1)">Text: Can I come over?</button><button class="o" onclick="pContacts()">Back</button>',true)}
function pText(id,k){const n=NP.find(x=>x.id===id),f=rel(id).f;S.t+=2;pContact(id,k===0?'Right now I\'m '+nstat(n)+'.':f<40?'We don\'t know each other well enough yet. Maybe soon!':nstate(n)==='home'?'Sure, come round! I\'m at '+addr(n.door[0],n.door[1])+'.':'Not now, I\'m '+nstat(n)+'. Try after 19:00.')}
function pMap(){const here=areaOf(P.position.x).n;modal('<h3>Maps</h3>'+DIST.map(d=>'<p><b>'+d.n+'</b> ('+d.code+')'+(d.n===here?' · you are here':'')+'<br><span class="m">'+NP.filter(n=>areaOf(n.cx)===d).length+' neighbours · '+d.st.join(' and ')+(d.ox===0?'<br>Your home: '+addr(0,-8)+'<br>School: '+addr(28,-8)+'<br>University: '+addr(-28,15)+'<br>Shop: '+addr(0,15):'')+'</span></p>').join('')+'<p class="m">Every neighbourhood has a bus stop. Fare £2.</p><button class="o" onclick="phone()">Back</button>',true)}
const MEALS=[['Burger meal',9,50,5],['Pizza',12,60,10],['Salad bowl',8,40,0]];
function pFood(){modal('<h3>Food delivery</h3><p class="m">Arrives in about 30 minutes. Balance '+gbp(S.cash)+'</p>'+MEALS.map((m,i)=>'<button class="o" onclick="order('+i+')">'+m[0]+' <span class="m">· '+gbp(m[1])+'</span></button>').join('')+'<button class="o" onclick="phone()">Back</button>',true)}
function order(i){const m=MEALS[i];if(S.cash<m[1]){toast('Not enough cash');SFX.bad();return}S.cash-=m[1];gain('hunger',m[2]);gain('fun',m[3]);S.t+=30;SFX.ok();store();toast(m[0]+' delivered. Hunger +'+m[2]);pFood()}
function busMenu(){modal('<h3>Bus stop</h3><p class="m">You are in '+areaOf(P.position.x).n+'. Single fare '+gbp(2)+', about 20 minutes.</p>'+DIST.map((d,i)=>d.n===areaOf(P.position.x).n?'':'<button class="o" onclick="ride('+i+')">Take the bus to '+d.n+'</button>').join(''),true)}
function ride(i){if(S.cash<2){toast('You need £2 for the fare');SFX.bad();return}S.cash-=2;S.t+=20;const d=DIST[i];P.position.set(d.ox+6,0,-.6);S.area=d.n;closeM();toast('Arrived in '+d.n);SFX.door();store()}
let ACT=null;
const SHOWS=[['Soap Opera',25,5,'A dramatic episode keeps you hooked.'],['Comedy Show',35,6,'You laugh until your sides hurt.'],['Nature Doc',30,7,'Beautiful animals and calm narration.'],['Football Match',40,8,'Your team scores in the final minute!'],['News Bulletin',15,4,'You catch up on what is happening.']];
function tvMenu(){
  if(ACT){toast('You are already busy');return}
  modal('<h3>What to watch?</h3><p class="m">Pick a show</p>'+SHOWS.map((s,i)=>'<button class="o" onclick="startTV('+i+')">'+s[0]+' <span class="m">· '+s[2]+'s · Fun +'+s[1]+'</span></button>').join('')+'<button class="o" onclick="closeM()">Cancel</button>',true);
}
function startTV(i){
  closeM();const s=SHOWS[i];
  ACT={icon:'TV',label:s[0],endMs:performance.now()+s[2]*1000,done:()=>{const cz=raining()?8:0;gain('fun',s[1]+cz);S.t+=s[2];toast(s[3]+' Fun +'+(s[1]+cz)+(cz?' (cosy rainy day)':''));SFX.ok();store()}};
  toast('Watching '+s[0]+'...');updateActUI();
}
const RECIPES=[['Scrambled eggs',{eggs:1,milk:1},35,5],['Toast & fruit',{bread:1,fruit:1},30,4],['Chicken rice',{chicken:1,rice:1,veg:1},55,8],['Pasta bowl',{pasta:1,veg:1},40,6],['Veggie stir-fry',{veg:2,rice:1},38,6]];
function cookMenu(){
  if(ACT){toast('You are already busy');return}
  S.food=S.food||{};
  const has=(need)=>Object.keys(need).every(k=>(S.food[k]||0)>=need[k]);
  let html='<h3>Cook a meal</h3><p class="m">Fridge: '+(Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+'x'+S.food[k]).join(', ')||'empty')+'</p>';
  RECIPES.forEach((r,i)=>{const ok=has(r[1]);const need=Object.keys(r[1]).map(k=>k+'x'+r[1][k]).join(', ');html+='<button class="o" onclick="startCook('+i+')" '+(ok?'':'style="opacity:.45"')+'>'+r[0]+' <span class="m">· '+need+' · '+r[3]+'s</span></button>'});
  html+='<p class="m">Buy groceries at the orange shop first.</p><button class="o" onclick="closeM()">Cancel</button>';
  modal(html,true);
}
function startCook(i){
  const r=RECIPES[i];S.food=S.food||{};
  for(const k in r[1]){if((S.food[k]||0)<r[1][k]){toast('Missing ingredients');SFX.bad();return}}
  for(const k in r[1])S.food[k]-=r[1][k];
  closeM();const skill=S.sk.cook||0;
  ACT={icon:'Cook',label:r[0],endMs:performance.now()+r[3]*1000,done:()=>{const h=r[2]+Math.round(skill*.35);gain('hunger',h);gain('fun',8);S.sk.cook=Math.min(100,skill+5*(1-skill/120));S.energy=Math.min(100,S.energy+10);S.t+=r[3];toast('Cooked '+r[0]+'! Hunger +'+h+' · Cooking '+Math.round(S.sk.cook));SFX.ok();store()}};
  toast('Cooking '+r[0]+'...');updateActUI();store();
}
function updateActUI(){
  let el=document.getElementById('actChip');
  if(!ACT){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='actChip';el.className='chip';el.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:6;pointer-events:none';document.body.appendChild(el)}
  const left=Math.max(0,Math.ceil((ACT.endMs-performance.now())/1000));
  el.innerHTML=ACT.icon+' '+ACT.label+' · '+left+'s';
}
function tickAct(){if(!ACT)return;updateActUI();if(performance.now()>=ACT.endMs){const d=ACT.done;ACT=null;updateActUI();d()}}
function workout(){
  if(ACT){toast('You are already busy');return}
  if(S.energy<20){toast('Too tired to exercise');SFX.bad();return}
  ACT={icon:'Gym',label:'Workout',endMs:performance.now()+6*1000,done:()=>{const f=S.sk.fit||0;S.sk.fit=Math.min(100,f+3*(1-f/120));S.energy-=12;gain('hygiene',-10);gain('fun',12);S.t+=6;toast('Good workout! Fitness '+Math.round(S.sk.fit));SFX.ok();store()}};
  toast('Working out...');updateActUI();
}

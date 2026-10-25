function startTV(i){
  closeM();const s=SHOWS[i];
  ACT={icon:'TV',label:s[0],endMs:performance.now()+s[2]*1000,done:()=>{const cz=raining()?8:0;gain('fun',s[1]+cz);S.t+=s[4];toast(s[3]+' Fun +'+(s[1]+cz)+(cz?' (cosy rainy day)':''));SFX.ok();store()}};
  toast('Watching '+s[0]+'...');updateActUI();
}
const RECIPES=[['Scrambled eggs',{eggs:1,milk:1},35,5],['Toast & fruit',{bread:1,fruit:1},30,4],['Chicken rice',{chicken:1,rice:1,veg:1},55,8],['Pasta bowl',{pasta:1,veg:1},40,6],['Veggie stir-fry',{veg:2,rice:1},38,6]];
const hasIng=need=>Object.keys(need).every(k=>((S.food||{})[k]||0)>=need[k]);
function cookMenu(){
  if(ACT){toast('You are already busy');return}
  S.food=S.food||{};
  let html='<h3>Cook a meal</h3><p class="m">Fridge: '+(Object.keys(S.food).filter(k=>S.food[k]>0).map(k=>k+'x'+S.food[k]).join(', ')||'empty')+'</p>';
  RECIPES.forEach((r,i)=>{const need=Object.keys(r[1]).map(k=>k+'x'+r[1][k]).join(', ');html+='<button class="o" onclick="startCook('+i+')" '+(hasIng(r[1])?'':'style="opacity:.45"')+'>'+r[0]+' <span class="m">· '+need+' · '+r[3]+'s</span></button>'});
  html+='<p class="m">Buy groceries at the orange shop first.</p><button class="o" onclick="closeM()">Cancel</button>';
  modal(html,true);
}
/* FIX: ingredients are used up when the meal is finished, so closing the page mid-cook does not lose them */
function startCook(i){
  const r=RECIPES[i];S.food=S.food||{};
  if(!hasIng(r[1])){toast('Missing ingredients');SFX.bad();return}
  closeM();const skill=S.sk.cook||0;
  ACT={icon:'Cook',label:r[0],endMs:performance.now()+r[3]*1000,done:()=>{
    if(!hasIng(r[1])){toast('The ingredients are gone');SFX.bad();return}
    for(const k in r[1])S.food[k]-=r[1][k];
    const h=r[2]+Math.round(skill*.35);gain('hunger',h);gain('fun',8);S.sk.cook=Math.min(100,skill+5*(1-skill/120));S.energy=Math.min(100,S.energy+10);S.t+=r[3]*3;
    toast('Cooked '+r[0]+'! Hunger +'+h+' · Cooking '+Math.round(S.sk.cook));SFX.ok();store()}};
  toast('Cooking '+r[0]+'...');updateActUI();
}
function updateActUI(){
  let el=document.getElementById('actChip');
  if(!ACT){if(el)el.remove();return}
  if(!el){el=document.createElement('div');el.id='actChip';el.className='chip';el.style.cssText='position:fixed;top:calc(12px + env(safe-area-inset-top));left:50%;transform:translateX(-50%);z-index:6;pointer-events:none';document.body.appendChild(el)}
  el.textContent=ACT.icon+' '+ACT.label+' · '+Math.max(0,Math.ceil((ACT.endMs-performance.now())/1000))+'s';
}
function tickAct(){if(!ACT)return;updateActUI();if(performance.now()>=ACT.endMs){const d=ACT.done;ACT=null;updateActUI();d()}}
function workout(){
  if(ACT){toast('You are already busy');return}
  if(S.energy<20){toast('Too tired to exercise');SFX.bad();return}
  ACT={icon:'Gym',label:'Workout',endMs:performance.now()+6*1000,done:()=>{const f=S.sk.fit||0;S.sk.fit=Math.min(100,f+3*(1-f/120));S.energy-=12;gain('hygiene',-10);gain('fun',12);S.t+=40;toast('Good workout! Fitness '+Math.round(S.sk.fit));SFX.ok();store()}};
  toast('Working out...');updateActUI();
}

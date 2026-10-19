/* ===== menu / screens (menus.js) ===== */
function progHTML(){
  return `<h3>${S.name}, age ${S.age||18}</h3><table>
  <tr><td>Energy</td><td>${Math.round(S.energy)}%</td></tr>
  <tr><td>Pocket money</td><td>${gbp(S.cash)}</td></tr>
  ${SUBJ.map(s=>`<tr><td>${s}</td><td>knowledge ${S.know[s]}/100</td></tr>`).join('')}
  <tr><td>Mood</td><td>${ML(mood())} (${Math.round(mood())})<br>Hunger ${Math.round(S.need.hunger)} · Fun ${Math.round(S.need.fun)}<br>Social ${Math.round(S.need.social)} · Hygiene ${Math.round(S.need.hygiene)}</td></tr><tr><td>Skills</td><td>Cooking ${Math.round((S.sk||{}).cook||0)} · Fitness ${Math.round((S.sk||{}).fit||0)} · Mind ${typeof mindSkill==='function'?mindSkill():Math.round((S.sk||{}).mind||0)}</td></tr><tr><td>Home comfort</td><td>${comfort()}/6 comfort · ${(S.deco||[]).length} items</td></tr><tr><td>Neighbours</td><td>${NP.map(n=>n.name+': '+FL(Math.round(rel(n.id).f))).join('<br>')}</td></tr><tr><td>Study / applications</td><td>${(S.apps||[]).length} apps · home desk study</td></tr><tr><td>Applications</td><td>${(S.apps||[]).length?S.apps.map(a=>a.k+': '+(a.ok?'admitted'+(a.sch!=='None'?' ('+a.sch+' scholarship)':''):'not admitted')).join('<br>'):'None yet'}</td></tr>
  <tr><td>Exam history</td><td>${S.exams.length?S.exams.map(e=>e.g+' ('+e.pct+'%)').join(', '):'No exams taken yet'}</td></tr></table>`}
function menu(){
  modal(`<h3>Menu</h3><button class="o" onclick="modal(progHTML(),true)">My progress</button><button class="o" onclick="modal(famHTML(),true)">My family</button><button class="o" onclick="store();toast('Game saved');closeM()">Save now</button><button class="o" onclick="if(confirm('Start a new life? Your current save will be replaced.'))newLifeScreen()">New life</button><button class="o" onclick="S.muted=!S.muted;store();menu()">Sound: ${S.muted?'Off':'On'}</button><button class="o" onclick="S.t+=60;store();toast('An hour passes');closeM()">Wait 1 hour</button><button class="o" onclick="closeM()">Resume</button>`);
}
const COLORS=['#e4572e','#2e86ab','#7cb518','#f2b705','#8e5cd9'];
const SKINS=['#8d5a3b','#c68642','#f1c8a5','#5a3825'],HAIRS=['#1d1410','#4a2c17','#b5651d','#8a8a8a','#f2c94c'];
let pickedColor=COLORS[0],pickedSkin=SKINS[0],pickedHair=HAIRS[0],pickedStyle='spiky',pickedGender='male';
const STY=[['spiky','⚡'],['short','✂️'],['long','👩'],['curly','🌀'],['bun','🎀']];
const mark=el=>{[...el.parentNode.children].forEach(e=>e.classList.remove('on'));el.classList.add('on')};
const sw=(list,v)=>`<div>${list.map((c,i)=>`<span class="sw${i?'':' on'}" style="background:${c}" onclick="${v}='${c}';mark(this)"></span>`).join('')}</div>`;
function newLifeScreen(){
  $('hud').style.display=$('joy').style.display=$('look').style.display=$('hint').style.display='none';
  const sv=loadSave();
  modal(`<h2>Life: Your Story</h2><p class="m">Prototype 0.9 · 18+</p>
  ${sv?`<button class="o go" onclick="continueGame()">Continue as ${sv.name}</button><p class="m">Or start over:</p>`:''}
  <p>Your name</p><input type="text" id="nm" maxlength="14" placeholder="Enter a name" autocomplete="off">
  <p>Gender</p><div><span class="sw on" style="background:#2b4a63;display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;font-size:14px" onclick="pickedGender='male';mark(this)">Male</span><span class="sw" style="background:#2b4a63;display:inline-flex;align-items:center;justify-content:center;padding:8px 14px;font-size:14px" onclick="pickedGender='female';mark(this)">Female</span></div>
  <p>Shirt colour</p>${sw(COLORS,'pickedColor')}<p>Skin tone</p>${sw(SKINS,'pickedSkin')}<p>Hair colour</p>${sw(HAIRS,'pickedHair')}<p>Hair style</p><div>${STY.map((x,i)=>`<span class="sw${i?'':' on'}" style="background:#2b4a63;display:inline-flex;align-items:center;justify-content:center;font-size:20px" onclick="pickedStyle='${x[0]}';mark(this)">${x[1]}</span>`).join('')}</div>
  <button class="o ${sv?'':'go'}" onclick="startLife()">Begin a new life</button>`);
}
function startLife(){
  const nm=($('nm').value||'').trim()||'Alex';
  S={name:nm,color:pickedColor,skin:pickedSkin,hair:pickedHair,style:pickedStyle,gender:pickedGender,inbox:[],chat:{},shirts:[pickedColor],deco:[],paint:{wall:'#f3ead7',floor:'#d8b98a'},al:0,sk:{cook:0,fit:0,mind:0},age:18,fam:genFamily(),know:{Maths:0,English:0,Science:0},energy:90,exams:[],rel:{},vis:null,need:{hunger:80,fun:70,social:60,hygiene:80},nt:480,evT:780,muted:false,seen:{},att:0,lastSch:-1,apps:[],lastApp:-1,t:480,inside:false,x:0,z:5,vehicles:[]};
  S.cash=S.fam.pocket;store();
  modal(`<p class="m">Your new life</p>${famHTML()}<p>You are ${nm}, 18 years old — free to live your own life.</p><button class="o go" onclick="beginPlay()">Step outside</button>`);
}
function continueGame(){S=loadSave();S.seen=S.seen||{};S.rel=S.rel||{};S.vis=S.vis||null;{const M={chioma:'emily',tunde:'oliver',amina:'priya',kelechi:'jack'};Object.keys(M).forEach(o=>{if(S.rel[o]){S.rel[M[o]]=S.rel[o];delete S.rel[o]}});if(M[S.vis])S.vis=M[S.vis]}
  S.inbox=S.inbox||[];S.chat=S.chat||{};S.style=S.style||'spiky';S.gender=S.gender||'male';S.deco=S.deco||[];S.paint=S.paint||{wall:'#f3ead7',floor:'#d8b98a'};S.sk=S.sk||{cook:0,fit:0,mind:0};S.sk.mind=S.sk.mind||0;S.vehicles=S.vehicles||[];if(S.age==null)S.age=18+Math.floor(S.t/1440/YEAR);if(S.age<18)S.age=18;S.shirts=S.shirts||[S.color];S.skin=S.skin||'#8d5a3b';S.hair=S.hair||'#1d1410';if(S.al==null)S.al=Math.floor(S.t/1440/7);S.need=S.need||{hunger:80,fun:70,social:60,hygiene:80};if(S.nt==null)S.nt=S.t;if(S.cash==null)S.cash=S.fam.pocket;if(S.evT==null)S.evT=S.t+300;S.att=S.att||0;S.apps=S.apps||[];if(S.lastSch==null)S.lastSch=-1;if(S.lastApp==null)S.lastApp=-1;beginPlay()}
function beginPlay(){
  closeM();buildPlayer();renderDeco();setScene(S.inside,S.vis);P.position.set(S.x,0,S.z);
  $('hud').style.display='flex';$('joy').style.display='block';$('look').style.display='block';$('hn').textContent=S.name;$('hint').style.display='block';if(typeof renderVehicles==='function')renderVehicles();
}

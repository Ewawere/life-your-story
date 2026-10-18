/* ===== question bank (exams.js) — original questions ===== */
const Q=(s,t,d,q,o,a,e)=>({s,t,d,q,o,a,e});
const QB=[
Q('Maths','Number',1,'What is 15% of 200?',['20','30','15','25'],1,'15/100 × 200 = 30.'),
Q('Maths','Algebra',1,'Solve 3x + 4 = 19. What is x?',['3','7','5','15'],2,'Subtract 4: 3x = 15, so x = 5.'),
Q('Maths','Geometry',1,'A rectangle is 8 m by 5 m. What is its area?',['13 m²','26 m²','40 m²','45 m²'],2,'Area = length × width = 8 × 5 = 40.'),
Q('Maths','Number',1,'A notebook costs £3.50. What do 4 notebooks cost?',['£12','£14','£15','£16'],1,'3.50 × 4 = 14.'),
Q('Maths','Geometry',1,'The angles of a triangle add up to…',['90°','270°','180°','360°'],2,'Every triangle has angles totalling 180°.'),
Q('Maths','Number',2,'Next number: 2, 6, 18, 54, ?',['108','162','72','148'],1,'Each term is multiplied by 3. 54 × 3 = 162.'),
Q('Maths','Algebra',2,'Simplify 2(x + 3) − x.',['x + 6','3x + 6','x + 3','2x + 3'],0,'2x + 6 − x = x + 6.'),
Q('Maths','Geometry',2,'A circle has radius 7 cm. Its circumference (π = 22/7) is…',['22 cm','44 cm','154 cm','49 cm'],1,'C = 2πr = 2 × 22/7 × 7 = 44.'),
Q('Maths','Data',2,'What is the mean of 4, 8, 6, 10 and 7?',['6','7','8','35'],1,'Sum = 35, and 35 ÷ 5 = 7.'),
Q('Maths','Probability',2,'What is the chance of rolling an even number on a fair die?',['1/6','1/3','1/2','2/3'],2,'Even numbers: 2, 4, 6. That is 3 out of 6 = 1/2.'),
Q('Maths','Number',3,'After a 20% discount a phone costs £400. What was the original price?',['£480','£500','£520','£320'],1,'£400 is 80% of the original, so original = 400 ÷ 0.8 = 500.'),
Q('Maths','Algebra',3,'Which values solve x² − 5x + 6 = 0?',['1 and 6','2 and 3','−2 and −3','5 and 6'],1,'Factorise: (x − 2)(x − 3) = 0.'),
Q('Maths','Geometry',3,'A right triangle has shorter sides 6 cm and 8 cm. Its hypotenuse is…',['10 cm','12 cm','14 cm','7 cm'],0,'6² + 8² = 100, and √100 = 10.'),
Q('Maths','Probability',3,'Two fair coins are tossed. The probability of two heads is…',['1/2','1/4','1/3','2/3'],1,'1/2 × 1/2 = 1/4.'),
Q('English','Grammar',1,'Which sentence is correct?',["She don't like rice.","She doesn't like rice.","She not like rice.","She do not likes rice."],1,'With she/he/it we use "doesn\'t" plus the base verb.'),
Q('English','Vocabulary',1,'Which word means almost the same as "rapid"?',['slow','quick','quiet','heavy'],1,'Rapid means fast, so "quick" is the synonym.'),
Q('English','Grammar',1,'A word that describes a noun is called a(n)…',['verb','adverb','adjective','pronoun'],2,'Adjectives describe nouns: a "tall" tree.'),
Q('English','Grammar',1,'What is the plural of "child"?',['childs','childrens','children','childes'],2,'"Child" is irregular: the plural is "children".'),
Q('English','Vocabulary',1,'What is the opposite of "brave"?',['bold','cowardly','strong','loud'],1,'Cowardly means lacking courage.'),
Q('English','Grammar',2,'Choose the correct word: Neither of the boys ___ ready.',['are','were','is','be'],2,'"Neither" is singular, so it takes "is".'),
Q('English','Vocabulary',2,'What is the opposite of "scarce"?',['rare','plentiful','costly','tiny'],1,'Scarce means hard to find. Plentiful means there is a lot.'),
Q('English','Grammar',2,'Name the tense: "By noon, she had finished her work."',['Simple past','Past perfect','Present perfect','Future perfect'],1,'"Had" plus a past participle, about an earlier past moment, is past perfect.'),
Q('English','Vocabulary',2,'"Benevolent" most nearly means…',['cruel','kind and generous','careless','nervous'],1,'Benevolent describes someone who wishes others well.'),
Q('English','Literature',3,'"The market was silent; even the hens seemed to hold their breath." This is…',['simile','personification','alliteration','hyperbole'],1,'The hens are given a human action, which is personification.'),
Q('English','Grammar',3,'Which sentence has a misplaced modifier?',['Ada missed the bus while running down the road.','Running down the road, the bus was missed by Ada.','Ada, running down the road, missed the bus.','While Ada ran down the road, she missed the bus.'],1,'In option B the opening phrase seems to describe the bus, not Ada.'),
Q('English','Comprehension',3,'In "Despite the rain, the match went ahead", "Despite" shows…',['cause','contrast','time','addition'],1,'The match continued even though rain would normally stop it. That is contrast.'),
Q('Science','Biology',1,'Which gas do plants take in for photosynthesis?',['Oxygen','Carbon dioxide','Nitrogen','Hydrogen'],1,'Plants use carbon dioxide, water and light to make food.'),
Q('Science','Chemistry',1,'At sea level, pure water boils at…',['50 °C','150 °C','100 °C','0 °C'],2,'Water boils at 100 °C at sea level.'),
Q('Science','Biology',1,'Which organ pumps blood around the body?',['Lung','Liver','Kidney','Heart'],3,'The heart is a muscle that pumps blood.'),
Q('Science','Physics',1,'Which force pulls objects towards the Earth?',['Friction','Magnetism','Gravity','Tension'],2,"Gravity attracts objects towards Earth's centre."),
Q('Science','Chemistry',2,'What is the chemical symbol for sodium?',['S','So','Na','N'],2,'Na comes from the Latin name natrium.'),
Q('Science','Biology',2,'Which part of a cell contains its genetic material?',['Cytoplasm','Nucleus','Cell wall','Vacuole'],1,'The nucleus holds the DNA.'),
Q('Science','Physics',2,'A car travels 150 km in 2 hours. What is its average speed?',['50 km/h','75 km/h','300 km/h','150 km/h'],1,'Speed = distance ÷ time = 150 ÷ 2 = 75.'),
Q('Science','Chemistry',2,'What is the pH of a neutral solution such as pure water?',['0','7','14','10'],1,'pH 7 is neutral. Below 7 is acidic and above 7 is alkaline.'),
Q('Science','Biology',2,'Malaria is spread by which animal?',['Housefly','Female Anopheles mosquito','Tsetse fly','Cockroach'],1,'The parasite is carried by female Anopheles mosquitoes.'),
Q('Science','Biology',3,'Water moving through a semi-permeable membrane from a dilute to a concentrated solution is called…',['Diffusion','Osmosis','Respiration','Evaporation'],1,'That movement of water is osmosis.'),
Q('Science','Physics',3,'A 10 N force moves an object 3 m in its own direction. The work done is…',['13 J','30 J','3.3 J','7 J'],1,'Work = force × distance = 10 × 3 = 30 J.'),
Q('Science','Chemistry',3,'Which balanced equation is correct for making water?',['H₂ + O₂ → H₂O','2H₂ + O₂ → 2H₂O','H₂ + 2O₂ → 2H₂O','2H + O → H₂O'],1,'Four hydrogen atoms and two oxygen atoms appear on both sides in 2H₂ + O₂ → 2H₂O.'),
Q('Science','Physics',3,"Ohm's law says that voltage V equals…",['I ÷ R','I × R','I + R','R ÷ I'],1,'V = I × R: current times resistance.')];
const SUBJ=['Maths','English','Science'];
const grade=p=>p>=83?'A':p>=67?'B':p>=50?'C':p>=33?'D':'F';

// Reusable quiz runner: title, questions, seconds (0 = untimed), show explanations, callback(log)
function quiz(title,qs,secs,explain,done){
  let i=0,t=secs,iv=null,log=[],locked=false;
  const finish=()=>{clearInterval(iv);done(log,qs)};
  const show=()=>{
    const q=qs[i],opts=shuf(q.o.map((x,k)=>({x,k})));locked=false;
    modal(`<h3>${title}</h3><p class="m">Question ${i+1} of ${qs.length} · ${q.s}: ${q.t}${secs?' · <b id="tm">'+t+'s</b> left':''}</p><p style="font-size:18px">${q.q}</p>`+
      opts.map(o=>`<button class="o" data-k="${o.k}">${o.x}</button>`).join(''));
    document.querySelectorAll('#mb .o').forEach(b=>b.onclick=()=>answer(+b.dataset.k,b));
  };
  const next=()=>{i++;if(i>=qs.length)finish();else show()};
  const answer=(k,btn)=>{
    if(locked)return;locked=true;const q=qs[i],ok=k===q.a;(ok?SFX.ok:SFX.bad)();log.push({q:q.q,ok,pick:q.o[k],right:q.o[q.a],e:q.e,s:q.s});
    if(!explain){next();return}
    document.querySelectorAll('#mb .o').forEach(b=>{if(+b.dataset.k===q.a)b.classList.add('ok');else if(b===btn)b.classList.add('no')});
    $('mb').insertAdjacentHTML('beforeend',`<p>${ok?'Correct. ':'Not quite. '}${q.e}</p><button class="o go" id="nx">${i+1<qs.length?'Next question':'Finish'}</button>`);
    $('nx').onclick=next;
  };
  if(secs)iv=setInterval(()=>{t--;const e=$('tm');if(e)e.textContent=t;if(t<=0){while(log.length<qs.length)log.push({q:qs[log.length].q,ok:false,pick:'(no answer)',right:qs[log.length].o[qs[log.length].a],e:qs[log.length].e,s:qs[log.length].s});finish()}},1000);
  show();
}

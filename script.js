const questions = [
  {id:"rating", type:"scale", text:"Насколько вам нравится предмет «Веб-программирование»?", min:"Совсем не нравится", max:"Очень нравится"},
  {id:"favorite", type:"single", text:"Какая часть предмета нравится вам больше всего?",
    options:["HTML и CSS","JavaScript","Серверная часть и базы данных","Работа над проектами"]},
  {id:"easy", type:"multi", text:"Что даётся вам легко?",
    options:["Вёрстка на HTML","Стилизация на CSS","Логика на JavaScript","Работа с Git","Поиск и исправление ошибок"]},
  {id:"level", type:"single", text:"Как вам сложность заданий?", options:["Слишком лёгкие","В самый раз","Слишком сложные"]},
  {id:"future", type:"single", text:"Хотите продолжить изучать веб-разработку?", options:["Да","Скорее да","Скорее нет","Нет"]},
  {id:"comment", type:"text", text:"Что стоит улучшить в предмете?", optional:true}
];
const answers = {};
let i = 0;
const card = document.getElementById("card");
const fill = document.getElementById("fill");
const stepEl = document.getElementById("step");
const bar = document.querySelector(".bar");

function render(){
  const q = questions[i];
  const pct = Math.round(i / questions.length * 100);
  fill.style.width = pct + "%";
  bar.setAttribute("aria-valuenow", pct);
  stepEl.textContent = "Вопрос " + (i+1) + " из " + questions.length;
  let body = "";
  if(q.type === "scale"){
    body = '<div class="scale">' + [1,2,3,4,5].map(n =>
      `<label><input type="radio" name="a" value="${n}" ${answers[q.id]==n?"checked":""}><span>${n}</span></label>`).join("") +
      `</div><div class="ends"><span>${q.min}</span><span>${q.max}</span></div>`;
  } else if(q.type === "single" || q.type === "multi"){
    const t = q.type === "single" ? "radio" : "checkbox";
    const cur = [].concat(answers[q.id] || []);
    body = q.options.map(o =>
      `<label class="opt"><input type="${t}" name="a" value="${o}" ${cur.includes(o)?"checked":""}><span>${o}</span></label>`).join("");
  } else {
    body = `<textarea name="a" placeholder="Необязательно">${answers[q.id] || ""}</textarea>`;
  }
  card.innerHTML = `<fieldset class="q"><legend>${q.text}</legend>${body}</fieldset>
    <p class="error" id="err" role="alert"></p>
    <div class="nav">
      <button type="button" class="ghost" id="back" ${i===0?"hidden":""}>Назад</button>
      <button type="button" id="next">${i===questions.length-1?"Отправить":"Далее"}</button>
    </div>`;
  document.getElementById("back").onclick = () => { save(); i--; render(); };
  document.getElementById("next").onclick = next;
}

function read(){
  const q = questions[i];
  const inputs = [...card.querySelectorAll('[name="a"]')];
  if(q.type === "multi") return inputs.filter(x => x.checked).map(x => x.value);
  if(q.type === "text") return inputs[0].value.trim();
  const c = inputs.find(x => x.checked);
  return c ? c.value : null;
}
function save(){ answers[questions[i].id] = read(); }

function next(){
  const q = questions[i], v = read();
  const empty = v === null || v === "" || (Array.isArray(v) && !v.length);
  if(empty && !q.optional){
    document.getElementById("err").textContent = "Выберите вариант, чтобы продолжить.";
    return;
  }
  answers[q.id] = v;
  if(i < questions.length - 1){ i++; render(); } else finish();
}

function finish(){
  fill.style.width = "100%"; bar.setAttribute("aria-valuenow", 100);
  stepEl.textContent = "Готово";
  const label = {rating:"Оценка предмета", favorite:"Любимая часть", easy:"Что даётся легко",
    level:"Сложность заданий", future:"Продолжить изучение", comment:"Комментарий"};
  const items = questions.map(q => {
    const v = answers[q.id];
    const s = Array.isArray(v) ? v.join(", ") : v;
    return `<li>${label[q.id]}: <b>${s ? s.replace(/</g,"&lt;") : "—"}</b></li>`;
  }).join("");
  card.innerHTML = `<div class="result"><h2>Спасибо за ответы!</h2>
    <p>Вот что вы отметили:</p><ul>${items}</ul>
    <button type="button" id="again">Пройти заново</button></div>`;
  document.getElementById("again").onclick = () => {
    Object.keys(answers).forEach(k => delete answers[k]); i = 0; render();
  };
}
render();

let questions = JSON.parse(localStorage.getItem("questions")) || [];
let currentQuestionId = null;

const questionList = document.getElementById("questionList");
const rightPane = document.getElementById("rightPane");
const searchBox = document.getElementById("searchBox");
const newQuestionBtn = document.getElementById("newQuestionBtn");


function renderQuestions() {
  const search = searchBox.value.toLowerCase();
  questionList.innerHTML = "";

  let filtered = questions
    .filter(q => q.title.toLowerCase().includes(search))
    .sort((a, b) => b.votes - a.votes);

  if (filtered.length === 0) {
    questionList.innerHTML = "<li>No questions found.</li>";
  }

  filtered.forEach(q => {
    const li = document.createElement("li");
    li.onclick = () => showQuestion(q.id);
    li.innerHTML = `
      <span>${q.title}</span>
      <div class="vote-buttons" onclick="event.stopPropagation();">
        <button onclick="upvote('${q.id}')">⬆️</button>
        <span>${q.votes}</span>
        <button onclick="downvote('${q.id}')">⬇️</button>
      </div>
    `;
    questionList.appendChild(li);
  });

  localStorage.setItem("questions", JSON.stringify(questions));
}

function showQuestion(id) {
  const question = questions.find(q => q.id === id);
  currentQuestionId = id;
  rightPane.innerHTML = `
    <h2>${question.title}</h2>
    <p>${question.question}</p>
    <button onclick="resolveQuestion('${id}')">Resolve</button>

    <form id="responseForm">
      <input type="text" id="name" placeholder="Your name" required />
      <textarea id="comment" placeholder="Your comment" required></textarea>
      <button type="submit">Add Comment</button>
    </form>

    <h3>Previous Answers</h3>
    <div id="responses">
      ${question.responses.map(res => `
        <div class="response">
          <div>
            <strong>${res.name}</strong>: ${res.comment}
          </div>
          <div class="vote-buttons">
            <button onclick="voteResponse('${id}', '${res.id}', 1)">⬆️</button>
            <span>${res.votes}</span>
            <button onclick="voteResponse('${id}', '${res.id}', -1)">⬇️</button>
          </div>
        </div>
      `).join("")}
    </div>
  `;

  document.getElementById("responseForm").addEventListener("submit", e => {
    e.preventDefault();
    const name = document.getElementById("name").value;
    const comment = document.getElementById("comment").value;
    addResponse(id, name, comment);
  });
}

function showForm() {
  rightPane.innerHTML = `
    <form id="questionForm">
      <h2>Ask a Question</h2>
      <input type="text" id="title" placeholder="Title" required />
      <textarea id="question" placeholder="Question" required></textarea>
      <button type="submit">Submit</button>
    </form>
  `;

  document.getElementById("questionForm").addEventListener("submit", e => {
    e.preventDefault();
    const title = document.getElementById("title").value;
    const questionText = document.getElementById("question").value;
    addQuestion(title, questionText);
  });
}


function addQuestion(title, question) {
  const newQuestion = {
    id: Date.now().toString(),
    title,
    question,
    votes: 0,
    responses: []
  };
  questions.push(newQuestion);
  showForm();
  renderQuestions();
}

function addResponse(qid, name, comment) {
  const q = questions.find(q => q.id === qid);
  q.responses.push({
    id: Date.now().toString(),
    name,
    comment,
    votes: 0
  });
  showQuestion(qid);
  renderQuestions();
}

function resolveQuestion(id) {
  questions = questions.filter(q => q.id !== id);
  showForm();
  renderQuestions();
}

function upvote(id) {
  const q = questions.find(q => q.id === id);
  q.votes += 1;
  renderQuestions();
}

function downvote(id) {
  const q = questions.find(q => q.id === id);
  q.votes -= 1;
  renderQuestions();
}

function voteResponse(qid, rid, delta) {
  const q = questions.find(q => q.id === qid);
  const r = q.responses.find(r => r.id === rid);
  r.votes += delta;
  showQuestion(qid);
  renderQuestions();
}


searchBox.addEventListener("input", renderQuestions);
newQuestionBtn.addEventListener("click", showForm);

showForm();
renderQuestions();

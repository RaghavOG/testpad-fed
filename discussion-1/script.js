let questions = JSON.parse(localStorage.getItem("questions")) || [];
let selectedQuestionIndex = null;

function saveQuestions() {
  localStorage.setItem("questions", JSON.stringify(questions));
}

function renderQuestions() {
  const questionList = document.getElementById("questionList");
  questionList.innerHTML = "";

  questions.forEach((q, index) => {
    const div = document.createElement("div");
    div.className = "question-box";
    div.textContent = q.title;
    div.onclick = () => showDiscussion(index);
    questionList.appendChild(div);
  });
}

function addQuestion() {
  const title = document.getElementById("questionTitle").value.trim();
  const body = document.getElementById("questionBody").value.trim();

  if (!title || !body) return alert("Both fields are required!");

  questions.push({ title, body, responses: [] });
  saveQuestions();
  renderQuestions();

  document.getElementById("questionTitle").value = "";
  document.getElementById("questionBody").value = "";
}

function showDiscussion(index) {
  selectedQuestionIndex = index;
  const question = questions[index];

  document.getElementById("selectedQuestionTitle").textContent = question.title;
  document.getElementById("selectedQuestionBody").textContent = question.body;

  document.getElementById("questionForm").classList.add("hidden");
  document.getElementById("discussionArea").classList.remove("hidden");

  renderResponses();
}

function renderResponses() {
  const responseList = document.getElementById("responseList");
  responseList.innerHTML = "";

  const responses = questions[selectedQuestionIndex].responses;

  responses.forEach(r => {
    const div = document.createElement("div");
    div.innerHTML = `<strong>${r.name}</strong>: ${r.comment}`;
    responseList.appendChild(div);
  });
}

function addResponse() {
  const name = document.getElementById("responderName").value.trim();
  const comment = document.getElementById("responderComment").value.trim();

  if (!name || !comment) return alert("Both name and comment are required!");

  questions[selectedQuestionIndex].responses.push({ name, comment });
  saveQuestions();
  renderResponses();

  document.getElementById("responderName").value = "";
  document.getElementById("responderComment").value = "";
}

function resolveQuestion() {
  questions.splice(selectedQuestionIndex, 1);
  saveQuestions();
  selectedQuestionIndex = null;

  document.getElementById("questionForm").classList.remove("hidden");
  document.getElementById("discussionArea").classList.add("hidden");
  renderQuestions();
}

renderQuestions();

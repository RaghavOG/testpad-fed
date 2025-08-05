const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks() {
  taskList.innerHTML = "";
  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.className = task.completed ? "completed" : "";

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const span = document.createElement("span");
    span.className = "editable";
    span.textContent = task.name;

    // Make it editable on click
    span.addEventListener("click", () => {
      const input = document.createElement("input");
      input.type = "text";
      input.value = task.name;
      input.addEventListener("blur", () => {
        task.name = input.value.trim() || task.name;
        saveTasks();
        renderTasks();
      });
      input.addEventListener("keydown", (e) => {
        if (e.key === "Enter") input.blur();
      });
      li.replaceChild(input, span);
      input.focus();
    });

    const editBtn = document.createElement("button");
    editBtn.innerHTML = "✏️";
    editBtn.title = "Edit Task";
    editBtn.addEventListener("click", () => span.click());

    const deleteBtn = document.createElement("button");
    deleteBtn.innerHTML = "❌";
    deleteBtn.title = "Delete Task";
    deleteBtn.addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    const actions = document.createElement("div");
    actions.className = "task-actions";
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);

    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(actions);

    taskList.appendChild(li);
  });
}

taskInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    const text = taskInput.value.trim();
    if (text) {
      tasks.push({ name: text, completed: false });
      saveTasks();
      renderTasks();
      taskInput.value = "";
    }
  }
});

renderTasks();

interface Task {
  id: number;
  text: string;
  completed: boolean;
}
let tasks: Task[] = [];
let currentFilter = "all";

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks);
}

const taskForm = document.getElementById("task-form") as HTMLFormElement | null;
const taskInput = document.getElementById("task-input") as HTMLInputElement | null;
const taskList = document.getElementById("task-list") as HTMLUListElement | null;
const filtersContainer = document.getElementById("filters-container") as HTMLElement | null;

if (!taskForm || !taskInput || !taskList || !filtersContainer) {
    throw new Error("Missing required DOM elements: task-form/task-input/task-list/filters-container");
}

function saveTasks() {
  if (savedTasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
}

function renderTasks() {
  if (!taskList) return;
  taskList.innerHTML = "";

  let filteredTasks = tasks;
  if (currentFilter === "active") {
    filteredTasks = tasks.filter((task) => !task.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter((task) => task.completed);
  }

  document.querySelectorAll(".filter-btn").forEach((btn) => {
    const button = btn as HTMLElement
    if (button.dataset.filter === currentFilter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });

  filteredTasks.forEach(function (task) {
    const li = document.createElement("li") as HTMLElement;
    li.className = "task-item";
    li.dataset.id = String(task.id);

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
                <span class="task-text">${task.text}</span>
                <div class="task-actions">
                    <input type="checkbox" class="task-checkbox" ${
                      task.completed ? "checked" : ""
                    }>
                    <button class="delete-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                    </button>
                </div>
            `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", function (event) {
  event.preventDefault();
  const taskText = taskInput.value.trim();
  if (taskText !== "") {
    const newTask = { id: Date.now(), text: taskText, completed: false };
    tasks.push(newTask);
    saveTasks();
    taskInput.value = "";
    taskInput.focus();
    renderTasks();
  }
});

taskList.addEventListener("click", function (event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target instanceof HTMLInputElement && target.type === "checkbox") {
    const taskLi = target.closest(".task-item") as HTMLLIElement | null;
    if (!taskLi) return;
    const taskId = Number(taskLi.dataset.id);
    const task = tasks.find((t) => t.id === taskId);
    if (task) {
      task.completed = !task.completed;
      saveTasks();
      renderTasks();
    }
    return;
  }
  if (target.closest(".delete-button")) {
    const taskLi = target.closest(".task-item") as HTMLElement | null;
    if(!taskLi) return;
    const taskId = Number(taskLi.dataset.id);
    tasks = tasks.filter((t) => t.id !== taskId);
    saveTasks();
    renderTasks();
  }
});

filtersContainer.addEventListener("click", function (event) {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;
  if (target.classList.contains("filter-btn")) {
    currentFilter = String(target.dataset.filter);
    renderTasks();
  }
});

renderTasks();
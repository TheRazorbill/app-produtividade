interface Task {
  id: number;
  text: string;
  completed: boolean;
}

let tasks: Task[] = [];
let currentFilter: "all" | "active" | "completed" = "all";

const savedTasks = localStorage.getItem("tasks");
if (savedTasks) {
  tasks = JSON.parse(savedTasks) as Task[];
}

const taskForm = document.getElementById("task-form") as HTMLFormElement;
const taskInput = document.getElementById("task-input") as HTMLInputElement;
const taskList = document.getElementById("task-list") as HTMLUListElement;
const filtersContainer = document.getElementById("filters-container") as HTMLElement;

function saveTasks(): void {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTasks(): void {
  taskList.innerHTML = "";

  let filteredTasks: Task[] = tasks;

  if (currentFilter === "active") {
    filteredTasks = tasks.filter(t => !t.completed);
  } else if (currentFilter === "completed") {
    filteredTasks = tasks.filter(t => t.completed);
  }

  document.querySelectorAll<HTMLButtonElement>(".filter-btn").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.filter === currentFilter);
  });

  filteredTasks.forEach(task => {
    const li = document.createElement("li");
    li.className = "task-item";
    li.dataset.id = String(task.id);

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <span class="task-text">${task.text}</span>
      <div class="task-actions">
        <input type="checkbox" class="task-checkbox" ${task.completed ? "checked" : ""}>
        <button class="delete-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="3 6 5 6 21 6"></polyline>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
            <line x1="10" y1="11" x2="10" y2="17"></line>
            <line x1="14" y1="11" x2="14" y2="17"></line>
          </svg>
        </button>
      </div>
    `;

    taskList.appendChild(li);
  });
}

taskForm.addEventListener("submit", event => {
  event.preventDefault();

  const text = taskInput.value.trim();
  if (!text) return;

  tasks.push({
    id: Date.now(),
    text,
    completed: false
  });

  saveTasks();
  taskInput.value = "";
  taskInput.focus();
  renderTasks();
});

taskList.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof Element)) return;

  const taskItem = target.closest(".task-item") as HTMLLIElement | null;
  if (!taskItem) return;

  const taskId = Number(taskItem.dataset.id);

  if (
    target instanceof HTMLInputElement &&
    target.classList.contains("task-checkbox")
  ) {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    task.completed = target.checked;
    saveTasks();
    renderTasks();
    return;
  }

  const deleteButton = target.closest(".delete-button");
  if (deleteButton) {
    tasks = tasks.filter(t => t.id !== taskId);
    saveTasks();
    renderTasks();
  }
});

filtersContainer.addEventListener("click", event => {
  const target = event.target;
  if (!(target instanceof HTMLElement)) return;

  if (target.classList.contains("filter-btn")) {
    currentFilter = target.dataset.filter as "all" | "active" | "completed";
    renderTasks();
  }
});

renderTasks();
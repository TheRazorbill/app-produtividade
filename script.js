// ==========================
//      ESTADO DA APLICAÇÃO (STATE)
// ==========================

let tasks = [];

// ==========================
//      ELEMENTOS DO DOM
// ==========================

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
// ==========================
//      FUNÇÕES
// ==========================

function renderTasks() {
    taskList.innerHTML = '';

    tasks.forEach(function(task) {
        const li = document.createElement('li');
        li.className = 'task-item';
        
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add('completed');
        }

        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-button">X</button>
        `;

        taskList.appendChild(li);
    });
}

// ==========================
//      EVENTOS
// ==========================

taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value.trim();

    if (taskText !== '') {
        const newTask = {
            id: Date.now(),
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        taskInput.value = '';
        taskInput.focus();

        renderTasks(); 
    }
});

taskList.addEventListener('click', function(event) {
    const clickedElement = event.target;

    if (clickedElement.type === 'checkbox') {
        const taskLi = clickedElement.closest('.task-item');
        const taskId = Number(taskLi.dataset.id);
        const task = tasks.find(t => t.id === taskId);

        if (task) {
            task.completed = !task.completed;
            renderTasks();
        }
    }

    if (clickedElement.classList.contains('delete-button')) {
        const taskLi = clickedElement.closest('.task-item');
        const taskId = Number(taskLi.dataset.id);

        tasks = tasks.filter(t => t.id !== taskId);

        renderTasks();
    }
});
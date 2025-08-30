// ==========================
//      ESTADO DA APLICAÇÃO (STATE)
// ==========================
let tasks = [];

// ==========================
//      ELEMENTOS DO DOM
// ==========================
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list'); // NOVO: Selecionamos a lista

// ==========================
//      FUNÇÕES
// ==========================

// NOVA FUNÇÃO: Renderiza as tarefas na tela
function renderTasks() {
    // 1. Limpa a lista atual no HTML
    taskList.innerHTML = '';

    // 2. Itera sobre o array 'tasks'
    tasks.forEach(function(task) {
        // 3. Cria um novo elemento <li>
        const li = document.createElement('li');
        li.className = 'task-item';
        
        // Adiciona um atributo 'data-id' para identificar a tarefa
        li.dataset.id = task.id;

        // Adiciona a classe 'completed' se a tarefa estiver concluída
        if (task.completed) {
            li.classList.add('completed');
        }

        // 4. Define o conteúdo HTML do <li>
        // Usamos template literals (crases ``) para facilitar a concatenação
        li.innerHTML = `
            <input type="checkbox" class="task-checkbox" ${task.completed ? 'checked' : ''}>
            <span class="task-text">${task.text}</span>
            <button class="delete-button">X</button>
        `;

        // 5. Adiciona o <li> recém-criado à lista <ul> no DOM
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

        // MODIFICADO: Chamamos a função para redesenhar a lista
        renderTasks(); 
    }
});
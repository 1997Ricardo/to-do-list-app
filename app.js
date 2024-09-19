document.addEventListener('DOMContentLoaded', loadTasks);

const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');

// Añadir tarea
taskForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const taskText = taskInput.value;
    const dueDate = document.getElementById('due-date').value;
    addTask(taskText, dueDate);
    saveTaskToLocalStorage(taskText, false, dueDate);
    taskInput.value = '';
});

function addTask(taskText, dueDate, completed = false) {
    const li = document.createElement('li');
    li.textContent = taskText;
    
    if (completed) {
        li.classList.add('completed');
    }
    
    if (dueDate !== '') {
        const dueDateSpan = document.createElement('span');
        dueDateSpan.textContent = ` (Límite: ${dueDate})`;
        li.appendChild(dueDateSpan);
    }

    const checkButton = document.createElement('button');
    checkButton.textContent = 'Check';
    checkButton.className = 'check-button';
    li.appendChild(checkButton);

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Eliminar';
    li.appendChild(deleteButton);

    taskList.appendChild(li);
}

// Marcar tarea como completada
taskList.addEventListener('click', function(event) {
    if (event.target.classList.contains('check-button')) {
        const li = event.target.parentElement;
        li.classList.toggle('completed');
        updateTaskCompletionInLocalStorage(li.firstChild.textContent);
    }

    if (event.target.textContent === 'Eliminar') {
        const li = event.target.parentElement;
        taskList.removeChild(li);
        removeTaskFromLocalStorage(li.firstChild.textContent);
    }
});

// Filtrar tareas
document.getElementById('all-tasks').addEventListener('click', showAllTasks);
document.getElementById('pending-tasks').addEventListener('click', showPendingTasks);
document.getElementById('completed-tasks').addEventListener('click', showCompletedTasks);

function showAllTasks() {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => task.style.display = 'flex');
}

function showPendingTasks() {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        if (task.classList.contains('completed')) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    });
}

function showCompletedTasks() {
    const tasks = document.querySelectorAll('li');
    tasks.forEach(task => {
        if (!task.classList.contains('completed')) {
            task.style.display = 'none';
        } else {
            task.style.display = 'flex';
        }
    });
}

// Guardar tarea en LocalStorage
function saveTaskToLocalStorage(taskText, completed = false, dueDate = '') {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.push({ text: taskText, completed, dueDate });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Cargar tareas de LocalStorage
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(function(task) {
        addTask(task.text, task.dueDate, task.completed);
    });
}

// Actualizar tarea completada en LocalStorage
function updateTaskCompletionInLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.map(task => {
        if (task.text === taskText.trim()) {
            task.completed = !task.completed;
        }
        return task;
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Eliminar tarea de LocalStorage
function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks = tasks.filter(task => task.text !== taskText.trim());
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

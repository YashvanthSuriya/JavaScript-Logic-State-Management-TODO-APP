// My To-Do List App
// Built with vanilla JS - no frameworks

// Grab all the elements we need
const taskForm = document.getElementById('task-form');
const taskInput = document.getElementById('task-input');
const taskList = document.getElementById('task-list');
const emptyMsg = document.getElementById('empty-msg');
const counter = document.getElementById('counter');
const clearBtn = document.getElementById('clear-btn');
const filterBtns = document.querySelectorAll('.filter-btn');

// Modal elements
const modal = document.getElementById('modal');
const editInput = document.getElementById('edit-input');
const saveEditBtn = document.getElementById('save-edit');
const cancelEditBtn = document.getElementById('cancel-edit');

// State
let todos = [];
let currentFilter = 'all';
let editingId = null;

const STORAGE_KEY = 'my-todos';

// ---- Storage functions ----

function loadTodos() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
        try {
            todos = JSON.parse(saved);
        } catch(e) {
            console.log('could not parse saved todos', e);
            todos = [];
        }
    }
}

function saveTodos() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// Helper to escape HTML so user input doesnt break things
// (got this from MDN)
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Generate a random id
function makeId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---- CRUD operations ----

// Create
function addTodo(title) {
    const todo = {
        id: makeId(),
        title: title,
        completed: false,
        createdAt: Date.now()
    };
    todos.push(todo);
    saveTodos();
    render();
}

// Update - toggle completed
function toggleTodo(id) {
    const todo = todos.find(t => t.id === id);
    if (todo) {
        todo.completed = !todo.completed;
        saveTodos();
        render();
    }
}

// Update - edit title
function updateTodo(id, newTitle) {
    const todo = todos.find(t => t.id === id);
    if (todo && newTitle.trim()) {
        todo.title = newTitle.trim();
        saveTodos();
        render();
    }
}

// Delete
function deleteTodo(id) {
    todos = todos.filter(t => t.id !== id);
    saveTodos();
    render();
}

// Delete all completed
function clearCompleted() {
    todos = todos.filter(t => !t.completed);
    saveTodos();
    render();
}

// ---- Filtering ----

function getFilteredTodos() {
    if (currentFilter === 'active') {
        return todos.filter(t => !t.completed);
    } else if (currentFilter === 'completed') {
        return todos.filter(t => t.completed);
    }
    return todos;
}

// ---- Rendering ----

function render() {
    const filtered = getFilteredTodos();

    // Clear the list first
    taskList.innerHTML = '';

    // Build each task item
    filtered.forEach(function(todo) {
        const li = document.createElement('li');
        li.className = 'task-item';
        if (todo.completed) {
            li.classList.add('completed');
        }
        li.dataset.id = todo.id;

        // checkbox
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = todo.completed;
        checkbox.dataset.action = 'toggle';

        // task text
        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = todo.title;

        // action buttons
        const actions = document.createElement('div');
        actions.className = 'task-actions';

        const editBtn = document.createElement('button');
        editBtn.textContent = 'Edit';
        editBtn.dataset.action = 'edit';

        const delBtn = document.createElement('button');
        delBtn.textContent = 'Delete';
        delBtn.className = 'delete-btn';
        delBtn.dataset.action = 'delete';

        actions.appendChild(editBtn);
        actions.appendChild(delBtn);

        li.appendChild(checkbox);
        li.appendChild(span);
        li.appendChild(actions);

        taskList.appendChild(li);
    });

    // Show/hide empty message
    if (filtered.length === 0) {
        emptyMsg.style.display = 'block';
        taskList.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        taskList.style.display = 'block';
    }

    // Update counter
    const remaining = todos.filter(t => !t.completed).length;
    counter.textContent = remaining + ' of ' + todos.length + ' left';

    // Enable/disable clear button
    const hasCompleted = todos.some(t => t.completed);
    clearBtn.disabled = !hasCompleted;
}

// ---- Event listeners ----

// Submit form to add new task
taskForm.addEventListener('submit', function(e) {
    e.preventDefault();
    const title = taskInput.value.trim();
    if (title) {
        addTodo(title);
        taskInput.value = '';
    }
});

// Event delegation - one listener handles all task clicks
// (instead of attaching to each button individually)
taskList.addEventListener('click', function(e) {
    const actionEl = e.target.closest('[data-action]');
    if (!actionEl) return;

    const li = e.target.closest('.task-item');
    if (!li) return;

    const id = li.dataset.id;
    const action = actionEl.dataset.action;

    if (action === 'toggle') {
        toggleTodo(id);
    } else if (action === 'edit') {
        openModal(id);
    } else if (action === 'delete') {
        deleteTodo(id);
    }
});

// Note: checkbox change also fires click so toggle works fine above
// (had to test this to make sure)

// Filter buttons - also delegated
const filtersContainer = document.querySelector('.filters');
filtersContainer.addEventListener('click', function(e) {
    if (!e.target.classList.contains('filter-btn')) return;

    currentFilter = e.target.dataset.filter;

    // update active class
    filterBtns.forEach(btn => btn.classList.remove('active'));
    e.target.classList.add('active');

    render();
});

// Clear completed button
clearBtn.addEventListener('click', clearCompleted);

// ---- Modal functions ----

function openModal(id) {
    const todo = todos.find(t => t.id === id);
    if (!todo) return;

    editingId = id;
    editInput.value = todo.title;
    modal.style.display = 'flex';
    editInput.focus();
    editInput.select();
}

function closeModal() {
    modal.style.display = 'none';
    editingId = null;
    editInput.value = '';
}

saveEditBtn.addEventListener('click', function() {
    if (editingId) {
        updateTodo(editingId, editInput.value);
        closeModal();
    }
});

cancelEditBtn.addEventListener('click', closeModal);

// Close modal if user clicks outside the box
modal.addEventListener('click', function(e) {
    if (e.target === modal) {
        closeModal();
    }
});

// Keyboard shortcuts in modal
editInput.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        saveEditBtn.click();
    } else if (e.key === 'Escape') {
        closeModal();
    }
});

// ---- Initialize ----

loadTodos();
render();

// TODO: maybe add due dates later

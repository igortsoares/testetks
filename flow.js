/* ================================================================ */
/* Arquivo: /js/modules/flow.js                                     */
/* Descrição: Módulo Flow com timer e lógica de tarefas.            */
/* Versão: 2.4 (Ordenação e Filtros)                                */
/* ================================================================ */

// --- Variáveis de Cache do DOM ---
let startBtn, resetBtn, pauseBtn, timerDisplay, timerConfigModal, timerMinutesInput;
let addTaskFloatBtn, addTaskListBtn, toggleTasksBtn, clearCompletedBtn;
let addTaskModal, addTaskForm, taskIdInput;
let filterPriority, filterStatus, filterBtn;

// --- Variáveis Globais do Módulo ---
let tasks = [];
let pomodoroTimer = null;
let pomodoroIsRunning = false;
let pomodoroCurrentTime = 25 * 60;
let pomodoroConfiguredTime = 25 * 60;
let todayCycles = 0;
let totalFocusTime = 0;
let timerSound = null;
let flowInitialized = false;

let sortState = { column: 'date', direction: 'asc' };
// [NOVO] Estado dos filtros
let filterState = { priority: '', status: '' };

/**
 * Função principal de inicialização do módulo Flow.
 */
export function initFlow() {
    if (document.body.id !== 'flow-page' || flowInitialized) return;
    console.log('🚀 Inicializando Módulo Flow...');

    cacheDOMElements();
    setupEventListeners();
    initTimerSound();
    initTableSorting();
    initTableFiltering(); // [NOVO]
    loadFlowData();
    updateAllDisplays();

    flowInitialized = true;
    console.log('✅ Módulo Flow inicializado com sucesso!');
}

function cacheDOMElements() {
    startBtn = document.getElementById('start-timer-btn');
    resetBtn = document.getElementById('reset-timer-btn');
    pauseBtn = document.getElementById('pause-timer-btn');
    timerDisplay = document.getElementById('timer-display');
    addTaskFloatBtn = document.getElementById('add-task-btn');
    addTaskListBtn = document.getElementById('add-task-list-btn');
    toggleTasksBtn = document.getElementById('toggle-tasks-btn');
    clearCompletedBtn = document.getElementById('clear-completed-btn');
    timerConfigModal = document.getElementById('timer-config-modal');
    timerMinutesInput = document.getElementById('timer-minutes');
    addTaskModal = document.getElementById('add-task-modal');
    addTaskForm = document.getElementById('add-task-form');
    filterPriority = document.getElementById('filter-priority');
    filterStatus = document.getElementById('filter-status');
    filterBtn = document.getElementById('filter-btn');
    
    const existingIdInput = document.getElementById('task-id');
    if (!existingIdInput && addTaskForm) {
        const hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = 'task-id';
        hiddenInput.name = 'taskId';
        addTaskForm.appendChild(hiddenInput);
    }
    taskIdInput = document.getElementById('task-id');
}

function setupEventListeners() {
    if (startBtn) startBtn.addEventListener('click', startPomodoro);
    if (resetBtn) resetBtn.addEventListener('click', resetPomodoro);
    if (pauseBtn) pauseBtn.addEventListener('click', pausePomodoro);
    if (timerDisplay) timerDisplay.addEventListener('click', openTimerConfig);
    if (addTaskFloatBtn) addTaskFloatBtn.addEventListener('click', () => openAddTaskModal());
    if (addTaskListBtn) addTaskListBtn.addEventListener('click', () => openAddTaskModal());
    if (toggleTasksBtn) toggleTasksBtn.addEventListener('click', toggleTasksList);
    if (clearCompletedBtn) clearCompletedBtn.addEventListener('click', clearCompletedTasks);
    
    document.querySelectorAll('.modal-close, .modal .btn-secondary').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = e.target.closest('.modal');
            if (modal) modal.classList.remove('show');
        });
    });

    const confirmTimerBtn = document.querySelector('#timer-config-modal .btn-primary');
    if (confirmTimerBtn) confirmTimerBtn.addEventListener('click', confirmTimerConfig);

    if (addTaskForm) addTaskForm.addEventListener('submit', handleTaskSubmit);

    document.querySelectorAll('.modal').forEach(modal => {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.classList.remove('show');
        });
    });
}

// ============================================================
// LÓGICA DO TIMER POMODORO
// ============================================================
function initTimerSound() {
    if (typeof Howl === 'undefined') return;
    timerSound = new Howl({
        src: ['assets/sounds/timer-end.mp3'],
        volume: 0.7,
    });
}

function startPomodoro() {
    if (pomodoroIsRunning) return;
    pomodoroIsRunning = true;
    if (startBtn) startBtn.style.display = 'none';
    if (pauseBtn) pauseBtn.style.display = 'flex';
    pomodoroTimer = setInterval(() => {
        pomodoroCurrentTime--;
        updatePomodoroDisplay();
        if (pomodoroCurrentTime <= 0) completePomodoro();
    }, 1000);
}

function pausePomodoro() {
    if (!pomodoroIsRunning) return;
    pomodoroIsRunning = false;
    clearInterval(pomodoroTimer);
    if (startBtn) startBtn.style.display = 'flex';
    if (pauseBtn) pauseBtn.style.display = 'none';
}

function resetPomodoro() {
    pomodoroIsRunning = false;
    clearInterval(pomodoroTimer);
    pomodoroCurrentTime = pomodoroConfiguredTime;
    if (startBtn) startBtn.style.display = 'flex';
    if (pauseBtn) pauseBtn.style.display = 'none';
    updatePomodoroDisplay();
}

function completePomodoro() {
    pomodoroIsRunning = false;
    clearInterval(pomodoroTimer);
    todayCycles++;
    totalFocusTime += pomodoroConfiguredTime;
    if (timerSound) timerSound.play();
    showBrowserNotification();
    resetPomodoro();
    updatePomodoroStats();
    saveFlowData();
}

function openTimerConfig() {
    if (pomodoroIsRunning) return;
    if (timerConfigModal && timerMinutesInput) {
        timerMinutesInput.value = pomodoroConfiguredTime / 60;
        timerConfigModal.classList.add('show');
    }
}

function confirmTimerConfig() {
    if (!timerMinutesInput) return;
    const minutes = parseInt(timerMinutesInput.value);
    if (minutes >= 1 && minutes <= 25) {
        pomodoroConfiguredTime = minutes * 60;
        resetPomodoro();
        saveFlowData();
    } else {
        alert('Por favor, insira um valor entre 1 e 25 minutos.');
    }
    if (timerConfigModal) timerConfigModal.classList.remove('show');
}

// ============================================================
// LÓGICA DE TAREFAS (CRUD, ORDENAÇÃO, FILTRO)
// ============================================================

/**
 * [NOVO] Inicializa a ordenação da tabela
 */
function initTableSorting() {
    const headers = document.querySelectorAll('.tasks-table th.sortable');
    headers.forEach(header => {
        header.addEventListener('click', () => {
            const column = header.dataset.column;
            if (sortState.column === column) {
                sortState.direction = sortState.direction === 'asc' ? 'desc' : 'asc';
            } else {
                sortState.column = column;
                sortState.direction = 'asc';
            }
            updateAllDisplays();
        });
    });
}

/**
 * [NOVO] Inicializa a filtragem da tabela
 */
function initTableFiltering() {
    if (filterBtn) {
        filterBtn.addEventListener('click', () => {
            filterState.priority = filterPriority.value;
            filterState.status = filterStatus.value;
            updateAllDisplays();
        });
    }
}

/**
 * [NOVO] Retorna uma lista de tarefas filtrada
 */
function getFilteredTasks() {
    let filtered = [...tasks];
    if (filterState.priority) {
        filtered = filtered.filter(task => task.priority === filterState.priority);
    }
    if (filterState.status) {
        const isCompleted = filterState.status === 'completed';
        filtered = filtered.filter(task => task.completed === isCompleted);
    }
    return filtered;
}

/**
 * [NOVO] Ordena um array de tarefas
 */
function sortTasks(tasksToSort) {
    const { column, direction } = sortState;
    const modifier = direction === 'asc' ? 1 : -1;

    const priorityOrder = {
        'urgent-important': 1,
        'not-urgent-important': 2,
        'urgent-not-important': 3,
        'not-urgent-not-important': 4
    };

    tasksToSort.sort((a, b) => {
        let valA, valB;
        if (column === 'priority') {
            valA = priorityOrder[a.priority] || 5;
            valB = priorityOrder[b.priority] || 5;
        } else if (column === 'status') {
            valA = a.completed;
            valB = b.completed;
        } else {
            valA = a[column] || '';
            valB = b[column] || '';
        }

        if (valA < valB) return -1 * modifier;
        if (valA > valB) return 1 * modifier;
        return 0;
    });
    return tasksToSort;
}


function openAddTaskModal(taskId = null) {
    if (!addTaskModal || !addTaskForm) return;
    addTaskForm.reset();
    if (taskIdInput) taskIdInput.value = '';
    const modalTitle = addTaskModal.querySelector('.modal-title');
    if (taskId && typeof taskId === 'number') {
        const task = tasks.find(t => t.id === taskId);
        if (task && modalTitle) {
            modalTitle.textContent = "Editar Tarefa";
            if (taskIdInput) taskIdInput.value = task.id;
            document.getElementById('task-title').value = task.title;
            document.getElementById('task-priority').value = task.priority;
            document.getElementById('task-time').value = task.time || '';
            document.getElementById('task-kr').value = task.kr || '';
            document.getElementById('task-date').value = task.date;
        }
    } else {
        if (modalTitle) modalTitle.textContent = "Adicionar Nova Tarefa";
    }
    addTaskModal.classList.add('show');
}

function handleTaskSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const id = parseInt(formData.get('taskId'));
    const title = formData.get('taskTitle').trim();
    const priority = formData.get('taskPriority');
    const date = formData.get('taskDate');

    if (!title || !priority || !date) {
        alert('Título, Prioridade e Data são obrigatórios.');
        return;
    }

    const taskData = {
        title: title,
        priority: priority,
        time: formData.get('taskTime'),
        kr: formData.get('taskKr'),
        date: date,
    };

    if (id) {
        const taskIndex = tasks.findIndex(t => t.id === id);
        if (taskIndex > -1) {
            tasks[taskIndex] = { ...tasks[taskIndex], ...taskData };
        }
    } else {
        tasks.push({
            id: Date.now(),
            completed: false,
            createdAt: new Date().toISOString(),
            ...taskData
        });
    }
    
    updateAllDisplays();
    saveFlowData();
    if (addTaskModal) addTaskModal.classList.remove('show');
}

function toggleTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        task.completed = !task.completed;
        updateAllDisplays();
        saveFlowData();
    }
}

function deleteTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task && confirm(`Tem certeza que deseja excluir a tarefa "${task.title}"?`)) {
        tasks = tasks.filter(t => t.id !== taskId);
        updateAllDisplays();
        saveFlowData();
    }
}

function clearCompletedTasks() {
    const completedCount = tasks.filter(t => t.completed).length;
    if (completedCount > 0 && confirm(`Tem certeza que deseja remover ${completedCount} tarefa(s) concluída(s)?`)) {
        tasks = tasks.filter(t => !t.completed);
        updateAllDisplays();
        saveFlowData();
    } else if (completedCount === 0) {
        alert('Não há tarefas concluídas para limpar.');
    }
}

function toggleTasksList() {
    const container = document.getElementById('tasks-table-container');
    if (!container || !toggleTasksBtn) return;
    const isVisible = container.style.display === 'block';
    container.style.display = isVisible ? 'none' : 'block';
    const btnText = toggleTasksBtn.querySelector('span');
    const btnIcon = toggleTasksBtn.querySelector('i');
    if (btnText && btnIcon) {
        btnText.textContent = `${isVisible ? 'Exibir' : 'Ocultar'} Tarefas (${tasks.length})`;
        btnIcon.className = `bx ${isVisible ? 'bx-chevron-down' : 'bx-chevron-up'}`;
    }
}

// ============================================================
// ATUALIZAÇÃO DE DISPLAYS
// ============================================================
function updateAllDisplays() {
    updatePomodoroDisplay();
    updatePomodoroStats();
    updateMissionStats();
    updateDetailedProgress();
    updateMatrix();

    // [MODIFICADO] Pega as tarefas filtradas, ordena, e depois renderiza a lista.
    const filteredTasks = getFilteredTasks();
    const sortedTasks = sortTasks(filteredTasks);
    updateTasksList(sortedTasks);
}

function updatePomodoroDisplay() {
    if (!timerDisplay) return;
    const minutes = Math.floor(pomodoroCurrentTime / 60);
    const seconds = pomodoroCurrentTime % 60;
    timerDisplay.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

function updatePomodoroStats() {
    const cyclesEl = document.getElementById('cycles-today');
    const totalTimeEl = document.getElementById('total-focus-time');
    if (cyclesEl) cyclesEl.textContent = todayCycles;
    if (totalTimeEl) {
        const hours = Math.floor(totalFocusTime / 3600);
        const minutes = Math.floor((totalFocusTime % 3600) / 60);
        totalTimeEl.textContent = `${hours}h ${minutes}m`;
    }
}

function updateMissionStats() {
    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];
    
    const completed = tasks.filter(t => t.completed).length;
    const todayTasks = tasks.filter(t => t.date === today);
    const tomorrowTasks = tasks.filter(t => t.date === tomorrow);
    
    const updateElement = (id, text) => {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    };
    
    updateElement('missions-completed-count', `${completed}/${tasks.length}`);
    updateElement('missions-today-count', `${todayTasks.filter(t => t.completed).length}/${todayTasks.length}`);
    updateElement('missions-tomorrow-count', `${tomorrowTasks.filter(t => t.completed).length}/${tomorrowTasks.length}`);
    
    const overallProgress = tasks.length > 0 ? Math.round((completed / tasks.length) * 100) : 0;
    updateElement('overall-progress', `${overallProgress}%`);

    const progressCircle = document.getElementById('progress-circle-container');
    if (progressCircle) {
        progressCircle.classList.toggle('completed', overallProgress === 100 && tasks.length > 0);
    }
}

function updateDetailedProgress() {
    const container = document.getElementById('detailed-progress-content');
    if (!container) return;

    const today = new Date().toISOString().split('T')[0];
    const tomorrowDate = new Date();
    tomorrowDate.setDate(tomorrowDate.getDate() + 1);
    const tomorrow = tomorrowDate.toISOString().split('T')[0];

    const allCompleted = tasks.filter(t => t.completed);
    const todayTasks = tasks.filter(t => t.date === today);
    const tomorrowTasks = tasks.filter(t => t.date === tomorrow);
    
    const completedProgress = tasks.length > 0 ? Math.round((allCompleted.length / tasks.length) * 100) : 0;
    const todayProgress = todayTasks.length > 0 ? Math.round((todayTasks.filter(t => t.completed).length / todayTasks.length) * 100) : 0;
    const tomorrowProgress = tomorrowTasks.length > 0 ? Math.round((tomorrowTasks.filter(t => t.completed).length / tomorrowTasks.length) * 100) : 0;

    container.innerHTML = `
        <div class="progress-bars-container">
            <div class="progress-item">
                <div class="progress-header">
                    <span class="progress-label">Missões Concluídas</span>
                    <span class="progress-percentage">${completedProgress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-fill progress-fill-completed" style="width: ${completedProgress}%;"></div>
                </div>
                <div class="progress-count">${allCompleted.length} de ${tasks.length}</div>
            </div>
            <div class="progress-item">
                <div class="progress-header">
                    <span class="progress-label">Missões Para Hoje</span>
                    <span class="progress-percentage">${todayProgress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-fill progress-fill-today" style="width: ${todayProgress}%;"></div>
                </div>
                <div class="progress-count">${todayTasks.filter(t => t.completed).length} de ${todayTasks.length}</div>
            </div>
            <div class="progress-item">
                <div class="progress-header">
                    <span class="progress-label">Missões Para Amanhã</span>
                    <span class="progress-percentage">${tomorrowProgress}%</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-fill progress-fill-tomorrow" style="width: ${tomorrowProgress}%;"></div>
                </div>
                <div class="progress-count">${tomorrowTasks.filter(t => t.completed).length} de ${tomorrowTasks.length}</div>
            </div>
        </div>
        <div class="progress-legend">
            <ul>
                <li><span class="legend-color-box" style="background-color: var(--success-color);"></span> Concluídas</li>
                <li><span class="legend-color-box" style="background-color: var(--warning-color);"></span> Para Hoje</li>
                <li><span class="legend-color-box" style="background-color: var(--info-color);"></span> Para Amanhã</li>
            </ul>
        </div>
    `;
}

function updateMatrix() {
    const quadrants = {
        'urgent-important': document.getElementById('urgent-important-tasks'),
        'not-urgent-important': document.getElementById('not-urgent-important-tasks'),
        'urgent-not-important': document.getElementById('urgent-not-important-tasks'),
        'not-urgent-not-important': document.getElementById('not-urgent-not-important-tasks')
    };
    Object.values(quadrants).forEach(q => { if (q) q.innerHTML = ''; });
    tasks.forEach(task => {
        if (quadrants[task.priority]) {
            quadrants[task.priority].appendChild(createTaskMatrixElement(task));
        }
    });
}

function createTaskMatrixElement(task) {
    const div = document.createElement('div');
    div.className = 'task-item';
    div.innerHTML = `
        <div class="task-checkbox ${task.completed ? 'checked' : ''}"></div>
        <div class="task-text ${task.completed ? 'completed' : ''}">${task.title}</div>
        <div class="task-actions">
            <button class="task-action-btn edit-btn" title="Editar"><i class="bx bx-edit"></i></button>
            <button class="task-action-btn delete-btn" title="Excluir"><i class="bx bx-trash"></i></button>
        </div>
    `;
    div.querySelector('.task-checkbox').addEventListener('click', () => toggleTask(task.id));
    div.querySelector('.edit-btn').addEventListener('click', () => openAddTaskModal(task.id));
    div.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
    return div;
}

function updateTasksList(tasksToRender) {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;
    tbody.innerHTML = '';
    tasksToRender.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td><span class="priority-badge priority-${task.priority}">${getPriorityLabel(task.priority)}</span></td>
            <td>${task.time || '-'}</td>
            <td>${task.kr || '-'}</td>
            <td>${formatDate(task.date)}</td>
            <td><span class="status-badge status-${task.completed ? 'completed' : 'pending'}">${task.completed ? 'Concluída' : 'Pendente'}</span></td>
            <td>
                <div class="table-actions">
                    <button class="task-action-btn edit-btn" title="Editar"><i class="bx bx-edit"></i></button>
                    <button class="task-action-btn delete-btn" title="Excluir"><i class="bx bx-trash"></i></button>
                </div>
            </td>
        `;
        row.querySelector('.edit-btn').addEventListener('click', () => openAddTaskModal(task.id));
        row.querySelector('.delete-btn').addEventListener('click', () => deleteTask(task.id));
        tbody.appendChild(row);
    });
}

// ============================================================
// FUNÇÕES AUXILIARES E NOTIFICAÇÕES
// ============================================================
function getPriorityLabel(priority) {
    const labels = {
        'urgent-important': 'Urgente/Importante',
        'not-urgent-important': 'Não Urgente/Importante',
        'urgent-not-important': 'Urgente/Não Importante',
        'not-urgent-not-important': 'Não Urgente/Não Importante'
    };
    return labels[priority] || 'N/A';
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('pt-BR');
}

function showBrowserNotification() {
    if (!('Notification' in window)) return;
    if (Notification.permission === 'granted') {
        new Notification('🎯 Pomodoro Concluído!', {
            body: `Hora de uma pausa! Você completou um ciclo de foco.`,
            icon: 'assets/images/logo.png'
        });
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(p => { if (p === 'granted') showBrowserNotification(); });
    }
}

// ============================================================
// PERSISTÊNCIA DE DADOS
// ============================================================
function saveFlowData() {
    try {
        const data = { tasks, todayCycles, totalFocusTime, pomodoroConfiguredTime };
        localStorage.setItem('flowData', JSON.stringify(data));
    } catch (error) {
        console.error("Erro ao salvar dados no localStorage:", error);
    }
}

function loadFlowData() {
    try {
        const dataString = localStorage.getItem('flowData');
        if (dataString) {
            const data = JSON.parse(dataString);
            tasks = data.tasks || [];
            todayCycles = data.todayCycles || 0;
            totalFocusTime = data.totalFocusTime || 0;
            pomodoroConfiguredTime = data.pomodoroConfiguredTime || 25 * 60;
            pomodoroCurrentTime = pomodoroConfiguredTime;
        }
    } catch (error) {
        console.error("Erro ao carregar dados do localStorage:", error);
    }
}

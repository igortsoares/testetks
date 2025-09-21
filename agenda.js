/* ================================================================ */
/* Arquivo: /js/modules/agenda.js                                   */
/* Descrição: Módulo para a página "Minha Agenda".                  */
/* Versão: 1.4                                                      */
/* Atualizado em: 19/09/2025 às 18:55                               */
/* ================================================================ */

let currentMonth;
let currentYear;
let selectedDate;
let weekOffset = 0; // 0 para semana atual, -1 para anterior, 1 para próxima, etc.

// --- DADOS ---
let mockEvents = [];

/**
 * Inicializa o módulo da Agenda.
 */
export function initAgenda() {
    if (document.body.id !== 'agenda-page') return;
    console.log('🚀 Inicializando Módulo Agenda...');

    const today = new Date();
    selectedDate = today;
    currentMonth = today.getMonth();
    currentYear = today.getFullYear();

    setupEventListeners();
    renderAllSections();

    console.log('✅ Módulo Agenda inicializado com sucesso!');
}

function setupEventListeners() {
    // Navegação do Calendário
    document.getElementById('prev-month')?.addEventListener('click', () => changeMonth(-1));
    document.getElementById('next-month')?.addEventListener('click', () => changeMonth(1));
    
    // [CORREÇÃO] Navegação da Semana agora funciona
    document.getElementById('prev-week')?.addEventListener('click', () => changeWeek(-1));
    document.getElementById('next-week')?.addEventListener('click', () => changeWeek(1));

    // Botões para abrir o modal
    document.getElementById('add-event-header-btn')?.addEventListener('click', openAddEventModal);
    document.getElementById('add-event-float-btn')?.addEventListener('click', openAddEventModal);
    
    // Formulário do modal
    document.getElementById('add-event-form')?.addEventListener('submit', handleEventSubmit);

    // [CORREÇÃO] Fechamento do modal
    const modal = document.getElementById('add-event-modal');
    if (modal) {
        modal.querySelector('.modal-close')?.addEventListener('click', () => modal.classList.remove('show'));
        modal.querySelector('.btn-secondary')?.addEventListener('click', () => modal.classList.remove('show'));
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.classList.remove('show');
            }
        });
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    } else if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar();
}

function changeWeek(direction) {
    weekOffset += direction;
    updateWeekSchedule();
}

function renderAllSections() {
    renderCalendar();
    updateDaySchedule(selectedDate);
    updateTodayTasks(selectedDate);
    updateWeekSchedule();
}

/**
 * Renderiza o calendário principal do mês.
 */
function renderCalendar() {
    const calendarDaysContainer = document.getElementById('calendar-days');
    const monthYearDisplay = document.getElementById('calendar-month-year');
    if (!calendarDaysContainer || !monthYearDisplay) return;

    calendarDaysContainer.innerHTML = '';
    const monthNames = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];
    monthYearDisplay.textContent = `${monthNames[currentMonth]} ${currentYear}`;

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const dayOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

    const daysInPrevMonth = new Date(currentYear, currentMonth, 0).getDate();
    for (let i = dayOffset; i > 0; i--) {
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day', 'other-month');
        dayElement.textContent = daysInPrevMonth - i + 1;
        calendarDaysContainer.appendChild(dayElement);
    }
    
    for (let i = 1; i <= daysInMonth; i++) {
        const dayDate = new Date(currentYear, currentMonth, i);
        const dayElement = document.createElement('div');
        dayElement.classList.add('calendar-day');
        dayElement.textContent = i;
        const dateISO = dayDate.toISOString().split('T')[0];
        dayElement.dataset.date = dateISO;

        if (dayDate.toDateString() === selectedDate.toDateString()) {
            dayElement.classList.add('selected');
        }
        
        const eventsOnDay = mockEvents.filter(e => e.date === dateISO);
        if (eventsOnDay.length > 0) {
            const dotsContainer = document.createElement('div');
            dotsContainer.className = 'event-dots-container';
            const uniqueStatuses = [...new Set(eventsOnDay.map(e => e.status))];
            const statusOrder = ['Cancelado', 'Aguardando', 'Confirmado'];
            uniqueStatuses.sort((a, b) => statusOrder.indexOf(a) - statusOrder.indexOf(b));

            uniqueStatuses.forEach(status => {
                const dot = document.createElement('div');
                dot.className = `event-dot status-${status}`;
                dotsContainer.appendChild(dot);
            });
            dayElement.appendChild(dotsContainer);
        }

        dayElement.addEventListener('click', () => {
            selectedDate = new Date(dayElement.dataset.date + 'T00:00:00');
            renderAllSections();
        });
        calendarDaysContainer.appendChild(dayElement);
    }
}

/**
 * Atualiza a seção "Calendário do Dia"
 */
function updateDaySchedule(date) {
    const titleEl = document.getElementById('day-schedule-title');
    const dateStringEl = document.getElementById('day-schedule-date-string');
    const eventListEl = document.getElementById('day-event-list');
    if (!titleEl || !dateStringEl || !eventListEl) return;

    const today = new Date(); today.setHours(0,0,0,0);
    const tomorrow = new Date(); tomorrow.setDate(today.getDate() + 1); tomorrow.setHours(0,0,0,0);
    const comparableDate = new Date(date).setHours(0,0,0,0);

    if (comparableDate === today.getTime()) {
        titleEl.textContent = 'HOJE';
    } else if (comparableDate === tomorrow.getTime()) {
        titleEl.textContent = 'AMANHÃ';
    } else {
        const day = date.getDate();
        const month = date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
        titleEl.textContent = `${day} ${month}`;
    }
    dateStringEl.textContent = date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    const dateISO = date.toISOString().split('T')[0];
    const eventsForDay = mockEvents.filter(e => e.date === dateISO).sort((a,b) => a.startTime.localeCompare(b.startTime));

    eventListEl.innerHTML = '';
    if (eventsForDay.length > 0) {
        eventsForDay.forEach(event => {
            const typeMap = { 'Presencial': 'green', 'Online': 'blue' };
            const item = document.createElement('div');
            item.className = 'event-item';
            item.innerHTML = `
                <div class="event-time">${event.startTime.substring(0,5).replace(':','h')}<span>${event.endTime.substring(0,5).replace(':','h')}</span></div>
                <div class="event-details event-details-aligned">
                    <p>${event.title}</p>
                    <span class="tag tag-${typeMap[event.type]}">${event.type}</span>
                </div>
                <button class="icon-btn" title="Ver detalhes"><i class='bx bx-right-arrow-alt'></i></button>
            `;
            eventListEl.appendChild(item);
        });
    } else {
        eventListEl.innerHTML = '<div class="empty-list">Nenhum compromisso para este dia.</div>';
    }
}

/**
 * [MELHORIA] Atualiza "Tarefas de Hoje" e adiciona interatividade.
 */
function updateTodayTasks(date) {
    const tasksListEl = document.getElementById('today-tasks-list');
    if (!tasksListEl) return;

    const dateISO = date.toISOString().split('T')[0];
    let flowTasks = [];
    try {
        const flowDataString = localStorage.getItem('flowData');
        if (flowDataString) {
            flowTasks = JSON.parse(flowDataString).tasks || [];
        }
    } catch (error) { console.error("Erro ao ler tarefas do Flow:", error); }
    
    const tasksForDay = flowTasks.filter(task => task.date === dateISO);

    tasksListEl.innerHTML = '';
    if (tasksForDay.length > 0) {
        tasksForDay.forEach(task => {
            const item = document.createElement('div');
            item.className = `task-item-agenda ${task.completed ? 'completed' : ''}`;
            item.innerHTML = `
                <div class="task-checkbox" data-task-id="${task.id}"></div>
                <span class="task-title-agenda">${task.title}</span>
                <span class="priority-badge priority-${task.priority}">${getPriorityLabel(task.priority)}</span>
            `;
            item.querySelector('.task-checkbox').addEventListener('click', toggleFlowTask);
            tasksListEl.appendChild(item);
        });
    } else {
        tasksListEl.innerHTML = '<div class="empty-list">Nenhuma tarefa para este dia.</div>';
    }
}

/**
 * [NOVO] Alterna o status de uma tarefa do Flow e salva no localStorage.
 */
function toggleFlowTask(event) {
    const taskId = parseInt(event.target.dataset.taskId);
    if (!taskId) return;

    try {
        const flowDataString = localStorage.getItem('flowData');
        if (flowDataString) {
            let flowData = JSON.parse(flowDataString);
            let taskFound = false;
            
            flowData.tasks = flowData.tasks.map(task => {
                if (task.id === taskId) {
                    task.completed = !task.completed;
                    taskFound = true;
                }
                return task;
            });
            
            if (taskFound) {
                localStorage.setItem('flowData', JSON.stringify(flowData));
                updateTodayTasks(selectedDate);
            }
        }
    } catch (error) {
        console.error("Erro ao atualizar tarefa do Flow:", error);
    }
}


/**
 * Atualiza a seção "Agenda da Semana"
 */
function updateWeekSchedule() {
    const container = document.getElementById('week-schedule-content');
    if (!container) return;
    container.innerHTML = '';

    const today = new Date();
    today.setDate(today.getDate() + (weekOffset * 7));
    const dayOfWeek = today.getDay(); 
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    let eventsFound = false;
    for (let i = 0; i < 7; i++) {
        const currentDay = new Date(startOfWeek);
        currentDay.setDate(startOfWeek.getDate() + i);
        const dateISO = currentDay.toISOString().split('T')[0];
        const eventsForDay = mockEvents.filter(event => event.date === dateISO).sort((a,b) => a.startTime.localeCompare(b.startTime));

        if (eventsForDay.length > 0) {
            eventsFound = true;
            const dayGroup = document.createElement('div');
            dayGroup.className = 'week-day-group';
            dayGroup.innerHTML = `
                <h5>${currentDay.getDate()} ${currentDay.toLocaleDateString('pt-BR', { month: 'short' }).toUpperCase().replace('.', '')}</h5>
                <p>${currentDay.toLocaleDateString('pt-BR', { weekday: 'long' })}</p>
            `;
            
            eventsForDay.forEach(event => {
                const item = document.createElement('div');
                item.className = 'event-item-week';
                item.innerHTML = `
                    <div class="event-status-bar status-${event.status}"></div>
                    <div class="event-time-week">${event.startTime.substring(0,5).replace(':','h')}<span>${event.endTime.substring(0,5).replace(':','h')}</span></div>
                    <div class="event-details-week">
                        <p>${event.title}</p>
                        <span class="tag tag-${event.type === 'Presencial' ? 'green' : 'blue'}">${event.type}</span>
                    </div>
                    <button class="icon-btn" title="Ver detalhes"><i class='bx bx-right-arrow-alt'></i></button>
                `;
                dayGroup.appendChild(item);
            });
            container.appendChild(dayGroup);
        }
    }
    
    if (!eventsFound) {
        container.innerHTML = '<div class="empty-list">Nenhum compromisso agendado para esta semana.</div>';
    }
}

function openAddEventModal() {
    const modal = document.getElementById('add-event-modal');
    if (modal) {
        const dateInput = document.getElementById('event-date');
        if (dateInput) {
            dateInput.value = selectedDate.toISOString().split('T')[0];
        }
        modal.classList.add('show');
    }
}

function handleEventSubmit(event) {
    event.preventDefault();
    const formData = new FormData(event.target);
    const newEvent = {
        id: Date.now(),
        title: formData.get('eventTitle'),
        date: formData.get('eventDate'),
        startTime: formData.get('eventStartTime'),
        endTime: formData.get('eventEndTime'),
        type: formData.get('eventType'),
        status: formData.get('eventStatus')
    };
    
    if(!newEvent.title || !newEvent.date || !newEvent.startTime || !newEvent.endTime) {
        alert('Por favor, preencha todos os campos obrigatórios.');
        return;
    }
    if (newEvent.startTime >= newEvent.endTime) {
        alert('O horário de término deve ser posterior ao horário de início.');
        return;
    }

    const conflictingEvent = checkForConflict(newEvent);
    if (conflictingEvent) {
        const confirmation = confirm(`AVISO: Este compromisso está em conflito com:\n\n"${conflictingEvent.title}"\n(${conflictingEvent.startTime} - ${conflictingEvent.endTime})\n\nDeseja salvar mesmo assim?`);
        if (!confirmation) return;
    }

    mockEvents.push(newEvent);
    selectedDate = new Date(newEvent.date + 'T00:00:00');
    currentMonth = selectedDate.getMonth();
    currentYear = selectedDate.getFullYear();
    renderAllSections();

    document.getElementById('add-event-modal')?.classList.remove('show');
}

function checkForConflict(newEvent) {
    const newStart = new Date(`${newEvent.date}T${newEvent.startTime}`);
    const newEnd = new Date(`${newEvent.date}T${newEvent.endTime}`);
    for (const existingEvent of mockEvents) {
        if (existingEvent.date === newEvent.date) {
            const existingStart = new Date(`${existingEvent.date}T${existingEvent.startTime}`);
            const existingEnd = new Date(`${existingEvent.date}T${existingEvent.endTime}`);
            if (newStart < existingEnd && newEnd > existingStart) {
                return existingEvent;
            }
        }
    }
    return null;
}

function getPriorityLabel(priority) {
    const labels = {
        'urgent-important': 'Urgente/Importante',
        'not-urgent-important': 'Não Urgente/Importante',
        'urgent-not-important': 'Urgente/Não Importante',
        'not-urgent-not-important': 'Não Urgente/Não Importante'
    };
    return labels[priority] || 'N/A';
}


/* ================================================================ */
/* Arquivo: /js/modules/okrs.js                                     */
/* Descrição: Módulo com a lógica de negócio para a Central de OKRs.*/
/* ================================================================ */

// Importa as funções de UI que este módulo precisa
import { showCustomConfirm, openIconPicker, openParameterPicker } from './ui.js';

// --- Variáveis e Constantes do Módulo ---
let objectiveIdCounter = 1;

// [NOVO] Estrutura de dados de exemplo para os OKRs de diferentes áreas
const mockOkrData = {
    "Governança": [
        {
            title: "Implementar Nova Estrutura de Governança Corporativa",
            endDate: "31/12/2025",
            icon: "bxs-bank",
            krs: [
                { title: "Definir 100% dos comitês de governança", min: 0, max: 100, value: 100, unit: "%" },
                { title: "Publicar o novo código de conduta para todos os colaboradores", min: 0, max: 1, value: 1, unit: "doc" }
            ]
        }
    ],
    "Vendas": [
        {
            title: "Aumentar a Receita Recorrente Mensal (MRR)",
            endDate: "31/12/2025",
            icon: "bxs-dollar-circle",
            krs: [
                { title: "Atingir R$ 50.000 de MRR", min: 10000, max: 50000, value: 25000, unit: "R$" },
                { title: "Aumentar a taxa de conversão de trial para pago em 15%", min: 0, max: 15, value: 5, unit: "%" },
                { title: "Conquistar 10 novos clientes B2B", min: 0, max: 10, value: 4, unit: "clientes" }
            ]
        },
        {
            title: "Expandir a Atuação para o Mercado Latam",
            endDate: "30/06/2026",
            icon: "bxs-plane-alt",
            krs: [
                { title: "Realizar 5 parcerias estratégicas na Argentina", min: 0, max: 5, value: 1, unit: "parcerias" }
            ]
        }
    ],
    "Tecnologia": [
        {
            title: "Reduzir o Tempo de Carregamento da Plataforma",
            endDate: "31/12/2025",
            icon: "bxs-timer",
            krs: [
                { title: "Diminuir o LCP (Largest Contentful Paint) para menos de 2s", min: 5, max: 2, value: 3.5, unit: "s" },
                { title: "Otimizar o tamanho das imagens em 90% das páginas", min: 0, max: 90, value: 60, unit: "%" }
            ]
        }
    ],
    "Marketing": [],
    "Financeiro": [],
    "Produto": [],
    "Customer Success": []
};


// --- Função Principal de Inicialização ---
export async function initOKRs() {
    // Verifica se estamos na página correta
    if (document.body.id !== 'dashboard-page') return;
    console.log("Módulo OKRs inicializado.");

    // Inicializa funcionalidades principais
    initAddObjectiveButton();
    initAreaSelector(); // [NOVO]
    renderObjectivesForArea("Governança"); // [NOVO] Carrega a área padrão
    
    // Escuta mudanças de tema para redesenhar gráficos
    document.addEventListener('themeChanged', redrawAllCharts);
}

// --- Funções de Renderização e Lógica Principal ---

/**
 * [NOVO] Renderiza os objetivos para uma área específica
 * @param {string} areaName - O nome da área a ser renderizada.
 */
function renderObjectivesForArea(areaName) {
    const okrMainList = document.querySelector('.okr-main-list');
    if (!okrMainList) return;

    // Limpa apenas os itens de objetivo, mantendo o cabeçalho
    const objectiveItems = okrMainList.querySelectorAll('.objective-item');
    objectiveItems.forEach(item => item.remove());
    const emptyMsg = okrMainList.querySelector('.empty-message');
    if(emptyMsg) emptyMsg.remove();

    const objectives = mockOkrData[areaName] || [];

    if (objectives.length === 0) {
        const emptyMessage = document.createElement('p');
        emptyMessage.className = 'empty-message';
        emptyMessage.textContent = 'Não há objetivos definidos para esta área.';
        emptyMessage.style.textAlign = 'center';
        emptyMessage.style.padding = '20px';
        okrMainList.appendChild(emptyMessage);
    } else {
        objectives.forEach(objData => {
            createNewObjective(objData);
        });
    }
    updateCompletedObjectivesKPI();
}

// --- Funções de Inicialização ---

/**
 * [NOVO] Inicializa a lógica do seletor de área
 */
function initAreaSelector() {
    const selectorBtn = document.getElementById('area-selector-btn');
    const dropdown = document.getElementById('area-dropdown');
    const selectedAreaName = document.getElementById('selected-area-name');

    if (!selectorBtn || !dropdown || !selectedAreaName) return;

    selectorBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = dropdown.style.display === 'block';
        dropdown.style.display = isOpen ? 'none' : 'block';
        selectorBtn.classList.toggle('open', !isOpen);
    });

    dropdown.addEventListener('click', (e) => {
        e.preventDefault();
        const target = e.target;
        if (target.tagName === 'A') {
            const area = target.dataset.area;
            selectedAreaName.textContent = area;
            renderObjectivesForArea(area);
            dropdown.style.display = 'none';
            selectorBtn.classList.remove('open');
        }
    });

    document.addEventListener('click', () => {
        if (dropdown.style.display === 'block') {
            dropdown.style.display = 'none';
            selectorBtn.classList.remove('open');
        }
    });
}

/**
 * Inicializa o botão "Adicionar Objetivo" principal
 */
function initAddObjectiveButton() {
    const primaryActionBtn = document.querySelector('.primary-action-btn');
    if (!primaryActionBtn) return;

    primaryActionBtn.replaceWith(primaryActionBtn.cloneNode(true));
    const newBtn = document.querySelector('.primary-action-btn');
    
    newBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        createNewObjective();
    });
}

// --- Funções de Criação de Elementos ---

/**
 * Cria um novo objetivo
 * @param {object} [data=null] - Dados do objetivo a ser criado.
 */
function createNewObjective(data = null) {
    const title = data ? data.title : "Novo Objetivo - Clique para editar";
    const endDate = data ? data.endDate : "31/12/2025";
    const icon = data ? data.icon : "bxs-rocket";
    const krs = data ? data.krs : [];

    const okrMainList = document.querySelector('.okr-main-list');
    if (!okrMainList) return;

    const emptyMsg = okrMainList.querySelector('.empty-message');
    if(emptyMsg) emptyMsg.remove();

    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = `
        <div class="objective-item">
            <div class="objective-summary">
                <div class="objective-info">
                    <i class='bx ${icon} objective-icon'></i>
                    <div>
                        <span class="objective-label"></span>
                        <h3 class="editable-title">${title}</h3>
                        <span class="objective-date editable-date">Data Fim: ${endDate}</span>
                    </div>
                </div>
                <div class="objective-progress-summary">
                    <div class="progress-chart">
                        <canvas id="objective${objectiveIdCounter}Chart"></canvas>
                        <div class="chart-center-text">0%</div>
                    </div>
                    <div class="progress-details">
                        <span>Progresso</span>
                        <strong><i class='bx bxs-flag-checkered'></i> ${krs.length} KRs</strong>
                    </div>
                </div>
                <div class="objective-actions">
                    <button class="icon-btn delete-objective-btn"><i class='bx bx-trash'></i></button>
                </div>
            </div>
            <div class="kr-details-container">
                <button class="toggle-krs-btn">EXIBIR KRs (${krs.length}) <i class='bx bx-chevron-down'></i></button>
                <div class="kr-list" style="display: none;">
                    ${krs.map(kr => createNewKRHTML(kr)).join('')}
                    <button class="add-kr-btn"><i class='bx bx-plus'></i> Adicionar KR</button>
                </div>
            </div>
        </div>`;
    
    const newObjectiveElement = tempDiv.firstElementChild;
    okrMainList.appendChild(newObjectiveElement);
    
    activateObjectiveFeatures(newObjectiveElement);
    
    renumberObjectives();
    updateObjectiveProgress(newObjectiveElement);
    
    objectiveIdCounter++;
}

/**
 * Ativa todas as funcionalidades de um objetivo
 */
function activateObjectiveFeatures(container) {
    if (!container) return;
    
    activateEditableTitle(container);
    activateEditableDate(container);
    activateToggleKRs(container);
    activateAddKRButton(container);
    activateDeleteObjective(container);
    activateObjectiveIcon(container);

    container.querySelectorAll('.kr-item').forEach(krEl => {
        activateKRFeatures(krEl);
    });
}

/**
 * Ativa edição do título do objetivo
 */
function activateEditableTitle(container) {
    const titleElement = container.querySelector('.editable-title');
    if (!titleElement) return;
    
    titleElement.replaceWith(titleElement.cloneNode(true));
    const newTitleElement = container.querySelector('.editable-title');
    
    newTitleElement.addEventListener('click', () => {
        const parentDiv = newTitleElement.parentElement; 
        if (!parentDiv || parentDiv.querySelector('.edit-input')) return;
        
        newTitleElement.classList.add('editing'); 
        const input = document.createElement('input');
        input.type = 'text'; 
        input.className = 'edit-input'; 
        input.value = newTitleElement.textContent;
        
        const saveChanges = () => { 
            const newTitle = input.value.trim(); 
            if (newTitle) newTitleElement.textContent = newTitle; 
            if (input.parentElement) parentDiv.removeChild(input); 
            newTitleElement.classList.remove('editing'); 
        };
        
        input.addEventListener('blur', saveChanges); 
        input.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter') saveChanges(); 
            else if (e.key === 'Escape') { 
                if (input.parentElement) parentDiv.removeChild(input); 
                newTitleElement.classList.remove('editing'); 
            }
        });
        
        parentDiv.insertBefore(input, newTitleElement.nextSibling); 
        input.focus();
    });
}

/**
 * Ativa seletor de data do objetivo
 */
function activateEditableDate(container) {
    const dateElement = container.querySelector('.editable-date');
    if (!dateElement) return;
    
    if (typeof flatpickr !== 'undefined') {
        flatpickr(dateElement, { 
            dateFormat: "d/m/Y", 
            minDate: "today", 
            "locale": "pt", 
            onClose: (selectedDates, dateStr) => {
                if (selectedDates.length > 0) {
                    dateElement.textContent = "Data Fim: " + dateStr;
                }
            }
        }); 
    }
}

/**
 * Ativa botão de toggle dos KRs
 */
function activateToggleKRs(container) {
    const toggleButton = container.querySelector('.toggle-krs-btn');
    if (!toggleButton) return;
    
    toggleButton.replaceWith(toggleButton.cloneNode(true));
    const newToggleButton = container.querySelector('.toggle-krs-btn');
    
    newToggleButton.addEventListener('click', () => {
        const krList = container.querySelector('.kr-list');
        const icon = newToggleButton.querySelector('i');
        if (!krList || !icon) return;

        if (krList.style.display === 'block') { 
            krList.style.display = 'none'; 
            icon.classList.remove('bx-chevron-up'); 
            icon.classList.add('bx-chevron-down'); 
        } else { 
            krList.style.display = 'block'; 
            icon.classList.remove('bx-chevron-down'); 
            icon.classList.add('bx-chevron-up'); 
        }
    });
}

/**
 * Ativa botão de adicionar KR
 */
function activateAddKRButton(container) {
    const addKrButton = container.querySelector('.add-kr-btn');
    if (!addKrButton) return;
    
    addKrButton.replaceWith(addKrButton.cloneNode(true));
    const newAddKrButton = container.querySelector('.add-kr-btn');
    
    newAddKrButton.addEventListener('click', () => {
        const krList = newAddKrButton.parentElement;
        const newKRElementHTML = createNewKRHTML();

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = newKRElementHTML;
        const newKRElement = tempDiv.firstElementChild;
        const taskListContainer = tempDiv.children[1];

        krList.insertBefore(newKRElement, newAddKrButton);
        krList.insertBefore(taskListContainer, newAddKrButton);

        activateKRFeatures(newKRElement);
        updateObjectiveProgress(newKRElement);
    });
}

/**
 * Ativa botão de deletar objetivo
 */
function activateDeleteObjective(container) {
    const deleteObjectiveButton = container.querySelector('.delete-objective-btn');
    if (!deleteObjectiveButton) return;
    
    deleteObjectiveButton.replaceWith(deleteObjectiveButton.cloneNode(true));
    const newDeleteButton = container.querySelector('.delete-objective-btn');
    
    newDeleteButton.addEventListener('click', async () => {
        const confirmed = await showCustomConfirm({ 
            title: 'Excluir Objetivo?', 
            message: 'Todos os KRs e checkpoints associados serão removidos permanentemente.', 
            type: 'delete', 
            icon: 'bx-trash', 
            confirmText: 'Sim, excluir' 
        });
        
        if (confirmed) {
            container.remove();
            renumberObjectives();
            updateCompletedObjectivesKPI();
        }
    });
}

/**
 * Ativa ícone clicável do objetivo
 */
function activateObjectiveIcon(container) {
    const iconElement = container.querySelector('.objective-icon');
    if (!iconElement) return;
    
    iconElement.style.cursor = 'pointer';
    iconElement.addEventListener('click', () => {
        openIconPicker(iconElement);
    });
}

/**
 * Cria o HTML para um novo KR
 * @param {object} [data=null] - Dados do KR a ser criado.
 * @returns {string} - Retorna o HTML do novo KR.
 */
function createNewKRHTML(data = null) {
    const title = data ? data.title : "Novo KR - Clique para editar";
    const min = data ? data.min : 0;
    const max = data ? data.max : 100;
    const value = data ? data.value : 0;
    const unit = data ? data.unit : "unidades";

    return `
        <div class="kr-item">
            <div class="kr-info">
                <i class='bx bx-target-lock kr-icon'></i>
                <span class="editable-kr-title">${title}</span>
            </div>
            <div class="kr-progress-slider">
                <span class="editable-min-value">${min}</span>
                <div class="slider-track">
                    <div class="slider-fill"></div>
                    <div class="slider-thumb"></div>
                </div>
                <div class="kr-max-value-container">
                    <span class="editable-max-value">${max}</span>
                    <span class="kr-parameter-selector">${unit}</span>
                </div>
            </div>
            <div class="kr-progress-text">
                <strong>0%</strong>
                <span>${value} / ${max}</span>
            </div>
            <div class="kr-actions">
                <button class="icon-btn kr-options-btn">
                    <i class='bx bx-dots-vertical-rounded'></i>
                </button>
            </div>
        </div>
        <div class="kr-task-list-container">
            <div class="kr-task-list-header">
                <h5>Checkpoints</h5>
            </div>
            <ul class="task-list"></ul>
            <button class="add-task-btn">
                <i class='bx bx-plus'></i> Adicionar Tarefa
            </button>
        </div>`;
}

/**
 * Ativa todas as funcionalidades de um KR
 */
function activateKRFeatures(krElement) {
    if (!krElement) return;
    
    activateKRTitleEdit(krElement);
    activateKRValueEdit(krElement);
    activateKROptionsMenu(krElement);
    activateKRSlider(krElement);
    activateKRIcon(krElement);
    activateKRParameterSelector(krElement);
}

/**
 * Ativa edição do título do KR
 */
function activateKRTitleEdit(krElement) {
    const titleElement = krElement.querySelector('.editable-kr-title');
    if (!titleElement) return;
    
    titleElement.addEventListener('click', () => {
        const parentDiv = titleElement.parentElement; 
        if (!parentDiv || parentDiv.querySelector('.edit-input')) return;
        
        titleElement.classList.add('editing'); 
        const input = document.createElement('input');
        input.type = 'text'; 
        input.className = 'edit-input'; 
        input.value = titleElement.textContent;
        
        const saveChanges = () => { 
            const newTitle = input.value.trim(); 
            if (newTitle) titleElement.textContent = newTitle; 
            if (input.parentElement) parentDiv.removeChild(input); 
            titleElement.classList.remove('editing'); 
        };
        
        input.addEventListener('blur', saveChanges); 
        input.addEventListener('keydown', (e) => { 
            if (e.key === 'Enter') saveChanges(); 
            else if (e.key === 'Escape') { 
                if (input.parentElement) parentDiv.removeChild(input); 
                titleElement.classList.remove('editing'); 
            }
        });
        
        parentDiv.insertBefore(input, titleElement.nextSibling); 
        input.focus();
    });
}

/**
 * Ativa edição dos valores min/max do KR
 */
function activateKRValueEdit(krElement) {
    const minElement = krElement.querySelector('.editable-min-value');
    const maxElement = krElement.querySelector('.editable-max-value');
    
    [minElement, maxElement].forEach(element => {
        if (!element) return;
        
        element.addEventListener('click', () => {
            if (element.querySelector('input')) return; 
            
            const originalValue = element.textContent;
            element.style.display = 'none'; 
            
            const input = document.createElement('input');
            input.type = 'number'; 
            input.value = originalValue; 
            input.style.width = '60px';
            
            const saveValue = () => { 
                element.textContent = input.value || originalValue; 
                element.style.display = 'inline'; 
                if (input.parentElement) input.remove();
                
                const slider = krElement.querySelector('.kr-progress-slider');
                if (slider) makeSliderInteractive(slider);
            };
            
            input.addEventListener('blur', saveValue); 
            input.addEventListener('keydown', (e) => { 
                if (e.key === 'Enter') saveValue(); 
                else if (e.key === 'Escape') { 
                    element.style.display = 'inline'; 
                    if (input.parentElement) input.remove();
                }
            });
            
            element.parentElement.insertBefore(input, element); 
            input.focus(); 
            input.select();
        });
    });
}

/**
 * Ativa menu de opções do KR
 */
function activateKROptionsMenu(krElement) {
    const optionsBtn = krElement.querySelector('.kr-options-btn');
    if (!optionsBtn) return;
    
    optionsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        document.querySelectorAll('.kr-actions-menu').forEach(m => m.remove());
        
        const menu = document.createElement('div');
        menu.className = 'kr-actions-menu';
        menu.innerHTML = `
            <button class="add-tasks-btn">
                <i class='bx bx-list-plus'></i> Adicionar Tarefas
            </button>
            <button class="delete-kr-btn">
                <i class='bx bx-trash'></i> Excluir KR
            </button>`;

        const actionsContainer = optionsBtn.parentElement;
        if (actionsContainer) actionsContainer.appendChild(menu);

        menu.querySelector('.delete-kr-btn').addEventListener('click', async () => {
            const confirmed = await showCustomConfirm({
                title: 'Excluir Key Result?',
                message: 'Todos os checkpoints associados também serão removidos.',
                type: 'delete',
                icon: 'bx-trash',
                confirmText: 'Sim, excluir'
            });

            if (confirmed) {
                const objectiveItem = krElement.closest('.objective-item');
                const taskContainer = krElement.nextElementSibling;

                if (taskContainer && taskContainer.classList.contains('kr-task-list-container')) {
                    taskContainer.remove();
                }

                krElement.remove();

                if (objectiveItem) {
                    updateObjectiveProgress(objectiveItem);
                }
            }
        });

        menu.querySelector('.add-tasks-btn').addEventListener('click', () => {
            const taskContainer = krElement.nextElementSibling;
            if (taskContainer && taskContainer.classList.contains('kr-task-list-container')) {
                taskContainer.style.display = 'block';
                activateTaskList(taskContainer);
            }
            menu.remove();
        });
        
        menu.style.display = 'block';

        const closeMenu = (event) => {
            if (!menu.contains(event.target)) {
                menu.remove();
                document.removeEventListener('click', closeMenu);
            }
        };
        document.addEventListener('click', closeMenu);
    });
}

/**
 * Ativa slider interativo do KR
 */
function activateKRSlider(krElement) {
    const slider = krElement.querySelector('.kr-progress-slider');
    if (slider) {
        makeSliderInteractive(slider);
    }
}

/**
 * Ativa ícone clicável do KR
 */
function activateKRIcon(krElement) {
    const iconElement = krElement.querySelector('.kr-icon');
    if (!iconElement) return;
    
    iconElement.style.cursor = 'pointer'; 
    iconElement.addEventListener('click', () => {
        openIconPicker(iconElement);
    });
}

/**
 * Ativa seletor de parâmetros do KR
 */
function activateKRParameterSelector(krElement) {
    const parameterElement = krElement.querySelector('.kr-parameter-selector');
    if (!parameterElement) return;
    
    parameterElement.addEventListener('click', () => {
        openParameterPicker(parameterElement);
    });
}

/**
 * Ativa funcionalidades da lista de tarefas
 */
function activateTaskList(taskListContainer) {
    if (!taskListContainer) return;
    
    const addTaskBtn = taskListContainer.querySelector('.add-task-btn');
    const taskList = taskListContainer.querySelector('.task-list');

    if (addTaskBtn) {
        addTaskBtn.addEventListener('click', () => createNewTaskInList(taskList));
    }
    
    let draggedItem = null;
    if (taskList) {
        taskList.addEventListener('dragstart', e => {
            draggedItem = e.target;
            setTimeout(() => { 
                if(draggedItem) draggedItem.classList.add('dragging') 
            }, 0);
        });
        
        taskList.addEventListener('dragend', () => {
            if(draggedItem) draggedItem.classList.remove('dragging');
            draggedItem = null;
        });
        
        taskList.addEventListener('dragover', e => {
            e.preventDefault();
            const afterElement = getDragAfterElement(taskList, e.clientY);
            if (draggedItem) {
                if (afterElement == null) {
                    taskList.appendChild(draggedItem);
                } else {
                    taskList.insertBefore(draggedItem, afterElement);
                }
            }
        });
    }
}

/**
 * Cria uma nova tarefa na lista
 */
function createNewTaskInList(taskList) {
    if (!taskList) return;
    
    const taskItem = document.createElement('li');
    taskItem.className = 'task-item';
    taskItem.draggable = true;
    taskItem.innerHTML = `
        <div class="task-content">
            <input type="checkbox" class="task-checkbox">
            <span class="task-text editable-task">Nova tarefa - Clique para editar</span>
        </div>
        <button class="delete-task-btn">
            <i class='bx bx-x'></i>
        </button>`;
    
    taskList.appendChild(taskItem);
    activateTaskFeatures(taskItem);
}

/**
 * Ativa funcionalidades de uma tarefa
 */
function activateTaskFeatures(taskItem) {
    const checkbox = taskItem.querySelector('.task-checkbox');
    const taskText = taskItem.querySelector('.editable-task');
    const deleteBtn = taskItem.querySelector('.delete-task-btn');
    
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            taskItem.classList.toggle('completed', checkbox.checked);
        });
    }
    
    if (taskText) {
        taskText.addEventListener('click', () => {
            if (taskText.querySelector('input')) return;
            
            const originalText = taskText.textContent;
            taskText.style.display = 'none';
            
            const input = document.createElement('input');
            input.type = 'text';
            input.value = originalText;
            input.className = 'task-edit-input';
            
            const saveTask = () => {
                taskText.textContent = input.value || originalText;
                taskText.style.display = 'inline';
                if (input.parentElement) input.remove();
            };
            
            input.addEventListener('blur', saveTask);
            input.addEventListener('keydown', (e) => {
                if (e.key === 'Enter') saveTask();
                else if (e.key === 'Escape') {
                    taskText.style.display = 'inline';
                    if (input.parentElement) input.remove();
                }
            });
            
            taskText.parentElement.insertBefore(input, taskText);
            input.focus();
            input.select();
        });
    }
    
    if (deleteBtn) {
        deleteBtn.addEventListener('click', () => {
            taskItem.remove();
        });
    }
}

function getDragAfterElement(container, y) {
    const draggableElements = [...container.querySelectorAll('.task-item:not(.dragging)')];
    
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        
        if (offset < 0 && offset > closest.offset) {
            return { offset: offset, element: child };
        } else {
            return closest;
        }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function renumberObjectives() {
    const objectives = document.querySelectorAll('.objective-item');
    objectives.forEach((objective, index) => {
        const label = objective.querySelector('.objective-label');
        if (label) {
            label.textContent = `Objetivo ${index + 1}`;
        }
    });
}

function updateObjectiveProgress(elementInsideObjective) {
    const objectiveItem = elementInsideObjective.closest('.objective-item');
    if (!objectiveItem) {
        renumberObjectives();
        updateCompletedObjectivesKPI();
        return;
    }
    
    const allKrItems = objectiveItem.querySelectorAll('.kr-item');
    let averageProgress = 0;
    
    if (allKrItems.length > 0) {
        let totalProgress = 0;
        allKrItems.forEach(krItem => {
            const progressText = krItem.querySelector('.kr-progress-text strong');
            if (progressText) {
                totalProgress += parseInt(progressText.textContent.replace('%', '')) || 0;
            }
        });
        averageProgress = Math.round(totalProgress / allKrItems.length);
    }
    
    const progressDetails = objectiveItem.querySelector('.progress-details strong');
    if (progressDetails) {
        progressDetails.innerHTML = `<i class='bx bxs-flag-checkered'></i> ${allKrItems.length} KRs`;
    }
    
    const toggleButton = objectiveItem.querySelector('.toggle-krs-btn');
    if (toggleButton) {
        const icon = toggleButton.querySelector('i');
        toggleButton.innerHTML = `EXIBIR KRs (${allKrItems.length}) `;
        if (icon) toggleButton.appendChild(icon);
    }
    
    const canvas = objectiveItem.querySelector('canvas');
    if (canvas) {
        renderDoughnutChart(canvas.id, averageProgress);
    }
    
    updateCompletedObjectivesKPI();
}

function makeSliderInteractive(sliderContainer) {
    const sliderTrack = sliderContainer.querySelector('.slider-track');
    const sliderFill = sliderContainer.querySelector('.slider-fill');
    const sliderThumb = sliderContainer.querySelector('.slider-thumb');
    const krItem = sliderContainer.closest('.kr-item');
    
    if (!krItem) return;

    const progressText = krItem.querySelector('.kr-progress-text strong');
    const progressSubtext = krItem.querySelector('.kr-progress-text span');
    const minValueElement = krItem.querySelector('.editable-min-value');
    const maxValueElement = krItem.querySelector('.editable-max-value');
    
    let isDragging = false;

    function updateSlider(value) {
        const minValue = parseInt(minValueElement.textContent) || 0;
        const maxValue = parseInt(maxValueElement.textContent) || 100;
        const clampedValue = Math.max(minValue, Math.min(value, maxValue));
        const percentage = (maxValue - minValue > 0) ? 
            ((clampedValue - minValue) / (maxValue - minValue)) * 100 : 0;
        
        if(sliderFill) sliderFill.style.width = `${percentage}%`;
        if(sliderThumb) sliderThumb.style.left = `${percentage}%`;
        if(progressText) progressText.textContent = `${Math.round(percentage)}%`;
        if(progressSubtext) progressSubtext.textContent = `${clampedValue} / ${max}`;
        
        updateObjectiveProgress(sliderContainer);
    }

    function getValueFromPosition(clientX) {
        const minValue = parseInt(minValueElement.textContent) || 0;
        const maxValue = parseInt(maxValueElement.textContent) || 100;
        const rect = sliderTrack.getBoundingClientRect();
        const percentage = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
        return Math.round(minValue + (percentage / 100) * (maxValue - minValue));
    }

    if(sliderThumb) {
        sliderThumb.addEventListener('mousedown', (e) => { 
            isDragging = true; 
            e.preventDefault(); 
            document.body.style.cursor = 'grabbing'; 
        });
    }
    
    if(sliderTrack) {
        sliderTrack.addEventListener('mousedown', (e) => { 
            if (e.target === sliderTrack || e.target === sliderFill) { 
                const newValue = getValueFromPosition(e.clientX); 
                updateSlider(newValue); 
                isDragging = true; 
                document.body.style.cursor = 'grabbing'; 
            } 
        });
    }
    
    document.addEventListener('mousemove', (e) => { 
        if (isDragging) { 
            const newValue = getValueFromPosition(e.clientX); 
            updateSlider(newValue); 
        } 
    });
    
    document.addEventListener('mouseup', () => { 
        if (isDragging) { 
            isDragging = false; 
            document.body.style.cursor = 'default'; 
        } 
    });
    
    const currentValue = parseInt(progressSubtext.textContent.split(' / ')[0]) || 0;
    updateSlider(currentValue);
}

function updateCompletedObjectivesKPI() {
    const objectives = document.querySelectorAll('.objective-item');
    let completedCount = 0;
    const totalCount = objectives.length;
    
    objectives.forEach(objective => {
        const progressText = objective.querySelector('.chart-center-text');
        if (progressText) {
            const progress = parseInt(progressText.textContent.replace('%', '')) || 0;
            if (progress >= 100) completedCount++;
        }
    });
    
    const kpiElement = document.getElementById('kpi-objetivos-concluidos');
    if (kpiElement) {
        kpiElement.textContent = `${completedCount}/${totalCount}`;
    }
}

function redrawAllCharts() {
    document.querySelectorAll('.objective-item canvas').forEach(canvas => {
        const objectiveItem = canvas.closest('.objective-item');
        if (objectiveItem) {
            const progressText = objectiveItem.querySelector('.chart-center-text');
            if (progressText) {
                const progress = parseInt(progressText.textContent.replace('%', '')) || 0;
                renderDoughnutChart(canvas.id, progress);
            }
        }
    });
}

function renderDoughnutChart(canvasId, progress) {
    if (typeof window.renderDoughnutChart === 'function') {
        window.renderDoughnutChart(canvasId, progress);
    }
}

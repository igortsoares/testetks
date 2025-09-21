/* ================================================================ */
/* Arquivo: /js/modules/ui.js                                       */
/* Descrição: Módulo responsável por toda a lógica de interface     */
/*            geral (UI), como menus, modais, seletores e temas.    */
/* ================================================================ */

// --- Variáveis Globais do Módulo de UI ---

// Variáveis para controlar qual elemento está sendo editado pelos seletores
let currentIconElement = null;
let currentParameterElement = null;

// Flag para evitar inicialização dupla dos seletores
let pickersInitialized = false;

// Definições dos dados dos seletores
const availableIcons = [
    'bx-target-lock', 'bx-line-chart', 'bx-user-plus', 'bx-dollar-circle', 
    'bx-smile', 'bx-rocket', 'bx-trophy', 'bx-check-shield', 'bx-bulb', 
    'bx-trending-up', 'bx-bar-chart-alt-2', 'bx-bullseye', 'bx-data', 
    'bx-like', 'bx-star'
];

const availableParameters = { 
    'Porcento': ['%'], 
    'Moedas': ['R$', '$', '€'], 
    'Unidades': [
        'respostas', 'assinaturas', 'clientes', 'usuários', 'reuniões', 
        'vídeos', 'postagens', 'NPS', 'pessoas', 'projetos', 'inscrições', 
        'visitantes', 'visualizações', 'vendas', 'ligações', 'leads', 
        'feedbacks', 'parceiros', 'acessos', 'downloads', 'ativações', 
        'cadastros', 'treinamentos', 'apresentações', 'propostas'
    ] 
};

// --- Funções Exportadas ---

/**
 * Inicializa todos os componentes de interface do usuário.
 */
export function initUI() {
    console.log('Inicializando módulo UI...');
    
    initThemeSwitcher();
    initSidebarCollapse();
    initMobileMenu();
    initDepartmentDropdown();
    initGlobalClosers();
    displayCurrentDate();
    initPickers();
    
    console.log('Módulo UI inicializado com sucesso');
}

/**
 * Exibe um modal de confirmação personalizado.
 * Retorna uma Promise que resolve para `true` se confirmado, `false` caso contrário.
 * @param {object} options - Opções para o modal.
 */
export function showCustomConfirm(options) {
    const confirmModal = document.querySelector('.custom-confirm-modal');
    const confirmOverlay = document.querySelector('.custom-confirm-overlay');
    
    return new Promise((resolve) => {
        if (!confirmModal || !confirmOverlay) {
            console.warn('Modal de confirmação não encontrado, usando confirm nativo');
            resolve(confirm(options.message || 'Você tem certeza?'));
            return;
        }

        const confirmTitle = confirmModal.querySelector('.confirm-title');
        const confirmMessage = confirmModal.querySelector('.confirm-message');
        const confirmIconArea = confirmModal.querySelector('.confirm-icon-area');
        const confirmBtnConfirm = confirmModal.querySelector('.confirm-btn-confirm');
        const confirmBtnCancel = confirmModal.querySelector('.confirm-btn-cancel');

        // Preenche o conteúdo do modal
        if (confirmTitle) confirmTitle.textContent = options.title || 'Você tem certeza?';
        if (confirmMessage) confirmMessage.innerHTML = options.message || 'Esta ação não pode ser desfeita.';
        if (confirmBtnConfirm) confirmBtnConfirm.textContent = options.confirmText || 'Confirmar';
        if (confirmBtnCancel) confirmBtnCancel.textContent = options.cancelText || 'Cancelar';
        
        if (confirmIconArea) {
            confirmIconArea.innerHTML = `<i class='bx ${options.icon || 'bx-error-circle'}'></i>`;
        }
        
        confirmModal.dataset.type = options.type || 'confirm';

        // Exibe o modal
        confirmModal.classList.add('visible');
        confirmOverlay.classList.add('visible');

        const close = (value) => {
            confirmModal.classList.remove('visible');
            confirmOverlay.classList.remove('visible');
            
            // Remove event listeners para evitar vazamentos
            if (confirmBtnConfirm) confirmBtnConfirm.onclick = null;
            if (confirmBtnCancel) confirmBtnCancel.onclick = null;
            if (confirmOverlay) confirmOverlay.onclick = null;
            
            resolve(value);
        };

        // Adiciona event listeners
        if (confirmBtnConfirm) confirmBtnConfirm.onclick = () => close(true);
        if (confirmBtnCancel) confirmBtnCancel.onclick = () => close(false);
        if (confirmOverlay) confirmOverlay.onclick = () => close(false);
    });
}

/**
 * Abre o modal de seleção de ícones.
 * @param {HTMLElement} iconElement - O elemento <i> que deve ser atualizado.
 */
export function openIconPicker(iconElement) {
    if (!iconElement) {
        console.warn('Elemento de ícone não fornecido para o seletor');
        return;
    }
    
    currentIconElement = iconElement;
    const iconPickerModal = document.querySelector('.icon-picker-modal');
    const iconPickerOverlay = document.querySelector('.icon-picker-overlay');
    
    if (iconPickerModal) iconPickerModal.style.display = 'block';
    if (iconPickerOverlay) iconPickerOverlay.style.display = 'block';
    
    console.log('Seletor de ícones aberto');
}

/**
 * Abre o modal de seleção de parâmetros.
 * @param {HTMLElement} paramElement - O elemento <span> que deve ser atualizado.
 */
export function openParameterPicker(paramElement) {
    if (!paramElement) {
        console.warn('Elemento de parâmetro não fornecido para o seletor');
        return;
    }
    
    currentParameterElement = paramElement;
    const parameterPickerModal = document.querySelector('.parameter-picker-modal');
    const parameterPickerOverlay = document.querySelector('.parameter-picker-overlay');
    
    if (parameterPickerModal) parameterPickerModal.style.display = 'block';
    if (parameterPickerOverlay) parameterPickerOverlay.style.display = 'block';
    
    console.log('Seletor de parâmetros aberto');
}

// --- Funções Internas do Módulo ---

/**
 * Inicializa o alternador de tema
 */
function initThemeSwitcher() {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    if (!themeToggleBtn) {
        console.warn('Botão de alternância de tema não encontrado');
        return;
    }

    const applyTheme = (theme) => {
        const icon = themeToggleBtn.querySelector('i');
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            if (icon) icon.className = 'bx bx-moon';
        } else {
            document.body.classList.remove('dark-mode');
            if (icon) icon.className = 'bx bx-sun';
        }
        
        // Dispara evento personalizado para outros módulos
        document.dispatchEvent(new CustomEvent('themeChanged'));
    };

    // Aplica tema salvo
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme) {
        applyTheme(currentTheme);
    }

    // Remove listener anterior para evitar duplicação
    themeToggleBtn.replaceWith(themeToggleBtn.cloneNode(true));
    const newThemeBtn = document.getElementById('theme-toggle-btn');
    
    newThemeBtn.addEventListener('click', () => {
        const newTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
    });
    
    console.log('Alternador de tema inicializado');
}

/**
 * Inicializa o colapso da sidebar
 */
function initSidebarCollapse() {
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');
    
    if (!sidebarToggleBtn || !sidebar || !mainContent) {
        console.warn('Elementos da sidebar não encontrados');
        return;
    }

    const applySidebarState = (state) => {
        const isCollapsed = state === 'collapsed';
        sidebar.classList.toggle('collapsed', isCollapsed);
        mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
    };

    // Aplica estado salvo
    const savedSidebarState = localStorage.getItem('sidebarState');
    if (savedSidebarState) {
        applySidebarState(savedSidebarState);
    }

    // Remove listener anterior para evitar duplicação
    sidebarToggleBtn.replaceWith(sidebarToggleBtn.cloneNode(true));
    const newSidebarBtn = document.getElementById('sidebar-toggle-btn');
    
    newSidebarBtn.addEventListener('click', () => {
        const isCollapsed = sidebar.classList.toggle('collapsed');
        mainContent.classList.toggle('sidebar-collapsed', isCollapsed);
        localStorage.setItem('sidebarState', isCollapsed ? 'collapsed' : 'expanded');
    });
    
    console.log('Colapso da sidebar inicializado');
}

/**
 * Inicializa o menu mobile
 */
function initMobileMenu() {
    const menuToggle = document.getElementById('menu-toggle');
    const sidebar = document.getElementById('sidebar');
    const mobileOverlay = document.getElementById('sidebar-overlay');
    
    if (!menuToggle || !sidebar || !mobileOverlay) {
        console.warn('Elementos do menu mobile não encontrados');
        return;
    }

    const closeSidebar = () => {
        sidebar.classList.remove('open');
        mobileOverlay.classList.remove('open');
    };

    // Remove listeners anteriores para evitar duplicação
    menuToggle.replaceWith(menuToggle.cloneNode(true));
    mobileOverlay.replaceWith(mobileOverlay.cloneNode(true));
    
    const newMenuToggle = document.getElementById('menu-toggle');
    const newMobileOverlay = document.getElementById('sidebar-overlay');
    
    newMenuToggle.addEventListener('click', () => {
        sidebar.classList.toggle('open');
        newMobileOverlay.classList.toggle('open');
    });
    
    newMobileOverlay.addEventListener('click', closeSidebar);
    
    console.log('Menu mobile inicializado');
}

/**
 * Inicializa o dropdown de departamentos
 */
function initDepartmentDropdown() {
    const departmentSelector = document.getElementById('department-selector');
    const departmentDropdown = document.getElementById('department-dropdown');
    
    if (!departmentSelector || !departmentDropdown) {
        console.warn('Elementos do dropdown de departamentos não encontrados');
        return;
    }

    // Remove listeners anteriores para evitar duplicação
    departmentSelector.replaceWith(departmentSelector.cloneNode(true));
    const newDepartmentSelector = document.getElementById('department-selector');
    
    newDepartmentSelector.addEventListener('click', (event) => {
        event.stopPropagation();
        departmentDropdown.classList.toggle('open');
    });

    // Event delegation para itens do dropdown
    departmentDropdown.addEventListener('click', (event) => {
        if (event.target.tagName === 'LI') {
            const selectedDepartment = document.getElementById('selected-department');
            if (selectedDepartment) {
                selectedDepartment.textContent = event.target.textContent;
            }
            departmentDropdown.classList.remove('open');
        }
    });
    
    console.log('Dropdown de departamentos inicializado');
}

/**
 * Inicializa fechadores globais
 */
function initGlobalClosers() {
    // Remove listener anterior se existir
    window.removeEventListener('click', globalClickHandler);
    window.addEventListener('click', globalClickHandler);
    
    console.log('Fechadores globais inicializados');
}

/**
 * Handler global para cliques
 */
function globalClickHandler() {
    // Fecha dropdown de departamentos
    const departmentDropdown = document.getElementById('department-dropdown');
    if (departmentDropdown && departmentDropdown.classList.contains('open')) {
        departmentDropdown.classList.remove('open');
    }
    
    // Fecha menus de ações dos KRs
    document.querySelectorAll('.kr-actions-menu').forEach(menu => {
        menu.style.display = 'none';
    });
}

/**
 * Exibe a data atual
 */
function displayCurrentDate() {
    const dateElement = document.getElementById('current-date');
    if (dateElement) {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        dateElement.textContent = today.toLocaleDateString('pt-BR', options);
    }
}

/**
 * Inicializa os seletores de ícones e parâmetros.
 */
function initPickers() {
    // Evita inicialização dupla
    if (pickersInitialized) {
        console.log('Seletores já inicializados, pulando...');
        return;
    }
    
    const iconPickerModal = document.querySelector('.icon-picker-modal');
    const iconPickerOverlay = document.querySelector('.icon-picker-overlay');
    const iconPickerGrid = document.querySelector('.icon-picker-grid');
    
    const parameterPickerModal = document.querySelector('.parameter-picker-modal');
    const parameterPickerOverlay = document.querySelector('.parameter-picker-overlay');
    const parameterPickerList = document.querySelector('.parameter-picker-list');

    // Inicializa seletor de ícones
    if (iconPickerGrid) {
        iconPickerGrid.innerHTML = ''; // Limpa a grade para evitar duplicação
        
        availableIcons.forEach(iconClass => {
            const iconContainer = document.createElement('div');
            iconContainer.className = 'icon-option';
            
            const icon = document.createElement('i');
            icon.className = `bx ${iconClass}`;
            
            iconContainer.appendChild(icon);
            iconContainer.addEventListener('click', () => {
                if (currentIconElement) {
                    // Lógica robusta para trocar apenas a classe do ícone
                    const baseClasses = currentIconElement.className
                        .split(' ')
                        .filter(c => !c.startsWith('bx-') && c !== 'bx');
                    baseClasses.push('bx', iconClass);
                    currentIconElement.className = baseClasses.join(' ');
                    
                    console.log(`Ícone alterado para: ${iconClass}`);
                }
                closePickers();
            });
            
            iconPickerGrid.appendChild(iconContainer);
        });
        
        console.log('Seletor de ícones preenchido');
    }

    // Inicializa seletor de parâmetros
    if (parameterPickerList) {
        parameterPickerList.innerHTML = ''; // Limpa a lista para evitar duplicação
        
        for (const group in availableParameters) {
            const groupTitle = document.createElement('div');
            groupTitle.className = 'group-title';
            groupTitle.textContent = group;
            parameterPickerList.appendChild(groupTitle);
            
            availableParameters[group].forEach(param => {
                const option = document.createElement('div');
                option.className = 'parameter-option';
                option.textContent = param;
                option.addEventListener('click', () => {
                    if (currentParameterElement) {
                        currentParameterElement.textContent = param;
                        console.log(`Parâmetro alterado para: ${param}`);
                    }
                    closePickers();
                });
                parameterPickerList.appendChild(option);
            });
        }
        
        console.log('Seletor de parâmetros preenchido');
    }

    // Adiciona eventos de fechamento aos overlays
    if (iconPickerOverlay) {
        iconPickerOverlay.replaceWith(iconPickerOverlay.cloneNode(true));
        const newIconOverlay = document.querySelector('.icon-picker-overlay');
        newIconOverlay.addEventListener('click', closePickers);
    }
    
    if (parameterPickerOverlay) {
        parameterPickerOverlay.replaceWith(parameterPickerOverlay.cloneNode(true));
        const newParamOverlay = document.querySelector('.parameter-picker-overlay');
        newParamOverlay.addEventListener('click', closePickers);
    }
    
    pickersInitialized = true;
    console.log('Seletores inicializados com sucesso');
}

/**
 * Fecha todos os modais de seleção.
 */
function closePickers() {
    const modals = document.querySelectorAll('.icon-picker-modal, .parameter-picker-modal');
    const overlays = document.querySelectorAll('.icon-picker-overlay, .parameter-picker-overlay');
    
    modals.forEach(modal => modal.style.display = 'none');
    overlays.forEach(overlay => overlay.style.display = 'none');
    
    // Limpa referências atuais
    currentIconElement = null;
    currentParameterElement = null;
    
    console.log('Seletores fechados');
}

/**
 * Reinicializa os seletores (útil para debugging)
 */
export function reinitPickers() {
    pickersInitialized = false;
    initPickers();
}

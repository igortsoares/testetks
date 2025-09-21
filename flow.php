<?php
/* ================================================================ */
/* Arquivo: flow.php                                               */
/* Descrição: Página do Hub de Produtividade "Flow".                */
/* Versão: 2.3 (Layout do Ciclo de Foco Refinado)                   */
/* ================================================================ */

// Define variáveis para o header
$headerTitle = 'Flow';
$bodyId = 'flow-page';

include 'components/_head.php';
?>

<body id="<?php echo $bodyId; ?>">

<div class="main-layout">
    <?php include 'components/_sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'components/_header.php'; ?>
        
        <div class="page-content">
            
            <div class="flow-header-section">
                <p class="flow-description">Seu HUB de produtividade.</p>
            </div>
            
            <!-- [MELHORIA] Estrutura do HTML da seção de foco foi reorganizada -->
            <section class="flow-focus-section">
                <div class="focus-container">
                    <div class="focus-main">
                        <div class="focus-title">
                            <h2>Ciclo de Foco</h2>
                            <p>Timer para você manter o foco sem distração</p>
                        </div>
                        <div class="focus-timer">
                            <span id="timer-display" class="timer-text" title="Clique para configurar">25:00</span>
                        </div>
                        <div class="focus-controls">
                            <button id="start-timer-btn" class="timer-btn timer-btn-start"><i class='bx bx-play'></i> Iniciar</button>
                            <button id="reset-timer-btn" class="timer-btn timer-btn-reset"><i class='bx bx-refresh'></i> Zerar</button>
                            <button id="pause-timer-btn" class="timer-btn timer-btn-pause" style="display: none;"><i class='bx bx-pause'></i> Pausar</button>
                        </div>
                    </div>
                    <div class="focus-stats">
                        <div class="stat-item">
                            <span id="cycles-today" class="stat-value">0</span>
                            <span class="stat-label">Ciclos de Hoje</span>
                        </div>
                        <div class="stat-item">
                            <span id="total-focus-time" class="stat-value">0h 0m</span>
                            <span class="stat-label">Tempo Total de Foco</span>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="flow-missions-section">
                <div class="missions-header">
                    <h2>Missões</h2>
                    <p>A estrutura das missões segue a metodologia da Matriz de Eisenhower</p>
                </div>
                <div class="missions-cards">
                    <div class="mission-card mission-completed">
                        <div class="mission-icon"><i class='bx bx-trophy'></i></div>
                        <div class="mission-info">
                            <h3>Missões Concluídas</h3>
                            <div id="missions-completed-count" class="mission-count">0/0</div>
                        </div>
                    </div>
                    <div class="mission-card mission-today">
                        <div class="mission-icon"><i class='bx bx-calendar-check'></i></div>
                        <div class="mission-info">
                            <h3>Missões Para Hoje</h3>
                            <div id="missions-today-count" class="mission-count">0/0</div>
                        </div>
                    </div>
                    <div class="mission-card mission-tomorrow">
                        <div class="mission-icon"><i class='bx bx-time'></i></div>
                        <div class="mission-info">
                            <h3>Missões Para Amanhã</h3>
                            <div id="missions-tomorrow-count" class="mission-count">0/0</div>
                        </div>
                    </div>
                    <div class="overall-progress">
                        <div id="progress-circle-container" class="progress-circle">
                            <svg class="progress-ring" width="80" height="80">
                                <circle class="progress-ring-circle" cx="40" cy="40" r="30" fill="transparent" stroke="#e9ecef" stroke-width="6"></circle>
                            </svg>
                            <div class="progress-text">
                                <span id="overall-progress" class="progress-percentage">0%</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            
            <section class="flow-detailed-progress-section">
                <div class="detailed-progress-header">
                    <h2>Progresso Detalhado das Missões</h2>
                    <p>Acompanhe o progresso de cada categoria de missão</p>
                </div>
                <div id="detailed-progress-content" class="detailed-progress-content">
                    <!-- Gerado dinamicamente pelo JavaScript -->
                </div>
            </section>
            
            <section class="flow-matrix-section">
                <div class="matrix-grid">
                    <div class="matrix-quadrant quadrant-urgent-important">
                        <div class="quadrant-header">
                            <h3>Urgente e Importante</h3>
                            <p>Isso faz o ponteiro girar!</p>
                        </div>
                        <div id="urgent-important-tasks" class="quadrant-tasks"></div>
                    </div>
                    <div class="matrix-quadrant quadrant-not-urgent-important">
                        <div class="quadrant-header">
                            <h3>Não Urgente e Importante</h3>
                            <p>Não deixe de fazer, agende um momento e execute</p>
                        </div>
                        <div id="not-urgent-important-tasks" class="quadrant-tasks"></div>
                    </div>
                    <div class="matrix-quadrant quadrant-urgent-not-important">
                        <div class="quadrant-header">
                            <h3>Urgente e Não Importante</h3>
                            <p>Delegue ou elimine</p>
                        </div>
                        <div id="urgent-not-important-tasks" class="quadrant-tasks"></div>
                    </div>
                    <div class="matrix-quadrant quadrant-not-urgent-not-important">
                        <div class="quadrant-header">
                            <h3>Não Urgente e Não Importante</h3>
                            <p>Elimine ou faça nos tempos livres</p>
                        </div>
                        <div id="not-urgent-not-important-tasks" class="quadrant-tasks"></div>
                    </div>
                </div>
            </section>
            
            <section class="flow-tasks-section">
                <div class="tasks-header">
                    <button id="toggle-tasks-btn" class="toggle-tasks-btn">
                        <span>Exibir Tarefas (0)</span>
                        <i class='bx bx-chevron-down'></i>
                    </button>
                    <div class="tasks-filters">
                        <select id="filter-priority" class="form-select-sm">
                            <option value="">Toda Prioridade</option>
                            <option value="urgent-important">Urgente/Importante</option>
                            <option value="not-urgent-important">Não Urgente/Importante</option>
                            <option value="urgent-not-important">Urgente/Não Importante</option>
                            <option value="not-urgent-not-important">Não Urgente/Não Importante</option>
                        </select>
                        <select id="filter-status" class="form-select-sm">
                            <option value="">Todo Status</option>
                            <option value="pending">Pendente</option>
                            <option value="completed">Concluída</option>
                        </select>
                        <button id="filter-btn" class="btn-sm btn-primary-sm">Filtrar</button>
                    </div>
                    <div class="tasks-actions">
                        <button id="add-task-list-btn" class="add-task-btn"><i class='bx bx-plus'></i> Adicionar Tarefa</button>
                        <button id="clear-completed-btn" class="clear-completed-btn"><i class='bx bx-trash'></i> Limpar Concluídas</button>
                    </div>
                </div>
                <div id="tasks-table-container" class="tasks-table-container" style="display: none;">
                    <table class="tasks-table">
                        <thead>
                            <tr>
                                <th class="sortable" data-column="title">Tarefa <i class='bx bxs-sort-alt'></i></th>
                                <th class="sortable" data-column="priority">Prioridade <i class='bx bxs-sort-alt'></i></th>
                                <th class="sortable" data-column="time">Tempo Estimado <i class='bx bxs-sort-alt'></i></th>
                                <th>KR Vinculado</th>
                                <th class="sortable" data-column="date">Data de Entrega <i class='bx bxs-sort-alt'></i></th>
                                <th class="sortable" data-column="status">Status <i class='bx bxs-sort-alt'></i></th>
                                <th>Ações</th>
                            </tr>
                        </thead>
                        <tbody id="tasks-table-body"></tbody>
                    </table>
                </div>
            </section>
            
            <button id="add-task-btn" class="floating-add-btn" title="Adicionar Nova Tarefa"><i class='bx bx-plus'></i></button>
        </div>
    </div>
</div>

<!-- MODAIS -->
<div id="timer-config-modal" class="modal">
    <div class="modal-content modal-small">
        <div class="modal-header">
            <h3 class="modal-title">Configurar Timer</h3>
            <button class="modal-close"><i class='bx bx-x'></i></button>
        </div>
        <div class="modal-body">
            <div class="form-group">
                <label for="timer-minutes">Minutos (1-25):</label>
                <input type="number" id="timer-minutes" min="1" max="25" value="25" class="form-input">
            </div>
        </div>
        <div class="modal-footer">
            <button type="button" class="btn btn-secondary">Cancelar</button>
            <button class="btn btn-primary">Confirmar</button>
        </div>
    </div>
</div>

<div id="add-task-modal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Adicionar Nova Tarefa</h3>
            <button class="modal-close"><i class='bx bx-x'></i></button>
        </div>
        <form id="add-task-form" novalidate>
            <div class="modal-body">
                <div class="form-group">
                    <label for="task-title">Título da Tarefa *</label>
                    <input type="text" id="task-title" name="taskTitle" class="form-input" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="task-priority">Prioridade *</label>
                        <select id="task-priority" name="taskPriority" class="form-select" required>
                            <option value="" disabled selected>Selecione...</option>
                            <option value="urgent-important">Urgente e Importante</option>
                            <option value="not-urgent-important">Não Urgente e Importante</option>
                            <option value="urgent-not-important">Urgente e Não Importante</option>
                            <option value="not-urgent-not-important">Não Urgente e Não Importante</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-time">Tempo Estimado</label>
                        <select id="task-time" name="taskTime" class="form-select">
                            <option value="15 min">15 minutos</option>
                            <option value="30 min">30 minutos</option>
                            <option value="1h">1 hora</option>
                            <option value="2h">2 horas</option>
                            <option value="4h">4 horas</option>
                            <option value="1 dia">1 dia</option>
                        </select>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="task-kr">KR Vinculado</label>
                        <select id="task-kr" name="taskKr" class="form-select">
                            <option value="">Nenhum</option>
                            <option value="KR1">KR 1 - Exemplo</option>
                            <option value="KR2">KR 2 - Exemplo</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="task-date">Data de Entrega *</label>
                        <input type="date" id="task-date" name="taskDate" class="form-input" required>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Tarefa</button>
            </div>
        </form>
    </div>
</div>

<?php include 'components/_scripts.php'; ?>
<script src="https://cdnjs.cloudflare.com/ajax/libs/howler/2.2.4/howler.min.js"></script>
</body>
</html>


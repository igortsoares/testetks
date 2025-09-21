<?php
/* ================================================================ */
/* Arquivo: agenda.php                                              */
/* Descrição: Página do novo módulo "Minha Agenda".                 */
/* Versão: 1.4                                                      */
/* Atualizado em: 19/09/2025 às 18:55                               */
/* ================================================================ */

// Define variáveis para o header
$headerTitle = 'Minha Agenda';
$bodyId = 'agenda-page';

include 'components/_head.php';
?>

<body id="<?php echo $bodyId; ?>">

<div class="main-layout">
    <?php include 'components/_sidebar.php'; ?>
    
    <div class="main-content">
        <?php include 'components/_header.php'; ?>
        
        <div class="page-content">
            
            <!-- Seção 2.1: Cabeçalho -->
            <section class="agenda-header-section">
                <p>Um espaço dedicado para você organizar os seus horários</p>
            </section>
            
            <!-- Seção 2.2: Conexão Google Agenda -->
            <section class="google-connect-section">
                <div class="google-connect-box">
                    <div class="connect-info">
                        <img src="https://upload.wikimedia.org/wikipedia/commons/a/a5/Google_Calendar_icon_%282020%29.svg" alt="Ícone Google Agenda" class="google-icon">
                        <button class="btn btn-primary"><i class='bx bx-link-alt'></i> Conectar com Google Agenda</button>
                    </div>
                    <div class="legend">
                        <span><i class='bx bxs-circle' style='color: var(--success-color);'></i> Confirmado</span>
                        <span><i class='bx bxs-circle' style='color: var(--warning-color);'></i> Aguardando Confirmação</span>
                        <span><i class='bx bxs-circle' style='color: var(--danger-color);'></i> Cancelado</span>
                        <button id="add-event-header-btn" class="add-event-btn-header"><i class='bx bx-plus'></i> Adicionar Agenda</button>
                    </div>
                </div>
            </section>
            
            <div class="agenda-main-grid">
                <div class="agenda-left-column">
                    <!-- Seção 2.3: Calendário do Mês -->
                    <section class="calendar-month-section">
                        <div class="calendar-header">
                            <h3 id="calendar-month-year">Setembro 2025</h3>
                            <div class="calendar-nav">
                                <button id="prev-month" title="Mês Anterior"><i class='bx bx-chevron-left'></i></button>
                                <button id="next-month" title="Próximo Mês"><i class='bx bx-chevron-right'></i></button>
                            </div>
                        </div>
                        <div class="calendar-grid">
                            <div class="day-name">Seg</div>
                            <div class="day-name">Ter</div>
                            <div class="day-name">Qua</div>
                            <div class="day-name">Qui</div>
                            <div class="day-name">Sex</div>
                            <div class="day-name">Sab</div>
                            <div class="day-name">Dom</div>
                        </div>
                        <div id="calendar-days" class="calendar-days">
                            <!-- Dias serão gerados dinamicamente pelo JavaScript -->
                        </div>
                    </section>
                    
                    <!-- Seção 2.4: Calendário do Dia -->
                    <section id="day-schedule-section" class="today-schedule-section">
                        <h4 id="day-schedule-title">HOJE</h4>
                        <p id="day-schedule-date-string">Terça Feira, 19 de Setembro</p>
                        <div id="day-event-list" class="event-list">
                            <!-- Eventos do dia serão gerados pelo JS -->
                        </div>
                    </section>
                </div>
                
                <div class="agenda-right-column">
                    <!-- Seção 2.5: Tarefas de Hoje -->
                    <section class="today-tasks-section">
                        <div class="tasks-header-agenda">
                            <h4>Tarefas de Hoje</h4>
                            <button class="icon-btn" title="Atualizar tarefas"><i class='bx bx-refresh'></i></button>
                        </div>
                        <div id="today-tasks-list" class="tasks-list">
                           <!-- Tarefas do dia serão geradas pelo JS -->
                        </div>
                    </section>
                    
                    <!-- Seção 2.6: Agenda da Semana -->
                    <section class="week-schedule-section">
                        <div class="week-schedule-header">
                            <h4>Agenda da Semana</h4>
                            <div class="calendar-nav">
                                <button id="prev-week" title="Semana Anterior"><i class='bx bx-chevron-left'></i></button>
                                <button id="next-week" title="Próxima Semana"><i class='bx bx-chevron-right'></i></button>
                            </div>
                        </div>
                        <div id="week-schedule-content">
                            <!-- Agenda da semana será gerada pelo JS -->
                        </div>
                    </section>
                </div>
            </div>

            <button id="add-event-float-btn" class="floating-add-btn" title="Adicionar Novo Evento"><i class='bx bx-plus'></i></button>
        </div>
    </div>
</div>

<!-- Modal para Adicionar Evento -->
<div id="add-event-modal" class="modal">
    <div class="modal-content">
        <div class="modal-header">
            <h3 class="modal-title">Adicionar Agenda</h3>
            <button class="modal-close"><i class='bx bx-x'></i></button>
        </div>
        <form id="add-event-form" novalidate>
            <div class="modal-body">
                <div class="form-group">
                    <label for="event-title">Título da Agenda *</label>
                    <input type="text" id="event-title" name="eventTitle" class="form-input" required>
                </div>
                <div class="form-group">
                    <label for="event-date">Data da Agenda *</label>
                    <input type="date" id="event-date" name="eventDate" class="form-input" required>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="event-start-time">Horário de Início *</label>
                        <input type="time" id="event-start-time" name="eventStartTime" class="form-input" required>
                    </div>
                    <div class="form-group">
                        <label for="event-end-time">Horário de Encerramento *</label>
                        <input type="time" id="event-end-time" name="eventEndTime" class="form-input" required>
                    </div>
                </div>
                <div class="form-row">
                    <div class="form-group">
                        <label for="event-type">Tipo *</label>
                        <select id="event-type" name="eventType" class="form-select" required>
                            <option value="Presencial">Presencial</option>
                            <option value="Online">Online</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="event-status">Status *</label>
                        <select id="event-status" name="eventStatus" class="form-select" required>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Aguardando">Aguardando Confirmação</option>
                            <option value="Cancelado">Cancelado</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-secondary">Cancelar</button>
                <button type="submit" class="btn btn-primary">Salvar Agenda</button>
            </div>
        </form>
    </div>
</div>


<?php include 'components/_scripts.php'; ?>
</body>
</html>


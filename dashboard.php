<?php
    // Futuramente, aqui poderemos adicionar verificações de segurança,
    // como garantir que o usuário está logado antes de carregar a página.
?>
<!DOCTYPE html>
<html lang="pt-BR">

<?php
    $pageTitle = "Dashboard - Central de OKRs";
    $bodyId = "dashboard-page";
    $headerTitle = "Central de OKRs"; // Título para o cabeçalho
?>

<?php include 'components/_head.php'; ?>

<body id="<?php echo $bodyId; ?>">
    <div class="sidebar-overlay" id="sidebar-overlay"></div>

    <div class="dashboard-container">
        
        <?php include 'components/_sidebar.php'; ?>

        <main class="main-content">
            <?php include 'components/_header.php'; ?>

            <div class="content-area">
                <!-- Seção de Filtros e KPIs -->
                <section class="filters-and-kpis">
                    <div class="period-filters">
                        <label>Selecione o período que você quer visualizar:</label>
                        <div class="filter-buttons">
                            <select class="year-select">
                                <option value="2025">2025</option>
                                <option value="2024">2024</option>
                                <option value="2023">2023</option>
                            </select>
                            <button class="period-btn" data-period="q1">1º Trimestre</button>
                            <button class="period-btn" data-period="q2">2º Trimestre</button>
                            <button class="period-btn" data-period="q3">3º Trimestre</button>
                            <button class="period-btn active" data-period="q4">4º Trimestre</button>
                        </div>
                    </div>
                    
                    <!-- Grid de KPIs -->
                    <div class="kpi-cards-grid">
                        <div class="kpi-card">
                            <i class='bx bx-line-chart'></i>
                            <div>
                                <span>MRR Conquistado</span>
                                <strong>+R$4.500,00</strong>
                            </div>
                        </div>
                        <div class="kpi-card">
                            <i class='bx bx-user-plus'></i>
                            <div>
                                <span>Novos Assinantes B2C</span>
                                <strong>37</strong>
                            </div>
                        </div>
                        <div class="kpi-card">
                            <i class='bx bxs-business'></i>
                            <div>
                                <span>Novos Clientes B2B</span>
                                <strong>2</strong>
                            </div>
                        </div>
                        <div class="kpi-card">
                            <i class='bx bxs-trophy'></i>
                            <div>
                                <span>Objetivos Concluídos</span>
                                <strong id="kpi-objetivos-concluidos">0/0</strong>
                            </div>
                        </div>
                    </div>
                </section>

                <!-- Seção Principal dos OKRs -->
                <section class="okr-main-list">
                    <div class="okr-list-header">
                        <div class="area-selector">
                            <button class="area-selector-btn" id="area-selector-btn">
                                <span id="selected-area-name">Governança</span>
                                <i class='bx bx-chevron-down'></i>
                            </button>
                            <div class="area-dropdown" id="area-dropdown">
                                <a href="#" data-area="Vendas">Vendas</a>
                                <a href="#" data-area="Marketing">Marketing</a>
                                <a href="#" data-area="Financeiro">Financeiro</a>
                                <a href="#" data-area="Produto">Produto</a>
                                <a href="#" data-area="Tecnologia">Tecnologia</a>
                                <a href="#" data-area="Governança">Governança</a>
                                <a href="#" data-area="Customer Success">Customer Success</a>
                            </div>
                        </div>
                        <h2>Acompanhamento dos Objetivos e KRs</h2>
                        <button class="primary-action-btn" type="button">
                            <i class='bx bx-plus'></i> Adicionar Objetivo
                        </button>
                    </div>
                    
                    <!-- Lista de Objetivos será inserida aqui dinamicamente via JavaScript -->
                    
                </section>
            </div>
        </main>
    </div>

    <!-- Inclui os modais -->
    <?php include 'components/_modals.php'; ?>
    
    <!-- Inclui os scripts -->
    <?php include 'components/_scripts.php'; ?>

</body>
</html>


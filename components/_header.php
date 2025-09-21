<header class="main-header">
    <button class="icon-btn" id="menu-toggle"><i class='bx bx-menu'></i></button>
    
    <div class="header-title">
        <button class="icon-btn" id="sidebar-toggle-btn">
            <i class='bx bx-menu-alt-left'></i>
        </button>

        <!-- [MUDANÇA] Agora o H1 usa a variável PHP -->
        <h1><?php echo isset($headerTitle) ? $headerTitle : 'Dashboard'; ?></h1>

        <!-- [MUDANÇA] O dropdown só aparece se a página for o dashboard de OKRs -->
        <?php if (isset($bodyId) && $bodyId === 'dashboard-page'): ?>
            <div class="department-selector" id="department-selector">
                <span id="selected-department">Vendas</span><i class='bx bx-chevron-down'></i>
                <ul class="department-dropdown" id="department-dropdown">
                    <li>Vendas</li>
                    <li>Marketing</li>
                    <li>Produto</li>
                    <li>Tecnologia</li>
                    <li>Governança</li>
                    <li>Sucesso do Cliente</li>
                </ul>
            </div>
        <?php endif; ?>
    </div>

    <div class="theme-switcher">
        <button class="icon-btn" id="theme-toggle-btn">
            <i class='bx bx-sun'></i>
        </button>
    </div>

    <div class="header-user-info">
        <span class="greeting">Bom trabalho, Igor!</span>
        <span class="date" id="current-date"></span>
    </div>
</header>

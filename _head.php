<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title><?php echo isset($pageTitle) ? $pageTitle : 'Dashboard - TKS Vantagens'; ?></title>
    
    <!-- CSS Principal -->
    <link rel="stylesheet" href="css/main.css?v=8.0">
    <link rel="stylesheet" href="css/flow.css?v=3.5">
    <!-- [NOVO] Adicionado o CSS do módulo Agenda -->
    <link rel="stylesheet" href="css/agenda.css?v=1.0">
    
    <!-- Ícones Boxicons -->
    <link href='https://unpkg.com/boxicons@2.1.4/css/boxicons.min.css' rel='stylesheet'>
    
    <!-- Flatpickr para seleção de datas -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/flatpickr/dist/flatpickr.min.css">
    <script src="https://cdn.jsdelivr.net/npm/flatpickr"></script>
    <script src="https://npmcdn.com/flatpickr/dist/l10n/pt.js"></script>
    
    <!-- Meta tags para SEO e compartilhamento -->
    <meta name="description" content="Dashboard de OKRs - Sistema de gestão de objetivos e resultados-chave">
    <meta name="author" content="TKS Vantagens">
    
    <!-- Favicon -->
    <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
    
    <!-- Preload de fontes importantes -->
    <link rel="preload" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" as="style">
    
    <!-- Configurações de tema -->
    <script>
        // Aplica tema salvo antes do carregamento da página para evitar flash
        (function() {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme === 'dark') {
                document.documentElement.classList.add('dark-mode');
            }
        })();
    </script>
</head>

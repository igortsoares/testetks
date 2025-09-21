<!-- Scripts externos necessários -->
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>

<!-- Script principal da aplicação -->
<script src="js/main.js?v=8.0" type="module"></script>

<!-- Script para renderização de gráficos -->
<script>
/**
 * Função para renderizar gráficos de rosca (doughnut charts)
 * Utiliza Chart.js para criar gráficos responsivos
 */
function renderDoughnutChart(canvasId, progress) {
    const canvas = document.getElementById(canvasId);
    if (!canvas) {
        console.warn(`Canvas com ID ${canvasId} não encontrado`);
        return;
    }

    // Destrói gráfico existente se houver
    if (canvas.chart) {
        canvas.chart.destroy();
    }

    const ctx = canvas.getContext('2d');
    const isDarkMode = document.body.classList.contains('dark-mode');
    
    // Cores baseadas no tema
    const colors = {
        primary: isDarkMode ? '#8338ec' : '#8338ec',
        background: isDarkMode ? '#374151' : '#e2e8f0',
        text: isDarkMode ? '#f9fafb' : '#1e293b'
    };

    // Configuração do gráfico
    const config = {
        type: 'doughnut',
        data: {
            datasets: [{
                data: [progress, 100 - progress],
                backgroundColor: [colors.primary, colors.background],
                borderWidth: 0,
                cutout: '70%'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    enabled: false
                }
            },
            animation: {
                animateRotate: true,
                duration: 1000
            }
        }
    };

    // Cria o gráfico
    canvas.chart = new Chart(ctx, config);
    
    // Atualiza o texto central
    const centerText = canvas.parentElement.querySelector('.chart-center-text');
    if (centerText) {
        centerText.textContent = `${progress}%`;
    }
}

// Disponibiliza a função globalmente
window.renderDoughnutChart = renderDoughnutChart;
</script>


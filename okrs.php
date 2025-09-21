<?php
// Arquivo: /api/okrs.php
// Descrição: Endpoint principal para todas as operações relacionadas a OKRs.

// Inclui nosso arquivo de configuração para ter acesso às credenciais e funções.
require_once 'config.php';

// Pega o método da requisição (GET, POST, etc.)
$method = $_SERVER['REQUEST_METHOD'];

// --- ROTEAMENTO DE REQUISIÇÕES ---
// Decide o que fazer com base no método HTTP.

if ($method === 'GET') {
    // Por enquanto, apenas busca todos os OKRs.
    handle_get_okrs();
} elseif ($method === 'POST') {
    // O corpo da requisição vem como JSON, então precisamos decodificá-lo.
    $input = json_decode(file_get_contents('php://input'), true);
    
    // Verificamos qual ação o POST quer executar.
    $action = $input['action'] ?? '';

    if ($action === 'create_objective') {
        handle_create_objective($input['data']);
    } else {
        send_response(false, 'Ação POST desconhecida.', 400);
    }
} else {
    // Se for um método não suportado (PUT, DELETE por enquanto)
    send_response(false, 'Método não suportado.', 405);
}


// --- FUNÇÕES DE MANIPULAÇÃO (HANDLERS) ---

/**
 * Lida com a busca de todos os OKRs.
 */
function handle_get_okrs() {
    // LÓGICA DE BANCO DE DADOS (a ser implementada)
    // Por enquanto, vamos apenas retornar uma mensagem de sucesso com dados de exemplo.
    
    $mock_data = [
        // No futuro, isso virá do Supabase.
    ];

    send_response(true, $mock_data);
}

/**
 * Lida com a criação de um novo objetivo.
 * @param array $data - Os dados do novo objetivo enviados pelo frontend.
 */
function handle_create_objective($data) {
    // Validação simples dos dados recebidos
    if (empty($data['title']) || empty($data['endDate'])) {
        send_response(false, 'Título e data final são obrigatórios.', 400);
        return;
    }

    // LÓGICA DE BANCO DE DADOS (a ser implementada)
    // Aqui, nós conectaríamos ao Supabase e inseriríamos o novo objetivo.
    
    // Por enquanto, vamos simular a criação e retornar o objeto com um novo ID.
    $new_objective = [
        'id' => rand(100, 999), // Simula um ID gerado pelo banco
        'title' => $data['title'],
        'end_date' => $data['endDate'],
        'created_at' => date('Y-m-d H:i:s')
    ];

    send_response(true, $new_objective, 201); // 201 = Created
}
?>

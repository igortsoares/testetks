<?php
// Arquivo: /api/config.php
// Descrição: Armazena as credenciais e configurações globais da API.

// --- CREDENCIAIS DO SUPABASE ---
// Substitua 'SUA_URL_DO_SUPABASE' e 'SUA_CHAVE_ANON_PUBLICA' pelos seus valores reais.
define('SUPABASE_URL', 'SUA_URL_DO_SUPABASE');
define('SUPABASE_KEY', 'SUA_CHAVE_ANON_PUBLICA');

// --- CABEÇALHOS PADRÃO ---
// Define que a resposta da nossa API será sempre em formato JSON.
header('Content-Type: application/json');

/**
 * Função auxiliar para enviar uma resposta JSON padronizada e encerrar o script.
 * @param bool $success - True se a operação foi um sucesso, false caso contrário.
 * @param mixed $data - Os dados a serem enviados (em caso de sucesso) ou a mensagem de erro.
 * @param int $statusCode - O código de status HTTP (200 para sucesso, 400, 500 para erros, etc.).
 */
function send_response($success, $data, $statusCode = 200) {
    http_response_code($statusCode );
    echo json_encode([
        'success' => $success,
        'data' => $data
    ]);
    exit;
}
?>

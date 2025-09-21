<?php
// Arquivo: /backoffice/api/auth.php
// Objetivo: Receber um email e senha, tentar autenticar no Supabase e retornar se foi sucesso ou falha.

// =================================================================================================
// INSTRUÇÃO 1: CONFIGURAÇÃO DE SEGURANÇA E AMBIENTE
// =================================================================================================

// Define que a resposta deste arquivo será no formato JSON.
// O JSON é um formato de texto leve que o JavaScript consegue entender facilmente.
header('Content-Type: application/json');

// Define as credenciais do Supabase.
// IMPORTANTE: Substitua os valores abaixo pelos do seu projeto Supabase.
// Você encontra isso em: Project Settings -> API no painel do Supabase.
$supabaseUrl = "https://ekevwyikqtyxiblygkxb.supabase.co"; // Cole aqui a URL do seu projeto.
$supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVrZXZ3eWlrcXR5eGlibHlna3hiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NjgxMzIzOCwiZXhwIjoyMDYyMzg5MjM4fQ.mZUU8VCAJS0Jmt8jDBsYDTB9zGTFUO7UmUIriMYaYHE"; // Cole aqui a sua chave "service_role". É a chave secreta.

// =================================================================================================
// INSTRUÇÃO 2: RECEBIMENTO DOS DADOS DO FORMULÁRIO DE LOGIN
// =================================================================================================

// O PHP recebe os dados enviados pelo JavaScript através de uma variável especial chamada `$_POST`.
// No entanto, quando os dados são enviados como JSON, precisamos ler o "corpo" da requisição.
$json_data = file_get_contents('php://input');

// Decodifica a string JSON para um objeto PHP, para que possamos acessar os dados.
$data = json_decode($json_data);

// Pega o email e a senha que foram enviados.
// Usamos o operador '??' para definir um valor padrão (string vazia) caso não venham, evitando erros.
$email = $data->email ?? '';
$password = $data->password ?? '';

// =================================================================================================
// INSTRUÇÃO 3: COMUNICAÇÃO COM O SUPABASE PARA AUTENTICAR
// =================================================================================================

// Monta a URL específica para a autenticação de usuário com senha no Supabase.
// Esta é a URL padrão do Supabase para essa funcionalidade.
$authUrl = $supabaseUrl . '/auth/v1/token?grant_type=password';

// Prepara os dados que serão enviados para o Supabase no formato que ele espera (JSON).
$postData = json_encode([
    'email' => $email,
    'password' => $password
]);

// Inicia o cURL, que é a ferramenta do PHP para fazer requisições a outras URLs (como a do Supabase).
$ch = curl_init($authUrl);

// Configura a requisição cURL:
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // Diz para o cURL retornar a resposta como uma string, em vez de imprimi-la.
curl_setopt($ch, CURLOPT_POST, true); // Define o método da requisição como POST (para enviar dados).
curl_setopt($ch, CURLOPT_POSTFIELDS, $postData); // Anexa os dados (email/senha) à requisição.
curl_setopt($ch, CURLOPT_HTTPHEADER, [ // Define os cabeçalhos da requisição.
    'Content-Type: application/json', // Informa que estamos enviando dados em formato JSON.
    'apikey: ' . $supabaseKey // Envia a chave de API para autorizar nossa requisição no Supabase.
]);

// Executa a requisição e armazena a resposta do Supabase na variável $response.
$response = curl_exec($ch);

// Fecha a sessão cURL para liberar recursos do servidor.
curl_close($ch);

// =================================================================================================
// INSTRUÇÃO 4: PROCESSAMENTO DA RESPOSTA E ENVIO PARA O FRONT-END
// =================================================================================================

// Decodifica a resposta JSON do Supabase para um objeto PHP.
$responseData = json_decode($response);

// Verifica se a autenticação foi bem-sucedida.
// O Supabase retorna um objeto 'user' quando o login está correto.
if (isset($responseData->user)) {
    // Se o login deu certo:
    // Prepara uma resposta de sucesso para o nosso front-end.
    $finalResponse = [
        'success' => true,
        'message' => 'Login realizado com sucesso!'
        // Futuramente, podemos iniciar uma sessão PHP aqui para manter o usuário logado.
    ];
    // Define o código de status HTTP como 200 (OK).
    http_response_code(200 );
} else {
    // Se o login deu errado:
    // O Supabase retorna um objeto 'error_description' com a mensagem de erro.
    $errorMessage = $responseData->error_description ?? 'E-mail ou senha inválidos.';
    
    // Prepara uma resposta de falha para o nosso front-end.
    $finalResponse = [
        'success' => false,
        'message' => $errorMessage
    ];
    // Define o código de status HTTP como 401 (Não Autorizado).
    http_response_code(401 );
}

// Converte a nossa resposta final em JSON e a imprime.
// É isso que o JavaScript no navegador vai receber.
echo json_encode($finalResponse);

?>

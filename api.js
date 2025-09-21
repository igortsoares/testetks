/* ================================================================ */
/* Arquivo: /js/api.js                                              */
/* Descrição: Módulo central para todas as comunicações com a API   */
/*            backend (PHP). Abstrai o uso do 'fetch'.            */
/* ================================================================ */

// URL base da nossa API. No futuro, apontará para nossos scripts PHP.
const API_BASE_URL = 'api/'; // Ex: api/okrs.php

/**
 * Função genérica para fazer requisições à nossa API.
 * @param {string} endpoint - O script PHP a ser chamado (ex: 'okrs.php').
 * @param {string} method - O método HTTP ('GET', 'POST', 'DELETE', etc.).
 * @param {object} [body=null] - O corpo da requisição para POST/PUT.
 * @returns {Promise<any>} - A resposta da API em formato JSON.
 */
async function request(endpoint, method, body = null) {
    const options = {
        method: method,
        headers: {
            'Content-Type': 'application/json'
        }
    };

    if (body) {
        options.body = JSON.stringify(body);
    }

    try {
        console.log(`[API Request] -> ${method} ${API_BASE_URL}${endpoint}`, body || '');

        const response = await fetch(API_BASE_URL + endpoint, options);

        if (!response.ok) {
            // Se a resposta não for bem-sucedida, tenta ler o corpo do erro como JSON
            const errorData = await response.json().catch(() => null);
            const errorMessage = errorData?.data || `HTTP error! Status: ${response.status}`;
            throw new Error(errorMessage);
        }

        const result = await response.json();
        console.log(`[API Response] <-`, result);
        return result;

    } catch (error) {
        console.error('API Request Error:', error.message);
        // No futuro, podemos mostrar um modal de erro aqui.
        return { success: false, error: error.message };
    }
}

// --- Funções exportadas para o resto da aplicação ---

export const api = {
    /**
     * Busca todos os OKRs (Objetivos, KRs e Tarefas) do banco de dados.
     * @returns {Promise<object>} Resposta da API com os dados dos OKRs
     */
    fetchOKRs: () => {
        return request('okrs.php', 'GET');
    },

    /**
     * Cria um novo Objetivo.
     * @param {object} objectiveData - Dados do objetivo.
     * @returns {Promise<object>} Resposta da API
     */
    createObjective: (objectiveData) => {
        return request('okrs.php', 'POST', { action: 'create_objective', data: objectiveData });
    },

    /**
     * Atualiza um objetivo existente.
     * @param {number} objectiveId - ID do objetivo a ser atualizado.
     * @param {object} objectiveData - Novos dados do objetivo.
     * @returns {Promise<object>} Resposta da API
     */
    updateObjective: (objectiveId, objectiveData) => {
        return request('okrs.php', 'PUT', { action: 'update_objective', id: objectiveId, data: objectiveData });
    },

    /**
     * Deleta um objetivo.
     * @param {number} objectiveId - ID do objetivo a ser deletado.
     * @returns {Promise<object>} Resposta da API
     */
    deleteObjective: (objectiveId) => {
        return request('okrs.php', 'DELETE', { action: 'delete_objective', id: objectiveId });
    },

    /**
     * Cria um novo Key Result.
     * @param {number} objectiveId - ID do objetivo pai.
     * @param {object} krData - Dados do KR.
     * @returns {Promise<object>} Resposta da API
     */
    createKR: (objectiveId, krData) => {
        return request('okrs.php', 'POST', { action: 'create_kr', objective_id: objectiveId, data: krData });
    },

    /**
     * Atualiza um Key Result existente.
     * @param {number} krId - ID do KR a ser atualizado.
     * @param {object} krData - Novos dados do KR.
     * @returns {Promise<object>} Resposta da API
     */
    updateKR: (krId, krData) => {
        return request('okrs.php', 'PUT', { action: 'update_kr', id: krId, data: krData });
    },

    /**
     * Deleta um Key Result.
     * @param {number} krId - ID do KR a ser deletado.
     * @returns {Promise<object>} Resposta da API
     */
    deleteKR: (krId) => {
        return request('okrs.php', 'DELETE', { action: 'delete_kr', id: krId });
    },

    /**
     * Cria uma nova tarefa/checkpoint.
     * @param {number} krId - ID do KR pai.
     * @param {object} taskData - Dados da tarefa.
     * @returns {Promise<object>} Resposta da API
     */
    createTask: (krId, taskData) => {
        return request('okrs.php', 'POST', { action: 'create_task', kr_id: krId, data: taskData });
    },

    /**
     * Atualiza uma tarefa existente.
     * @param {number} taskId - ID da tarefa a ser atualizada.
     * @param {object} taskData - Novos dados da tarefa.
     * @returns {Promise<object>} Resposta da API
     */
    updateTask: (taskId, taskData) => {
        return request('okrs.php', 'PUT', { action: 'update_task', id: taskId, data: taskData });
    },

    /**
     * Deleta uma tarefa.
     * @param {number} taskId - ID da tarefa a ser deletada.
     * @returns {Promise<object>} Resposta da API
     */
    deleteTask: (taskId) => {
        return request('okrs.php', 'DELETE', { action: 'delete_task', id: taskId });
    },

    /**
     * Busca estatísticas gerais dos OKRs.
     * @returns {Promise<object>} Resposta da API com estatísticas
     */
    getStats: () => {
        return request('stats.php', 'GET');
    }
};

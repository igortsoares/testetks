/* ================================================================ */
/* Arquivo: /js/main.js                                             */
/* Descrição: Ponto de entrada principal do JavaScript.             */
/* Versão: 1.1                                                      */
/* Atualizado em: 19/09/2025 às 16:39                               */
/* ================================================================ */

import { initUI } from './modules/ui.js';
import { initOKRs } from './modules/okrs.js';
import { api } from './modules/api.js';
import { initFlow } from './modules/flow.js';
// [NOVO] Importa a função de inicialização do módulo Agenda
import { initAgenda } from './modules/agenda.js';

// Disponibiliza a API globalmente para fins de depuração no console.
window.api = api;

// Executa o código quando o DOM estiver totalmente carregado
document.addEventListener('DOMContentLoaded', () => {
    console.log('Inicializando aplicação...');
    
    // Inicializa os módulos na ordem correta
    initUI();
    initOKRs();
    initFlow();
    // [NOVO] Chama a função de inicialização do módulo Agenda
    initAgenda();
    
    console.log('Aplicação inicializada com sucesso!');
});

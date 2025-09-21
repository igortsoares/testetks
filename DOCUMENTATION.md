# Playbook do Projeto: Backoffice TKS Vantagens
**Versão do Documento:** 1.0
**Data da Última Atualização:** 17 de Setembro de 2025

## 1. Visão Geral do Projeto

### 1.1. Propósito
O projeto "Backoffice TKS Vantagens" é uma plataforma de gestão interna (Software as a Service - SaaS) projetada para centralizar e otimizar as operações da empresa. O sistema é modular, permitindo a adição de novas ferramentas de gestão de forma escalável e integrada.

O primeiro módulo desenvolvido é a **Central de OKRs (Objectives and Key Results)**, uma ferramenta completa para criação, acompanhamento e gestão de metas da equipe.

### 1.2. Stack de Tecnologias
A aplicação foi construída com uma abordagem de renderização no servidor (Server-Side Rendering - SSR) utilizando tecnologias web fundamentais, focando em robustez, manutenibilidade e performance.

- **Frontend:** HTML5, CSS3, JavaScript (ES6 Modules)
- **Backend:** PHP
- **Banco de Dados (Planejado):** Supabase (PostgreSQL)
- **Bibliotecas Externas:**
  - **Chart.js:** Para a renderização dos gráficos de progresso (doughnut charts).
  - **Flatpickr:** Para a seleção de datas (calendário pop-up).
  - **BoxIcons:** Para a suíte de ícones utilizada em toda a interface.

## 2. Arquitetura do Código

A arquitetura do projeto foi refatorada para seguir os padrões modernos da indústria, focando em **Modularidade**, **Componentização** e no princípio **DRY (Don't Repeat Yourself)**.

A estrutura de pastas principal dentro de `/backoffice` é a seguinte:

/backoffice
├── api/
├── assets/
├── components/
├── css/
│   ├── components/
│   └── pages/
├── js/
│   ├── lib/
│   └── modules/
├── dashboard.php
├── index.php (Login - a ser criado)
└── DOCUMENTATION.md (este arquivo)


### 2.1. Estrutura de Pastas Detalhada

- **`/api`**: Contém todos os scripts PHP que funcionam como o backend da aplicação. É a única camada que se comunicará com o banco de dados.
  - `config.php`: Arquivo crítico que armazena credenciais (como as chaves do Supabase) e funções auxiliares globais. **Este arquivo nunca deve ser acessível publicamente.**
  - `okrs.php`: Endpoint que lida com todas as requisições (GET, POST, etc.) relacionadas aos OKRs.

- **`/assets`**: Armazena todos os ativos estáticos, como imagens (logos, ícones personalizados) e fontes.

- **`/components`**: Contém os "blocos de construção" reutilizáveis do layout, escritos em PHP.
  - `_head.php`: O `<head>` da página, importando todos os CSS e metadados.
  - `_sidebar.php`: A barra de navegação lateral.
  - `_header.php`: O cabeçalho superior.
  - `_modals.php`: O HTML de todos os pop-ups e modais.
  - `_scripts.php`: As tags `<script>` do final da página.

- **`/css`**: Organiza as folhas de estilo de forma modular.
  - `main.css`: Ponto de entrada principal. Define as variáveis globais de cor (para os temas claro e escuro) e importa todos os outros arquivos CSS. **É o único arquivo CSS linkado no HTML.**
  - `/components`: Estilos para componentes específicos e reutilizáveis (ex: `_sidebar.css`, `_modals.css`).
  - `/pages`: Estilos aplicados a páginas inteiras (ex: `dashboard.css`).

- **`/js`**: Organiza a lógica do frontend com Módulos ES6.
  - `main.js`: Ponto de entrada principal. **É o único arquivo JS linkado no HTML (`type="module"`)**. Ele importa e inicializa os outros módulos.
  - `api.js`: Camada de abstração de dados. Centraliza todas as chamadas `fetch` para a API PHP. Nenhum outro módulo JS deve fazer chamadas de rede diretas.
  - `/modules`: Contém a lógica de negócio dividida por responsabilidade.
    - `ui.js`: Controla a interface do usuário geral (menus, modais, tema, etc.).
    - `okrs.js`: Controla todas as funcionalidades específicas da Central de OKRs.

## 3. Funcionalidades Implementadas (Frontend)

Até a presente data, a "Central de OKRs" possui as seguintes funcionalidades 100% implementadas no frontend:

- **Gestão de Objetivos:**
  - Criação e exclusão de cards de Objetivos.
  - Edição in-loco (clicar para editar) do título e da data final (com calendário).
  - Renumeração automática e dinâmica dos objetivos.

- **Gestão de Key Results (KRs):**
  - Criação e exclusão de KRs dentro de um Objetivo.
  - Edição in-loco do título e dos valores (mínimo e máximo).
  - Slider de progresso interativo.
  - Seletor de ícone personalizado para cada KR.
  - Seletor de unidade de medida (Parâmetro) para a meta.

- **Gestão de Checkpoints (Tarefas):**
  - Criação e exclusão de tarefas dentro de um KR.
  - Marcar/desmarcar tarefas como concluídas.
  - Edição in-loco do texto da tarefa.
  - Reordenação das tarefas via arrastar e soltar (Drag and Drop).

- **Interface do Usuário (UI):**
  - **Modo Noturno (Dark Mode):** Com botão de alternância e persistência da preferência do usuário (`localStorage`).
  - **Menu Lateral Retrátil:** Permite expandir e recolher o menu para maximizar a área de conteúdo, com persistência do estado.
  - **Modais Personalizados:** Substituição dos alertas padrão do navegador (`confirm()`) por modais estilizados e consistentes com a identidade visual do projeto.
  - **Design Responsivo:** A interface se adapta a telas de desktop, tablet e mobile.

## 4. Próximos Passos (Roadmap)

1.  **Fase 2 (Backend):**
    - Conectar a API PHP ao Supabase para persistir todos os dados (Objetivos, KRs, Tarefas).
    - Implementar a lógica de `UPDATE` e `DELETE` nos endpoints da API.
    - Adicionar regras de segurança (`.htaccess`) para proteger a pasta `/api`.

2.  **Fase 3 (Autenticação):**
    - Criar as páginas de Login (`index.php`) e Cadastro.
    - Integrar a autenticação de usuários do Supabase.
    - Proteger a `dashboard.php` para que apenas usuários logados possam acessá-la, usando sessões PHP.

3.  **Fases Futuras:**
    - Desenvolvimento de novos módulos (ex: Gestão Financeira) seguindo a arquitetura estabelecida.
    - Criação de um painel de administração de usuários.

Este documento serve como uma fonte central de verdade para a arquitetura e o estado atual do projeto Backoffice TKS Vantagens.

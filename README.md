# Projeto Backoffice - TKS Vantagens

## 1. Visão Geral

Este diretório contém o código-fonte do sistema de backoffice da TKS Vantagens. A plataforma é projetada com uma arquitetura modular para suportar diversas ferramentas de gestão interna, com a "Central de OKRs" sendo o primeiro módulo implementado.

O projeto segue as melhores práticas de desenvolvimento web, focando em manutenibilidade, escalabilidade e segurança, preparando a plataforma para crescimento futuro e integrações complexas.

## 2. Arquitetura do Projeto (Em Transição)

A aplicação está passando por uma refatoração para uma arquitetura modular e profissional. A estrutura alvo é:

- **/api**: Contém os endpoints de backend (PHP) que servem como uma camada segura entre o frontend e o banco de dados.
- **/assets**: Armazena todos os ativos estáticos, como imagens (logos, ícones) e fontes.
- **/components**: Contém "pedaços" de HTML reutilizáveis (componentes PHP) que formam o layout base de todas as páginas (header, sidebar, etc.).
- **/css**: Organiza as folhas de estilo, divididas por componentes e páginas específicas.
- **/js**: Organiza a lógica do frontend, separando bibliotecas externas, módulos de funcionalidade e o script de entrada principal.
- **Arquivos `.php` na raiz**: São as páginas principais da aplicação (ex: `index.php`, `dashboard.php`), montadas a partir dos componentes.

*Para mais detalhes sobre cada diretório, consulte o `README.md` dentro da respectiva pasta (a ser criado na Fase 1).*

## 3. Como Contribuir (Padrões de Desenvolvimento)

Para manter a organização e a qualidade do código, siga os seguintes padrões:

1.  **Componentização:** Sempre que criar um elemento de UI que possa ser reutilizado (um botão, um card, um modal), separe seu estilo em um arquivo CSS de componente e sua lógica em um módulo JS apropriado.
2.  **Isolamento de Módulos:** A lógica de um módulo principal (ex: OKRs) não deve depender diretamente de outro módulo (ex: Financeiro). A comunicação deve ocorrer, se necessário, através de eventos ou de um orquestrador central no `main.js`.
3.  **Segurança da API:** Nenhuma chave de API, senha ou outra informação sensível deve ser escrita diretamente no código JavaScript. Utilize a camada de API em PHP para mediar o acesso a serviços externos.
4.  **Documentação:** Ao criar um novo componente ou módulo significativo, atualize ou crie o `README.md` correspondente explicando sua finalidade e como usá-lo.


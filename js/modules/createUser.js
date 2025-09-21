// Arquivo: createUser.js
// Objetivo: Validação por campo com mensagens individuais e envio de dados.

document.addEventListener('DOMContentLoaded', () => {

    // =====================================================================================
    // INSTRUÇÃO 1: SELEÇÃO DOS ELEMENTOS
    // =====================================================================================
    const form = document.getElementById('create-user-form');
    const inputs = form.querySelectorAll('input, select'); // Pega todos os inputs e selects

    // =====================================================================================
    // INSTRUÇÃO 2: FUNÇÕES DE MÁSCARA (sem alteração)
    // =====================================================================================
    const maskCPF = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    };

    const maskPhone = (value) => {
        return value
            .replace(/\D/g, '')
            .replace(/^(\d{2})(\d)/g, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
    };

    // Aplica as máscaras enquanto o usuário digita
    document.getElementById('cpf').addEventListener('input', (e) => {
        e.target.value = maskCPF(e.target.value);
    });
    document.getElementById('phone').addEventListener('input', (e) => {
        e.target.value = maskPhone(e.target.value);
    });

    // =====================================================================================
    // INSTRUÇÃO 3: FUNÇÕES DE VALIDAÇÃO (sem alteração)
    // =====================================================================================
    const validateCPF = (cpf) => {
        cpf = cpf.replace(/[^\d]+/g, '');
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;
        let sum = 0, rest;
        for (let i = 1; i <= 9; i++) sum += parseInt(cpf.substring(i - 1, i)) * (11 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cpf.substring(9, 10))) return false;
        sum = 0;
        for (let i = 1; i <= 10; i++) sum += parseInt(cpf.substring(i - 1, i)) * (12 - i);
        rest = (sum * 10) % 11;
        if ((rest === 10) || (rest === 11)) rest = 0;
        if (rest !== parseInt(cpf.substring(10, 11))) return false;
        return true;
    };

    const validatePhone = (phone) => {
        const cleanedPhone = phone.replace(/\D/g, '');
        if (cleanedPhone.length !== 11) return false;
        if (cleanedPhone.charAt(0) === '0') return false;
        if (cleanedPhone.charAt(2) !== '9') return false;
        return true;
    };

    // =====================================================================================
    // INSTRUÇÃO 4: FUNÇÕES DE FEEDBACK VISUAL
    // =====================================================================================
    
    // Mostra uma mensagem de erro para um campo específico.
    const showError = (input, message) => {
        const formGroup = input.parentElement;
        const errorText = formGroup.querySelector('.error-text');
        
        formGroup.classList.add('error'); // (Opcional, se quisermos estilizar o grupo)
        input.classList.add('input-error'); // Adiciona a borda vermelha
        errorText.innerText = message;
        errorText.style.display = 'block'; // Mostra a mensagem
    };

    // Limpa a mensagem de erro de um campo específico.
    const clearError = (input) => {
        const formGroup = input.parentElement;
        const errorText = formGroup.querySelector('.error-text');

        formGroup.classList.remove('error');
        input.classList.remove('input-error'); // Remove a borda vermelha
        errorText.innerText = '';
        errorText.style.display = 'none'; // Esconde a mensagem
    };

    // =====================================================================================
    // INSTRUÇÃO 5: VALIDAÇÃO DO FORMULÁRIO NO ENVIO
    // =====================================================================================
    form.addEventListener('submit', (event) => {
        event.preventDefault(); // Previne o envio padrão
        let isValid = true; // Flag para controlar a validade geral do formulário

        // Limpa todos os erros antigos antes de validar novamente.
        inputs.forEach(input => clearError(input));

        // --- Validação de cada campo ---

        // Nome
        const nameInput = document.getElementById('name');
        if (nameInput.value.trim() === '') {
            showError(nameInput, 'O nome completo é obrigatório.');
            isValid = false;
        }

        // E-mail
        const emailInput = document.getElementById('email');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            showError(emailInput, 'Por favor, insira um e-mail válido.');
            isValid = false;
        }

        // CPF
        const cpfInput = document.getElementById('cpf');
        if (!validateCPF(cpfInput.value)) {
            showError(cpfInput, 'CPF inválido.');
            isValid = false;
        }

        // Telefone
        const phoneInput = document.getElementById('phone');
        if (!validatePhone(phoneInput.value)) {
            showError(phoneInput, 'Formato de telefone inválido. Use (XX) 9XXXX-XXXX.');
            isValid = false;
        }
        
        // Tipo de Usuário e Setor (apenas verifica se algo foi selecionado)
        const userTypeSelect = document.getElementById('user-type');
        if (userTypeSelect.value === '') {
            showError(userTypeSelect, 'Por favor, selecione um tipo de usuário.');
            isValid = false;
        }
        const departmentSelect = document.getElementById('department');
        if (departmentSelect.value === '') {
            showError(departmentSelect, 'Por favor, selecione um setor.');
            isValid = false;
        }

         // =============================================================================
        // INSTRUÇÃO: Validação de Senha Atualizada
        // =============================================================================
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        // Expressões Regulares para validar a senha:
        const hasNumber = /\d/; // Verifica se contém pelo menos um número.
        const hasLetter = /[a-zA-Z]/; // Verifica se contém pelo menos uma letra.

               // =============================================================================
        // INSTRUÇÃO: Validação de Senha CORRIGIDA
        // =============================================================================
        const passwordInput = document.getElementById('password');
        const confirmPasswordInput = document.getElementById('confirm-password');
        
        const hasNumber = /\d/;
        const hasLetter = /[a-zA-Z]/;

        // 1. Valida o comprimento da senha.
        if (passwordInput.value.length < 8) {
            showError(passwordInput, 'A senha deve ter no mínimo 8 caracteres.');
            isValid = false;
        }
        
        // 2. Valida se contém letras E números (esta verificação agora é independente).
        if (!hasLetter.test(passwordInput.value) || !hasNumber.test(passwordInput.value)) {
            // Mostra o erro apenas se nenhum erro de comprimento já foi mostrado, para não sobrepor.
            if (isValid) { 
                showError(passwordInput, 'A senha deve conter letras e números.');
            }
            isValid = false;
        }

        // 3. Valida se a confirmação de senha está preenchida.
        if (confirmPasswordInput.value === '') {
            showError(confirmPasswordInput, 'Por favor, confirme sua senha.');
            isValid = false;
        }
        // 4. Valida se as senhas coincidem.
        else if (passwordInput.value !== confirmPasswordInput.value) {
            showError(confirmPasswordInput, 'As senhas não coincidem.');
            isValid = false;
        }

        // --- Fim das Validações ---

        if (isValid) {
            // Se o formulário for válido, podemos prosseguir para o envio dos dados.
            alert('Formulário válido! Pronto para enviar ao servidor.');
            // PRÓXIMO PASSO: Aqui chamaremos a função para enviar os dados para o PHP.
            // form.submit(); // Exemplo de como seria o envio real.
        }
    });
});

// Register Page - Hub Financeiro Pro

const API_URL = window.location.origin + '/api';
axios.defaults.baseURL = API_URL;

// Check if already logged in
const token = localStorage.getItem('token');
if (token) {
  window.location.href = '/principal';
}

// ========== PASSWORD STRENGTH ==========

function checkPasswordStrength(password) {
  let strength = 0;
  const feedback = [];
  
  if (password.length >= 6) strength += 20;
  if (password.length >= 8) strength += 10;
  if (password.length >= 12) strength += 10;
  
  if (/[a-z]/.test(password)) strength += 15;
  if (/[A-Z]/.test(password)) strength += 15;
  if (/[0-9]/.test(password)) strength += 15;
  if (/[^A-Za-z0-9]/.test(password)) strength += 15;
  
  if (password.length < 6) feedback.push('Mínimo 6 caracteres');
  if (!/[a-z]/.test(password)) feedback.push('Adicione minúsculas');
  if (!/[A-Z]/.test(password)) feedback.push('Adicione MAIÚSCULAS');
  if (!/[0-9]/.test(password)) feedback.push('Adicione números');
  if (!/[^A-Za-z0-9]/.test(password)) feedback.push('Adicione símbolos (!@#$)');
  
  let level = 'Muito fraca';
  let color = '#EF4444';
  
  if (strength >= 80) {
    level = 'Forte';
    color = '#10B981';
  } else if (strength >= 60) {
    level = 'Média';
    color = '#F59E0B';
  } else if (strength >= 40) {
    level = 'Fraca';
    color = '#F97316';
  }
  
  return { strength, level, color, feedback };
}

// Password strength indicator
document.getElementById('registerPassword').addEventListener('input', (e) => {
  const password = e.target.value;
  const result = checkPasswordStrength(password);
  
  document.getElementById('passwordStrengthBar').style.width = result.strength + '%';
  document.getElementById('passwordStrengthBar').style.backgroundColor = result.color;
  document.getElementById('passwordStrengthLabel').textContent = result.level;
  document.getElementById('passwordStrengthLabel').style.color = result.color;
  
  if (result.feedback.length > 0) {
    document.getElementById('passwordFeedback').textContent = result.feedback.join(' • ');
  } else {
    document.getElementById('passwordFeedback').textContent = '✓ Senha forte!';
  }
});

// ========== REGISTER FORM ==========

function showError(message) {
  const errorDiv = document.getElementById('authError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}

function showSuccess(message) {
  const successDiv = document.getElementById('authSuccess');
  successDiv.textContent = message;
  successDiv.classList.remove('hidden');
}

document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  // Valida força da senha
  const strength = checkPasswordStrength(password);
  if (strength.strength < 40) {
    showError(`Senha muito fraca! ${strength.feedback.join(', ')}`);
    return;
  }

  try {
    // Registra o usuário
    await axios.post('/auth/register', { name, email, password });
    
    // Limpa o formulário
    document.getElementById('registerForm').reset();
    
    // Mostra mensagem de sucesso
    showSuccess('✅ Conta criada com sucesso! Redirecionando para o login...');
    
    // Redireciona para login após 2 segundos
    setTimeout(() => {
      window.location.href = '/login';
    }, 2000);
    
  } catch (error) {
    console.error('Register error:', error);
    showError(error.response?.data?.error || 'Erro ao criar conta. Tente novamente.');
  }
});

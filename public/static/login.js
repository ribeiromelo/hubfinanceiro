// Login Page - Hub Financeiro Pro

const API_URL = window.location.origin + '/api';
axios.defaults.baseURL = API_URL;

// Check if already logged in
const token = localStorage.getItem('token');
if (token) {
  window.location.href = '/principal';
}

// Utils
function showError(message) {
  const errorDiv = document.getElementById('authError');
  errorDiv.textContent = message;
  errorDiv.classList.remove('hidden');
  setTimeout(() => errorDiv.classList.add('hidden'), 5000);
}

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await axios.post('/auth/login', { email, password });
    const token = response.data.token;
    
    // Save token
    localStorage.setItem('token', token);
    
    // Redirect to dashboard
    window.location.href = '/principal';
    
  } catch (error) {
    console.error('Login error:', error);
    showError(error.response?.data?.error || 'Erro ao fazer login');
  }
});

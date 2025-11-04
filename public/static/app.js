// Hub Financeiro - Frontend Application

const API_URL = window.location.origin + '/api';
let currentUser = null;
let token = localStorage.getItem('token');
let accounts = [];
let categories = [];
let transactions = [];
let categoryChart = null;

// Configuração do Axios
axios.defaults.baseURL = API_URL;
if (token) {
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}

// ========== UTILS ==========

function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value || 0);
}

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('pt-BR');
}

function showError(message) {
  const errorDiv = document.getElementById('authError');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 5000);
  } else {
    alert(message);
  }
}

function hideLoading() {
  document.getElementById('loadingScreen').classList.add('hidden');
}

function showAuthScreen() {
  hideLoading();
  document.getElementById('authScreen').classList.remove('hidden');
  document.getElementById('app').classList.add('hidden');
}

function showApp() {
  hideLoading();
  document.getElementById('authScreen').classList.add('hidden');
  document.getElementById('app').classList.remove('hidden');
}

// ========== AUTH ==========

async function checkAuth() {
  if (!token) {
    showAuthScreen();
    return;
  }

  try {
    const response = await axios.get('/auth/me');
    currentUser = response.data.user;
    document.getElementById('userName').textContent = currentUser.name;
    await loadDashboard();
    showApp();
  } catch (error) {
    console.error('Auth error:', error);
    token = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    showAuthScreen();
  }
}

// Auth Tabs
document.getElementById('loginTab').addEventListener('click', () => {
  document.getElementById('loginTab').classList.add('text-pink-600', 'border-b-2', 'border-pink-600');
  document.getElementById('loginTab').classList.remove('text-gray-400', 'border-0');
  document.getElementById('registerTab').classList.remove('text-pink-600', 'border-b-2', 'border-pink-600');
  document.getElementById('registerTab').classList.add('text-gray-400', 'border-0');
  document.getElementById('loginForm').classList.remove('hidden');
  document.getElementById('registerForm').classList.add('hidden');
});

document.getElementById('registerTab').addEventListener('click', () => {
  document.getElementById('registerTab').classList.add('text-pink-600', 'border-b-2', 'border-pink-600');
  document.getElementById('registerTab').classList.remove('text-gray-400', 'border-0');
  document.getElementById('loginTab').classList.remove('text-pink-600', 'border-b-2', 'border-pink-600');
  document.getElementById('loginTab').classList.add('text-gray-400', 'border-0');
  document.getElementById('loginForm').classList.add('hidden');
  document.getElementById('registerForm').classList.remove('hidden');
});

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await axios.post('/auth/login', { email, password });
    token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    currentUser = response.data.user;
    
    await loadDashboard();
    showApp();
  } catch (error) {
    console.error('Login error:', error);
    showError(error.response?.data?.error || 'Erro ao fazer login');
  }
});

// Register Form
document.getElementById('registerForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const name = document.getElementById('registerName').value;
  const email = document.getElementById('registerEmail').value;
  const password = document.getElementById('registerPassword').value;

  try {
    const response = await axios.post('/auth/register', { name, email, password });
    token = response.data.token;
    localStorage.setItem('token', token);
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    currentUser = response.data.user;
    
    await loadDashboard();
    showApp();
  } catch (error) {
    console.error('Register error:', error);
    showError(error.response?.data?.error || 'Erro ao criar conta');
  }
});

// Logout
document.getElementById('logoutBtn').addEventListener('click', () => {
  if (confirm('Deseja realmente sair?')) {
    token = null;
    currentUser = null;
    localStorage.removeItem('token');
    delete axios.defaults.headers.common['Authorization'];
    showAuthScreen();
  }
});

// ========== DASHBOARD ==========

async function loadDashboard() {
  try {
    // Carrega dados em paralelo
    const [accountsRes, categoriesRes, transactionsRes, statsRes] = await Promise.all([
      axios.get('/accounts'),
      axios.get('/categories'),
      axios.get('/transactions'),
      axios.get('/transactions/stats')
    ]);

    accounts = accountsRes.data.accounts;
    categories = categoriesRes.data.categories;
    transactions = transactionsRes.data.transactions;
    
    renderKPIs(statsRes.data);
    renderCategoryChart(statsRes.data.categoriesStats);
    renderBudgets(statsRes.data.categoriesStats);
    renderAccounts();
    renderTransactions();
    populateFormSelects();
  } catch (error) {
    console.error('Error loading dashboard:', error);
    showError('Erro ao carregar dados do dashboard');
  }
}

function renderKPIs(stats) {
  document.getElementById('kpiIncome').textContent = formatCurrency(stats.income);
  document.getElementById('kpiExpense').textContent = formatCurrency(stats.expense);
  document.getElementById('kpiBalance').textContent = formatCurrency(stats.balance);
  document.getElementById('kpiPercent').textContent = stats.percentSpent + '%';
  document.getElementById('kpiPercentBar').style.width = Math.min(stats.percentSpent, 100) + '%';
}

function renderCategoryChart(categoriesStats) {
  const ctx = document.getElementById('categoryChart');
  
  if (categoryChart) {
    categoryChart.destroy();
  }

  const labels = categoriesStats.map(c => c.name || 'Sem categoria');
  const data = categoriesStats.map(c => c.spent || 0);
  const colors = categoriesStats.map(c => c.color || '#6B7280');

  categoryChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors,
        borderWidth: 0
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: 'bottom',
          labels: {
            padding: 15,
            font: { size: 12 }
          }
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              return context.label + ': ' + formatCurrency(context.parsed);
            }
          }
        }
      }
    }
  });
}

function renderBudgets(categoriesStats) {
  const container = document.getElementById('budgetList');
  container.innerHTML = '';

  categoriesStats.forEach(cat => {
    if (!cat.budget_limit || cat.budget_limit === 0) return;

    const spent = cat.spent || 0;
    const percent = Math.min(Math.round((spent / cat.budget_limit) * 100), 100);

    const item = document.createElement('div');
    item.className = 'border-l-4 pl-3 py-2';
    item.style.borderColor = cat.color || '#EC4899';
    
    item.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="font-medium text-gray-800">${cat.icon || '💰'} ${cat.name || 'Sem categoria'}</span>
        <span class="text-sm ${percent >= 100 ? 'text-red-600' : 'text-gray-600'} font-semibold">${percent}%</span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Gasto: ${formatCurrency(spent)}</span>
        <span>Limite: ${formatCurrency(cat.budget_limit)}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="h-2 rounded-full transition-all" 
             style="width: ${percent}%; background-color: ${cat.color || '#EC4899'}"></div>
      </div>
    `;
    
    container.appendChild(item);
  });

  if (categoriesStats.length === 0 || categoriesStats.every(c => !c.budget_limit)) {
    container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Nenhum orçamento configurado</p>';
  }
}

function renderAccounts() {
  const container = document.getElementById('accountsList');
  container.innerHTML = '';

  accounts.forEach(acc => {
    const item = document.createElement('div');
    item.className = 'p-3 border border-gray-200 rounded-lg hover:border-pink-500 transition';
    
    if (acc.type === 'account') {
      item.innerHTML = `
        <div class="flex justify-between items-center">
          <div>
            <p class="font-medium text-gray-800">${acc.name}</p>
            <p class="text-xs text-gray-500">Conta</p>
          </div>
          <p class="font-bold text-gray-800">${formatCurrency(acc.balance)}</p>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div>
          <div class="flex justify-between items-center mb-1">
            <p class="font-medium text-gray-800">${acc.name}</p>
            <span class="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded-full">Cartão</span>
          </div>
          <p class="text-xs text-gray-500">Limite: ${formatCurrency(acc.card_limit)}</p>
        </div>
      `;
    }
    
    container.appendChild(item);
  });

  if (accounts.length === 0) {
    container.innerHTML = '<p class="text-gray-500 text-sm text-center py-4">Nenhuma conta cadastrada</p>';
  }
}

function renderTransactions() {
  const tbody = document.getElementById('transactionsList');
  tbody.innerHTML = '';

  const filtered = transactions.slice(0, 20); // Últimas 20

  filtered.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-100 hover:bg-gray-50';
    
    const amountClass = tx.type === 'income' ? 'text-green-600' : 'text-red-600';
    
    tr.innerHTML = `
      <td class="py-3 px-4 text-sm text-gray-600">${formatDate(tx.date)}</td>
      <td class="py-3 px-4 text-sm text-gray-800">${tx.description}</td>
      <td class="py-3 px-4 text-sm">
        <span class="px-2 py-1 rounded-full text-xs" style="background-color: ${tx.category_color || '#E5E7EB'}; color: #374151">
          ${tx.category_icon || '💰'} ${tx.category_name || 'Sem categoria'}
        </span>
      </td>
      <td class="py-3 px-4 text-sm text-gray-600">${tx.account_name}</td>
      <td class="py-3 px-4 text-sm text-right font-semibold ${amountClass}">${formatCurrency(tx.amount)}</td>
      <td class="py-3 px-4 text-right">
        <button onclick="deleteTransaction(${tx.id})" class="text-red-600 hover:text-red-800 text-sm">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });

  if (filtered.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6" class="text-center py-8 text-gray-500">Nenhuma transação encontrada</td></tr>';
  }
}

function populateFormSelects() {
  // Popula select de contas
  const accountSelect = document.getElementById('quickAccount');
  accountSelect.innerHTML = '<option value="">Selecione a conta</option>';
  accounts.forEach(acc => {
    const option = document.createElement('option');
    option.value = acc.id;
    option.textContent = acc.name;
    accountSelect.appendChild(option);
  });

  // Popula select de categorias
  const categorySelect = document.getElementById('quickCategory');
  categorySelect.innerHTML = '<option value="">Categoria (opcional)</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat.id;
    option.textContent = `${cat.icon} ${cat.name}`;
    categorySelect.appendChild(option);
  });

  // Define data de hoje
  document.getElementById('quickDate').value = new Date().toISOString().split('T')[0];
}

// ========== TRANSACTIONS ==========

document.getElementById('quickAddForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const type = document.getElementById('quickType').value;
  const date = document.getElementById('quickDate').value;
  const description = document.getElementById('quickDesc').value;
  const amount = parseFloat(document.getElementById('quickAmount').value);
  const account_id = parseInt(document.getElementById('quickAccount').value);
  const category_id = document.getElementById('quickCategory').value ? parseInt(document.getElementById('quickCategory').value) : null;

  if (!account_id) {
    showError('Selecione uma conta');
    return;
  }

  try {
    await axios.post('/transactions', {
      type,
      date,
      description,
      amount,
      account_id,
      category_id
    });

    // Limpa form
    document.getElementById('quickDesc').value = '';
    document.getElementById('quickAmount').value = '';
    document.getElementById('quickCategory').value = '';

    // Recarrega dashboard
    await loadDashboard();
  } catch (error) {
    console.error('Error adding transaction:', error);
    showError(error.response?.data?.error || 'Erro ao adicionar transação');
  }
});

async function deleteTransaction(id) {
  if (!confirm('Deseja realmente excluir esta transação?')) return;

  try {
    await axios.delete(`/transactions/${id}`);
    await loadDashboard();
  } catch (error) {
    console.error('Error deleting transaction:', error);
    showError('Erro ao excluir transação');
  }
}

// ========== ADD ACCOUNT MODAL (Simple prompt for now) ==========

document.getElementById('addAccountBtn').addEventListener('click', async () => {
  const name = prompt('Nome da conta:');
  if (!name) return;

  const typeOptions = 'Digite:\n1 - Conta corrente/poupança\n2 - Cartão de crédito';
  const type = prompt(typeOptions);
  
  let accountType = 'account';
  let balance = 0;
  let card_limit = 0;
  let card_closing_day = 0;
  let card_due_day = 0;

  if (type === '2') {
    accountType = 'card';
    const limitStr = prompt('Limite do cartão (em R$):');
    card_limit = parseFloat(limitStr) || 0;
    const closingStr = prompt('Dia de fechamento da fatura (1-31):');
    card_closing_day = parseInt(closingStr) || 10;
    const dueStr = prompt('Dia de vencimento da fatura (1-31):');
    card_due_day = parseInt(dueStr) || 17;
  } else {
    const balanceStr = prompt('Saldo inicial (em R$):');
    balance = parseFloat(balanceStr) || 0;
  }

  try {
    await axios.post('/accounts', {
      name,
      type: accountType,
      balance,
      card_limit,
      card_closing_day,
      card_due_day
    });

    await loadDashboard();
  } catch (error) {
    console.error('Error adding account:', error);
    showError('Erro ao adicionar conta');
  }
});

// ========== FILTER ==========

document.getElementById('filterType').addEventListener('change', async (e) => {
  const type = e.target.value;
  
  try {
    let url = '/transactions';
    if (type) url += `?type=${type}`;
    
    const response = await axios.get(url);
    transactions = response.data.transactions;
    renderTransactions();
  } catch (error) {
    console.error('Error filtering transactions:', error);
  }
});

// ========== INIT ==========

window.onload = () => {
  checkAuth();
};

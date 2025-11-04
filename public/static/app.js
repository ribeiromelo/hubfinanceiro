// Hub Financeiro Pro - Frontend Application v2.0

const API_URL = window.location.origin + '/api';
let currentUser = null;
let token = localStorage.getItem('token');
let accounts = [];
let categories = [];
let transactions = [];
let categoryChart = null;
let editingAccountId = null;
let editingTransactionId = null;

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
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString('pt-BR');
}

function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  const icon = document.getElementById('toastIcon');
  const msg = document.getElementById('toastMessage');
  
  icon.className = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
  msg.textContent = message;
  toast.classList.remove('hidden');
  
  setTimeout(() => {
    toast.classList.add('hidden');
  }, 3000);
}

function showError(message) {
  const errorDiv = document.getElementById('authError');
  if (errorDiv) {
    errorDiv.textContent = message;
    errorDiv.classList.remove('hidden');
    setTimeout(() => errorDiv.classList.add('hidden'), 5000);
  } else {
    showToast(message, 'error');
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

// ========== SMART QUICK INPUT PARSER ==========

// Mapa expandido de palavras-chave para categorização automática
const CATEGORY_KEYWORDS = {
  'alimentação': [
    'ifood', 'rappi', 'uber eats', 'delivery', 'entrega',
    'burguer', 'pizza', 'lanche', 'restaurante', 'bar', 'cafe', 'cafeteria',
    'comida', 'almoço', 'almoco', 'jantar', 'café', 'breakfast', 'marmita',
    'mcdonalds', 'bk', 'burger king', 'subway', 'habibs',
    'padaria', 'confeitaria', 'sorveteria', 'açai', 'acai',
    'pastelaria', 'churrascaria', 'sushi', 'japonês', 'japones'
  ],
  'mercado': [
    'mercado', 'supermercado', 'hipermercado',
    'carrefour', 'pão de açúcar', 'extra', 'assaí', 'assai', 'atacadão', 'atacadao',
    'walmart', 'sams', 'makro', 'maxxi',
    'feira', 'hortifruti', 'sacolão', 'sacolao', 'verduras'
  ],
  'transporte': [
    'uber', '99', '99pop', 'taxi', 'cabify', 'indriver',
    'combustível', 'combustivel', 'gasolina', 'etanol', 'diesel', 'posto', 'gnv',
    'ipva', 'licenciamento', 'multa', 'estacionamento',
    'onibus', 'ônibus', 'metro', 'metrô', 'trem', 'bilhete',
    'app', 'pedágio', 'pedagio', 'vistoria'
  ],
  'saúde': [
    'farmácia', 'farmacia', 'drogaria', 'droga raia', 'pacheco', 'drogasil',
    'remédio', 'remedio', 'medicamento', 'genérico', 'generico',
    'médico', 'medico', 'consulta', 'exame', 'laboratório', 'laboratorio',
    'hospital', 'clínica', 'clinica', 'dentista', 'odontologia',
    'plano de saúde', 'plano de saude', 'unimed', 'amil', 'sulamerica'
  ],
  'assinaturas': [
    'netflix', 'spotify', 'prime', 'amazon prime', 'youtube', 'premium',
    'disney', 'disney+', 'hbo', 'max', 'paramount', 'star+',
    'globoplay', 'telecine', 'streaming', 'apple tv', 'deezer',
    'assinatura', 'mensalidade', 'recorrente'
  ],
  'moradia': [
    'aluguel', 'imobiliária', 'imobiliaria', 'condomínio', 'condominio',
    'luz', 'energia', 'eletricidade', 'cemig', 'enel', 'celpe',
    'água', 'agua', 'saneamento', 'sabesp', 'caesb',
    'internet', 'wifi', 'banda larga', 'fibra', 'vivo', 'claro', 'tim', 'oi',
    'gás', 'gas', 'botijão', 'botijao',
    'iptu', 'taxa', 'reforma', 'manutenção', 'manutencao'
  ],
  'educação': [
    'curso', 'faculdade', 'universidade', 'escola', 'colégio', 'colegio',
    'livro', 'apostila', 'material escolar', 'papelaria',
    'ead', 'online', 'udemy', 'coursera', 'alura', 'rocketseat',
    'matrícula', 'matricula', 'mensalidade escolar', 'inglês', 'ingles'
  ],
  'lazer': [
    'cinema', 'ingresso', 'show', 'teatro', 'festival',
    'parque', 'diversão', 'viagem', 'turismo', 'hotel', 'pousada',
    'festa', 'balada', 'evento', 'jogo', 'futebol'
  ],
  'salário': [
    'salário', 'salario', 'pagamento', 'pró-labore', 'pro-labore',
    'freelance', 'freela', 'bico', 'extra', 'hora extra',
    'comissão', 'comissao', 'bonificação', 'bonificacao', 'décimo', 'decimo'
  ],
  'outros': [
    'diversos', 'outros', 'variados', 'geral'
  ]
};

function parseQuickInput(text) {
  // Remove espaços extras
  text = text.trim();
  
  // Detecta valor (com ou sem R$, com vírgula ou ponto)
  const valueMatch = text.match(/-?\s*R?\$?\s*([\d.,]+)/i);
  if (!valueMatch) {
    return null;
  }
  
  let valueStr = valueMatch[1].replace(/\./g, '').replace(',', '.');
  let amount = parseFloat(valueStr);
  
  if (isNaN(amount)) return null;
  
  // Detecta tipo: negativo = despesa, positivo = receita
  let type = 'expense';
  if (text.includes('-') || amount < 0) {
    type = 'expense';
    amount = Math.abs(amount);
  } else if (amount > 1000) {
    // Valores altos provavelmente são receitas
    type = 'income';
  }
  
  // Remove o valor do texto para pegar descrição
  let description = text.replace(valueMatch[0], '').trim();
  
  // Detecta conta/cartão por palavras-chave
  let accountId = null;
  const accountKeywords = {
    'nubank': ['nubank', 'nu'],
    'bb': ['bb', 'banco do brasil'],
    'inter': ['inter', 'banco inter'],
    'c6': ['c6', 'c6 bank'],
    'itau': ['itau', 'itaú'],
    'bradesco': ['bradesco'],
    'santander': ['santander'],
    'caixa': ['caixa', 'cef'],
    'carteira': ['carteira', 'dinheiro', 'cash']
  };
  
  for (const acc of accounts) {
    const accNameLower = acc.name.toLowerCase();
    for (const [key, keywords] of Object.entries(accountKeywords)) {
      if (keywords.some(kw => accNameLower.includes(kw) || description.toLowerCase().includes(kw))) {
        accountId = acc.id;
        // Remove palavra-chave da descrição
        keywords.forEach(kw => {
          const regex = new RegExp('\\b' + kw + '\\b', 'gi');
          description = description.replace(regex, '').trim();
        });
        break;
      }
    }
    if (accountId) break;
  }
  
  // Se não encontrou, usa primeira conta
  if (!accountId && accounts.length > 0) {
    accountId = accounts[0].id;
  }
  
  // Detecta categoria por palavras-chave (agora com muito mais padrões!)
  let categoryId = null;
  const descLower = description.toLowerCase();
  
  for (const cat of categories) {
    const catNameLower = cat.name.toLowerCase();
    const keywords = CATEGORY_KEYWORDS[catNameLower] || [];
    
    if (keywords.some(kw => descLower.includes(kw.toLowerCase()))) {
      categoryId = cat.id;
      break;
    }
  }
  
  // Se descrição ficou vazia, usa valor como descrição
  if (!description) {
    description = type === 'income' ? 'Receita' : 'Despesa';
  }
  
  return {
    type,
    amount,
    description: description || 'Lançamento',
    account_id: accountId,
    category_id: categoryId,
    date: new Date().toISOString().split('T')[0]
  };
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

// ========== AUTH ==========

async function checkAuth() {
  // SEMPRE re-lê do localStorage (persistência total)
  token = localStorage.getItem('token');
  
  if (!token) {
    showAuthScreen();
    return;
  }

  // Configura o header do axios com o token
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

  try {
    const response = await axios.get('/auth/me');
    currentUser = response.data.user;
    document.getElementById('userName').textContent = currentUser.name;
    await loadDashboard();
    showApp();
  } catch (error) {
    console.error('Auth error:', error);
    // Token inválido ou expirado - limpa tudo
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

// Login Form
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;

  try {
    const response = await axios.post('/auth/login', { email, password });
    token = response.data.token;
    
    // Salva o token no localStorage
    localStorage.setItem('token', token);
    
    // Configura o axios para usar o token
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    
    currentUser = response.data.user;
    
    // Carrega dashboard e mostra app
    await loadDashboard();
    showApp();
    
    showToast(`Bem-vindo, ${currentUser.name}!`);
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

  // Valida força da senha
  const strength = checkPasswordStrength(password);
  if (strength.strength < 40) {
    showError(`Senha muito fraca! ${strength.feedback.join(', ')}`);
    return;
  }

  try {
    // Registra o usuário (MAS NÃO LOGA AUTOMATICAMENTE)
    await axios.post('/auth/register', { name, email, password });
    
    // Limpa o formulário
    document.getElementById('registerForm').reset();
    
    // Mostra mensagem de sucesso
    showToast('✅ Conta criada com sucesso! Faça login para continuar.');
    
    // Troca para a aba de login
    document.getElementById('loginTab').click();
    
    // Preenche o email no login para facilitar
    document.getElementById('loginEmail').value = email;
    document.getElementById('loginPassword').focus();
    
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

  // Filtra apenas categorias com orçamento
  const withBudget = categoriesStats.filter(cat => cat.budget_limit && cat.budget_limit > 0);

  if (withBudget.length === 0) {
    container.innerHTML = `
      <div class="text-center py-8 text-gray-500">
        <i class="fas fa-chart-pie text-4xl mb-3"></i>
        <p>Nenhum orçamento configurado</p>
        <button onclick="openBudgetModal()" class="mt-3 text-purple-600 hover:text-purple-800 font-semibold">
          <i class="fas fa-plus mr-1"></i>Configurar Orçamentos
        </button>
      </div>
    `;
    return;
  }

  withBudget.forEach(cat => {
    const spent = cat.spent || 0;
    const percent = Math.min(Math.round((spent / cat.budget_limit) * 100), 100);
    const isOverBudget = percent >= 100;

    const item = document.createElement('div');
    item.className = 'border-l-4 pl-3 py-2 hover:bg-gray-50 rounded transition';
    item.style.borderColor = isOverBudget ? '#EF4444' : (cat.color || '#EC4899');
    
    item.innerHTML = `
      <div class="flex justify-between items-center mb-1">
        <span class="font-medium text-gray-800">${cat.icon || '💰'} ${cat.name || 'Sem categoria'}</span>
        <span class="text-sm ${isOverBudget ? 'text-red-600' : 'text-gray-600'} font-semibold">
          ${percent}%
          ${isOverBudget ? '<i class="fas fa-exclamation-triangle ml-1"></i>' : ''}
        </span>
      </div>
      <div class="flex justify-between text-xs text-gray-500 mb-1">
        <span>Gasto: ${formatCurrency(spent)}</span>
        <span>Limite: ${formatCurrency(cat.budget_limit)}</span>
      </div>
      <div class="w-full bg-gray-200 rounded-full h-2">
        <div class="h-2 rounded-full transition-all" 
             style="width: ${percent}%; background-color: ${isOverBudget ? '#EF4444' : (cat.color || '#EC4899')}"></div>
      </div>
    `;
    
    container.appendChild(item);
  });
}

function renderAccounts() {
  const container = document.getElementById('accountsList');
  container.innerHTML = '';

  if (accounts.length === 0) {
    container.innerHTML = `
      <div class="col-span-2 text-center py-8 text-gray-500">
        <i class="fas fa-university text-4xl mb-3"></i>
        <p>Nenhuma conta cadastrada</p>
      </div>
    `;
    return;
  }

  accounts.forEach(acc => {
    const item = document.createElement('div');
    item.className = 'p-4 border border-gray-200 rounded-lg hover:border-blue-500 hover:shadow-md transition cursor-pointer';
    
    if (acc.type === 'account') {
      item.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
              <i class="fas fa-university text-white"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">${acc.name}</p>
              <p class="text-xs text-gray-500">Conta Bancária</p>
            </div>
          </div>
          <button onclick="openEditAccount(${acc.id})" class="text-gray-400 hover:text-blue-600 transition">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-600">Saldo Atual</p>
          <p class="text-xl font-bold text-gray-800">${formatCurrency(acc.balance)}</p>
        </div>
      `;
    } else {
      item.innerHTML = `
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center space-x-2">
            <div class="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center">
              <i class="fas fa-credit-card text-white"></i>
            </div>
            <div>
              <p class="font-semibold text-gray-800">${acc.name}</p>
              <p class="text-xs text-gray-500">Cartão de Crédito</p>
            </div>
          </div>
          <button onclick="openEditAccount(${acc.id})" class="text-gray-400 hover:text-purple-600 transition">
            <i class="fas fa-edit"></i>
          </button>
        </div>
        <div class="mt-3 pt-3 border-t border-gray-100 space-y-1">
          <div class="flex justify-between text-sm">
            <span class="text-gray-600">Limite:</span>
            <span class="font-semibold text-gray-800">${formatCurrency(acc.card_limit)}</span>
          </div>
          <div class="flex justify-between text-xs text-gray-500">
            <span>Fechamento: dia ${acc.card_closing_day}</span>
            <span>Vencimento: dia ${acc.card_due_day}</span>
          </div>
        </div>
      `;
    }
    
    container.appendChild(item);
  });
}

function renderTransactions() {
  const tbody = document.getElementById('transactionsList');
  tbody.innerHTML = '';

  const filtered = transactions.slice(0, 50);

  if (filtered.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="6" class="text-center py-12 text-gray-500">
          <i class="fas fa-receipt text-4xl mb-3"></i>
          <p>Nenhuma transação encontrada</p>
        </td>
      </tr>
    `;
    return;
  }

  filtered.forEach(tx => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-gray-100 hover:bg-gray-50 transition';
    
    const amountClass = tx.type === 'income' ? 'text-green-600' : 'text-red-600';
    
    tr.innerHTML = `
      <td class="py-3 px-4 text-sm text-gray-600">${formatDate(tx.date)}</td>
      <td class="py-3 px-4 text-sm text-gray-800 font-medium">${tx.description}</td>
      <td class="py-3 px-4 text-sm">
        <span class="px-2 py-1 rounded-full text-xs font-medium" style="background-color: ${tx.category_color || '#E5E7EB'}20; color: ${tx.category_color || '#6B7280'}">
          ${tx.category_icon || '💰'} ${tx.category_name || 'Sem categoria'}
        </span>
      </td>
      <td class="py-3 px-4 text-sm text-gray-600">${tx.account_name}</td>
      <td class="py-3 px-4 text-sm text-right font-bold ${amountClass}">${formatCurrency(tx.amount)}</td>
      <td class="py-3 px-4 text-right">
        <button onclick="openEditTransaction(${tx.id})" class="text-blue-600 hover:text-blue-800 mr-2 transition" data-tooltip="Editar">
          <i class="fas fa-edit"></i>
        </button>
        <button onclick="deleteTransaction(${tx.id})" class="text-red-600 hover:text-red-800 transition" data-tooltip="Excluir">
          <i class="fas fa-trash"></i>
        </button>
      </td>
    `;
    
    tbody.appendChild(tr);
  });
}

// ========== QUICK ADD (SMART INPUT) ==========

document.getElementById('quickAddBtn').addEventListener('click', async () => {
  const input = document.getElementById('quickInput');
  const text = input.value.trim();
  
  if (!text) {
    showToast('Digite algo para adicionar', 'error');
    return;
  }
  
  const parsed = parseQuickInput(text);
  
  if (!parsed) {
    showToast('Não consegui entender. Tente: "50 mercado", "-120 gasolina", "8500 salário"', 'error');
    return;
  }
  
  try {
    await axios.post('/transactions', parsed);
    input.value = '';
    await loadDashboard();
    showToast(`✨ ${parsed.type === 'income' ? 'Receita' : 'Despesa'} de ${formatCurrency(parsed.amount)} adicionada!`);
  } catch (error) {
    console.error('Error adding transaction:', error);
    showToast(error.response?.data?.error || 'Erro ao adicionar transação', 'error');
  }
});

// Enter key support
document.getElementById('quickInput').addEventListener('keypress', (e) => {
  if (e.key === 'Enter') {
    document.getElementById('quickAddBtn').click();
  }
});

// ========== ACCOUNT MODAL ==========

function openAccountModal() {
  editingAccountId = null;
  document.getElementById('accountModalTitle').textContent = 'Nova Conta';
  document.getElementById('accountForm').reset();
  document.getElementById('accountId').value = '';
  document.getElementById('accountType').value = 'account';
  toggleAccountFields();
  document.getElementById('accountModal').classList.remove('hidden');
  document.getElementById('accountModal').classList.add('flex');
}

function openEditAccount(id) {
  const account = accounts.find(a => a.id === id);
  if (!account) return;
  
  editingAccountId = id;
  document.getElementById('accountModalTitle').textContent = 'Editar Conta';
  document.getElementById('accountId').value = id;
  document.getElementById('accountName').value = account.name;
  document.getElementById('accountType').value = account.type;
  
  if (account.type === 'account') {
    document.getElementById('accountBalance').value = account.balance || 0;
  } else {
    document.getElementById('cardLimit').value = account.card_limit || 0;
    document.getElementById('cardClosingDay').value = account.card_closing_day || 10;
    document.getElementById('cardDueDay').value = account.card_due_day || 17;
  }
  
  toggleAccountFields();
  document.getElementById('accountModal').classList.remove('hidden');
  document.getElementById('accountModal').classList.add('flex');
}

function closeAccountModal() {
  document.getElementById('accountModal').classList.add('hidden');
  document.getElementById('accountModal').classList.remove('flex');
}

function toggleAccountFields() {
  const type = document.getElementById('accountType').value;
  const accountFields = document.getElementById('accountFields');
  const cardFields = document.getElementById('cardFields');
  
  if (type === 'account') {
    accountFields.classList.remove('hidden');
    cardFields.classList.add('hidden');
  } else {
    accountFields.classList.add('hidden');
    cardFields.classList.remove('hidden');
  }
}

document.getElementById('accountType').addEventListener('change', toggleAccountFields);

document.getElementById('addAccountBtn').addEventListener('click', openAccountModal);

document.getElementById('accountForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('accountId').value;
  const name = document.getElementById('accountName').value;
  const type = document.getElementById('accountType').value;
  
  const data = { name, type };
  
  if (type === 'account') {
    data.balance = parseFloat(document.getElementById('accountBalance').value) || 0;
  } else {
    data.card_limit = parseFloat(document.getElementById('cardLimit').value) || 0;
    data.card_closing_day = parseInt(document.getElementById('cardClosingDay').value) || 10;
    data.card_due_day = parseInt(document.getElementById('cardDueDay').value) || 17;
  }
  
  try {
    if (id) {
      await axios.put(`/accounts/${id}`, data);
      showToast('Conta atualizada com sucesso!');
    } else {
      await axios.post('/accounts', data);
      showToast('Conta criada com sucesso!');
    }
    
    closeAccountModal();
    await loadDashboard();
  } catch (error) {
    console.error('Error saving account:', error);
    showToast(error.response?.data?.error || 'Erro ao salvar conta', 'error');
  }
});

// ========== BUDGET MODAL ==========

function openBudgetModal() {
  renderBudgetForms();
  document.getElementById('budgetModal').classList.remove('hidden');
  document.getElementById('budgetModal').classList.add('flex');
}

function closeBudgetModal() {
  document.getElementById('budgetModal').classList.add('hidden');
  document.getElementById('budgetModal').classList.remove('flex');
  loadDashboard(); // Reload to update budgets
}

function renderBudgetForms() {
  const container = document.getElementById('budgetFormsList');
  container.innerHTML = '';
  
  categories.forEach(cat => {
    const item = document.createElement('div');
    item.className = 'p-4 border border-gray-200 rounded-lg hover:border-purple-500 transition';
    
    item.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <div class="flex items-center space-x-3">
          <span class="text-2xl">${cat.icon || '💰'}</span>
          <div>
            <p class="font-semibold text-gray-800">${cat.name}</p>
            <p class="text-xs text-gray-500">Orçamento mensal</p>
          </div>
        </div>
        <div class="w-8 h-8 rounded-full" style="background-color: ${cat.color}"></div>
      </div>
      
      <div class="flex items-center space-x-2">
        <span class="text-gray-600 text-sm">R$</span>
        <input 
          type="number" 
          step="0.01" 
          value="${cat.budget_limit || 0}"
          data-category-id="${cat.id}"
          class="budget-input flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          placeholder="0.00"
        />
        <button 
          onclick="saveBudget(${cat.id})" 
          class="gradient-purple text-white px-4 py-2 rounded-lg hover:opacity-90 transition">
          <i class="fas fa-save"></i>
        </button>
      </div>
    `;
    
    container.appendChild(item);
  });
}

async function saveBudget(categoryId) {
  const input = document.querySelector(`input[data-category-id="${categoryId}"]`);
  const budgetLimit = parseFloat(input.value) || 0;
  
  try {
    await axios.put(`/categories/${categoryId}`, { budget_limit: budgetLimit });
    showToast('Orçamento atualizado!');
  } catch (error) {
    console.error('Error saving budget:', error);
    showToast('Erro ao salvar orçamento', 'error');
  }
}

document.getElementById('manageBudgetsBtn').addEventListener('click', openBudgetModal);

// ========== TRANSACTION MODAL ==========

function openEditTransaction(id) {
  const tx = transactions.find(t => t.id === id);
  if (!tx) return;
  
  editingTransactionId = id;
  document.getElementById('transactionId').value = id;
  document.getElementById('txType').value = tx.type;
  document.getElementById('txDate').value = tx.date;
  document.getElementById('txDescription').value = tx.description;
  document.getElementById('txAmount').value = Math.abs(tx.amount);
  
  // Populate selects
  populateTransactionSelects();
  
  document.getElementById('txAccount').value = tx.account_id;
  document.getElementById('txCategory').value = tx.category_id || '';
  
  document.getElementById('transactionModal').classList.remove('hidden');
  document.getElementById('transactionModal').classList.add('flex');
}

function closeTransactionModal() {
  document.getElementById('transactionModal').classList.add('hidden');
  document.getElementById('transactionModal').classList.remove('flex');
}

function populateTransactionSelects() {
  const accountSelect = document.getElementById('txAccount');
  accountSelect.innerHTML = '<option value="">Selecione a conta</option>';
  accounts.forEach(acc => {
    accountSelect.innerHTML += `<option value="${acc.id}">${acc.name}</option>`;
  });
  
  const categorySelect = document.getElementById('txCategory');
  categorySelect.innerHTML = '<option value="">Sem categoria</option>';
  categories.forEach(cat => {
    categorySelect.innerHTML += `<option value="${cat.id}">${cat.icon} ${cat.name}</option>`;
  });
}

document.getElementById('transactionForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const id = document.getElementById('transactionId').value;
  const type = document.getElementById('txType').value;
  const date = document.getElementById('txDate').value;
  const description = document.getElementById('txDescription').value;
  const amount = parseFloat(document.getElementById('txAmount').value);
  const account_id = parseInt(document.getElementById('txAccount').value);
  const category_id = document.getElementById('txCategory').value ? parseInt(document.getElementById('txCategory').value) : null;
  
  const data = {
    type,
    date,
    description,
    amount,
    account_id,
    category_id
  };
  
  try {
    await axios.put(`/transactions/${id}`, data);
    showToast('Transação atualizada com sucesso!');
    closeTransactionModal();
    await loadDashboard();
  } catch (error) {
    console.error('Error updating transaction:', error);
    showToast(error.response?.data?.error || 'Erro ao atualizar transação', 'error');
  }
});

async function deleteTransaction(id) {
  if (!confirm('Deseja realmente excluir esta transação?')) return;

  try {
    await axios.delete(`/transactions/${id}`);
    await loadDashboard();
    showToast('Transação excluída com sucesso!');
  } catch (error) {
    console.error('Error deleting transaction:', error);
    showToast('Erro ao excluir transação', 'error');
  }
}

// ========== CSV IMPORT/EXPORT ==========

document.getElementById('importCsvBtn').addEventListener('click', () => {
  document.getElementById('csvFileInput').click();
});

document.getElementById('csvFileInput').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  if (!file) return;
  
  try {
    const text = await file.text();
    const lines = text.split('\n').filter(l => l.trim());
    
    if (lines.length < 2) {
      showToast('Arquivo CSV vazio ou inválido', 'error');
      return;
    }
    
    // Skip header
    let imported = 0;
    let errors = 0;
    
    for (let i = 1; i < lines.length; i++) {
      try {
        // Parse CSV line (handle quoted values)
        const parts = [];
        let current = '';
        let inQuotes = false;
        
        for (let j = 0; j < lines[i].length; j++) {
          const char = lines[i][j];
          if (char === '"') {
            inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
            parts.push(current.trim().replace(/^"|"$/g, ''));
            current = '';
          } else {
            current += char;
          }
        }
        parts.push(current.trim().replace(/^"|"$/g, ''));
        
        const [date, description, amount, type, categoryName, accountName] = parts;
        
        if (!date || !amount) {
          errors++;
          continue;
        }
        
        // Find account (case insensitive)
        const account = accounts.find(a => 
          a.name.toLowerCase().trim() === (accountName || '').toLowerCase().trim()
        );
        
        if (!account) {
          console.warn(`Conta não encontrada: "${accountName}"`);
          errors++;
          continue;
        }
        
        // Find category (case insensitive, optional)
        let category = null;
        if (categoryName) {
          category = categories.find(c => 
            c.name.toLowerCase().trim() === categoryName.toLowerCase().trim()
          );
        }
        
        // Parse amount
        const amountValue = parseFloat(amount);
        if (isNaN(amountValue)) {
          errors++;
          continue;
        }
        
        // Determine type
        let txType = type?.toLowerCase().trim() || '';
        if (!txType) {
          txType = amountValue < 0 ? 'expense' : 'income';
        }
        
        const txData = {
          date: date.trim(),
          description: description || 'Importado',
          amount: Math.abs(amountValue),
          type: txType,
          account_id: account.id,
          category_id: category?.id || null
        };
        
        await axios.post('/transactions', txData);
        imported++;
      } catch (lineError) {
        console.error(`Erro na linha ${i + 1}:`, lineError);
        errors++;
      }
    }
    
    if (imported > 0) {
      showToast(`✅ ${imported} transação(ões) importada(s) com sucesso!${errors > 0 ? ` (${errors} erro(s))` : ''}`);
      await loadDashboard();
    } else {
      showToast(`❌ Nenhuma transação importada. ${errors} erro(s) encontrado(s).`, 'error');
    }
    
    e.target.value = '';
  } catch (error) {
    console.error('Error importing CSV:', error);
    showToast('Erro ao importar CSV. Verifique o formato do arquivo.', 'error');
  }
});

document.getElementById('exportCsvBtn').addEventListener('click', () => {
  if (transactions.length === 0) {
    showToast('Nenhuma transação para exportar', 'error');
    return;
  }
  
  // Header
  let csv = 'date,description,amount,type,category,account\n';
  
  // Data
  transactions.forEach(tx => {
    const desc = `"${tx.description.replace(/"/g, '""')}"`;
    const cat = `"${tx.category_name || ''}"`;
    const acc = `"${tx.account_name || ''}"`;
    csv += `${tx.date},${desc},${tx.amount},${tx.type},${cat},${acc}\n`;
  });
  
  // Download
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  link.setAttribute('href', url);
  link.setAttribute('download', `hub_financeiro_${new Date().toISOString().split('T')[0]}.csv`);
  link.click();
  URL.revokeObjectURL(url);
  
  showToast('✅ CSV exportado com sucesso!');
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

// Make functions global for onclick handlers
window.openAccountModal = openAccountModal;
window.openEditAccount = openEditAccount;
window.closeAccountModal = closeAccountModal;
window.openBudgetModal = openBudgetModal;
window.closeBudgetModal = closeBudgetModal;
window.saveBudget = saveBudget;
window.openEditTransaction = openEditTransaction;
window.closeTransactionModal = closeTransactionModal;
window.deleteTransaction = deleteTransaction;

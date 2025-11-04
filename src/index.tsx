import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import { Bindings, Variables } from './types';

// Importa as rotas
import auth from './routes/auth';
import accounts from './routes/accounts';
import categories from './routes/categories';
import transactions from './routes/transactions';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// CORS para todas as rotas de API
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Rotas de API
app.route('/api/auth', auth);
app.route('/api/accounts', accounts);
app.route('/api/categories', categories);
app.route('/api/transactions', transactions);

// Serve arquivos estáticos
app.use('/static/*', serveStatic({ root: './public' }));

// Rota principal (HTML do frontend)
app.get('/', (c) => {
  return c.html(`
<!DOCTYPE html>
<html lang="pt-BR" class="h-full">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Hub Financeiro Pro</title>
  
  <!-- Tailwind CSS -->
  <script src="https://cdn.tailwindcss.com"></script>
  
  <!-- Chart.js -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.min.js"></script>
  
  <!-- Axios -->
  <script src="https://cdn.jsdelivr.net/npm/axios@1.6.0/dist/axios.min.js"></script>
  
  <!-- Font Awesome -->
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"/>
  
  <!-- Google Fonts -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; }
    html { scroll-behavior: smooth; }
    
    /* Loading spinner */
    .spinner {
      border: 3px solid #f3f4f6;
      border-top: 3px solid #ec4899;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    /* Animações */
    @keyframes fadeIn {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    
    .fade-in { animation: fadeIn 0.3s ease-out; }
    
    /* Card hover */
    .card-hover {
      transition: transform 0.2s, box-shadow 0.2s;
    }
    
    .card-hover:hover {
      transform: translateY(-2px);
      box-shadow: 0 20px 40px rgba(0,0,0,0.1);
    }
    
    /* Gradientes modernos */
    .gradient-pink {
      background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
    }
    
    .gradient-purple {
      background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
    }
    
    .gradient-blue {
      background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
    }
    
    .gradient-green {
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
    }
    
    /* Glass effect */
    .glass {
      backdrop-filter: blur(10px);
      background: rgba(255, 255, 255, 0.9);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
  </style>
</head>
<body class="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen">

  <!-- Loading Screen -->
  <div id="loadingScreen" class="fixed inset-0 bg-white z-50 flex items-center justify-center">
    <div class="text-center">
      <div class="spinner mx-auto mb-4"></div>
      <p class="text-gray-600">Carregando...</p>
    </div>
  </div>

  <!-- Auth Screen (Login/Register) -->
  <div id="authScreen" class="hidden min-h-screen flex items-center justify-center p-4">
    <div class="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 fade-in">
      <div class="text-center mb-8">
        <div class="w-16 h-16 gradient-pink rounded-full flex items-center justify-center mx-auto mb-4">
          <i class="fas fa-wallet text-white text-2xl"></i>
        </div>
        <h1 class="text-3xl font-bold text-gray-800">Hub Financeiro</h1>
        <p class="text-gray-600 mt-2">Controle suas finanças com inteligência</p>
      </div>
      
      <!-- Tabs -->
      <div class="flex border-b mb-6">
        <button id="loginTab" class="flex-1 py-3 font-semibold text-pink-600 border-b-2 border-pink-600">
          Login
        </button>
        <button id="registerTab" class="flex-1 py-3 font-semibold text-gray-400">
          Cadastro
        </button>
      </div>
      
      <!-- Login Form -->
      <form id="loginForm" class="space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="loginEmail" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="seu@email.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha</label>
          <input type="password" id="loginPassword" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="••••••••">
        </div>
        <button type="submit" class="w-full gradient-pink text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">
          Entrar
        </button>
      </form>
      
      <!-- Register Form -->
      <form id="registerForm" class="hidden space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
          <input type="text" id="registerName" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Seu nome completo">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" id="registerEmail" required
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="seu@email.com">
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Senha (mín. 6 caracteres)</label>
          <input type="password" id="registerPassword" required minlength="6"
            class="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="••••••••">
        </div>
        <button type="submit" class="w-full gradient-pink text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">
          Criar conta
        </button>
      </form>
      
      <div id="authError" class="hidden mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm"></div>
    </div>
  </div>

  <!-- Main App -->
  <div id="app" class="hidden">
    <!-- Header -->
    <header class="glass sticky top-0 z-30 shadow-lg">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="w-10 h-10 gradient-pink rounded-full flex items-center justify-center">
              <i class="fas fa-wallet text-white"></i>
            </div>
            <div>
              <h1 class="text-xl font-bold text-gray-800">Hub Financeiro</h1>
              <p class="text-xs text-gray-600">Bem-vindo, <span id="userName">Usuário</span>!</p>
            </div>
          </div>
          
          <div class="flex items-center space-x-2">
            <button id="logoutBtn" class="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 font-medium">
              <i class="fas fa-sign-out-alt mr-2"></i>Sair
            </button>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- KPI Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover fade-in">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Receitas</h3>
            <div class="w-10 h-10 gradient-green rounded-lg flex items-center justify-center">
              <i class="fas fa-arrow-up text-white"></i>
            </div>
          </div>
          <p id="kpiIncome" class="text-3xl font-bold text-gray-800">R$ 0,00</p>
          <p class="text-xs text-gray-500 mt-1">Este mês</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover fade-in" style="animation-delay: 0.1s">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Despesas</h3>
            <div class="w-10 h-10 gradient-pink rounded-lg flex items-center justify-center">
              <i class="fas fa-arrow-down text-white"></i>
            </div>
          </div>
          <p id="kpiExpense" class="text-3xl font-bold text-gray-800">R$ 0,00</p>
          <p class="text-xs text-gray-500 mt-1">Este mês</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover fade-in" style="animation-delay: 0.2s">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">Saldo</h3>
            <div class="w-10 h-10 gradient-blue rounded-lg flex items-center justify-center">
              <i class="fas fa-wallet text-white"></i>
            </div>
          </div>
          <p id="kpiBalance" class="text-3xl font-bold text-gray-800">R$ 0,00</p>
          <p class="text-xs text-gray-500 mt-1">Receitas - Despesas</p>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 card-hover fade-in" style="animation-delay: 0.3s">
          <div class="flex items-center justify-between mb-2">
            <h3 class="text-sm font-medium text-gray-600">% Gasto</h3>
            <div class="w-10 h-10 gradient-purple rounded-lg flex items-center justify-center">
              <i class="fas fa-chart-pie text-white"></i>
            </div>
          </div>
          <p id="kpiPercent" class="text-3xl font-bold text-gray-800">0%</p>
          <div class="w-full bg-gray-200 rounded-full h-2 mt-2">
            <div id="kpiPercentBar" class="gradient-pink h-2 rounded-full transition-all" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div class="bg-white rounded-xl shadow-lg p-6 fade-in">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Despesas por Categoria</h2>
          <canvas id="categoryChart"></canvas>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 fade-in">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Orçamentos</h2>
          <div id="budgetList" class="space-y-3"></div>
        </div>
      </div>

      <!-- Accounts & Quick Add -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div class="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 fade-in">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Lançamento Rápido</h2>
          <form id="quickAddForm" class="space-y-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <select id="quickType" class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                <option value="expense">Despesa (-)</option>
                <option value="income">Receita (+)</option>
              </select>
              
              <input type="date" id="quickDate" required
                class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
              
              <input type="text" id="quickDesc" required placeholder="Descrição"
                class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
              
              <input type="number" id="quickAmount" required step="0.01" placeholder="Valor"
                class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
              
              <select id="quickAccount" class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                <option value="">Selecione a conta</option>
              </select>
              
              <select id="quickCategory" class="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500">
                <option value="">Categoria (opcional)</option>
              </select>
            </div>
            
            <button type="submit" class="w-full gradient-pink text-white font-semibold py-3 rounded-lg hover:opacity-90 transition">
              <i class="fas fa-plus mr-2"></i>Adicionar Transação
            </button>
          </form>
        </div>
        
        <div class="bg-white rounded-xl shadow-lg p-6 fade-in">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Contas</h2>
          <div id="accountsList" class="space-y-3"></div>
          <button id="addAccountBtn" class="w-full mt-4 px-4 py-2 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-pink-500 hover:text-pink-500 transition">
            <i class="fas fa-plus mr-2"></i>Nova Conta
          </button>
        </div>
      </div>

      <!-- Transactions Table -->
      <div class="bg-white rounded-xl shadow-lg p-6 fade-in">
        <div class="flex items-center justify-between mb-4">
          <h2 class="text-lg font-bold text-gray-800">Transações Recentes</h2>
          <div class="flex space-x-2">
            <select id="filterType" class="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="">Todos</option>
              <option value="income">Receitas</option>
              <option value="expense">Despesas</option>
            </select>
          </div>
        </div>
        
        <div class="overflow-x-auto">
          <table class="min-w-full">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Data</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Descrição</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Categoria</th>
                <th class="text-left py-3 px-4 text-sm font-semibold text-gray-600">Conta</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-gray-600">Valor</th>
                <th class="text-right py-3 px-4 text-sm font-semibold text-gray-600">Ações</th>
              </tr>
            </thead>
            <tbody id="transactionsList"></tbody>
          </table>
        </div>
      </div>
    </main>
  </div>

  <script src="/static/app.js"></script>
</body>
</html>
  `);
});

export default app;

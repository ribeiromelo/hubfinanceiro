# 💰 Hub Financeiro Pro

Um sistema completo de gestão financeira pessoal com autenticação segura, banco de dados em nuvem e interface moderna.

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- 🔐 **Registro de usuários** com validação de email e senha
- 🔑 **Login seguro** com JWT (JSON Web Tokens)
- 🔒 **Proteção de dados** com hash de senha SHA-256
- 👤 **Multi-usuário** - cada pessoa tem seus próprios dados isolados

### 💳 Gestão de Contas
- **Contas bancárias** (conta corrente, poupança, investimentos)
- **Cartões de crédito** (com limite, data de fechamento e vencimento)
- **Saldos em tempo real** atualizados automaticamente

### 📊 Controle de Transações
- ➕ **Lançamento rápido** de receitas e despesas
- 🏷️ **Categorização automática** com ícones e cores
- 📅 **Filtros por data** (mensal)
- 🔍 **Filtros por tipo** (receita/despesa)
- 🗑️ **Exclusão de transações**

### 📈 Dashboard Inteligente
- 💵 **KPIs em tempo real**: Receitas, Despesas, Saldo, % Gasto
- 📊 **Gráfico de pizza** mostrando despesas por categoria
- 🎯 **Orçamentos por categoria** com barras de progresso
- 🔴 **Alertas visuais** quando ultrapassa orçamento

### 🎨 Design Moderno
- 🌈 **Interface profissional** com gradientes e animações
- 📱 **Responsivo** (funciona em desktop, tablet e mobile)
- ⚡ **Animações suaves** e transições fluidas
- 🎨 **Cores vibrantes** para cada categoria

## 🌐 URLs de Acesso

### 🚀 Aplicação em Produção (Sandbox)
**URL Pública**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai

### 📡 Endpoints da API
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário autenticado
- `GET /api/accounts` - Listar contas
- `POST /api/accounts` - Criar conta
- `GET /api/categories` - Listar categorias
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `GET /api/transactions/stats` - Estatísticas (KPIs)
- `DELETE /api/transactions/:id` - Excluir transação

## 🏗️ Arquitetura Técnica

### Backend
- ⚡ **Hono Framework** - Framework web ultra-rápido para Cloudflare Workers
- 💾 **Cloudflare D1** - Banco de dados SQLite distribuído globalmente
- 🔐 **JWT Authentication** - Autenticação stateless com tokens
- 🌐 **RESTful API** - APIs bem estruturadas e documentadas

### Frontend
- 🎨 **Tailwind CSS** - Framework CSS utility-first
- 📊 **Chart.js** - Biblioteca de gráficos interativos
- 🔌 **Axios** - Cliente HTTP para comunicação com API
- ✨ **Vanilla JavaScript** - Performance máxima sem frameworks pesados

### Banco de Dados
**Tabelas principais:**
- `users` - Usuários do sistema
- `accounts` - Contas bancárias e cartões
- `categories` - Categorias de transações (com orçamentos)
- `transactions` - Todas as transações financeiras

## 🚀 Como Usar

### 1️⃣ Primeiro Acesso
1. Acesse a URL: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai
2. Clique em **"Cadastro"**
3. Preencha: Nome, Email, Senha (mínimo 6 caracteres)
4. Clique em **"Criar conta"**

### 2️⃣ Após o Login
Você será redirecionado para o **Dashboard** com:
- ✅ 10 categorias padrão já criadas (Alimentação, Mercado, Transporte, etc)
- ✅ Interface pronta para uso

### 3️⃣ Adicionar uma Conta
1. No card **"Contas"** (lado direito), clique em **"+ Nova Conta"**
2. Digite o nome (ex: "Nubank", "Banco do Brasil")
3. Escolha o tipo:
   - `1` = Conta corrente/poupança
   - `2` = Cartão de crédito
4. Informe saldo inicial (ou limite do cartão)

### 4️⃣ Lançar Transações
No formulário **"Lançamento Rápido"**:
1. Escolha o tipo (Receita ou Despesa)
2. Selecione a data
3. Digite a descrição (ex: "Supermercado", "Salário")
4. Informe o valor
5. Escolha a conta
6. Selecione a categoria (opcional)
7. Clique em **"Adicionar Transação"**

### 5️⃣ Visualizar Estatísticas
- 📊 **KPIs no topo**: Receitas, Despesas, Saldo, % Gasto
- 🍩 **Gráfico de pizza**: Distribuição de despesas por categoria
- 📊 **Barras de progresso**: Quanto gastou vs. orçamento de cada categoria
- 📋 **Tabela**: Últimas 20 transações

## 🔧 Desenvolvimento Local

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Comandos

```bash
# Instalar dependências
npm install

# Aplicar migrations no banco local
npm run db:migrate:local

# Build do projeto
npm run build

# Iniciar servidor local (sandbox)
npm run dev:sandbox

# Ou usar PM2 (daemon)
pm2 start ecosystem.config.cjs

# Ver logs
pm2 logs webapp --nostream

# Parar servidor
pm2 delete webapp
```

### Estrutura de Pastas

```
webapp/
├── src/
│   ├── index.tsx              # Arquivo principal (HTML + rotas)
│   ├── routes/
│   │   ├── auth.ts            # Rotas de autenticação
│   │   ├── accounts.ts        # Rotas de contas
│   │   ├── categories.ts      # Rotas de categorias
│   │   └── transactions.ts    # Rotas de transações
│   ├── middleware/
│   │   └── auth.ts            # Middleware de autenticação JWT
│   ├── utils/
│   │   └── auth.ts            # Funções de hash e JWT
│   └── types/
│       └── index.ts           # Tipos TypeScript
├── public/
│   └── static/
│       └── app.js             # Frontend JavaScript
├── migrations/
│   └── 0001_initial_schema.sql # Schema do banco
├── wrangler.toml              # Config Cloudflare
└── package.json
```

## 📊 Modelos de Dados

### User (Usuário)
```typescript
{
  id: number
  email: string
  password_hash: string
  name: string
  created_at: string
}
```

### Account (Conta)
```typescript
{
  id: number
  user_id: number
  name: string
  type: 'account' | 'card'
  balance: number
  card_limit?: number
  card_closing_day?: number
  card_due_day?: number
}
```

### Transaction (Transação)
```typescript
{
  id: number
  user_id: number
  account_id: number
  category_id: number | null
  description: string
  amount: number  // negativo = despesa, positivo = receita
  type: 'income' | 'expense'
  date: string
  tags: string
}
```

### Category (Categoria)
```typescript
{
  id: number
  user_id: number
  name: string
  budget_limit: number
  color: string
  icon: string
}
```

## 🎯 Próximos Passos Recomendados

### Features Futuras
1. 📱 **App mobile** (PWA)
2. 📧 **Recuperação de senha** via email
3. 📊 **Relatórios PDF** exportáveis
4. 🔔 **Notificações** quando atingir 80% do orçamento
5. 📈 **Gráficos de linha** (evolução temporal)
6. 🔄 **Transações recorrentes** (assinaturas, contas fixas)
7. 💱 **Multi-moeda** (dólar, euro, etc)
8. 👥 **Compartilhamento** de contas com família
9. 🏦 **Integração bancária** (Open Banking)
10. 🤖 **IA para sugestões** de economia

### Melhorias Técnicas
- ⚡ Implementar **cache** para queries frequentes
- 🔒 Usar **bcrypt/argon2** para hash de senha (quando disponível em Workers)
- 📊 **Pagination** para lista de transações
- 🔍 **Busca avançada** com múltiplos filtros
- 📤 **Export/Import CSV** de transações
- 🌙 **Modo escuro** (dark mode)
- 🎨 **Temas personalizáveis**

## 🔐 Segurança

- ✅ **Senhas com hash** SHA-256 (considerar bcrypt em produção)
- ✅ **JWT tokens** com expiração de 7 dias
- ✅ **CORS configurado** para segurança de API
- ✅ **Validação de entrada** em todas as rotas
- ✅ **SQL Injection** protegido (prepared statements)
- ✅ **Dados isolados** por usuário (user_id em todas queries)

## 📝 Status do Projeto

✅ **PRONTO PARA USO!**

### O que está funcionando:
- ✅ Autenticação completa (registro + login)
- ✅ CRUD de contas e cartões
- ✅ CRUD de transações
- ✅ Dashboard com KPIs e gráficos
- ✅ Orçamentos por categoria
- ✅ Interface responsiva e moderna
- ✅ Banco de dados D1 (local e pronto para produção)

### Limitações atuais:
- ⚠️ Rodando em **ambiente sandbox** (URL temporária)
- ⚠️ Banco de dados **local** (não persistido após restart do sandbox)
- ⚠️ Sem deploy em **produção Cloudflare** ainda

## 🚀 Deploy para Produção Cloudflare

Para fazer deploy permanente:

```bash
# 1. Criar banco D1 de produção
npx wrangler d1 create webapp-production

# 2. Copiar o database_id para wrangler.toml

# 3. Aplicar migrations
npm run db:migrate:prod

# 4. Deploy
npm run deploy:prod
```

## 📱 Screenshots

(O sistema possui uma interface moderna com gradientes pink/purple, cards com shadow, animações suaves e gráficos interativos)

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

## 📄 Licença

MIT License - Use como quiser! 🎉

---

**Desenvolvido com ❤️ usando Hono + Cloudflare Workers + D1**

**URL de Acesso**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai

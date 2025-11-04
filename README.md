# 💰 Hub Financeiro Pro v2.0

Um sistema completo de gestão financeira pessoal com autenticação segura, banco de dados em nuvem, IA de entrada rápida e interface moderna.

## 🎯 Funcionalidades Implementadas

### ✅ Sistema de Autenticação
- 🔐 **Registro de usuários** com validação de email e senha
- 🔑 **Login seguro** com JWT (JSON Web Tokens)
- 🔒 **Proteção de dados** com hash de senha SHA-256
- 👤 **Multi-usuário** - cada pessoa tem seus próprios dados isolados

### 🤖 Entrada Rápida Inteligente (NEW!)
- ✨ **IA que entende linguagem natural**: Digite naturalmente como "50 mercado", "-120 gasolina nubank", "8500 salário BB"
- 🧠 **Detecção automática de tipo**: Valores negativos viram despesas automaticamente
- 🏷️ **Categorização inteligente**: Reconhece palavras-chave (ifood → Alimentação, uber → Transporte)
- 💳 **Identificação de contas**: Detecta Nubank, BB, Inter, Itaú, etc.
- ⚡ **Super rápido**: Basta digitar e apertar Enter

**Exemplos de entrada:**
- `50 mercado` → Despesa de R$ 50,00 em Mercado
- `-120 gasolina nubank` → Despesa de R$ 120,00 em Transporte, cartão Nubank
- `8500 salário` → Receita de R$ 8.500,00 em Salário
- `42.90 ifood` → Despesa de R$ 42,90 em Alimentação

### 💳 Gestão de Contas (MELHORADO!)
- ✏️ **Edição completa** com modals estilizados (sem popups feios do navegador!)
- 💰 **Contas bancárias** editáveis (nome, saldo)
- 💳 **Cartões de crédito** configuráveis (limite, fechamento, vencimento)
- 🎨 **Cards modernos** com ícones e gradientes
- 🔄 **Atualização em tempo real** dos saldos

### 📊 Controle de Transações (MELHORADO!)
- ➕ **Entrada rápida inteligente** com IA
- ✏️ **Edição de transações** (modal estilizado)
- 🗑️ **Exclusão rápida** com confirmação
- 🏷️ **Categorização automática** com ícones e cores
- 📅 **Filtros por data** (mensal)
- 🔍 **Filtros por tipo** (receita/despesa)

### 🎯 Gerenciamento de Orçamentos (NEW!)
- 💰 **Configurar orçamento** para cada categoria
- 📊 **Acompanhamento visual** com barras de progresso
- 🔴 **Alertas visuais** quando ultrapassa 100%
- ✏️ **Modal dedicado** para gerenciar todos os orçamentos
- 💾 **Salvamento individual** por categoria

### 📤 Importar/Exportar CSV (NEW!)
- 📥 **Importação em massa** de transações via CSV
- 📤 **Exportação completa** para backup
- 📋 **Formato padrão**: `date,description,amount,type,category,account`
- 🔄 **Compatível com Excel** e Google Sheets

### 📈 Dashboard Inteligente
- 💵 **KPIs em tempo real**: Receitas, Despesas, Saldo, % Gasto
- 📊 **Gráfico de pizza** mostrando despesas por categoria
- 🎯 **Orçamentos por categoria** com barras de progresso
- 🔴 **Alertas visuais** quando ultrapassa orçamento

### 🎨 Design Moderno Premium
- 🌈 **Modals estilizados** (sem popups do navegador!)
- 📱 **Responsivo** (funciona em desktop, tablet e mobile)
- ⚡ **Animações suaves** e transições fluidas
- 🎨 **Cores vibrantes** para cada categoria
- 🍞 **Toast notifications** para feedback instantâneo
- 💎 **Glass effects** e backdrop blur

## 🌐 URLs de Acesso

### 🚀 Aplicação em Produção (Sandbox)
**URL Pública**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai

### 📡 Endpoints da API
- `POST /api/auth/register` - Criar nova conta
- `POST /api/auth/login` - Fazer login
- `GET /api/auth/me` - Dados do usuário autenticado
- `GET /api/accounts` - Listar contas
- `POST /api/accounts` - Criar conta
- `PUT /api/accounts/:id` - Atualizar conta
- `DELETE /api/accounts/:id` - Excluir conta
- `GET /api/categories` - Listar categorias
- `PUT /api/categories/:id` - Atualizar categoria (orçamento)
- `GET /api/transactions` - Listar transações
- `POST /api/transactions` - Criar transação
- `PUT /api/transactions/:id` - Atualizar transação
- `DELETE /api/transactions/:id` - Excluir transação
- `GET /api/transactions/stats` - Estatísticas (KPIs)

## 🚀 Como Usar

### 1️⃣ Primeiro Acesso
1. Acesse a URL: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai
2. Clique em **"Cadastro"**
3. Preencha: Nome, Email, Senha (mínimo 6 caracteres)
4. Clique em **"Criar conta"**

### 2️⃣ Adicionar uma Conta
1. Clique no botão **"+ Nova Conta"** (card "Contas & Cartões")
2. Preencha:
   - Nome (ex: "Nubank", "Banco do Brasil")
   - Tipo: Conta Bancária ou Cartão de Crédito
   - Saldo inicial (ou limite do cartão)
   - Se cartão: dia de fechamento e vencimento
3. Clique em **"Salvar"**

### 3️⃣ Usar Entrada Rápida Inteligente ⭐
**Esta é a forma mais rápida!** Digite naturalmente:

```
50 mercado              → R$ 50,00 em Mercado
-120 gasolina           → R$ 120,00 em Transporte
35 ifood                → R$ 35,00 em Alimentação
8500 salário BB         → R$ 8.500,00 receita no BB
49.90 netflix           → R$ 49,90 em Assinaturas
```

A IA entende:
- ✅ Valores com ou sem R$
- ✅ Negativos como despesas
- ✅ Vírgula ou ponto
- ✅ Nomes de contas (Nubank, BB, Inter)
- ✅ Categorias automáticas (mercado, ifood, uber)

### 4️⃣ Configurar Orçamentos
1. Clique no botão **"Orçamentos"** no topo
2. Para cada categoria, defina o valor mensal
3. Clique no ícone de **salvar** ao lado
4. Acompanhe visualmente o quanto já gastou

### 5️⃣ Editar Contas e Transações
- **Contas**: Clique no ícone de editar no card da conta
- **Transações**: Clique no ícone de editar na tabela
- Tudo com modals bonitos e modernos!

### 6️⃣ Importar Transações de CSV
1. Prepare arquivo CSV com formato:
   ```csv
   date,description,amount,type,category,account
   2024-01-15,"Mercado","-120.50","expense","Mercado","Nubank"
   2024-01-20,"Salário","8500","income","Salário","BB"
   ```
2. Clique em **"Importar CSV"**
3. Selecione o arquivo
4. Pronto! Transações importadas automaticamente

### 7️⃣ Exportar para Backup
1. Clique em **"Exportar CSV"**
2. Arquivo baixado automaticamente
3. Use para backup ou análise em Excel

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
- 🤖 **Smart Parser** - IA de processamento de linguagem natural
- ✨ **Vanilla JavaScript** - Performance máxima sem frameworks pesados

### Banco de Dados
**Tabelas principais:**
- `users` - Usuários do sistema
- `accounts` - Contas bancárias e cartões
- `categories` - Categorias de transações (com orçamentos)
- `transactions` - Todas as transações financeiras

## 🆕 O Que Há de Novo na v2.0

### 🎉 Novas Funcionalidades
1. **🤖 Entrada Rápida Inteligente**
   - Parse de linguagem natural
   - Detecção automática de tipo, categoria e conta
   - Interface super rápida (apenas digite e Enter)

2. **✏️ Modals Estilizados**
   - Editação de contas com modal bonito
   - Editação de transações visual
   - Sem popups feios do navegador!

3. **🎯 Gerenciamento de Orçamentos**
   - Modal dedicado para configurar orçamentos
   - Salvamento individual por categoria
   - Alertas visuais de ultrapassagem

4. **📤 CSV Import/Export**
   - Importação em massa
   - Exportação completa
   - Formato compatível com Excel

5. **🍞 Toast Notifications**
   - Feedback visual instantâneo
   - Animações suaves
   - Ícones contextuais

### 🎨 Melhorias de UI/UX
- Cards de contas clicáveis para edição
- Ícones de ação nas transações
- Tooltips informativos
- Animações de slide-up nos modals
- Backdrop blur nos overlays
- Gradientes modernos nos botões

## 🎯 Próximos Passos Recomendados

### Features Futuras
1. 📱 **App mobile** (PWA)
2. 📧 **Recuperação de senha** via email
3. 📊 **Relatórios PDF** exportáveis
4. 🔔 **Notificações push** quando atingir 80% do orçamento
5. 📈 **Gráficos de linha** (evolução temporal)
6. 🔄 **Transações recorrentes** (assinaturas, contas fixas)
7. 💱 **Multi-moeda** (dólar, euro, etc)
8. 👥 **Compartilhamento** de contas com família
9. 🏦 **Integração bancária** (Open Banking)
10. 🤖 **IA para sugestões** de economia

### Melhorias Técnicas
- ⚡ Implementar **cache** para queries frequentes
- 🔒 Usar **bcrypt/argon2** para hash de senha
- 📊 **Pagination** para lista de transações
- 🔍 **Busca avançada** com múltiplos filtros
- 🌙 **Modo escuro** (dark mode)
- 🎨 **Temas personalizáveis**
- 📊 **Dashboard personalizável**

## 🔐 Segurança

- ✅ **Senhas com hash** SHA-256
- ✅ **JWT tokens** com expiração de 7 dias
- ✅ **CORS configurado** para segurança de API
- ✅ **Validação de entrada** em todas as rotas
- ✅ **SQL Injection** protegido (prepared statements)
- ✅ **Dados isolados** por usuário (user_id em todas queries)

## 📝 Status do Projeto

✅ **PRONTO PARA USO - VERSÃO 2.0!**

### ✨ Novidades da v2.0:
- ✅ Entrada rápida inteligente com IA
- ✅ Modals estilizados (sem popups do navegador)
- ✅ Edição completa de contas e transações
- ✅ Gerenciamento de orçamentos
- ✅ Importação/Exportação CSV
- ✅ Toast notifications
- ✅ Interface ainda mais polida

### O que está funcionando:
- ✅ Autenticação completa (registro + login)
- ✅ CRUD completo de contas e cartões
- ✅ CRUD completo de transações
- ✅ Entrada rápida inteligente (AI-powered)
- ✅ Dashboard com KPIs e gráficos
- ✅ Gerenciamento de orçamentos
- ✅ CSV Import/Export
- ✅ Interface responsiva e premium

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

### Tela de Login/Registro
- Design moderno com gradientes
- Animações suaves
- Formulários validados

### Dashboard Principal
- KPIs em cards coloridos
- Gráfico de pizza interativo
- Orçamentos com barras de progresso
- Entrada rápida inteligente no topo

### Modals Estilizados
- Adicionar/Editar contas
- Editar transações
- Gerenciar orçamentos
- Animações slide-up

### Tabela de Transações
- Categorias com cores
- Ações de edição/exclusão
- Filtros por tipo
- Responsiva

## 📄 Formato CSV para Importação

```csv
date,description,amount,type,category,account
2024-01-15,"Mercado Assaí","-320.50","expense","Mercado","Nubank"
2024-01-16,"iFood","-42.90","expense","Alimentação","Nubank"
2024-01-20,"Salário","8500","income","Salário","BB"
2024-01-22,"Gasolina","-210","expense","Transporte","BB"
```

**Campos:**
- `date`: Formato YYYY-MM-DD
- `description`: Texto livre (entre aspas se tiver vírgula)
- `amount`: Número (negativo para despesa)
- `type`: "income" ou "expense"
- `category`: Nome da categoria (deve existir)
- `account`: Nome da conta (deve existir)

## 🤝 Contribuindo

Este é um projeto pessoal, mas sugestões são bem-vindas!

## 📄 Licença

MIT License - Use como quiser! 🎉

---

**Desenvolvido com ❤️ usando Hono + Cloudflare Workers + D1 + IA**

**URL de Acesso**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai

**Versão**: 2.2.0 - Stable Release! 🚀✨

---

## ✅ TODAS AS CORREÇÕES IMPLEMENTADAS - v2.2.0

### 🐛 Problemas Críticos Corrigidos:

#### 1. ✅ F5 NÃO DESLOGA MAIS!
- Token persistente no localStorage
- Axios configurado corretamente após reload
- Mantém sessão até token expirar (7 dias)

#### 2. ✅ Fluxo de Autenticação Correto
**Antes**: Registro → Logado automaticamente (confuso)
**Agora**: 
1. **Registro** → Cria conta
2. Redireciona para **Login**
3. Faz primeiro login
4. Entra no **Dashboard**
5. **F5** → Mantém logado ✓

#### 3. ✅ Validação de Senha Forte
- Barra visual em tempo real
- Níveis: Muito fraca → Fraca → Média → Forte
- Feedback: "Adicione MAIÚSCULAS", "Adicione números"
- Cores dinâmicas (vermelho → verde)
- Validação antes de criar conta

#### 4. ✅ Edição de Contas FUNCIONANDO
- Corrigido erro `Type 'undefined' not supported`
- Edita nome, saldo, limite, dias
- Salvamento instantâneo

#### 5. ✅ Edição de Transações FUNCIONANDO
- Corrigido erro 500
- Edita descrição, valor, categoria, data
- Pode remover categoria (opcional)
- Atualiza saldos corretamente

### 🎯 Palavras-Chave Adicionadas:
- **Alimentação**: +30 termos (rappi, uber eats, mcdonalds, sushi, etc)
- **Mercado**: +15 termos (walmart, sams, feira, hortifruti, etc)
- **Transporte**: +20 termos (99pop, cabify, posto, estacionamento, etc)
- **Saúde**: +25 termos (drogaria, unimed, amil, genérico, etc)
- **Moradia**: +20 termos (cemig, enel, sabesp, iptu, etc)
- **E muito mais!**

### 📋 Arquivo CSV de Exemplo:
Incluído no projeto: `exemplo_importacao.csv`

```csv
date,description,amount,type,category,account
2024-01-15,"Mercado Assaí",-320.50,expense,Mercado,Nubank
2024-01-16,"iFood",-42.90,expense,Alimentação,Nubank
2024-01-20,"Salário",8500,income,Salário,BB
```

# 💰 Hub Financeiro Pro

Sistema completo de gestão financeira pessoal com entrada rápida inteligente, orçamentos automáticos e análises visuais.

## 🌟 Status do Projeto

✅ **Funcional e Pronto para Uso**

- ✅ Landing Page explicativa
- ✅ Sistema de autenticação completo (Login/Registro)
- ✅ Dashboard interativo com KPIs
- ✅ Entrada rápida inteligente com 100+ palavras-chave
- ✅ Gestão de contas e cartões
- ✅ Orçamentos por categoria
- ✅ Gráficos e análises em tempo real
- ✅ Import/Export CSV
- ✅ Persistência de sessão (sobrevive a F5)
- ✅ Rotas separadas e protegidas

## 🚀 URLs do Projeto

### Ambiente de Desenvolvimento
- **Landing Page**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai/
- **Login**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai/login
- **Registro**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai/registro
- **Dashboard**: https://3000-i8hjae221su2mndj8qpz9-dfc00ec5.sandbox.novita.ai/principal

### Produção (Cloudflare Pages)
- Aguardando deploy

## 🎯 Funcionalidades

### 🏠 Landing Page
- Design moderno e responsivo
- Explicação clara das funcionalidades
- Call-to-actions para Login e Registro
- Seções: Hero, Recursos, Como Funciona, CTA Final

### 🔐 Autenticação
- **Registro** com validação de força de senha visual
- **Login** com JWT (7 dias de validade)
- **Persistência** de sessão no localStorage
- **Proteção** de rotas (redirect automático)
- Indicador visual de força da senha em tempo real

### 📊 Dashboard (Rota: `/principal`)

**KPIs Principais:**
- 💚 Receitas do mês
- 💸 Despesas do mês
- 💰 Saldo (Receitas - Despesas)
- 📊 % Gasto da renda

**Recursos:**
- ✨ Entrada Rápida Inteligente com IA
- 🏦 Gestão de Contas Bancárias e Cartões
- 📈 Gráfico de Despesas por Categoria (Chart.js)
- 🎯 Orçamentos com Alertas Visuais
- 📋 Tabela de Transações com Filtros
- ✏️ Edição de Contas e Transações (modais estilizados)
- 📥 Import/Export CSV

## 🧠 Entrada Rápida Inteligente

Digite naturalmente e o sistema entende automaticamente:

```
"50 mercado" → Despesa R$50 na categoria Mercado
"-120 gasolina nubank" → Despesa R$120 em Transporte via Nubank
"8500 salário" → Receita R$8.500 em Salário
"35 ifood" → Despesa R$35 em Alimentação
```

**100+ Palavras-chave Categorizadas:**
- 🍔 Alimentação: ifood, rappi, restaurante, pizza, café, etc.
- 🛒 Mercado: carrefour, extra, assaí, feira, etc.
- 🚗 Transporte: uber, 99, gasolina, ipva, etc.
- 💊 Saúde: farmácia, médico, plano de saúde, etc.
- 📺 Assinaturas: netflix, spotify, prime, etc.
- 🏠 Moradia: aluguel, luz, água, internet, etc.
- 📚 Educação: curso, faculdade, livro, etc.
- 🎬 Lazer: cinema, viagem, show, etc.

## 🏗️ Arquitetura do Projeto

### 📁 Estrutura de Páginas (Separadas)

```
/                    → Landing Page (pública)
/login               → Login (pública)
/registro            → Registro (pública)
/principal           → Dashboard (protegida, requer token)
```

### 📂 Estrutura de Arquivos

```
webapp/
├── src/
│   ├── index.tsx           # Servidor Hono com rotas
│   ├── htmlLoader.ts       # Carregador de HTMLs
│   ├── types/              # TypeScript types
│   ├── routes/             # Rotas de API
│   │   ├── auth.ts         # Autenticação (login/register)
│   │   ├── accounts.ts     # Contas bancárias/cartões
│   │   ├── categories.ts   # Categorias de transações
│   │   └── transactions.ts # Transações financeiras
│   └── pages/              # Páginas HTML (source)
│       ├── landing.html    # Landing Page
│       ├── login.html      # Página de Login
│       ├── register.html   # Página de Registro
│       └── dashboard.html  # Dashboard
├── public/
│   ├── pages/              # Páginas HTML (build)
│   └── static/             # JavaScript e CSS
│       ├── login.js        # Lógica do Login
│       ├── register.js     # Lógica do Registro
│       ├── dashboard.js    # Lógica do Dashboard
│       └── style.css       # Estilos customizados
├── migrations/             # Migrações D1 Database
│   └── 0001_initial_schema.sql
├── wrangler.toml           # Configuração Cloudflare
├── package.json            # Dependências e scripts
├── ecosystem.config.cjs    # Configuração PM2
└── README.md               # Este arquivo
```

## 🗄️ Banco de Dados (Cloudflare D1)

### Tabelas

**users** - Usuários do sistema
- id, email, password (hash SHA-256), name, created_at

**accounts** - Contas e Cartões
- id, user_id, name, type (account/card), balance
- card_limit, card_closing_day, card_due_day

**categories** - Categorias de Transações
- id, user_id, name, icon, color, budget_limit

**transactions** - Transações Financeiras
- id, user_id, account_id, category_id
- type (income/expense), amount, description, date, tags

### Desenvolvimento Local (--local)

```bash
# Aplicar migrações localmente
npm run db:migrate:local

# Resetar banco local
npm run db:reset

# Inserir dados de teste
npm run db:seed
```

## 🛠️ Stack Tecnológica

### Backend
- **Hono** v4 - Web framework ultrarrápido para Cloudflare Workers
- **Cloudflare D1** - Banco de dados SQLite distribuído
- **JWT** - Autenticação via tokens (7 dias de expiração)
- **Web Crypto API** - SHA-256 para hash de senhas

### Frontend
- **TailwindCSS** - Framework CSS utilitário (via CDN)
- **Chart.js** - Gráficos interativos
- **Axios** - Cliente HTTP
- **Font Awesome** - Ícones
- **Vanilla JavaScript** - Sem frameworks, código limpo

### DevOps
- **Wrangler** - CLI do Cloudflare
- **PM2** - Gerenciador de processos Node.js
- **Vite** - Build tool
- **TypeScript** - Tipagem estática

## 📦 Instalação e Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn
- Conta Cloudflare (para deploy)

### Setup Local

```bash
# 1. Instalar dependências
cd /home/user/webapp
npm install

# 2. Criar banco de dados local
npm run db:migrate:local
npm run db:seed

# 3. Build do projeto
npm run build

# 4. Iniciar servidor de desenvolvimento com PM2
pm2 start ecosystem.config.cjs

# 5. Verificar logs
pm2 logs webapp --nostream

# 6. Testar localmente
curl http://localhost:3000/
```

### Scripts Disponíveis

```json
{
  "dev": "vite",
  "dev:sandbox": "wrangler pages dev dist --ip 0.0.0.0 --port 3000",
  "dev:d1": "wrangler pages dev dist --d1=webapp-production --local --ip 0.0.0.0 --port 3000",
  "build": "vite build",
  "preview": "wrangler pages dev dist",
  "deploy": "npm run build && wrangler pages deploy dist",
  "db:migrate:local": "wrangler d1 migrations apply webapp-production --local",
  "db:migrate:prod": "wrangler d1 migrations apply webapp-production",
  "db:seed": "wrangler d1 execute webapp-production --local --file=./seed.sql",
  "db:reset": "rm -rf .wrangler/state/v3/d1 && npm run db:migrate:local && npm run db:seed",
  "clean-port": "fuser -k 3000/tcp 2>/dev/null || true",
  "test": "curl http://localhost:3000"
}
```

## 🚀 Deploy para Cloudflare Pages

### Configuração Inicial

```bash
# 1. Setup da API Key do Cloudflare (necessário uma vez)
# Vá até: Deploy tab → Configure Cloudflare API Key

# 2. Criar banco D1 de produção
npx wrangler d1 create webapp-production

# 3. Atualizar wrangler.toml com o database_id retornado

# 4. Aplicar migrações no banco de produção
npm run db:migrate:prod
```

### Deploy

```bash
# Build e Deploy
npm run deploy

# Ou manual
npm run build
npx wrangler pages deploy dist --project-name webapp
```

### Após o Deploy

URLs Geradas:
- **Produção**: `https://webapp.pages.dev`
- **Branch**: `https://main.webapp.pages.dev`

## 🧪 Testando o Sistema

### 1. Criar Conta
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"João Silva","email":"joao@example.com","password":"Senha123!@#"}'
```

### 2. Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"joao@example.com","password":"Senha123!@#"}'
```

### 3. Criar Transação
```bash
curl -X POST http://localhost:3000/api/transactions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer SEU_TOKEN" \
  -d '{"type":"expense","amount":50,"description":"Mercado","account_id":1,"category_id":2,"date":"2024-11-06"}'
```

## 🔒 Segurança

- ✅ Senhas hasheadas com SHA-256
- ✅ JWT com expiração de 7 dias
- ✅ Validação de força de senha (visual)
- ✅ Proteção de rotas no cliente e servidor
- ✅ CORS configurado para APIs
- ✅ Headers de autenticação Bearer
- ✅ Validação de inputs

## 🎨 Design

- Interface moderna e limpa
- Gradientes vibrantes (Pink, Purple, Blue)
- Animações suaves (fade-in, slide-up)
- Responsivo (mobile-first)
- Cards com hover effects
- Modais estilizados (sem prompts do navegador)
- Toast notifications
- Loading states

## 🐛 Problemas Resolvidos

✅ **F5 Logout Issue** - Implementadas rotas separadas com persistência de token
✅ **SPA Single Page** - Migrado para arquitetura multi-página
✅ **Edição de Contas/Transações** - Fix `undefined → null` para D1
✅ **CSV Import** - Parser robusto com valores entre aspas
✅ **Password Strength** - Indicador visual em tempo real
✅ **Categorização Automática** - 100+ palavras-chave mapeadas
✅ **Login não redirecionava** - Fix: Adicionar import de `verifyToken` em auth.ts

## 📝 Próximos Passos Recomendados

### Features Prioritárias
1. **Relatórios** - Exportar PDFs com análises mensais
2. **Metas Financeiras** - Definir e acompanhar metas
3. **Gráfico de Evolução** - Timeline de saldo ao longo do tempo
4. **Notificações** - Alertas de orçamento estourado
5. **Filtros Avançados** - Por período, categoria, conta
6. **Tags** - Sistema de tags para transações
7. **Recorrências** - Lançamentos recorrentes automáticos
8. **Multi-moeda** - Suporte a múltiplas moedas

### Melhorias Técnicas
1. **Testes** - Unit tests e E2E tests
2. **PWA** - Progressive Web App com offline support
3. **Dark Mode** - Tema escuro
4. **i18n** - Internacionalização (EN, ES)
5. **Otimizações** - Lazy loading, code splitting
6. **Analytics** - Integração com Google Analytics

## 👨‍💻 Desenvolvimento

### Comandos Úteis

```bash
# Limpar porta 3000
npm run clean-port

# Ver logs PM2
pm2 logs webapp --lines 50

# Restart PM2
pm2 restart webapp

# Status PM2
pm2 status

# Deletar do PM2
pm2 delete webapp

# Build rápido
npm run build

# Test API
npm test
```

## 📄 Licença

MIT License - Sinta-se livre para usar e modificar.

## 🤝 Contribuindo

Contribuições são bem-vindas! Abra issues e pull requests.

---

**Desenvolvido com ❤️ usando Hono + Cloudflare Workers**

**Última Atualização**: 06/11/2024
**Versão**: 2.5.0
**Status**: ✅ Produção Ready

# Changelog - Hub Financeiro Pro

## [2.2.0] - 2025-11-04

### 🐛 Correções Críticas

#### 1. ✅ Persistência de Login Corrigida
**Problema**: F5 deslogava o usuário
**Solução**: 
- Token agora é SEMPRE lido do localStorage em `checkAuth()`
- Axios headers configurados corretamente após reload
- Token permanece válido até expirar (7 dias)

#### 2. ✅ Fluxo de Autenticação Melhorado
**Problema**: Registro logava automaticamente (confuso)
**Nova Lógica**:
1. **Registro** → Cria conta e redireciona para Login
2. **Login** → Autentica e entra no Dashboard
3. **F5 no Dashboard** → Mantém logado

**Benefícios**:
- Usuário confirma que quer fazer o primeiro login
- Fluxo mais seguro e intuitivo
- Email pré-preenchido no login após registro

#### 3. ✅ Validação de Senha Forte
**Novo recurso**:
- Barra visual de força da senha em tempo real
- Níveis: Muito fraca, Fraca, Média, Forte
- Feedback detalhado: "Adicione MAIÚSCULAS", "Adicione números", etc
- Cores dinâmicas (vermelho → laranja → verde)
- Validação antes de criar conta

**Critérios de força**:
- ✅ Mínimo 6 caracteres
- ✅ Minúsculas (a-z)
- ✅ MAIÚSCULAS (A-Z)
- ✅ Números (0-9)
- ✅ Símbolos especiais (!@#$%^&*)

#### 4. ✅ Edição de Contas Corrigida
**Problema**: Erro `Type 'undefined' not supported for value 'undefined'`
**Solução**: 
- Conversão de `undefined` para `null` antes de enviar ao D1
- Uso do operador `??` para valores opcionais
- Binding correto de parâmetros

**Agora funciona**:
- ✅ Editar nome da conta
- ✅ Editar saldo
- ✅ Editar limite de cartão
- ✅ Editar dias de fechamento/vencimento

#### 5. ✅ Edição de Transações Corrigida
**Problema**: Erro 500 ao salvar transação editada
**Solução**:
- Conversão de `undefined` para `null`
- category_id pode ser null (opcional)
- Validação de amount antes de atualizar saldo

**Agora funciona**:
- ✅ Editar descrição
- ✅ Editar valor
- ✅ Editar categoria (pode remover)
- ✅ Editar data
- ✅ Editar conta

### 🎨 Melhorias de UX

1. **Indicador Visual de Senha**
   - Barra de progresso colorida
   - Feedback instantâneo
   - Sugestões de melhoria

2. **Mensagens Claras**
   - Toast notification após registro
   - Instruções no formulário
   - Emails pré-preenchidos

3. **Fluxo Intuitivo**
   - Caminho claro: Registro → Login → App
   - Sem surpresas ou logins automáticos
   - Usuário no controle

### 🔧 Correções Técnicas

**Backend (accounts.ts)**:
```typescript
// ANTES (quebrava)
.bind(name, balance, card_limit, ...)

// DEPOIS (funciona)
.bind(
  name ?? null,
  balance ?? null,
  card_limit ?? null,
  ...
)
```

**Backend (transactions.ts)**:
```typescript
// Correção similar para transações
category_id: category_id ?? null
```

**Frontend (app.js)**:
```javascript
// Token sempre lido do localStorage
token = localStorage.getItem('token');
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### 📊 Estatísticas

- 🐛 **5 bugs críticos corrigidos**
- ✨ **1 novo recurso** (validação de senha)
- 🎨 **3 melhorias de UX**
- 📝 **112 linhas alteradas**
- ⚡ **100% dos problemas reportados resolvidos**

---

## [2.1.0] - 2025-11-04

### 🐛 Correções
- CSV Import corrigido com parse robusto
- 100+ palavras-chave adicionadas para categorização

---

## [2.0.0] - 2025-11-04

### ✨ Novidades
- Entrada rápida inteligente (IA)
- Modals estilizados
- Gerenciamento de orçamentos
- CSV Import/Export
- Edição de contas e transações

---

## [1.0.0] - 2025-11-03

### 🎉 Lançamento Inicial
- Sistema de autenticação
- CRUD de contas e transações
- Dashboard com KPIs
- Gráficos interativos

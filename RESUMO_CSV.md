# 📊 Resumo Executivo - Importação CSV

## 🎯 Informação Essencial

### Formato Obrigatório do CSV:

```csv
date,description,amount,type,category,account
2024-03-15,"Compra no mercado",235.50,expense,"Mercado","Nubank"
```

---

## 📋 Colunas (6 obrigatórias na ordem exata)

| # | Coluna | Obrigatório? | Formato | Exemplo |
|---|--------|--------------|---------|---------|
| 1 | date | ✅ SIM | YYYY-MM-DD | `2024-03-15` |
| 2 | description | ❌ Não | Texto entre aspas | `"Compra no mercado"` |
| 3 | amount | ✅ SIM | Número positivo | `235.50` |
| 4 | type | ❌ Não | expense/income/transfer | `expense` |
| 5 | category | ❌ Não | Nome categoria | `"Mercado"` |
| 6 | account | ✅ SIM | Nome conta | `"Nubank"` |

---

## 🏷️ Categorias Aceitas (10 categorias padrão)

### 💸 DESPESAS (expense):
1. **Alimentação** 🍔 - Restaurantes, delivery
2. **Mercado** 🛒 - Supermercado, feira
3. **Transporte** 🚗 - Uber, gasolina, ônibus
4. **Saúde** 💊 - Farmácia, consultas
5. **Lazer** 🎮 - Cinema, jogos, viagens
6. **Educação** 📚 - Cursos, livros
7. **Moradia** 🏠 - Aluguel, contas
8. **Assinaturas** 📺 - Netflix, Spotify
9. **Outros** 📦 - Diversos

### 💰 RECEITAS (income):
10. **Salário** 💰 - Salários, freelances

---

## ⚠️ Regras Críticas

### ✅ FAÇA:
- Datas no formato `YYYY-MM-DD`
- Valores sempre **positivos** (ex: `150.50`)
- Use **ponto** (`.`) como decimal
- Categorias **exatamente** como acima
- Crie as **contas antes** de importar

### ❌ NÃO FAÇA:
- ❌ Datas brasileiras: `15/03/2024`
- ❌ Valores negativos: `-150.50`
- ❌ Vírgula decimal: `150,50`
- ❌ Categorias inventadas: `"Compras"`
- ❌ Contas inexistentes no sistema

---

## 🏦 Sobre Contas (IMPORTANTE!)

**Contas NÃO são criadas automaticamente!**

### Antes de importar:
1. Acesse: https://fermhubfinanceiro.pages.dev/principal
2. Clique em **"+ Nova Conta"**
3. Crie cada conta referenciada no CSV:
   - **Nubank** (ex: R$ 1.000 inicial)
   - **Carteira** (ex: R$ 500 inicial)
   - **Cartão de Crédito** (ex: R$ 0 inicial)

### No CSV, use exatamente o nome cadastrado:
```csv
date,description,amount,type,category,account
2024-03-15,"Compra",100,expense,"Mercado","Nubank"
                                            ^^^^^^ 
                                    Nome EXATO da conta
```

---

## 📝 Exemplo Mínimo Válido

```csv
date,description,amount,type,category,account
2024-03-01,"Salário",5500,income,"Salário","Nubank"
2024-03-05,"Mercado",235.50,expense,"Mercado","Nubank"
2024-03-10,"Uber",28.90,expense,"Transporte","Carteira"
```

---

## 🤖 Prompt Rápido para IA

```
Gere um CSV com este formato EXATO:

date,description,amount,type,category,account

Regras:
- date: YYYY-MM-DD (ex: 2024-03-15)
- amount: positivo, ponto decimal (ex: 125.50)
- type: expense ou income
- category: use APENAS estas 10:
  Alimentação, Mercado, Transporte, Saúde, Lazer, 
  Educação, Moradia, Assinaturas, Salário, Outros
- account: "Nubank", "Carteira" ou "Cartão de Crédito"

Gere 30 transações para março/2024, classe média brasileira.
```

---

## 🔍 Checklist Rápido

Antes de importar, verifique:

- [ ] Cabeçalho: `date,description,amount,type,category,account`
- [ ] Datas no formato `YYYY-MM-DD`
- [ ] Valores positivos com ponto decimal
- [ ] Categorias das 10 padrão
- [ ] Contas já criadas no sistema
- [ ] Arquivo salvo como `.csv`

---

## 🚀 Passo a Passo Rápido

1. **Criar contas** no dashboard primeiro
2. **Gerar/preparar** arquivo CSV
3. **Acessar** https://fermhubfinanceiro.pages.dev/principal
4. **Clicar** em "Importar CSV"
5. **Selecionar** arquivo
6. **Aguardar** mensagem de sucesso

---

## ❓ Problemas Comuns

### "Nenhuma transação importada"
→ Verifique formato do cabeçalho e datas

### "Conta não encontrada: XXX"
→ Crie a conta no dashboard primeiro

### "Erro na linha X"
→ Abra Console (F12) e veja detalhes

---

## 📚 Documentação Completa

📄 **Guia Detalhado:** `/GUIA_IMPORTACAO_CSV.md`  
🤖 **Prompt para IA:** `/PROMPT_PARA_IA.md`  
📊 **Exemplo CSV:** `/exemplo_csv_completo.csv`

---

## 🌐 Links Úteis

- **Sistema:** https://fermhubfinanceiro.pages.dev/
- **Dashboard:** https://fermhubfinanceiro.pages.dev/principal
- **GitHub:** https://github.com/ribeiromelo/hubfinanceiro

---

**Versão:** Hub Financeiro Pro v2.5.0  
**Última atualização:** 06/11/2024

# 📊 Guia Completo de Importação CSV - Hub Financeiro Pro

## 🎯 Resposta Direta à Sua Pergunta

Você perguntou sobre quais categorias são aceitas e como estruturar o CSV. Aqui está a resposta completa:

---

## 📋 Estrutura Obrigatória do CSV

### Cabeçalho (primeira linha):
```csv
date,description,amount,type,category,account
```

### Exemplo de linha de dados:
```csv
2024-03-15,"Compra no mercado",235.50,expense,"Mercado","Nubank"
```

---

## 🏷️ As 10 Categorias Aceitas (EXATAS)

### 💸 Despesas (type: expense):

1. **Alimentação** 🍔
   - Restaurantes, delivery, lanches
   
2. **Mercado** 🛒
   - Supermercado, feira, compras domésticas
   
3. **Transporte** 🚗
   - Uber, gasolina, estacionamento, ônibus
   
4. **Saúde** 💊
   - Farmácia, consultas, plano de saúde
   
5. **Lazer** 🎮
   - Cinema, jogos, hobbies, viagens
   
6. **Educação** 📚
   - Cursos, livros, material escolar
   
7. **Moradia** 🏠
   - Aluguel, condomínio, luz, água, internet
   
8. **Assinaturas** 📺
   - Netflix, Spotify, softwares, academias
   
9. **Outros** 📦
   - Despesas diversas não categorizadas

### 💰 Receitas (type: income):

10. **Salário** 💰
    - Salários, freelances, rendimentos

---

## ✅ Regras Críticas

### Formato de Data:
- ✅ **CORRETO**: `2024-03-15` (YYYY-MM-DD)
- ❌ **ERRADO**: `15/03/2024`, `03-15-2024`, `2024/03/15`

### Valores Monetários:
- ✅ **CORRETO**: `235.50` (sempre positivo, ponto decimal)
- ❌ **ERRADO**: `-235.50`, `235,50`, `R$ 235.50`

### Categorias:
- ✅ **CORRETO**: `"Mercado"`, `"mercado"`, `"MERCADO"` (case-insensitive)
- ❌ **ERRADO**: `"Compras"`, `"Supermercado"`, `"Gastos"`

### Contas:
- ⚠️ **IMPORTANTE**: A conta DEVE existir no sistema antes da importação
- ✅ Use o nome **EXATO** que você cadastrou
- Não diferencia maiúsculas/minúsculas

---

## 🏦 Sobre Contas - ATENÇÃO!

### ⚠️ Contas NÃO são criadas automaticamente!

**ANTES de importar o CSV:**

1. Acesse: https://fermhubfinanceiro.pages.dev/principal
2. Clique em **"+ Nova Conta"**
3. Crie cada conta que você vai usar no CSV:
   - Exemplo: "Nubank" (saldo inicial: R$ 1.000)
   - Exemplo: "Carteira" (saldo inicial: R$ 500)
   - Exemplo: "Cartão de Crédito" (saldo inicial: R$ 0)

**No CSV, use exatamente o nome cadastrado:**
```csv
date,description,amount,type,category,account
2024-03-15,"Compra",100,expense,"Mercado","Nubank"
                                            ^^^^^^
                                    Nome EXATO da conta
```

Se a conta não existir, a linha será **ignorada** (erro no console).

---

## 📝 Exemplo Completo e Funcional

```csv
date,description,amount,type,category,account
2024-03-01,"Salário de Março",6500,income,"Salário","Nubank"
2024-03-02,"Aluguel apartamento",2200,expense,"Moradia","Nubank"
2024-03-02,"Condomínio",450,expense,"Moradia","Nubank"
2024-03-03,"Mercado - compras do mês",680.50,expense,"Mercado","Nubank"
2024-03-04,"Uber para trabalho",18.50,expense,"Transporte","Nubank"
2024-03-05,"Almoço restaurante",42.90,expense,"Alimentação","Carteira"
2024-03-05,"Netflix",55.90,expense,"Assinaturas","Cartão de Crédito"
2024-03-06,"Farmácia - vitaminas",89.90,expense,"Saúde","Nubank"
2024-03-07,"Gasolina posto",280,expense,"Transporte","Nubank"
2024-03-08,"Cinema",65,expense,"Lazer","Carteira"
2024-03-10,"Curso Udemy",97.90,expense,"Educação","Cartão de Crédito"
2024-03-12,"Luz - energia",195.80,expense,"Moradia","Nubank"
2024-03-12,"Água - SABESP",78.30,expense,"Moradia","Nubank"
2024-03-12,"Internet - Vivo",119.90,expense,"Moradia","Nubank"
2024-03-15,"Mercado - feira",156.20,expense,"Mercado","Carteira"
2024-03-18,"Jantar delivery",85.50,expense,"Alimentação","Nubank"
2024-03-20,"Academia - mensalidade",129.90,expense,"Assinaturas","Cartão de Crédito"
2024-03-22,"Dentista - consulta",250,expense,"Saúde","Nubank"
2024-03-25,"Livro técnico Amazon",89,expense,"Educação","Cartão de Crédito"
2024-03-28,"Show música",180,expense,"Lazer","Carteira"
```

---

## 🤖 Prompt Pronto para Outra IA

**Copie e cole este prompt para pedir a outra IA que gere seu CSV:**

```
Gere um arquivo CSV de transações financeiras com este cabeçalho EXATO:

date,description,amount,type,category,account

Regras OBRIGATÓRIAS:
- date: formato YYYY-MM-DD (ex: 2024-03-15)
- amount: sempre positivo, ponto decimal (ex: 125.50)
- type: 'expense' para despesas, 'income' para receitas
- category: use APENAS uma destas 10 categorias (copie exatamente):
  Alimentação, Mercado, Transporte, Saúde, Lazer, Educação, Moradia, Assinaturas, Salário, Outros
- account: use apenas estes nomes de contas: "Nubank", "Carteira", "Cartão de Crédito"

Gere 30 transações brasileiras realistas para março de 2024, perfil classe média, incluindo:
- 1 salário no início do mês (R$ 5.000-7.000)
- Despesas típicas: mercado, transporte, contas, lazer
- Valores realistas em reais

Retorne APENAS o conteúdo CSV puro, sem markdown, sem explicações.
```

---

## 📂 Descrição das Colunas

| Coluna | Obrigatório? | Formato | Descrição |
|--------|--------------|---------|-----------|
| **date** | ✅ SIM | YYYY-MM-DD | Data da transação |
| **description** | ❌ Não | Texto | Descrição (use aspas se tiver vírgula) |
| **amount** | ✅ SIM | Número positivo | Valor (sempre positivo) |
| **type** | ❌ Não | expense/income/transfer | Tipo de transação |
| **category** | ❌ Não | Nome categoria | Uma das 10 categorias |
| **account** | ✅ SIM | Nome conta | Conta cadastrada no sistema |

---

## ⚠️ Erros Comuns e Soluções

### ❌ Erro: "Nenhuma transação importada"

**Causas:**
- Formato do cabeçalho incorreto
- Todas as contas não existem
- Formato de data incorreto

**Solução:**
1. Verifique o cabeçalho: `date,description,amount,type,category,account`
2. Crie as contas no dashboard primeiro
3. Use formato de data ISO: `YYYY-MM-DD`

---

### ❌ Erro: "Conta não encontrada: XXX"

**Causa:** A conta referenciada não existe no sistema.

**Solução:**
1. Vá no dashboard: https://fermhubfinanceiro.pages.dev/principal
2. Clique em **"+ Nova Conta"**
3. Crie a conta com o nome exato usado no CSV
4. Reimporte o arquivo

---

### ⚠️ Erro: "Erro na linha X"

**Causa:** Problema específico (data inválida, valor não numérico).

**Solução:**
1. Abra o Console do Navegador (F12)
2. Veja detalhes do erro
3. Corrija a linha específica
4. Reimporte

---

## 🚀 Passo a Passo Completo

### 1️⃣ Preparar o Sistema:

1. Acesse: https://fermhubfinanceiro.pages.dev/
2. Faça login
3. Vá para o dashboard: `/principal`
4. Crie suas contas:
   - Clique **"+ Nova Conta"**
   - Nome: "Nubank", Saldo: R$ 1.000
   - Nome: "Carteira", Saldo: R$ 500
   - Nome: "Cartão de Crédito", Saldo: R$ 0

### 2️⃣ Preparar o CSV:

1. Crie um arquivo de texto com extensão `.csv`
2. Adicione o cabeçalho:
   ```csv
   date,description,amount,type,category,account
   ```
3. Adicione suas transações seguindo as regras
4. Salve o arquivo

### 3️⃣ Importar:

1. No dashboard, clique em **"Importar CSV"**
2. Selecione seu arquivo
3. Aguarde a mensagem de confirmação
4. Verifique suas transações na tabela

---

## 📚 Documentação Disponível

### Para começar rápido:
- **QUICK_START_CSV.txt** - Guia visual de uma página

### Para referência rápida:
- **RESUMO_CSV.md** - Resumo executivo com tabelas

### Para detalhes completos:
- **GUIA_IMPORTACAO_CSV.md** - Guia detalhado com FAQ

### Para usar IA:
- **PROMPT_PARA_IA.md** - Prompt completo para outras IAs

### Para ver exemplo:
- **exemplo_csv_completo.csv** - 20 transações prontas

---

## 🔍 Checklist Final

Antes de importar, confirme:

- [ ] Cabeçalho exato: `date,description,amount,type,category,account`
- [ ] Todas as datas no formato `YYYY-MM-DD`
- [ ] Valores positivos com ponto decimal
- [ ] Categorias das 10 padrão do sistema
- [ ] Todas as contas já criadas no dashboard
- [ ] Arquivo salvo com extensão `.csv`
- [ ] Codificação UTF-8 (para acentos)

---

## 🌐 Links Úteis

- **Sistema:** https://fermhubfinanceiro.pages.dev/
- **Login:** https://fermhubfinanceiro.pages.dev/login
- **Dashboard:** https://fermhubfinanceiro.pages.dev/principal
- **GitHub:** https://github.com/ribeiromelo/hubfinanceiro

---

## 💡 Dica Final

**Para entender melhor o formato:**

1. Crie 2-3 transações manualmente no sistema
2. Clique em **"Exportar CSV"**
3. Abra o arquivo baixado
4. Use como modelo para seus dados

---

**Versão:** Hub Financeiro Pro v2.5.0  
**Data:** 06/11/2024  
**Autor:** Claude Code Assistant

---

## ❓ Perguntas Frequentes

**P: Posso usar datas brasileiras (DD/MM/YYYY)?**  
R: ❌ Não. Use apenas formato ISO: `YYYY-MM-DD`

**P: Posso criar novas categorias no CSV?**  
R: ❌ Não. Use apenas as 10 categorias padrão listadas acima.

**P: Preciso criar as contas antes?**  
R: ✅ Sim! Obrigatório. Contas devem existir no sistema.

**P: Posso importar o mesmo CSV duas vezes?**  
R: ⚠️ Sim, mas as transações serão duplicadas.

**P: Como vejo erros da importação?**  
R: 🔍 Console do navegador (F12) + mensagem de resumo no dashboard.

---

Espero que este guia completo ajude! Se tiver mais dúvidas, consulte os arquivos de documentação no repositório.

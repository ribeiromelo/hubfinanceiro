# 📊 Guia Completo de Importação CSV - Hub Financeiro Pro

## 📋 Estrutura do Arquivo CSV

### Formato Obrigatório

O arquivo CSV **DEVE** ter exatamente estas colunas nesta ordem:

```csv
date,description,amount,type,category,account
```

### Descrição das Colunas

| Coluna | Obrigatório | Formato | Descrição | Exemplo |
|--------|-------------|---------|-----------|---------|
| **date** | ✅ Sim | YYYY-MM-DD | Data da transação | `2024-03-15` |
| **description** | ❌ Não | Texto entre aspas | Descrição da transação | `"Compra no supermercado"` |
| **amount** | ✅ Sim | Número decimal | Valor da transação (sempre positivo) | `150.50` |
| **type** | ❌ Não | expense/income/transfer | Tipo de transação | `expense` |
| **category** | ❌ Não | Texto (case-insensitive) | Nome da categoria | `"Mercado"` |
| **account** | ✅ Sim | Texto (case-insensitive) | Nome da conta | `"Nubank"` |

---

## 🎯 Regras de Validação

### ✅ O que o sistema ACEITA:

1. **Datas no formato ISO**: `YYYY-MM-DD` (ex: `2024-03-15`)
2. **Valores numéricos positivos**: `150.50`, `1200`, `35.99`
3. **Descrições com vírgulas**: `"Compra no mercado, frutas e legumes"`
4. **Campos vazios opcionais**: Se `type` estiver vazio, será inferido pelo valor
5. **Nomes case-insensitive**: `"mercado"` = `"Mercado"` = `"MERCADO"`

### ❌ O que o sistema REJEITA:

1. ❌ **Data ausente ou inválida**: linha será ignorada
2. ❌ **Amount ausente ou não-numérico**: linha será ignorada
3. ❌ **Conta não cadastrada**: linha será ignorada (erro no log)
4. ❌ **Formato de data incorreto**: `15/03/2024`, `03-15-2024`
5. ❌ **Valores negativos no amount**: use o campo `type` para indicar despesa

---

## 📂 Categorias Padrão do Sistema

Quando você cria uma conta, o sistema automaticamente cria estas **10 categorias**:

### 💸 Categorias de Despesa (expense):

| Nome | Ícone | Orçamento Sugerido | Uso |
|------|-------|-------------------|-----|
| **Alimentação** | 🍔 | R$ 1.200/mês | Restaurantes, delivery, lanches |
| **Mercado** | 🛒 | R$ 1.500/mês | Supermercado, feira, compras domésticas |
| **Transporte** | 🚗 | R$ 600/mês | Uber, gasolina, estacionamento, ônibus |
| **Saúde** | 💊 | R$ 500/mês | Farmácia, consultas, plano de saúde |
| **Lazer** | 🎮 | R$ 400/mês | Cinema, jogos, hobbies, viagens |
| **Educação** | 📚 | R$ 800/mês | Cursos, livros, material escolar |
| **Moradia** | 🏠 | R$ 2.500/mês | Aluguel, condomínio, luz, água, internet |
| **Assinaturas** | 📺 | R$ 150/mês | Netflix, Spotify, softwares, academias |
| **Outros** | 📦 | R$ 500/mês | Despesas diversas não categorizadas |

### 💰 Categoria de Receita (income):

| Nome | Ícone | Uso |
|------|-------|-----|
| **Salário** | 💰 | Salários, freelances, rendimentos |

---

## 🏦 Sobre as Contas (Accounts)

**ATENÇÃO:** As contas **NÃO são criadas automaticamente**!

### Como criar contas:

1. Faça login no sistema
2. Acesse o dashboard (`/principal`)
3. Clique em **"+ Nova Conta"**
4. Preencha:
   - **Nome**: Ex: "Nubank", "Banco Inter", "Carteira"
   - **Saldo Inicial**: Ex: `1500.00`
   - **Cor**: Escolha uma cor para identificação visual

### ⚠️ Importante sobre Contas no CSV:

- O **nome da conta no CSV** precisa **exatamente corresponder** ao nome cadastrado
- Exemplo: Se você criou uma conta chamada **"Nubank"**, no CSV use **"Nubank"**
- Não diferencia maiúsculas/minúsculas: `"nubank"` = `"Nubank"` = `"NUBANK"`
- Se a conta não existir, a linha será **ignorada** (erro registrado no console)

---

## 📝 Exemplo de CSV Válido

```csv
date,description,amount,type,category,account
2024-03-01,"Salário de Março",5500,income,"Salário","Nubank"
2024-03-02,"Compra no Mercado Dia",235.50,expense,"Mercado","Nubank"
2024-03-03,"Uber para reunião",28.90,expense,"Transporte","Nubank"
2024-03-05,"Netflix",39.90,expense,"Assinaturas","Cartão de Crédito"
2024-03-07,"Almoço no restaurante",89.00,expense,"Alimentação","Nubank"
2024-03-10,"Farmácia - Remédios",125.00,expense,"Saúde","Nubank"
2024-03-12,"Cinema com amigos",60,expense,"Lazer","Carteira"
2024-03-15,"Conta de luz",180.50,expense,"Moradia","Nubank"
2024-03-20,"Curso online Udemy",97.90,expense,"Educação","Cartão de Crédito"
2024-03-25,"Compras diversas",45.30,expense,"Outros","Carteira"
```

---

## 🔄 Comportamento do Campo `type`

### Regra de Inferência Automática:

Se o campo `type` estiver **vazio ou ausente**:

```javascript
// Lógica do sistema:
if (type === '') {
  type = amount < 0 ? 'expense' : 'income';
}
```

**Mas atenção**: O `amount` sempre deve ser **positivo** no CSV!

### Valores Aceitos para `type`:

| Valor | Descrição | Quando Usar |
|-------|-----------|-------------|
| `expense` | Despesa | Saídas de dinheiro |
| `income` | Receita | Entradas de dinheiro |
| `transfer` | Transferência | Movimentação entre contas |

---

## 🚨 Casos Especiais e Soluções

### ❓ Caso 1: Descrição com vírgulas
✅ **CORRETO:**
```csv
2024-03-15,"Compra no mercado, frutas e legumes",125.50,expense,"Mercado","Nubank"
```

❌ **ERRADO:**
```csv
2024-03-15,Compra no mercado, frutas e legumes,125.50,expense,"Mercado","Nubank"
```

### ❓ Caso 2: Categoria não preenchida

Se você não especificar a categoria, ela será `null` no banco de dados:

```csv
2024-03-15,"Compra variada",50.00,expense,,"Nubank"
```

Isso é **válido**, mas a transação não aparecerá nos gráficos de categoria.

### ❓ Caso 3: Conta inexistente

```csv
2024-03-15,"Compra teste",100,expense,"Mercado","Banco Inexistente"
```

**Resultado**: 
- ⚠️ Console do navegador mostrará: `Conta não encontrada: "Banco Inexistente"`
- ❌ Linha será **ignorada** (não importada)
- ✅ Outras linhas válidas continuam sendo importadas

### ❓ Caso 4: Data em formato incorreto

❌ **ERRADO:**
```csv
15/03/2024,"Compra",100,expense,"Mercado","Nubank"
03-15-2024,"Compra",100,expense,"Mercado","Nubank"
2024/03/15,"Compra",100,expense,"Mercado","Nubank"
```

✅ **CORRETO:**
```csv
2024-03-15,"Compra",100,expense,"Mercado","Nubank"
```

---

## 🎬 Passo a Passo Completo para Importação

### 📌 Pré-requisitos:

1. ✅ Ter uma conta criada no sistema
2. ✅ Estar logado no dashboard (`/principal`)
3. ✅ Ter pelo menos **1 conta cadastrada** no sistema

### 🛠️ Preparação do Arquivo CSV:

**Passo 1:** Crie um arquivo de texto com extensão `.csv`

**Passo 2:** Adicione o cabeçalho obrigatório:
```csv
date,description,amount,type,category,account
```

**Passo 3:** Adicione suas transações, seguindo as regras:
- ✅ Datas no formato `YYYY-MM-DD`
- ✅ Valores sempre positivos
- ✅ Descrições entre aspas se contiverem vírgulas
- ✅ Nomes de categorias exatamente como no sistema
- ✅ Nomes de contas exatamente como cadastradas

**Passo 4:** Salve o arquivo (ex: `minhas_financas.csv`)

### 📤 Importação no Sistema:

1. Acesse o dashboard: https://fermhubfinanceiro.pages.dev/principal
2. Localize a seção **"Importar/Exportar"**
3. Clique no botão **"Importar CSV"**
4. Selecione seu arquivo `.csv`
5. Aguarde a mensagem de confirmação

### ✅ Resultado Esperado:

```
✅ 10 transação(ões) importada(s) com sucesso!
```

Ou, se houver erros:

```
✅ 8 transação(ões) importada(s) com sucesso! (2 erro(s))
```

### 🔍 Como Verificar Erros:

1. Abra o **Console do Navegador** (F12)
2. Procure por mensagens:
   - `Conta não encontrada: "Nome da Conta"`
   - `Erro na linha X:`

---

## 📤 Exportação de Exemplo

Para entender melhor o formato, você pode:

1. Criar algumas transações manualmente no sistema
2. Clicar em **"Exportar CSV"**
3. Abrir o arquivo baixado para ver o formato correto
4. Usar como modelo para seus próprios dados

### Exemplo de CSV Exportado:

```csv
date,description,amount,type,category,account
2024-03-15,"Compra no mercado",235.50,expense,"Mercado","Nubank"
2024-03-16,"Salário",5500,income,"Salário","Nubank"
2024-03-17,"Uber",28.90,expense,"Transporte","Carteira"
```

---

## 🤖 Prompt para IA Gerar CSV

Use este prompt para pedir a outra IA que gere seu arquivo CSV:

```
Preciso que você gere um arquivo CSV de transações financeiras seguindo estas especificações EXATAS:

CABEÇALHO OBRIGATÓRIO:
date,description,amount,type,category,account

REGRAS OBRIGATÓRIAS:
1. date: formato YYYY-MM-DD (ex: 2024-03-15)
2. description: texto entre aspas se contiver vírgula
3. amount: número positivo, ponto como separador decimal (ex: 125.50)
4. type: pode ser "expense", "income" ou "transfer" (ou vazio)
5. category: usar EXATAMENTE uma destas opções (case-insensitive):
   - Para despesas: Alimentação, Mercado, Transporte, Saúde, Lazer, Educação, Moradia, Assinaturas, Outros
   - Para receitas: Salário
6. account: nome da conta (ex: "Nubank", "Banco Inter", "Carteira")

IMPORTANTE:
- Valores sempre positivos (o tipo define se é entrada ou saída)
- Datas no formato ISO (YYYY-MM-DD)
- Categorias exatamente como listadas acima
- Contas: você pode usar "Nubank", "Banco Inter" ou "Carteira"

EXEMPLO:
date,description,amount,type,category,account
2024-03-01,"Salário de Março",5500,income,"Salário","Nubank"
2024-03-02,"Mercado",235.50,expense,"Mercado","Nubank"
2024-03-03,"Uber",28.90,expense,"Transporte","Carteira"

Gere 30 transações para o mês de março de 2024, com valores realistas para um brasileiro classe média.
```

---

## ❓ FAQ - Perguntas Frequentes

### **P: Posso usar datas em formato brasileiro (DD/MM/YYYY)?**
**R:** ❌ Não. Use apenas o formato ISO: `YYYY-MM-DD` (ex: `2024-03-15`)

### **P: Valores negativos são permitidos?**
**R:** ❌ Não. Use sempre valores positivos e defina o `type` como `expense` para despesas.

### **P: Posso criar novas categorias no CSV?**
**R:** ❌ Não diretamente. Use apenas as 10 categorias padrão. Para adicionar novas categorias, faça no dashboard primeiro.

### **P: O que acontece se eu não preencher a categoria?**
**R:** ✅ A transação será importada, mas a categoria ficará vazia (`null`). Ela não aparecerá nos gráficos de categoria.

### **P: Preciso criar as contas antes de importar?**
**R:** ✅ Sim! Obrigatoriamente. As contas referenciadas no CSV **devem existir** no sistema antes da importação.

### **P: Posso importar o mesmo CSV duas vezes?**
**R:** ⚠️ Sim, mas as transações serão **duplicadas**. O sistema não verifica duplicatas.

### **P: Como saber se houve erros na importação?**
**R:** 🔍 Abra o Console do Navegador (F12) e procure por mensagens de erro. O sistema também mostra um resumo: "X transação(ões) importada(s) com sucesso! (Y erro(s))"

### **P: O CSV precisa ter codificação específica?**
**R:** ✅ Use UTF-8 para evitar problemas com acentos. A maioria dos editores modernos usa UTF-8 por padrão.

---

## 🔧 Troubleshooting - Resolução de Problemas

### ❌ Erro: "Nenhuma transação importada"

**Possíveis causas:**
1. Formato do cabeçalho incorreto
2. Todas as contas referenciadas não existem
3. Formato de data incorreto em todas as linhas
4. Valores não numéricos na coluna `amount`

**Solução:**
- Verifique o cabeçalho: `date,description,amount,type,category,account`
- Confirme que as contas existem no dashboard
- Use formato de data ISO: `YYYY-MM-DD`
- Use ponto (`.`) como separador decimal

### ⚠️ Erro: "Conta não encontrada: XXX"

**Causa:** A conta referenciada no CSV não existe no sistema.

**Solução:**
1. Vá no dashboard
2. Clique em **"+ Nova Conta"**
3. Crie a conta com o nome **exato** usado no CSV
4. Tente importar novamente

### ⚠️ Erro: "Erro na linha X"

**Causa:** Problema específico em uma linha (data inválida, valor não numérico, etc.)

**Solução:**
1. Abra o Console (F12)
2. Veja detalhes do erro
3. Corrija a linha específica
4. Reimporte o arquivo

---

## 📊 Exemplo Real Completo

```csv
date,description,amount,type,category,account
2024-03-01,"Salário mensal",6500,income,"Salário","Nubank"
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

## ✅ Checklist Final

Antes de importar, verifique:

- [ ] Cabeçalho exato: `date,description,amount,type,category,account`
- [ ] Todas as datas no formato `YYYY-MM-DD`
- [ ] Valores sempre positivos com ponto decimal
- [ ] Descrições com vírgulas estão entre aspas
- [ ] Categorias usam nomes das 10 padrão
- [ ] Todas as contas referenciadas **já existem** no sistema
- [ ] Arquivo salvo com codificação UTF-8
- [ ] Extensão do arquivo é `.csv`

---

## 📞 Suporte

Se ainda tiver dúvidas:

1. Exporte um CSV de exemplo do próprio sistema (**"Exportar CSV"**)
2. Use-o como modelo para seu arquivo
3. Verifique os erros no Console do Navegador (F12)
4. Confira se todas as contas estão criadas no dashboard

---

**Última atualização:** 06/11/2024  
**Versão do Sistema:** Hub Financeiro Pro v2.5.0  
**URL:** https://fermhubfinanceiro.pages.dev/

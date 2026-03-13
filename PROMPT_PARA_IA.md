# 🤖 Prompt para IA Gerar CSV de Transações Financeiras

Use este prompt para solicitar a outra IA que gere seu arquivo CSV para importação no Hub Financeiro Pro:

---

## 📋 PROMPT COMPLETO

```
Preciso que você gere um arquivo CSV de transações financeiras brasileiras seguindo estas especificações EXATAS:

═══════════════════════════════════════════════════════════════════════════

CABEÇALHO OBRIGATÓRIO (primeira linha):
date,description,amount,type,category,account

═══════════════════════════════════════════════════════════════════════════

REGRAS OBRIGATÓRIAS PARA CADA COLUNA:

1. date (OBRIGATÓRIO):
   - Formato: YYYY-MM-DD (ISO 8601)
   - Exemplo: 2024-03-15
   - ❌ NUNCA use: DD/MM/YYYY, MM-DD-YYYY, etc.

2. description (OPCIONAL):
   - Texto descritivo da transação
   - Use aspas duplas se contiver vírgulas
   - Exemplo: "Compra no mercado, frutas e legumes"
   - Se vazio, o sistema usará "Importado"

3. amount (OBRIGATÓRIO):
   - Número positivo SEMPRE
   - Use ponto (.) como separador decimal
   - Exemplo: 125.50, 1200, 35.99
   - ❌ NUNCA use vírgula ou valores negativos

4. type (OPCIONAL, mas RECOMENDADO):
   - Valores aceitos: expense, income, transfer
   - expense = despesa (saída de dinheiro)
   - income = receita (entrada de dinheiro)
   - transfer = transferência entre contas
   - Se vazio, o sistema tentará inferir (mas pode falhar)

5. category (OPCIONAL):
   - Use EXATAMENTE uma destas categorias (case-insensitive):
   
   DESPESAS:
   - Alimentação    (restaurantes, delivery, lanches)
   - Mercado        (supermercado, feira, compras domésticas)
   - Transporte     (Uber, gasolina, estacionamento, ônibus)
   - Saúde          (farmácia, consultas, plano de saúde)
   - Lazer          (cinema, jogos, hobbies, viagens)
   - Educação       (cursos, livros, material escolar)
   - Moradia        (aluguel, condomínio, luz, água, internet)
   - Assinaturas    (Netflix, Spotify, softwares, academias)
   - Outros         (despesas diversas não categorizadas)
   
   RECEITAS:
   - Salário        (salários, freelances, rendimentos)
   
   - Se deixado vazio, a transação não terá categoria

6. account (OBRIGATÓRIO):
   - Nome da conta bancária/carteira
   - Sugestões comuns: "Nubank", "Banco Inter", "Carteira", "Cartão de Crédito"
   - ⚠️ A conta DEVE existir no sistema antes da importação!
   - Para este exemplo, use estas 3 contas:
     * Nubank
     * Carteira
     * Cartão de Crédito

═══════════════════════════════════════════════════════════════════════════

EXEMPLO DE FORMATO CORRETO:

date,description,amount,type,category,account
2024-03-01,"Salário mensal",6500,income,"Salário","Nubank"
2024-03-02,"Aluguel",2200,expense,"Moradia","Nubank"
2024-03-03,"Mercado - compras do mês",680.50,expense,"Mercado","Nubank"
2024-03-05,"Almoço restaurante",42.90,expense,"Alimentação","Carteira"
2024-03-05,"Netflix",55.90,expense,"Assinaturas","Cartão de Crédito"

═══════════════════════════════════════════════════════════════════════════

REQUISITOS PARA GERAÇÃO:

1. Gere transações para: [ESCOLHA O PERÍODO, ex: março de 2024]
2. Número de transações: [ESCOLHA A QUANTIDADE, ex: 30 transações]
3. Perfil financeiro: [ESCOLHA, ex: classe média brasileira, freelancer, assalariado]
4. Inclua:
   - 1 salário no início do mês (5000-7000 reais)
   - Despesas de moradia (aluguel, condomínio, luz, água, internet)
   - Compras de mercado semanais (150-300 reais cada)
   - Transporte regular (Uber, gasolina)
   - Lazer ocasional (cinema, delivery, restaurantes)
   - Assinaturas mensais (Netflix, Spotify, academia)
   - Saúde (farmácia, consultas)
   - Educação (cursos, livros)

5. Valores realistas para Brasil em 2024:
   - Aluguel: 1500-2500
   - Mercado semanal: 150-300
   - Uber: 15-50
   - Restaurante: 40-100
   - Netflix: 50-60
   - Academia: 100-150
   - Energia elétrica: 150-250

═══════════════════════════════════════════════════════════════════════════

⚠️ IMPORTANTE - EVITE ESTES ERROS COMUNS:

❌ Data em formato brasileiro: 15/03/2024
✅ Data correta: 2024-03-15

❌ Valor negativo: -150.50
✅ Valor correto: 150.50 (use type=expense)

❌ Vírgula decimal: 150,50
✅ Ponto decimal: 150.50

❌ Categoria inventada: "Compras"
✅ Categoria válida: "Mercado"

❌ Descrição sem aspas com vírgula: Compra no mercado, frutas
✅ Descrição correta: "Compra no mercado, frutas"

═══════════════════════════════════════════════════════════════════════════

FORMATO DE SAÍDA:

Por favor, retorne APENAS o conteúdo CSV puro, sem:
- Markdown (```csv)
- Explicações adicionais
- Numeração de linhas
- Comentários

Apenas o CSV puro começando com o cabeçalho.

═══════════════════════════════════════════════════════════════════════════

AGORA, GERE O CSV COM ESTAS ESPECIFICAÇÕES:

Período: [SEU PERÍODO AQUI, ex: Janeiro a Março de 2024]
Número de transações: [SUA QUANTIDADE, ex: 50 transações]
Perfil: [SEU PERFIL, ex: Desenvolvedor freelancer, classe média, SP]
Observações adicionais: [SUAS OBSERVAÇÕES, ex: incluir mais gastos com educação]
```

---

## 🎯 Personalizações Comuns

### Para Freelancer:
```
Perfil: Freelancer de tecnologia
- Múltiplas receitas durante o mês (pagamentos de clientes diferentes)
- Gastos com assinaturas de software (Adobe, GitHub, etc.)
- Home office (internet premium, café, lanches)
- Menos gastos com transporte
```

### Para Assalariado:
```
Perfil: Assalariado CLT
- 1 salário no dia 5 do mês
- Gastos regulares com transporte (vale-transporte ou Uber diário)
- Almoço fora todos os dias úteis
- Despesas previsíveis
```

### Para Estudante:
```
Perfil: Estudante universitário
- Receita: mesada + freelas ocasionais
- Gastos com material escolar e cursos
- Muito transporte (Uber/ônibus)
- Lanches e alimentação fora
- Lazer com amigos
```

### Para Família:
```
Perfil: Família com 2 adultos e 1 criança
- Salários de 2 pessoas
- Gastos com escola/creche
- Mercado mais caro e frequente
- Plano de saúde familiar
- Consultas médicas pediatria
- Brinquedos e entretenimento infantil
```

---

## 📊 Exemplo de Prompt Personalizado

```
Preciso que você gere um arquivo CSV de transações financeiras brasileiras seguindo estas especificações EXATAS:

[... TODAS AS REGRAS ACIMA ...]

AGORA, GERE O CSV COM ESTAS ESPECIFICAÇÕES:

Período: Janeiro a Março de 2024 (3 meses completos)
Número de transações: 80 transações
Perfil: Desenvolvedor freelancer, classe média, morando em São Paulo
Observações adicionais:
- Incluir 3-4 pagamentos de clientes diferentes por mês (valores variados: 2000-4000 cada)
- Gastos elevados com educação (cursos online, livros técnicos)
- Assinaturas de software (GitHub Pro, Adobe, ChatGPT Plus)
- Home office (café, lanches, internet premium)
- Pouco gasto com transporte (trabalha de casa)
- Lazer ocasional nos fins de semana
- Sem aluguel (mora com família), mas paga condomínio e contas
```

---

## ✅ Checklist Pós-Geração

Depois que a IA gerar o CSV, verifique:

- [ ] Primeira linha é exatamente: `date,description,amount,type,category,account`
- [ ] Todas as datas estão no formato `YYYY-MM-DD`
- [ ] Nenhum valor é negativo
- [ ] Todos os valores usam ponto (.) como decimal
- [ ] Categorias usam apenas as 10 permitidas
- [ ] Contas são apenas: "Nubank", "Carteira", "Cartão de Crédito"
- [ ] Descrições com vírgulas estão entre aspas duplas
- [ ] Arquivo não tem caracteres especiais estranhos

---

## 🔧 Correções Rápidas com Regex

Se a IA gerar datas erradas, você pode corrigir com Find & Replace:

### Converter DD/MM/YYYY para YYYY-MM-DD:
```regex
Find: (\d{2})/(\d{2})/(\d{4})
Replace: $3-$2-$1
```

### Remover espaços extras:
```regex
Find: \s+,
Replace: ,
```

### Adicionar aspas em descrições:
```regex
Find: ,([^,"]+,[^,"]+),
Replace: ,"$1",
```

---

## 📁 Exemplo de Saída Esperada

A IA deve retornar algo assim (sem os comentários):

```csv
date,description,amount,type,category,account
2024-01-05,"Salário Janeiro",6500,income,"Salário","Nubank"
2024-01-08,"Cliente XYZ - Site",3200,income,"Salário","Nubank"
2024-01-10,"Mercado - compras semanais",287.50,expense,"Mercado","Carteira"
2024-01-12,"ChatGPT Plus",96,expense,"Assinaturas","Cartão de Crédito"
2024-01-15,"Almoço restaurante",52.90,expense,"Alimentação","Carteira"
...
```

---

## 🚀 Uso Após Geração

1. Copie a saída da IA para um arquivo `.csv`
2. Verifique o arquivo com o checklist acima
3. Acesse https://fermhubfinanceiro.pages.dev/principal
4. Crie as contas necessárias:
   - "Nubank" (saldo inicial: R$ 1.000)
   - "Carteira" (saldo inicial: R$ 500)
   - "Cartão de Crédito" (saldo inicial: R$ 0)
5. Clique em "Importar CSV"
6. Selecione o arquivo
7. Aguarde a confirmação

---

**Última atualização:** 06/11/2024  
**Versão:** Hub Financeiro Pro v2.5.0  
**URL Sistema:** https://fermhubfinanceiro.pages.dev/

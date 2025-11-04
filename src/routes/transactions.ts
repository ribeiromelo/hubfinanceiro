// Rotas de transações

import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middleware/auth';

const transactions = new Hono<{ Bindings: Bindings; Variables: Variables }>();

transactions.use('/*', authMiddleware);

/**
 * GET /api/transactions
 * Lista todas as transações do usuário (com filtros opcionais)
 */
transactions.get('/', async (c) => {
  try {
    const user = c.get('user');
    const db = c.env.DB;

    // Filtros query params
    const month = c.req.query('month'); // formato: YYYY-MM
    const type = c.req.query('type'); // income ou expense
    const accountId = c.req.query('account_id');
    const categoryId = c.req.query('category_id');

    let query = `
      SELECT 
        t.*,
        a.name as account_name,
        c.name as category_name,
        c.icon as category_icon,
        c.color as category_color
      FROM transactions t
      LEFT JOIN accounts a ON t.account_id = a.id
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ?
    `;

    const params: any[] = [user!.id];

    if (month) {
      query += ' AND strftime("%Y-%m", t.date) = ?';
      params.push(month);
    }

    if (type) {
      query += ' AND t.type = ?';
      params.push(type);
    }

    if (accountId) {
      query += ' AND t.account_id = ?';
      params.push(accountId);
    }

    if (categoryId) {
      query += ' AND t.category_id = ?';
      params.push(categoryId);
    }

    query += ' ORDER BY t.date DESC, t.created_at DESC';

    const results = await db.prepare(query).bind(...params).all();

    return c.json({ transactions: results.results });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    return c.json({ error: 'Erro ao listar transações' }, 500);
  }
});

/**
 * GET /api/transactions/stats
 * Retorna estatísticas (receitas, despesas, saldo, etc)
 */
transactions.get('/stats', async (c) => {
  try {
    const user = c.get('user');
    const db = c.env.DB;
    const month = c.req.query('month'); // formato: YYYY-MM

    let query = `
      SELECT 
        type,
        SUM(amount) as total
      FROM transactions
      WHERE user_id = ?
    `;

    const params: any[] = [user!.id];

    if (month) {
      query += ' AND strftime("%Y-%m", date) = ?';
      params.push(month);
    }

    query += ' GROUP BY type';

    const results = await db.prepare(query).bind(...params).all();

    let income = 0;
    let expense = 0;

    for (const row of results.results as any[]) {
      if (row.type === 'income') income = row.total;
      if (row.type === 'expense') expense = Math.abs(row.total);
    }

    const balance = income - expense;
    const percentSpent = income > 0 ? Math.round((expense / income) * 100) : 0;

    // Stats por categoria (despesas)
    let categoryQuery = `
      SELECT 
        c.id,
        c.name,
        c.icon,
        c.color,
        c.budget_limit,
        SUM(ABS(t.amount)) as spent
      FROM transactions t
      LEFT JOIN categories c ON t.category_id = c.id
      WHERE t.user_id = ? AND t.type = 'expense'
    `;

    const categoryParams: any[] = [user!.id];

    if (month) {
      categoryQuery += ' AND strftime("%Y-%m", t.date) = ?';
      categoryParams.push(month);
    }

    categoryQuery += ' GROUP BY c.id, c.name, c.icon, c.color, c.budget_limit';

    const categoryResults = await db.prepare(categoryQuery).bind(...categoryParams).all();

    return c.json({
      income,
      expense,
      balance,
      percentSpent,
      categoriesStats: categoryResults.results,
    });
  } catch (error) {
    console.error('Erro ao calcular estatísticas:', error);
    return c.json({ error: 'Erro ao calcular estatísticas' }, 500);
  }
});

/**
 * POST /api/transactions
 * Cria uma nova transação
 */
transactions.post('/', async (c) => {
  try {
    const user = c.get('user');
    const { account_id, category_id, description, amount, type, date, tags } = await c.req.json();

    if (!account_id || !description || amount === undefined || !type || !date) {
      return c.json({ error: 'Campos obrigatórios: account_id, description, amount, type, date' }, 400);
    }

    if (!['income', 'expense'].includes(type)) {
      return c.json({ error: 'Tipo deve ser "income" ou "expense"' }, 400);
    }

    const db = c.env.DB;

    // Verifica se a conta pertence ao usuário
    const account = await db
      .prepare('SELECT id FROM accounts WHERE id = ? AND user_id = ?')
      .bind(account_id, user!.id)
      .first();

    if (!account) {
      return c.json({ error: 'Conta não encontrada' }, 404);
    }

    // Ajusta o valor baseado no tipo
    let finalAmount = parseFloat(amount);
    if (type === 'expense' && finalAmount > 0) {
      finalAmount = -Math.abs(finalAmount);
    } else if (type === 'income' && finalAmount < 0) {
      finalAmount = Math.abs(finalAmount);
    }

    const result = await db
      .prepare(`
        INSERT INTO transactions (user_id, account_id, category_id, description, amount, type, date, tags)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        user!.id,
        account_id,
        category_id || null,
        description,
        finalAmount,
        type,
        date,
        tags || ''
      )
      .run();

    // Atualiza saldo da conta (se for account, não card)
    const accountData = await db
      .prepare('SELECT type, balance FROM accounts WHERE id = ?')
      .bind(account_id)
      .first<any>();

    if (accountData && accountData.type === 'account') {
      const newBalance = accountData.balance + finalAmount;
      await db
        .prepare('UPDATE accounts SET balance = ? WHERE id = ?')
        .bind(newBalance, account_id)
        .run();
    }

    return c.json({
      message: 'Transação criada com sucesso',
      transaction: {
        id: result.meta.last_row_id,
        description,
        amount: finalAmount,
        type,
        date,
      },
    }, 201);
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    return c.json({ error: 'Erro ao criar transação' }, 500);
  }
});

/**
 * PUT /api/transactions/:id
 * Atualiza uma transação
 */
transactions.put('/:id', async (c) => {
  try {
    const user = c.get('user');
    const txId = c.req.param('id');
    const { description, amount, category_id, date, tags } = await c.req.json();

    const db = c.env.DB;

    // Verifica se a transação pertence ao usuário
    const transaction = await db
      .prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?')
      .bind(txId, user!.id)
      .first<any>();

    if (!transaction) {
      return c.json({ error: 'Transação não encontrada' }, 404);
    }

    // Se o amount mudou, ajusta o saldo da conta
    if (amount !== undefined && amount !== null && amount !== transaction.amount) {
      const diff = amount - transaction.amount;
      await db
        .prepare('UPDATE accounts SET balance = balance + ? WHERE id = ? AND type = "account"')
        .bind(diff, transaction.account_id)
        .run();
    }

    // Converte undefined para null
    await db
      .prepare(`
        UPDATE transactions
        SET description = COALESCE(?, description),
            amount = COALESCE(?, amount),
            category_id = ?,
            date = COALESCE(?, date),
            tags = COALESCE(?, tags)
        WHERE id = ?
      `)
      .bind(
        description ?? null,
        amount ?? null,
        category_id ?? null,
        date ?? null,
        tags ?? null,
        txId
      )
      .run();

    return c.json({ message: 'Transação atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    return c.json({ error: 'Erro ao atualizar transação' }, 500);
  }
});

/**
 * DELETE /api/transactions/:id
 * Deleta uma transação
 */
transactions.delete('/:id', async (c) => {
  try {
    const user = c.get('user');
    const txId = c.req.param('id');
    const db = c.env.DB;

    // Verifica se a transação pertence ao usuário
    const transaction = await db
      .prepare('SELECT * FROM transactions WHERE id = ? AND user_id = ?')
      .bind(txId, user!.id)
      .first<any>();

    if (!transaction) {
      return c.json({ error: 'Transação não encontrada' }, 404);
    }

    // Ajusta o saldo da conta
    await db
      .prepare('UPDATE accounts SET balance = balance - ? WHERE id = ? AND type = "account"')
      .bind(transaction.amount, transaction.account_id)
      .run();

    await db
      .prepare('DELETE FROM transactions WHERE id = ?')
      .bind(txId)
      .run();

    return c.json({ message: 'Transação deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar transação:', error);
    return c.json({ error: 'Erro ao deletar transação' }, 500);
  }
});

export default transactions;

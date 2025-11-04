// Rotas de contas e cartões

import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middleware/auth';

const accounts = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// Todas as rotas requerem autenticação
accounts.use('/*', authMiddleware);

/**
 * GET /api/accounts
 * Lista todas as contas do usuário
 */
accounts.get('/', async (c) => {
  try {
    const user = c.get('user');
    const db = c.env.DB;

    const results = await db
      .prepare('SELECT * FROM accounts WHERE user_id = ? ORDER BY created_at DESC')
      .bind(user!.id)
      .all();

    return c.json({ accounts: results.results });
  } catch (error) {
    console.error('Erro ao listar contas:', error);
    return c.json({ error: 'Erro ao listar contas' }, 500);
  }
});

/**
 * POST /api/accounts
 * Cria uma nova conta
 */
accounts.post('/', async (c) => {
  try {
    const user = c.get('user');
    const { name, type, balance, card_limit, card_closing_day, card_due_day } = await c.req.json();

    if (!name || !type) {
      return c.json({ error: 'Nome e tipo são obrigatórios' }, 400);
    }

    if (!['account', 'card'].includes(type)) {
      return c.json({ error: 'Tipo deve ser "account" ou "card"' }, 400);
    }

    const db = c.env.DB;

    const result = await db
      .prepare(`
        INSERT INTO accounts (user_id, name, type, balance, card_limit, card_closing_day, card_due_day)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `)
      .bind(
        user!.id,
        name,
        type,
        balance || 0,
        card_limit || 0,
        card_closing_day || 0,
        card_due_day || 0
      )
      .run();

    return c.json({
      message: 'Conta criada com sucesso',
      account: {
        id: result.meta.last_row_id,
        name,
        type,
        balance: balance || 0,
      },
    }, 201);
  } catch (error) {
    console.error('Erro ao criar conta:', error);
    return c.json({ error: 'Erro ao criar conta' }, 500);
  }
});

/**
 * PUT /api/accounts/:id
 * Atualiza uma conta
 */
accounts.put('/:id', async (c) => {
  try {
    const user = c.get('user');
    const accountId = c.req.param('id');
    const { name, balance, card_limit, card_closing_day, card_due_day } = await c.req.json();

    const db = c.env.DB;

    // Verifica se a conta pertence ao usuário
    const account = await db
      .prepare('SELECT id FROM accounts WHERE id = ? AND user_id = ?')
      .bind(accountId, user!.id)
      .first();

    if (!account) {
      return c.json({ error: 'Conta não encontrada' }, 404);
    }

    // Converte undefined para null para o D1 aceitar
    await db
      .prepare(`
        UPDATE accounts
        SET name = COALESCE(?, name),
            balance = COALESCE(?, balance),
            card_limit = COALESCE(?, card_limit),
            card_closing_day = COALESCE(?, card_closing_day),
            card_due_day = COALESCE(?, card_due_day)
        WHERE id = ?
      `)
      .bind(
        name ?? null,
        balance ?? null,
        card_limit ?? null,
        card_closing_day ?? null,
        card_due_day ?? null,
        accountId
      )
      .run();

    return c.json({ message: 'Conta atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar conta:', error);
    return c.json({ error: 'Erro ao atualizar conta' }, 500);
  }
});

/**
 * DELETE /api/accounts/:id
 * Deleta uma conta
 */
accounts.delete('/:id', async (c) => {
  try {
    const user = c.get('user');
    const accountId = c.req.param('id');
    const db = c.env.DB;

    // Verifica se a conta pertence ao usuário
    const account = await db
      .prepare('SELECT id FROM accounts WHERE id = ? AND user_id = ?')
      .bind(accountId, user!.id)
      .first();

    if (!account) {
      return c.json({ error: 'Conta não encontrada' }, 404);
    }

    await db
      .prepare('DELETE FROM accounts WHERE id = ?')
      .bind(accountId)
      .run();

    return c.json({ message: 'Conta deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar conta:', error);
    return c.json({ error: 'Erro ao deletar conta' }, 500);
  }
});

export default accounts;

// Rotas de categorias

import { Hono } from 'hono';
import { Bindings, Variables } from '../types';
import { authMiddleware } from '../middleware/auth';

const categories = new Hono<{ Bindings: Bindings; Variables: Variables }>();

categories.use('/*', authMiddleware);

/**
 * GET /api/categories
 * Lista todas as categorias do usuário
 */
categories.get('/', async (c) => {
  try {
    const user = c.get('user');
    const db = c.env.DB;

    const results = await db
      .prepare('SELECT * FROM categories WHERE user_id = ? ORDER BY name ASC')
      .bind(user!.id)
      .all();

    return c.json({ categories: results.results });
  } catch (error) {
    console.error('Erro ao listar categorias:', error);
    return c.json({ error: 'Erro ao listar categorias' }, 500);
  }
});

/**
 * POST /api/categories
 * Cria uma nova categoria
 */
categories.post('/', async (c) => {
  try {
    const user = c.get('user');
    const { name, budget_limit, color, icon } = await c.req.json();

    if (!name) {
      return c.json({ error: 'Nome é obrigatório' }, 400);
    }

    const db = c.env.DB;

    const result = await db
      .prepare(`
        INSERT INTO categories (user_id, name, budget_limit, color, icon)
        VALUES (?, ?, ?, ?, ?)
      `)
      .bind(
        user!.id,
        name,
        budget_limit || 0,
        color || '#EC4899',
        icon || '💰'
      )
      .run();

    return c.json({
      message: 'Categoria criada com sucesso',
      category: {
        id: result.meta.last_row_id,
        name,
        budget_limit: budget_limit || 0,
        color: color || '#EC4899',
        icon: icon || '💰',
      },
    }, 201);
  } catch (error) {
    console.error('Erro ao criar categoria:', error);
    return c.json({ error: 'Erro ao criar categoria' }, 500);
  }
});

/**
 * PUT /api/categories/:id
 * Atualiza uma categoria
 */
categories.put('/:id', async (c) => {
  try {
    const user = c.get('user');
    const categoryId = c.req.param('id');
    const { name, budget_limit, color, icon } = await c.req.json();

    const db = c.env.DB;

    // Verifica se a categoria pertence ao usuário
    const category = await db
      .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
      .bind(categoryId, user!.id)
      .first();

    if (!category) {
      return c.json({ error: 'Categoria não encontrada' }, 404);
    }

    await db
      .prepare(`
        UPDATE categories
        SET name = COALESCE(?, name),
            budget_limit = COALESCE(?, budget_limit),
            color = COALESCE(?, color),
            icon = COALESCE(?, icon)
        WHERE id = ?
      `)
      .bind(name, budget_limit, color, icon, categoryId)
      .run();

    return c.json({ message: 'Categoria atualizada com sucesso' });
  } catch (error) {
    console.error('Erro ao atualizar categoria:', error);
    return c.json({ error: 'Erro ao atualizar categoria' }, 500);
  }
});

/**
 * DELETE /api/categories/:id
 * Deleta uma categoria
 */
categories.delete('/:id', async (c) => {
  try {
    const user = c.get('user');
    const categoryId = c.req.param('id');
    const db = c.env.DB;

    // Verifica se a categoria pertence ao usuário
    const category = await db
      .prepare('SELECT id FROM categories WHERE id = ? AND user_id = ?')
      .bind(categoryId, user!.id)
      .first();

    if (!category) {
      return c.json({ error: 'Categoria não encontrada' }, 404);
    }

    await db
      .prepare('DELETE FROM categories WHERE id = ?')
      .bind(categoryId)
      .run();

    return c.json({ message: 'Categoria deletada com sucesso' });
  } catch (error) {
    console.error('Erro ao deletar categoria:', error);
    return c.json({ error: 'Erro ao deletar categoria' }, 500);
  }
});

export default categories;

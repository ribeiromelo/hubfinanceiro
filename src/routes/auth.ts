// Rotas de autenticação (registro, login)

import { Hono } from 'hono';
import { Bindings } from '../types';
import { hashPassword, verifyPassword, createToken, verifyToken } from '../utils/auth';
import { JWT_SECRET } from '../middleware/auth';

const auth = new Hono<{ Bindings: Bindings }>();

/**
 * POST /api/auth/register
 * Registra um novo usuário
 */
auth.post('/register', async (c) => {
  try {
    const { email, password, name } = await c.req.json();

    if (!email || !password || !name) {
      return c.json({ error: 'Email, senha e nome são obrigatórios' }, 400);
    }

    if (password.length < 6) {
      return c.json({ error: 'Senha deve ter no mínimo 6 caracteres' }, 400);
    }

    const db = c.env.DB;

    // Verifica se o email já existe
    const existingUser = await db
      .prepare('SELECT id FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first();

    if (existingUser) {
      return c.json({ error: 'Email já cadastrado' }, 409);
    }

    // Hash da senha
    const passwordHash = await hashPassword(password);

    // Insere o usuário
    const result = await db
      .prepare('INSERT INTO users (email, password_hash, name) VALUES (?, ?, ?)')
      .bind(email.toLowerCase(), passwordHash, name)
      .run();

    const userId = result.meta.last_row_id;

    // Cria categorias padrão para o novo usuário
    const defaultCategories = [
      { name: 'Alimentação', budget: 1200, icon: '🍔', color: '#EC4899' },
      { name: 'Mercado', budget: 1500, icon: '🛒', color: '#8B5CF6' },
      { name: 'Transporte', budget: 600, icon: '🚗', color: '#3B82F6' },
      { name: 'Saúde', budget: 500, icon: '💊', color: '#10B981' },
      { name: 'Lazer', budget: 400, icon: '🎮', color: '#F59E0B' },
      { name: 'Educação', budget: 800, icon: '📚', color: '#6366F1' },
      { name: 'Moradia', budget: 2500, icon: '🏠', color: '#EF4444' },
      { name: 'Assinaturas', budget: 150, icon: '📺', color: '#14B8A6' },
      { name: 'Salário', budget: 0, icon: '💰', color: '#22C55E' },
      { name: 'Outros', budget: 500, icon: '📦', color: '#6B7280' },
    ];

    for (const cat of defaultCategories) {
      await db
        .prepare('INSERT INTO categories (user_id, name, budget_limit, icon, color) VALUES (?, ?, ?, ?, ?)')
        .bind(userId, cat.name, cat.budget, cat.icon, cat.color)
        .run();
    }

    // Cria token JWT
    const token = await createToken(
      {
        userId,
        email: email.toLowerCase(),
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 dias
      },
      JWT_SECRET
    );

    return c.json({
      message: 'Usuário registrado com sucesso',
      token,
      user: {
        id: userId,
        email: email.toLowerCase(),
        name,
      },
    }, 201);
  } catch (error: any) {
    console.error('Erro no registro:', error);
    return c.json({ error: 'Erro ao registrar usuário' }, 500);
  }
});

/**
 * POST /api/auth/login
 * Faz login de um usuário existente
 */
auth.post('/login', async (c) => {
  try {
    const { email, password } = await c.req.json();

    if (!email || !password) {
      return c.json({ error: 'Email e senha são obrigatórios' }, 400);
    }

    const db = c.env.DB;

    // Busca o usuário
    const user = await db
      .prepare('SELECT id, email, password_hash, name FROM users WHERE email = ?')
      .bind(email.toLowerCase())
      .first<any>();

    if (!user) {
      return c.json({ error: 'Email ou senha incorretos' }, 401);
    }

    // Verifica a senha
    const isValidPassword = await verifyPassword(password, user.password_hash);

    if (!isValidPassword) {
      return c.json({ error: 'Email ou senha incorretos' }, 401);
    }

    // Cria token JWT
    const token = await createToken(
      {
        userId: user.id,
        email: user.email,
        exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 dias
      },
      JWT_SECRET
    );

    return c.json({
      message: 'Login realizado com sucesso',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Erro no login:', error);
    return c.json({ error: 'Erro ao fazer login' }, 500);
  }
});

/**
 * GET /api/auth/me
 * Retorna os dados do usuário autenticado
 */
auth.get('/me', async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');

    if (!token) {
      return c.json({ error: 'Token não fornecido' }, 401);
    }

    const payload = await verifyToken(token, JWT_SECRET);

    if (!payload) {
      return c.json({ error: 'Token inválido' }, 401);
    }

    const db = c.env.DB;
    const user = await db
      .prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
      .bind(payload.userId)
      .first<any>();

    if (!user) {
      return c.json({ error: 'Usuário não encontrado' }, 404);
    }

    return c.json({ user });
  } catch (error: any) {
    console.error('Erro ao buscar usuário:', error);
    return c.json({ error: 'Erro ao buscar usuário' }, 500);
  }
});

export default auth;

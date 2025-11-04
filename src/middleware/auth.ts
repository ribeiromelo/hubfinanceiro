// Middleware de autenticação

import { Context, Next } from 'hono';
import { Bindings, Variables } from '../types';
import { verifyToken, extractToken } from '../utils/auth';

const JWT_SECRET = 'your-secret-key-change-in-production-2024';

/**
 * Middleware que valida o JWT e adiciona o usuário ao contexto
 */
export async function authMiddleware(
  c: Context<{ Bindings: Bindings; Variables: Variables }>,
  next: Next
) {
  const authHeader = c.req.header('Authorization');
  const token = extractToken(authHeader);

  if (!token) {
    return c.json({ error: 'Token não fornecido' }, 401);
  }

  const payload = await verifyToken(token, JWT_SECRET);

  if (!payload) {
    return c.json({ error: 'Token inválido ou expirado' }, 401);
  }

  // Busca o usuário no banco
  const db = c.env.DB;
  const user = await db
    .prepare('SELECT id, email, name, created_at FROM users WHERE id = ?')
    .bind(payload.userId)
    .first<any>();

  if (!user) {
    return c.json({ error: 'Usuário não encontrado' }, 401);
  }

  // Adiciona o usuário ao contexto
  c.set('user', user);

  await next();
}

export { JWT_SECRET };

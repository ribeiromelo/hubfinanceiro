import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { serveStatic } from 'hono/cloudflare-workers';
import { Bindings, Variables } from './types';
import { getHTML } from './htmlLoader';

// Importa as rotas de API
import auth from './routes/auth';
import accounts from './routes/accounts';
import categories from './routes/categories';
import transactions from './routes/transactions';

const app = new Hono<{ Bindings: Bindings; Variables: Variables }>();

// CORS para todas as rotas de API
app.use('/api/*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Rotas de API
app.route('/api/auth', auth);
app.route('/api/accounts', accounts);
app.route('/api/categories', categories);
app.route('/api/transactions', transactions);

// Serve arquivos estáticos (CSS, JS, imagens)
app.use('/static/*', serveStatic({ root: './' }));

// ========== ROTAS DE PÁGINA ==========

// Landing Page (/)
app.get('/', (c) => {
  return c.html(getHTML('landing'));
});

// Login Page (/login)
app.get('/login', (c) => {
  return c.html(getHTML('login'));
});

// Register Page (/registro)
app.get('/registro', (c) => {
  return c.html(getHTML('register'));
});

// Dashboard Page (/principal) - Protected Route
app.get('/principal', (c) => {
  return c.html(getHTML('dashboard'));
});

export default app;

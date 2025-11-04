// Definições de tipos TypeScript

export type Bindings = {
  DB: D1Database;
};

export type User = {
  id: number;
  email: string;
  name: string;
  created_at: string;
};

export type Account = {
  id: number;
  user_id: number;
  name: string;
  type: 'account' | 'card';
  balance: number;
  card_limit?: number;
  card_closing_day?: number;
  card_due_day?: number;
  created_at: string;
};

export type Category = {
  id: number;
  user_id: number;
  name: string;
  budget_limit: number;
  color: string;
  icon: string;
  created_at: string;
};

export type Transaction = {
  id: number;
  user_id: number;
  account_id: number;
  category_id: number | null;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  tags: string;
  created_at: string;
};

export type JWTPayload = {
  userId: number;
  email: string;
  exp: number;
};

export type Variables = {
  user?: User;
};

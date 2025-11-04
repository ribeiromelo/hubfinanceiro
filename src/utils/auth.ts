// Utilitários para autenticação e JWT

/**
 * Hash simples de senha usando Web Crypto API
 * Para produção, considere usar bcrypt ou argon2 (mas não disponíveis em Workers)
 */
export async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'SALT_SECRET_KEY_2024');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica se a senha corresponde ao hash
 */
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

/**
 * Cria um JWT simples (sem biblioteca externa)
 * Para produção mais robusta, use hono/jwt
 */
export async function createToken(payload: any, secret: string): Promise<string> {
  const header = { alg: 'HS256', typ: 'JWT' };
  const encodedHeader = btoa(JSON.stringify(header));
  const encodedPayload = btoa(JSON.stringify(payload));
  
  const encoder = new TextEncoder();
  const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
  const secretKey = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', secretKey, data);
  const encodedSignature = btoa(String.fromCharCode(...new Uint8Array(signature)));
  
  return `${encodedHeader}.${encodedPayload}.${encodedSignature}`;
}

/**
 * Verifica e decodifica um JWT
 */
export async function verifyToken(token: string, secret: string): Promise<any> {
  try {
    const [encodedHeader, encodedPayload, encodedSignature] = token.split('.');
    if (!encodedHeader || !encodedPayload || !encodedSignature) {
      return null;
    }
    
    const encoder = new TextEncoder();
    const data = encoder.encode(`${encodedHeader}.${encodedPayload}`);
    const secretKey = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );
    
    const signature = Uint8Array.from(atob(encodedSignature), c => c.charCodeAt(0));
    const isValid = await crypto.subtle.verify('HMAC', secretKey, signature, data);
    
    if (!isValid) return null;
    
    const payload = JSON.parse(atob(encodedPayload));
    
    // Verifica expiração
    if (payload.exp && Date.now() >= payload.exp * 1000) {
      return null;
    }
    
    return payload;
  } catch (error) {
    return null;
  }
}

/**
 * Extrai o token do header Authorization
 */
export function extractToken(authHeader: string | undefined): string | null {
  if (!authHeader) return null;
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  return parts[1];
}

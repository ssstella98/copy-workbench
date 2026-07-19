import { error } from '../utils.js';

export function requireAuth(req, env) {
  const token = (req.headers.get('Authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token || token !== env.AUTH_TOKEN) {
    return error('Unauthorized', 401);
  }
  return null; // auth passed
}

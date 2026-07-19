export function uuid() {
  return crypto.randomUUID();
}

export function json(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

export function error(msg, status = 400) {
  return json({ error: msg }, status);
}

export function parseBody(req) {
  return req.json().catch(() => ({}));
}

/** Simple router: match method + path pattern, extract params */
export class Router {
  constructor() {
    this.routes = [];
  }
  get(path, handler)    { this.routes.push({ m: 'GET',    p: path, h: handler }); }
  post(path, handler)   { this.routes.push({ m: 'POST',   p: path, h: handler }); }
  put(path, handler)    { this.routes.push({ m: 'PUT',    p: path, h: handler }); }
  delete(path, handler) { this.routes.push({ m: 'DELETE', p: path, h: handler }); }
  all(handler)          { this.routes.push({ m: '*',      p: '*',   h: handler }); }

  async handle(req, env, ctx) {
    const url = new URL(req.url);
    const path = url.pathname;
    const method = req.method;
    for (const r of this.routes) {
      if (r.m !== '*' && r.m !== method) continue;
      const params = matchPath(r.p, path);
      if (params === null) continue;
      req.params = params;
      return r.h(req, env, ctx);
    }
    return error('Not Found', 404);
  }
}

/** Convert /api/projects/:id → regex, extract named params */
function matchPath(pattern, path) {
  const patParts = pattern.split('/');
  const pathParts = path.split('/');
  if (patParts.length !== pathParts.length) return null;
  const params = {};
  for (let i = 0; i < patParts.length; i++) {
    if (patParts[i].startsWith(':')) {
      params[patParts[i].slice(1)] = decodeURIComponent(pathParts[i]);
    } else if (patParts[i] !== pathParts[i]) {
      return null;
    }
  }
  return params;
}

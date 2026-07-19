export function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Authorization,Content-Type',
    'Access-Control-Max-Age': '86400',
  };
}

export function wrapCORS(handler) {
  return async (req, env, ctx) => {
    if (req.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: corsHeaders() });
    }
    const resp = await handler(req, env, ctx);
    // Add CORS headers to every response
    const out = new Response(resp.body, resp);
    for (const [k, v] of Object.entries(corsHeaders())) {
      out.headers.set(k, v);
    }
    return out;
  };
}

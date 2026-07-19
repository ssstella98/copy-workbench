// hunyuan-cors-proxy — Cloudflare Worker
// Deploy via: https://workers.cloudflare.com (free tier: 100k req/day)
// After deployment, set the worker URL in figma-key-demo.html as HUNYUAN_PROXY

const HUNYUAN_BASE = 'https://api.hunyuan.cloud.tencent.com';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const targetPath = url.pathname.replace(/^\/api\/hunyuan/, '');
    const targetUrl = HUNYUAN_BASE + targetPath;

    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: corsHeaders(),
      });
    }

    // Forward the request
    const headers = new Headers(request.headers);
    headers.set('Host', 'api.hunyuan.cloud.tencent.com');
    // Remove browser-specific headers that may cause issues
    headers.delete('Origin');
    headers.delete('Referer');

    const resp = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD'
        ? await request.arrayBuffer()
        : undefined,
    });

    // Clone response with CORS headers
    const outHeaders = new Headers(resp.headers);
    for (const [k, v] of Object.entries(corsHeaders())) {
      outHeaders.set(k, v);
    }

    return new Response(resp.body, {
      status: resp.status,
      headers: outHeaders,
    });
  },
};

function corsHeaders() {
  return {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': '*',
    'Access-Control-Max-Age': '86400',
  };
}

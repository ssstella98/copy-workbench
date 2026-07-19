import { json, error, parseBody } from '../utils.js';

const FIGMA_BASE = 'https://api.figma.com';
const AI_ENDPOINTS = {
  deepseek: 'https://api.deepseek.com',
  hunyuan: 'https://api.hunyuan.cloud.tencent.com',
};

/** POST /api/proxy/figma — proxy Figma REST API calls */
export async function figmaProxy(req, env) {
  const body = await parseBody(req);
  const { path, method, params, token } = body;
  if (!path) return error('path required');

  let url = FIGMA_BASE + path;
  if (params) {
    const sp = new URLSearchParams(params);
    url += '?' + sp.toString();
  }

  const tokenToUse = token || '';
  const resp = await fetch(url, {
    method: method || 'GET',
    headers: {
      'X-Figma-Token': tokenToUse,
      'Content-Type': 'application/json',
    },
    body: body.body ? JSON.stringify(body.body) : undefined,
  });

  const data = await resp.json().catch(() => null);
  return json(data, resp.status);
}

/** POST /api/proxy/:provider — generic AI proxy (deepseek / hunyuan) */
export async function aiProxy(req, env) {
  const provider = req.params.provider;
  const baseUrl = AI_ENDPOINTS[provider];
  if (!baseUrl) return error('Unknown AI provider: ' + provider);

  const body = await parseBody(req);
  const { messages, model, max_tokens, temperature, apiKey } = body;
  if (!messages) return error('messages required');

  const resp = await fetch(baseUrl + '/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey || ''}`,
    },
    body: JSON.stringify({
      model: model || 'deepseek-chat',
      messages,
      max_tokens: max_tokens || 300,
      temperature: temperature != null ? temperature : 0.3,
    }),
  });

  const data = await resp.json().catch(() => ({ error: 'parse failed' }));
  return json(data, resp.status);
}

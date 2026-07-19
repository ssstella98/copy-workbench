import { json, error, parseBody } from '../utils.js';

const FIGMA_BASE = 'https://api.figma.com';
const HUNYUAN_BASE = 'https://api.hunyuan.cloud.tencent.com';

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

/** POST /api/proxy/hunyuan — proxy Hunyuan chat completions */
export async function hunyuanProxy(req, env) {
  const body = await parseBody(req);
  const { messages, model, max_tokens, temperature, apiKey, proxyUrl } = body;
  if (!messages) return error('messages required');

  const tokenToUse = apiKey || '';
  const hunyuanUrl = (proxyUrl || HUNYUAN_BASE) + '/v1/chat/completions';

  const resp = await fetch(hunyuanUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${tokenToUse}`,
    },
    body: JSON.stringify({
      model: model || 'hunyuan-turbo',
      messages,
      max_tokens: max_tokens || 300,
      temperature: temperature != null ? temperature : 0.3,
    }),
  });

  const data = await resp.json().catch(() => ({ error: 'parse failed' }));
  return json(data, resp.status);
}

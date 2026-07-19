import { json, error, parseBody, uuid } from '../utils.js';

export async function listProjects(req, env) {
  const { results } = await env.DB.prepare(
    'SELECT id, name, domain, figma_url, figma_file_key, created_at, updated_at FROM projects ORDER BY updated_at DESC'
  ).all();
  return json(results);
}

export async function createProject(req, env) {
  const body = await parseBody(req);
  if (!body.name || !body.domain) return error('name and domain are required');
  const id = uuid();
  const now = Date.now();
  await env.DB.prepare(
    `INSERT INTO projects (id, name, domain, figma_url, figma_file_key, figma_token, hunyuan_key, hunyuan_proxy, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(id, body.name, body.domain, body.figmaUrl || '', body.figmaFileKey || '',
         body.figmaToken || '', body.hunyuanKey || '', body.hunyuanProxy || '', now, now).run();
  return json({ id, name: body.name, domain: body.domain, created_at: now, updated_at: now }, 201);
}

export async function getProject(req, env) {
  const { id } = req.params;
  const proj = await env.DB.prepare('SELECT * FROM projects WHERE id = ?').bind(id).first();
  if (!proj) return error('Project not found', 404);

  // Also fetch frames, keys, and prompts
  const { results: frames } = await env.DB.prepare(
    'SELECT * FROM frames WHERE project_id = ? ORDER BY sort_order'
  ).bind(id).all();

  const { results: keys } = await env.DB.prepare(
    'SELECT * FROM keys WHERE project_id = ? ORDER BY sort_order'
  ).bind(id).all();

  const prompts = await env.DB.prepare(
    'SELECT * FROM prompts WHERE project_id = ?'
  ).bind(id).first();

  const cache = await env.DB.prepare(
    'SELECT * FROM figma_cache WHERE project_id = ?'
  ).bind(id).first();

  // Deserialize JSON fields
  for (const f of frames) f.frame_box = safeJSON(f.frame_box);
  for (const k of keys) { /* rel_* fields are already numeric */ }

  return json({
    ...proj,
    frames,
    keys,
    prompts: prompts ? {
      layer1: prompts.layer1 || '',
      layer2: safeJSON(prompts.layer2, {}),
      layer3: safeJSON(prompts.layer3, {}),
      compliance: safeJSON(prompts.compliance, {}),
    } : null,
    figmaCache: cache ? {
      rawData: safeJSON(cache.raw_data),
      frameImages: safeJSON(cache.frame_images, {}),
    } : null,
  });
}

export async function updateProject(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  const existing = await env.DB.prepare('SELECT id FROM projects WHERE id = ?').bind(id).first();
  if (!existing) return error('Project not found', 404);

  const fields = [];
  const values = [];
  for (const [k, v] of Object.entries(body)) {
    const col = camelToSnake(k);
    if (['name','domain','figma_url','figma_file_key','figma_token','hunyuan_key','hunyuan_proxy'].includes(col)) {
      fields.push(`${col} = ?`);
      values.push(v);
    }
  }
  if (fields.length > 0) {
    fields.push('updated_at = ?');
    values.push(Date.now());
    values.push(id);
    await env.DB.prepare(`UPDATE projects SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  }
  return json({ ok: true });
}

export async function deleteProject(req, env) {
  const { id } = req.params;
  // CASCADE will handle frames, keys, prompts, cache
  await env.DB.prepare('DELETE FROM projects WHERE id = ?').bind(id).run();
  return json({ ok: true });
}

// ---- Helpers ----
function camelToSnake(s) {
  return s.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
}

function safeJSON(str, fallback = null) {
  if (!str) return fallback;
  try { return JSON.parse(str); } catch { return fallback; }
}

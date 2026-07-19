import { json, error, parseBody } from '../utils.js';

/** PUT /api/projects/:id/frames — batch upsert frames for a project */
export async function saveFrames(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  if (!body.frames || !Array.isArray(body.frames)) return error('frames array required');
  const stmt = env.DB.prepare(
    `INSERT INTO frames (id, project_id, name, canvas_name, frame_box, sort_order, figma_image_url)
     VALUES (?, ?, ?, ?, ?, ?, ?)
     ON CONFLICT(project_id, id) DO UPDATE SET
       name=excluded.name, canvas_name=excluded.canvas_name,
       frame_box=excluded.frame_box, sort_order=excluded.sort_order,
       figma_image_url=excluded.figma_image_url`
  );
  const batch = [];
  for (let i = 0; i < body.frames.length; i++) {
    const f = body.frames[i];
    batch.push(stmt.bind(
      f.id, id, f.name, f.canvasName || '', JSON.stringify(f.frameBox || {}),
      i, f.figmaImageUrl || ''
    ));
  }
  await env.DB.batch(batch);
  return json({ ok: true, count: batch.length });
}

/** PUT /api/projects/:id/keys — batch save keys for a frame */
export async function saveKeys(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  if (!body.frameId || !body.keys) return error('frameId and keys array required');
  const stmt = env.DB.prepare(
    `INSERT INTO keys (frame_id, project_id, node_id, text, page, module, title, body,
       hidden, zh_cn, en_us, ja_jp, rel_x, rel_y, rel_w, rel_h, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  );
  const batch = [];
  for (let i = 0; i < body.keys.length; i++) {
    const k = body.keys[i];
    batch.push(stmt.bind(
      body.frameId, id,
      k.nodeId || '', k.text || '', k.page || '', k.module || '', k.title || '', k.body || '',
      k.hidden ? 1 : 0, k.zhCN || k.zhCn || '', k.enUS || k.enUs || '', k.jaJP || k.jaJp || '',
      k.relX || 0, k.relY || 0, k.relW || 0, k.relH || 0,
      i
    ));
  }
  await env.DB.batch(batch);
  return json({ ok: true, count: batch.length });
}

/** POST /api/projects/:id/keys — create a single key */
export async function createKey(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  if (!body.frameId) return error('frameId required');
  const result = await env.DB.prepare(
    `INSERT INTO keys (frame_id, project_id, node_id, text, page, module, title, body,
       hidden, zh_cn, en_us, ja_jp, rel_x, rel_y, rel_w, rel_h, sort_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).bind(
    body.frameId, id,
    body.nodeId || '', body.text || '', body.page || '', body.module || '', body.title || '', body.body || '',
    body.hidden ? 1 : 0, body.zhCN || body.zhCn || '', body.enUS || body.enUs || '', body.jaJP || body.jaJp || '',
    body.relX || 0, body.relY || 0, body.relW || 0, body.relH || 0,
    body.sortOrder || 0
  ).run();
  return json({ id: result.meta?.last_row_id, ok: true }, 201);
}

/** PUT /api/keys/:keyId — update a single key */
export async function updateKey(req, env) {
  const { keyId } = req.params;
  const body = await parseBody(req);
  const fields = [];
  const values = [];
  const allowed = ['page','module','title','body','hidden','zh_cn','en_us','ja_jp','text',
                   'rel_x','rel_y','rel_w','rel_h','node_id'];
  for (const [k, v] of Object.entries(body)) {
    const col = camelToSnake(k);
    if (allowed.includes(col)) {
      fields.push(`${col} = ?`);
      values.push(typeof v === 'boolean' ? (v ? 1 : 0) : v);
    }
  }
  if (fields.length === 0) return error('No valid fields to update');
  values.push(keyId);
  await env.DB.prepare(`UPDATE keys SET ${fields.join(', ')} WHERE id = ?`).bind(...values).run();
  return json({ ok: true });
}

/** DELETE /api/keys/:keyId */
export async function deleteKey(req, env) {
  const { keyId } = req.params;
  await env.DB.prepare('DELETE FROM keys WHERE id = ?').bind(keyId).run();
  return json({ ok: true });
}

function camelToSnake(s) {
  return s.replace(/[A-Z]/g, m => '_' + m.toLowerCase());
}

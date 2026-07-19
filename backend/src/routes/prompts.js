import { json, parseBody } from '../utils.js';

/** PUT /api/projects/:id/prompts */
export async function savePrompts(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  await env.DB.prepare(
    `INSERT INTO prompts (project_id, layer1, layer2, layer3, compliance)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(project_id) DO UPDATE SET
       layer1=excluded.layer1, layer2=excluded.layer2,
       layer3=excluded.layer3, compliance=excluded.compliance`
  ).bind(
    id,
    body.layer1 || '',
    JSON.stringify(body.layer2 || {}),
    JSON.stringify(body.layer3 || {}),
    JSON.stringify(body.compliance || {})
  ).run();
  return json({ ok: true });
}

/** PUT /api/projects/:id/cache — save figma cache */
export async function saveCache(req, env) {
  const { id } = req.params;
  const body = await parseBody(req);
  await env.DB.prepare(
    `INSERT INTO figma_cache (project_id, file_key, raw_data, frame_images, cached_at)
     VALUES (?, ?, ?, ?, ?)
     ON CONFLICT(project_id, file_key) DO UPDATE SET
       raw_data=excluded.raw_data, frame_images=excluded.frame_images, cached_at=excluded.cached_at`
  ).bind(
    id,
    body.fileKey || '',
    JSON.stringify(body.rawData || null),
    JSON.stringify(body.frameImages || {}),
    Date.now()
  ).run();
  return json({ ok: true });
}

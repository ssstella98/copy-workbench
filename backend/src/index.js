import { Router, json } from './utils.js';
import { wrapCORS } from './middleware/cors.js';
import { requireAuth } from './middleware/auth.js';
import {
  listProjects, createProject, getProject, updateProject, deleteProject,
} from './routes/projects.js';
import { saveFrames, saveKeys, createKey, updateKey, deleteKey } from './routes/keys.js';
import { savePrompts, saveCache } from './routes/prompts.js';
import { figmaProxy, hunyuanProxy } from './routes/proxy.js';

const router = new Router();

// Health check (no auth)
router.get('/api/health', () => json({ ok: true }));

// Auth check
router.post('/api/auth/check', (req, env) => {
  const err = requireAuth(req, env);
  if (err) return err;
  return json({ ok: true });
});

// ---- Projects ----
router.get('/api/projects', listProjects);
router.post('/api/projects', createProject);
router.get('/api/projects/:id', getProject);
router.put('/api/projects/:id', updateProject);
router.delete('/api/projects/:id', deleteProject);

// ---- Frames ----
router.put('/api/projects/:id/frames', saveFrames);

// ---- Keys ----
router.put('/api/projects/:id/keys', saveKeys);
router.post('/api/projects/:id/keys', createKey);
router.put('/api/keys/:keyId', updateKey);
router.delete('/api/keys/:keyId', deleteKey);

// ---- Prompts & Cache ----
router.put('/api/projects/:id/prompts', savePrompts);
router.put('/api/projects/:id/cache', saveCache);

// ---- API Proxies ----
router.post('/api/proxy/figma', figmaProxy);
router.post('/api/proxy/hunyuan', hunyuanProxy);

// Wrap all routes with CORS, and apply auth to protected routes
async function handleWithAuth(req, env, ctx) {
  const url = new URL(req.url);
  const path = url.pathname;

  // Public routes (no auth required for basic use)
  const publicPaths = ['/api/health', '/api/auth/check'];
  const isPublic = publicPaths.includes(path);
  const isProxy = path.startsWith('/api/proxy/');

  // Auth is optional for now — only enforce if AUTH_TOKEN is set to a non-dev value
  if (env.AUTH_TOKEN && env.AUTH_TOKEN !== 'dev-token-change-in-production') {
    if (!isPublic && !isProxy) {
      const authErr = requireAuth(req, env);
      if (authErr) return authErr;
    }
  }

  return router.handle(req, env, ctx);
}

export default {
  fetch: (req, env, ctx) => wrapCORS(handleWithAuth)(req, env, ctx),
};

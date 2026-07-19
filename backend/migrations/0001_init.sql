-- Migration 0001: Initial schema
CREATE TABLE IF NOT EXISTS projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  domain TEXT NOT NULL,
  figma_url TEXT DEFAULT '',
  figma_file_key TEXT DEFAULT '',
  figma_token TEXT DEFAULT '',
  hunyuan_key TEXT DEFAULT '',
  hunyuan_proxy TEXT DEFAULT '',
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  updated_at INTEGER NOT NULL DEFAULT (unixepoch())
);

CREATE TABLE IF NOT EXISTS frames (
  id TEXT NOT NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  canvas_name TEXT DEFAULT '',
  frame_box TEXT DEFAULT '{}',
  sort_order INTEGER DEFAULT 0,
  figma_image_url TEXT DEFAULT '',
  PRIMARY KEY (project_id, id)
);

CREATE TABLE IF NOT EXISTS keys (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  frame_id TEXT NOT NULL,
  project_id TEXT NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  node_id TEXT DEFAULT '',
  text TEXT DEFAULT '',
  page TEXT NOT NULL DEFAULT '',
  module TEXT DEFAULT '',
  title TEXT NOT NULL DEFAULT '',
  body TEXT DEFAULT '',
  hidden INTEGER DEFAULT 0,
  zh_cn TEXT DEFAULT '',
  en_us TEXT DEFAULT '',
  ja_jp TEXT DEFAULT '',
  rel_x REAL DEFAULT 0,
  rel_y REAL DEFAULT 0,
  rel_w REAL DEFAULT 0,
  rel_h REAL DEFAULT 0,
  sort_order INTEGER DEFAULT 0
);

CREATE INDEX IF NOT EXISTS idx_keys_project ON keys(project_id);
CREATE INDEX IF NOT EXISTS idx_keys_frame ON keys(project_id, frame_id);

CREATE TABLE IF NOT EXISTS prompts (
  project_id TEXT PRIMARY KEY REFERENCES projects(id) ON DELETE CASCADE,
  layer1 TEXT DEFAULT '',
  layer2 TEXT DEFAULT '',
  layer3 TEXT DEFAULT '',
  compliance TEXT DEFAULT ''
);

CREATE TABLE IF NOT EXISTS figma_cache (
  project_id TEXT NOT NULL,
  file_key TEXT NOT NULL,
  raw_data TEXT DEFAULT '',
  frame_images TEXT DEFAULT '',
  cached_at INTEGER NOT NULL DEFAULT (unixepoch()),
  PRIMARY KEY (project_id, file_key)
);

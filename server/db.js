import Database from "better-sqlite3";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database(path.join(__dirname, "data.sqlite"));

db.exec(`
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS guest_sessions (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS carts (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  guest_id TEXT,
  created_at TEXT NOT NULL,
  UNIQUE(user_id),
  UNIQUE(guest_id)
);

CREATE TABLE IF NOT EXISTS cart_items (
  id TEXT PRIMARY KEY,
  cart_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  name TEXT NOT NULL,
  plan TEXT,
  term TEXT,
  price_id TEXT NOT NULL,
  qty INTEGER NOT NULL DEFAULT 1,
  meta_json TEXT,
  created_at TEXT NOT NULL
);
`);

export default db;

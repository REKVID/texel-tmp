import path from "node:path";
import { fileURLToPath } from "node:url";
import fs from "node:fs/promises";
import sqlite3 from "sqlite3";
import { open } from "sqlite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbDir = path.resolve(__dirname, "../data");
const dbPath = path.join(dbDir, "auth.sqlite3");

let _db;

export async function openDb() {
  if (_db) return _db;
  await fs.mkdir(dbDir, { recursive: true });
  _db = await open({
    filename: dbPath,
    driver: sqlite3.Database,
  });
  await _db.exec("PRAGMA journal_mode=WAL;");
  await _db.exec("PRAGMA foreign_keys=ON;");
  return _db;
}

export async function initDb() {
  const db = await openDb();
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT NOT NULL UNIQUE,
      email TEXT NOT NULL UNIQUE,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT NOT NULL,
      progress INTEGER NOT NULL,
      created_at INTEGER NOT NULL
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      session_id TEXT PRIMARY KEY,
      user_id INTEGER NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL,
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
  await db.exec(`
    CREATE TABLE IF NOT EXISTS test_results (
      user_id INTEGER NOT NULL,
      topic_id TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      percentage INTEGER NOT NULL,
      updated_at INTEGER NOT NULL,
      PRIMARY KEY(user_id, topic_id),
      FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
    );
  `);
}


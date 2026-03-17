import express from "express";
import cookieParser from "cookie-parser";
import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { openDb, initDb } from "./storage.js";

const app = express();
app.use(express.json());
app.use(cookieParser());

const PORT = Number(process.env.PORT || 3001);

const SESSION_COOKIE = "texel_session";
const SESSION_MAX_AGE_SECONDS = 30 * 24 * 60 * 60;

function nowSec() {
  return Math.floor(Date.now() / 1000);
}

function makeSessionId() {
  return crypto.randomBytes(32).toString("hex");
}

function setSessionCookie(res, sessionId) {
  res.cookie(SESSION_COOKIE, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    maxAge: SESSION_MAX_AGE_SECONDS * 1000,
    path: "/",
  });
}

function clearSessionCookie(res) {
  res.clearCookie(SESSION_COOKIE, { path: "/" });
}

app.get("/api/health", async (_req, res) => {
  res.json({ status: "ok" });
});

const registerSchema = z.object({
  username: z.string().min(2),
  email: z.string().email(),
  password: z.string().min(6).max(200),
  name: z.string().min(1).max(200),
});

const loginSchema = z.object({
  login_or_email: z.string().min(1),
  password: z.string().min(1).max(200),
});

function userToDto(row) {
  return {
    id: row.id,
    username: row.username,
    email: row.email,
    name: row.name,
    role: row.role,
    progress: row.progress,
  };
}

async function requireUser(req, res) {
  const db = await openDb();
  const sessionId = req.cookies[SESSION_COOKIE];
  const user = await getUserBySession(db, sessionId);
  if (!user) {
    res.status(401).json({ detail: "Не авторизован" });
    return null;
  }
  return { db, user };
}

async function createSession(db, res, userId) {
  const sessionId = makeSessionId();
  const createdAt = nowSec();
  const expiresAt = createdAt + SESSION_MAX_AGE_SECONDS;
  await db.run(
    `INSERT INTO sessions(session_id, user_id, created_at, expires_at)
     VALUES (?, ?, ?, ?)`,
    [sessionId, userId, createdAt, expiresAt]
  );
  setSessionCookie(res, sessionId);
}

async function getUserBySession(db, sessionId) {
  if (!sessionId) return null;
  const row = await db.get(
    `SELECT u.id, u.username, u.email, u.password_hash, u.name, u.role, u.progress
     FROM sessions s
     JOIN users u ON u.id = s.user_id
     WHERE s.session_id = ? AND s.expires_at > ?`,
    [sessionId, nowSec()]
  );
  return row || null;
}

app.post("/api/auth/register", async (req, res) => {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: "Неверные данные регистрации" });
  }
  const { username, email, password, name } = parsed.data;
  const db = await openDb();
  const usernameNorm = username.trim().toLowerCase();
  const emailNorm = email.trim().toLowerCase();
  const nameNorm = name.trim();
  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const createdAt = nowSec();
    const role = "user";
    const progress = 0;
    const result = await db.run(
      `INSERT INTO users(username, email, password_hash, name, role, progress, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [usernameNorm, emailNorm, passwordHash, nameNorm, role, progress, createdAt]
    );
    await createSession(db, res, result.lastID);
    const userRow = await db.get(
      `SELECT id, username, email, password_hash, name, role, progress FROM users WHERE id = ?`,
      [result.lastID]
    );
    return res.json(userToDto(userRow));
  } catch (e) {
    const msg = String(e?.message || e);
    if (msg.includes("UNIQUE")) {
      return res.status(400).json({ detail: "Логин или почта уже заняты" });
    }
    return res.status(500).json({ detail: "Внутренняя ошибка сервера" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({ detail: "Укажите логин/почту и пароль" });
  }
  const { login_or_email, password } = parsed.data;
  const db = await openDb();
  const key = login_or_email.trim().toLowerCase();

  const row = await db.get(
    `SELECT id, username, email, password_hash, name, role, progress
     FROM users
     WHERE username = ? OR email = ?`,
    [key, key]
  );
  if (!row) return res.status(401).json({ detail: "Неверный логин/почта или пароль" });
  const ok = await bcrypt.compare(password, row.password_hash);
  if (!ok) return res.status(401).json({ detail: "Неверный логин/почта или пароль" });

  await createSession(db, res, row.id);
  return res.json(userToDto(row));
});

app.get("/api/auth/me", async (req, res) => {
  const db = await openDb();
  const sessionId = req.cookies[SESSION_COOKIE];
  const row = await getUserBySession(db, sessionId);
  if (!row) return res.status(401).json({ detail: "Не авторизован" });
  return res.json(userToDto(row));
});

app.post("/api/auth/logout", async (req, res) => {
  const db = await openDb();
  const sessionId = req.cookies[SESSION_COOKIE];
  if (sessionId) {
    await db.run(`DELETE FROM sessions WHERE session_id = ?`, [sessionId]);
  }
  clearSessionCookie(res);
  return res.json({ ok: true });
});

app.get("/api/training/:topicId/test-result", async (req, res) => {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const { db, user } = auth;
  const topicId = String(req.params.topicId || "").trim();
  if (!topicId) return res.status(400).json({ detail: "Некорректная тема" });

  const row = await db.get(
    `SELECT score, total, percentage, updated_at
     FROM test_results
     WHERE user_id = ? AND topic_id = ?`,
    [user.id, topicId]
  );
  if (!row) return res.json({ hasResult: false });
  return res.json({ hasResult: true, ...row });
});

app.post("/api/training/:topicId/test-result", async (req, res) => {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const { db, user } = auth;
  const topicId = String(req.params.topicId || "").trim();
  if (!topicId) return res.status(400).json({ detail: "Некорректная тема" });

  const schema = z.object({
    score: z.number().int().min(0),
    total: z.number().int().min(1),
  });
  const parsed = schema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ detail: "Неверные данные результата" });

  const { score, total } = parsed.data;
  const percentage = Math.round((score / total) * 100);
  const updatedAt = nowSec();

  await db.run(
    `INSERT INTO test_results(user_id, topic_id, score, total, percentage, updated_at)
     VALUES (?, ?, ?, ?, ?, ?)
     ON CONFLICT(user_id, topic_id)
     DO UPDATE SET score=excluded.score, total=excluded.total, percentage=excluded.percentage, updated_at=excluded.updated_at`,
    [user.id, topicId, score, total, percentage, updatedAt]
  );

  return res.json({ ok: true, score, total, percentage, updated_at: updatedAt });
});

app.get("/api/training/test-results", async (req, res) => {
  const auth = await requireUser(req, res);
  if (!auth) return;
  const { db, user } = auth;

  const rows = await db.all(
    `SELECT topic_id, score, total, percentage, updated_at
     FROM test_results
     WHERE user_id = ?
     ORDER BY updated_at DESC`,
    [user.id]
  );

  return res.json({ results: rows });
});

// Start
await initDb();
app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`[server] listening on http://localhost:${PORT}`);
});


import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { v4 as uuid } from "uuid";
import db from "./db.js";

const JWT_SECRET = process.env.JWT_SECRET || "dev-secret";
const SESSION_COOKIE_NAME = process.env.SESSION_COOKIE_NAME || "mh_sess";

function signJwt(payload) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: "7d" });
}

function setAuthCookie(res, token) {
  res.cookie("mh_auth", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    maxAge: 7 * 24 * 3600 * 1000,
  });
}

function clearAuthCookie(res) {
  res.clearCookie("mh_auth");
}

function getOrCreateGuestSession(req, res) {
  const name = SESSION_COOKIE_NAME;
  let sid = req.cookies[name];
  if (!sid) {
    sid = uuid();
    const now = new Date().toISOString();
    db.prepare("INSERT OR IGNORE INTO guest_sessions (id, created_at) VALUES (?, ?)").run(sid, now);
    res.cookie(name, sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 30 * 24 * 3600 * 1000,
    });
  }
  return sid;
}

function requireUser(req, res, next) {
  const token = req.cookies["mh_auth"];
  if (!token) return res.status(401).json({ error: "not_authenticated" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ error: "invalid_token" });
  }
}

export {
  signJwt,
  setAuthCookie,
  clearAuthCookie,
  requireUser,
  getOrCreateGuestSession,
};

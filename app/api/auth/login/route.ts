import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { createSession, cookieOptions, SESSION_COOKIE } from "@/lib/auth";

// Simple in-memory brute-force guard (per server instance).
const attempts = new Map<string, { count: number; until: number }>();
const MAX = 5;
const LOCK_MS = 15 * 60 * 1000;

function storedHash() {
  const v = (process.env.ADMIN_PASSWORD_HASH || "").trim();
  if (!v) return "";
  return v.startsWith("$2") ? v : Buffer.from(v, "base64").toString("utf8");
}

export async function POST(req: Request) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  const rec = attempts.get(ip);
  if (rec && rec.until > Date.now() && rec.count >= MAX) {
    return NextResponse.json({ error: "Too many attempts. Try again in 15 minutes." }, { status: 429 });
  }

  let body: { email?: string; password?: string } = {};
  try { body = await req.json(); } catch {}
  const email = (body.email || "").trim().toLowerCase();
  const password = body.password || "";

  const adminEmail = (process.env.ADMIN_EMAIL || "").trim().toLowerCase();
  const hash = storedHash();
  if (!adminEmail || !hash || !process.env.AUTH_SECRET) {
    return NextResponse.json({ error: "Admin login is not configured. Set ADMIN_EMAIL, ADMIN_PASSWORD_HASH and AUTH_SECRET." }, { status: 500 });
  }

  const ok = email === adminEmail && (await bcrypt.compare(password, hash));
  if (!ok) {
    const next = { count: (rec && rec.until > Date.now() ? rec.count : 0) + 1, until: Date.now() + LOCK_MS };
    attempts.set(ip, next);
    return NextResponse.json({ error: "Incorrect email or password." }, { status: 401 });
  }

  attempts.delete(ip);
  const token = await createSession(adminEmail);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, token, cookieOptions);
  return res;
}

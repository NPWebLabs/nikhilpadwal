import { NextResponse } from "next/server";
import { dbConfigured } from "@/lib/db";
import { isBot, recordView } from "@/lib/analytics";
import { SESSION_COOKIE } from "@/lib/auth";
import { SITE_URL } from "@/lib/data";

// Page-view beacon from components/Tracker.tsx. Bots and the signed-in admin are not counted.
export async function POST(req: Request) {
  if (!dbConfigured) return new NextResponse(null, { status: 204 });
  const ua = req.headers.get("user-agent") || "";
  if (isBot(ua) || req.headers.get("cookie")?.includes(`${SESSION_COOKIE}=`)) return new NextResponse(null, { status: 204 });
  let body: { path?: string; ref?: string } = {};
  try {
    body = JSON.parse(await req.text());
  } catch {}
  const path = String(body.path || "").split(/[?#]/)[0];
  if (!path.startsWith("/") || path.length > 300 || /^\/(admin|api)(\/|$)/.test(path)) return new NextResponse(null, { status: 204 });
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "0.0.0.0";
  try {
    await recordView({ path, referrer: body.ref ? String(body.ref).slice(0, 500) : null, ua, ip, siteHost: new URL(SITE_URL).hostname });
  } catch (e) {
    console.error("[track]", (e as Error).message);
  }
  return new NextResponse(null, { status: 204 });
}

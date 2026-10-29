import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

// Root files with their own routes; every other /<name>.<ext> is looked up in admin → Site files.
const OWN_ROUTES = new Set(["/robots.txt", "/sitemap.xml", "/llms.txt"]);
const ROOT_FILE = /^\/[A-Za-z0-9][A-Za-z0-9._-]{0,120}\.(txt|xml|html|json|webmanifest)$/;

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (ROOT_FILE.test(pathname)) {
    if (OWN_ROUTES.has(pathname)) return NextResponse.next();
    return NextResponse.rewrite(new URL(`/api/files${pathname}`, req.url));
  }

  const isLogin = pathname === "/admin/login";
  const isAdminApi = pathname.startsWith("/api/admin");
  const session = await verifySession(req.cookies.get(SESSION_COOKIE)?.value);

  if (isLogin) {
    if (session) return NextResponse.redirect(new URL("/admin", req.url));
    return NextResponse.next();
  }
  if (!session) {
    if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const url = new URL("/admin/login", req.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }
  const res = NextResponse.next();
  res.headers.set("X-Robots-Tag", "noindex, nofollow");
  return res;
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*", "/((?!_next/|api/|admin/|media/)[^/]+\\.(?:txt|xml|html|json|webmanifest))"],
};

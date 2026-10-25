import { NextResponse, type NextRequest } from "next/server";
import { SESSION_COOKIE, verifySession } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
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

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };

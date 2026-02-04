import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // 모든 쿠키 이름 로깅
    const allCookies = request.cookies.getAll();
    console.log("[MIDDLEWARE] All cookies:", allCookies.map(c => c.name));

    // better-auth 쿠키 확인 (여러 가능한 이름 체크)
    const sessionCookie =
      request.cookies.get("better-auth.session_token") ||
      request.cookies.get("better-auth.session") ||
      request.cookies.get("__Secure-better-auth.session_token");

    console.log("[MIDDLEWARE] Session cookie found:", !!sessionCookie);

    if (!sessionCookie) {
      // No session, redirect to home
      console.log("[MIDDLEWARE] No session, redirecting to home");
      return NextResponse.redirect(new URL("/?login=required", request.url));
    }

    // Role verification is handled in admin/layout.tsx (server-side)
    // Middleware just ensures user is logged in
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

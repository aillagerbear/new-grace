import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get session cookie (better-auth uses "better-auth.session_token")
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      // No session, redirect to home
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

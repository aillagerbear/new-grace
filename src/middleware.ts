import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  // Only protect /admin routes
  if (request.nextUrl.pathname.startsWith("/admin")) {
    // Get session cookie (better-auth uses "better-auth.session_token")
    const sessionCookie = request.cookies.get("better-auth.session_token");

    if (!sessionCookie) {
      // No session, redirect to home
      return NextResponse.redirect(new URL("/?login=required", request.url));
    }

    // For admin routes, we need to verify the role server-side
    // We'll call our verify API internally
    try {
      const verifyUrl = new URL("/api/admin/verify", request.url);
      const verifyResponse = await fetch(verifyUrl, {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      });

      if (verifyResponse.ok) {
        const data = await verifyResponse.json();

        if (!data.authenticated) {
          if (data.reason === "not_logged_in") {
            return NextResponse.redirect(new URL("/?login=required", request.url));
          }
          if (data.reason === "not_admin") {
            return NextResponse.redirect(new URL("/?error=unauthorized", request.url));
          }
        }
      }
    } catch (error) {
      console.error("Middleware auth check failed:", error);
      // On error, let the request through and handle in the page
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};

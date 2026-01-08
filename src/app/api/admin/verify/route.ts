import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function POST(request: NextRequest) {
  try {
    const { password } = await request.json();

    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      return NextResponse.json(
        { error: "Admin password not configured" },
        { status: 500 }
      );
    }

    if (password === adminPassword) {
      // 세션 토큰 생성 (24시간 유효)
      const token = Buffer.from(`admin:${Date.now()}`).toString("base64");

      const cookieStore = await cookies();
      cookieStore.set("admin_session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24, // 24시간
        path: "/",
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json(
      { error: "Invalid password" },
      { status: 401 }
    );
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get("admin_session");

    if (session?.value) {
      // 토큰 검증 (24시간 이내인지 확인)
      try {
        const decoded = Buffer.from(session.value, "base64").toString();
        const [prefix, timestamp] = decoded.split(":");
        const tokenTime = parseInt(timestamp, 10);
        const now = Date.now();
        const oneDay = 24 * 60 * 60 * 1000;

        if (prefix === "admin" && now - tokenTime < oneDay) {
          return NextResponse.json({ authenticated: true });
        }
      } catch {
        // 토큰 파싱 실패
      }
    }

    return NextResponse.json({ authenticated: false });
  } catch {
    return NextResponse.json({ authenticated: false });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete("admin_session");
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

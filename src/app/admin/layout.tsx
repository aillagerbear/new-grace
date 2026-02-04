import { headers } from "next/headers";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Pool } from "pg";
import AdminSidebar from "@/components/admin/admin-sidebar";
import { LogIn, ShieldAlert } from "lucide-react";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  max: 10,
});

async function getAuthState() {
  try {
    console.log("[ADMIN LAYOUT] Getting session...");
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    console.log("[ADMIN LAYOUT] Session:", session?.user?.id, session?.user?.email);

    if (!session?.user?.id) {
      console.log("[ADMIN LAYOUT] No session found");
      return { authenticated: false, reason: "not_logged_in" as const };
    }

    console.log("[ADMIN LAYOUT] Querying role for user:", session.user.id);
    const result = await pool.query(
      `SELECT role FROM "user" WHERE id = $1`,
      [session.user.id]
    );

    console.log("[ADMIN LAYOUT] DB result:", result.rows);
    const userRole = result.rows[0]?.role || "user";
    console.log("[ADMIN LAYOUT] User role:", userRole);

    if (userRole !== "admin") {
      return {
        authenticated: false,
        reason: "not_admin" as const,
        userRole,
      };
    }

    return {
      authenticated: true,
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: userRole,
      },
    };
  } catch (error) {
    console.error("[ADMIN LAYOUT] Error:", error);
    return { authenticated: false, reason: "error" as const };
  }
}

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const authState = await getAuthState();

  // 로그인하지 않은 경우
  if (authState.reason === "not_logged_in") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                <LogIn className="w-8 h-8 text-indigo-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">로그인 필요</h1>
              <p className="text-gray-600 mt-2">
                관리자 페이지에 접근하려면 먼저 로그인해주세요.
              </p>
            </div>

            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              메인 페이지에서 로그인하기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 관리자가 아닌 경우
  if (authState.reason === "not_admin") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <ShieldAlert className="w-8 h-8 text-red-600" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">접근 권한 없음</h1>
              <p className="text-gray-600 mt-2">
                관리자 페이지는 관리자 권한이 있는 사용자만 접근할 수 있습니다.
              </p>
              <p className="text-sm text-gray-500 mt-2">
                현재 역할:{" "}
                <span className="font-medium">
                  {authState.userRole === "pastor" ? "목사" : "일반"}
                </span>
              </p>
            </div>

            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700"
            >
              메인 사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 인증 실패 (에러 또는 기타)
  if (!authState.authenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">오류 발생</h1>
              <p className="text-gray-600 mt-2">
                인증 확인 중 오류가 발생했습니다.
              </p>
            </div>

            <Link
              href="/admin"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              다시 시도
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-100">
      <AdminSidebar userName={authState.user?.name} />

      {/* 메인 컨텐츠 */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

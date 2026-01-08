"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  FileText,
  LogOut,
  Menu,
  X,
  ShieldAlert,
  LogIn,
} from "lucide-react";

type AuthState = {
  authenticated: boolean;
  reason?: "not_logged_in" | "not_admin" | "error";
  userRole?: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
} | null;

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [authState, setAuthState] = useState<AuthState>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch("/api/admin/verify");
      const data = await res.json();
      setAuthState(data);
    } catch {
      setAuthState({ authenticated: false, reason: "error" });
    }
  };

  const navigation = [
    { name: "대시보드", href: "/admin", icon: LayoutDashboard },
    { name: "사용자 관리", href: "/admin/users", icon: Users },
    { name: "게시글 관리", href: "/admin/posts", icon: FileText },
  ];

  // 로딩 중
  if (authState === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  // 로그인하지 않은 경우
  if (!authState.authenticated && authState.reason === "not_logged_in") {
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
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              메인 페이지에서 로그인하기
            </Link>

            <div className="mt-6 text-center">
              <Link
                href="/"
                className="text-sm text-gray-600 hover:text-indigo-600"
              >
                ← 메인 사이트로 돌아가기
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 관리자가 아닌 경우
  if (!authState.authenticated && authState.reason === "not_admin") {
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
                현재 역할: <span className="font-medium">{authState.userRole === "pastor" ? "목사" : "일반"}</span>
              </p>
            </div>

            <Link
              href="/"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              메인 사이트로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // 에러 발생
  if (!authState.authenticated && authState.reason === "error") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="text-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900">오류 발생</h1>
              <p className="text-gray-600 mt-2">
                인증 확인 중 오류가 발생했습니다. 다시 시도해주세요.
              </p>
            </div>

            <button
              onClick={() => {
                setAuthState(null);
                checkAuth();
              }}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
            >
              다시 시도
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 관리자 대시보드
  return (
    <div className="min-h-screen bg-gray-100">
      {/* 모바일 사이드바 토글 */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-20 bg-white border-b px-4 py-3 flex items-center justify-between">
        <h1 className="font-bold text-lg">관리자</h1>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* 사이드바 */}
      <aside
        className={`fixed inset-y-0 left-0 z-10 w-64 bg-white border-r transform transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 border-b hidden lg:block">
            <h1 className="text-xl font-bold text-gray-900">관리자 대시보드</h1>
            {authState.user && (
              <p className="text-sm text-gray-500 mt-1">{authState.user.name}</p>
            )}
          </div>

          <nav className="flex-1 p-4 space-y-1 mt-14 lg:mt-0">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center px-4 py-3 rounded-lg transition-colors ${
                    isActive
                      ? "bg-indigo-50 text-indigo-600"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  <item.icon className="w-5 h-5 mr-3" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t">
            <Link
              href="/"
              className="flex items-center w-full px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5 mr-3" />
              메인으로 돌아가기
            </Link>
          </div>
        </div>
      </aside>

      {/* 오버레이 (모바일) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-5 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 메인 컨텐츠 */}
      <main className="lg:ml-64 pt-14 lg:pt-0">
        <div className="p-6">{children}</div>
      </main>
    </div>
  );
}

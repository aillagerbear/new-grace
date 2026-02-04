"use client";

import React, { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { Search, Menu, ChevronDown, X, PenLine } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { ThemeToggle } from "@/components/ui/theme-toggle";

// bundle-dynamic-imports: 모달은 필요할 때만 로드
const LoginModal = dynamic(
  () => import("@/components/auth/login-modal").then((mod) => mod.LoginModal),
  { ssr: false }
);

// rendering-hoist-jsx: 정적 데이터를 컴포넌트 외부로 추출
const NAV_ITEMS = [
  { label: "기도 요청", href: "/prayer" },
  { label: "함께 기도", href: "/pray-together" },
  { label: "응답 이야기", href: "/testimonies" },
  {
    label: "더보기",
    href: "#",
    children: [
      { label: "자유 게시판", href: "/community" },
      { label: "공지사항", href: "/notice" },
      { label: "이용 안내", href: "/guide" },
      { label: "문의하기", href: "/contact" },
    ],
  },
] as const;

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { data: session } = useSession();

  // client-passive-event-listeners: passive 옵션으로 스크롤 성능 개선
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // rerender-functional-setstate: 안정적인 콜백 참조
  const openLoginModal = useCallback(() => setIsLoginModalOpen(true), []);
  const closeLoginModal = useCallback(() => setIsLoginModalOpen(false), []);
  const closeMobileMenu = useCallback(() => setIsMobileMenuOpen(false), []);
  const toggleMobileMenu = useCallback(() => setIsMobileMenuOpen((prev) => !prev), []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${isScrolled
            ? "bg-card/95 backdrop-blur-md shadow-lg shadow-black/5"
            : "bg-card border-b border-border"
          }`}
      >
        <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src="/logo.jpg"
              alt="Grace Church"
              width={40}
              height={40}
              className="rounded-xl object-cover shadow-lg"
              priority
            />
            <div className="flex flex-col">
              <span className="text-lg font-bold text-foreground group-hover:text-primary transition-colors leading-tight">
                기도하는 손
              </span>
              <span className="text-[11px] text-muted-foreground leading-tight">
                함께 기도하는 커뮤니티
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {NAV_ITEMS.map((item) => (
              <div key={item.label} className="relative group">
                {item.children ? (
                  <span className="px-4 py-2 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg flex items-center gap-1.5 transition-all duration-200 cursor-pointer">
                    {item.label}
                    <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
                  </span>
                ) : (
                  <Link
                    href={item.href}
                    className="px-4 py-2 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg flex items-center gap-1.5 transition-all duration-200"
                  >
                    {item.label}
                  </Link>
                )}
                {item.children && (
                  <ul className="absolute left-0 top-full mt-2 bg-card border border-border shadow-xl shadow-black/10 rounded-xl py-2 min-w-[160px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110]">
                    {item.children.map((child) => (
                      <li key={child.href}>
                        <Link
                          href={child.href}
                          className="block px-4 py-2.5 text-[14px] text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-colors"
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button className="p-2.5 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg">
              <Search className="w-5 h-5" />
            </button>

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Write Prayer Request */}
            <Link
              href="/prayer/new"
              className="hidden md:inline-flex items-center gap-1.5 h-10 px-4 bg-primary/10 text-primary text-[14px] font-medium rounded-xl hover:bg-primary/20 transition-all duration-200"
            >
              <PenLine className="w-4 h-4" />
              기도 요청
            </Link>

            {/* User Actions */}
            {session?.user ? (
              <div className="hidden sm:flex items-center gap-3 ml-1">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground text-sm font-medium">
                      {(session.user.name || session.user.email)?.[0]?.toUpperCase()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => signOut()}
                  className="text-[13px] font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  로그아웃
                </button>
              </div>
            ) : (
              <button
                onClick={openLoginModal}
                className="hidden sm:inline-flex items-center justify-center h-10 px-5 bg-primary text-primary-foreground text-[14px] font-semibold rounded-xl hover:bg-primary/90 transition-colors"
              >
                로그인
              </button>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 text-muted-foreground hover:text-foreground hover:bg-secondary/50 transition-all rounded-lg"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-border bg-card/95 backdrop-blur-md">
            <nav className="max-w-[1280px] mx-auto px-6 py-4 space-y-1">
              {NAV_ITEMS.map((item) => (
                <div key={item.label}>
                  {item.children ? (
                    <>
                      <div className="px-4 py-2 text-[13px] font-medium text-muted-foreground/70">
                        {item.label}
                      </div>
                      {item.children.map((child) => (
                        <Link
                          key={child.href}
                          href={child.href}
                          onClick={closeMobileMenu}
                          className="block px-4 py-3 pl-6 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </>
                  ) : (
                    <Link
                      href={item.href}
                      onClick={closeMobileMenu}
                      className="block px-4 py-3 text-[15px] font-medium text-muted-foreground hover:text-foreground hover:bg-secondary/50 rounded-lg transition-colors"
                    >
                      {item.label}
                    </Link>
                  )}
                </div>
              ))}
              <Link
                href="/prayer/new"
                onClick={closeMobileMenu}
                className="flex items-center justify-center gap-2 mt-4 h-12 bg-primary/10 text-primary font-semibold rounded-xl"
              >
                <PenLine className="w-4 h-4" />
                기도 요청하기
              </Link>
              {!session?.user && (
                <button
                  onClick={() => {
                    openLoginModal();
                    closeMobileMenu();
                  }}
                  className="w-full mt-2 h-12 bg-primary text-primary-foreground text-[14px] font-semibold rounded-xl hover:bg-primary/90 transition-colors"
                >
                  로그인
                </button>
              )}
            </nav>
          </div>
        )}
      </header>
      <div className="h-16" /> {/* Spacer */}

      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={closeLoginModal}
      />
    </>
  );
};

export default Header;
import React from 'react';
import { Shield, Heart, ChevronRight, Users } from 'lucide-react';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: "기도",
      links: [
        { label: "기도 요청하기", href: "/prayer/new" },
        { label: "함께 기도하기", href: "/pray-together" },
        { label: "응답 이야기", href: "/testimonies" },
      ]
    },
    {
      title: "커뮤니티",
      links: [
        { label: "자유 게시판", href: "/community" },
        { label: "공지사항", href: "/notice" },
        { label: "이용 안내", href: "/guide" },
        { label: "문의하기", href: "/contact" },
      ]
    },
  ];

  return (
    <footer className="bg-card border-t border-border">
      {/* Main Footer */}
      <div className="max-w-[1280px] mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Info */}
          <div className="md:col-span-2">
            <a href="/" className="flex items-center gap-2 mb-4">
              <img
                src="/logo.jpg"
                alt="기도하는 손"
                className="w-10 h-10 rounded-xl object-cover shadow-lg"
              />
              <div>
                <span className="text-lg font-bold text-foreground block leading-tight">
                  기도하는 손
                </span>
                <span className="text-[11px] text-muted-foreground">
                  함께 기도하는 커뮤니티
                </span>
              </div>
            </a>
            <p className="text-[14px] text-muted-foreground leading-relaxed mb-6 max-w-sm">
              기도가 필요한 순간, 혼자가 아닙니다. 기도 제목을 나누고, 서로를 위해 기도하며, 하나님의 응답을 함께 경험하세요.
            </p>

            {/* Features */}
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Shield className="w-3.5 h-3.5 text-primary" />
                <span>익명 보장</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Heart className="w-3.5 h-3.5 text-pink-500" />
                <span>진심 어린 기도</span>
              </div>
              <div className="flex items-center gap-2 text-[12px] text-muted-foreground bg-secondary/50 px-3 py-1.5 rounded-full">
                <Users className="w-3.5 h-3.5 text-amber-500" />
                <span>함께하는 커뮤니티</span>
              </div>
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((group) => (
            <div key={group.title}>
              <h4 className="text-[14px] font-semibold text-foreground mb-4">
                {group.title}
              </h4>
              <ul className="space-y-2.5">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="group flex items-center text-[13px] text-muted-foreground hover:text-foreground transition-colors"
                    >
                      <ChevronRight className="w-3.5 h-3.5 mr-1 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Copyright */}
      <div className="border-t border-border">
        <div className="max-w-[1280px] mx-auto px-6 py-4 flex flex-col md:flex-row items-center justify-between gap-2">
          <p className="text-[12px] text-muted-foreground">
            © {currentYear} 기도하는 손. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <a href="/privacy" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              개인정보처리방침
            </a>
            <a href="/terms" className="text-[12px] text-muted-foreground hover:text-foreground transition-colors">
              이용약관
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
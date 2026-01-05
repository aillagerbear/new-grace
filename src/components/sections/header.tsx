"use client";

import React, { useState, useEffect } from "react";
import { Search, Menu, ChevronDown } from "lucide-react";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { label: "전체글보기", href: "/all" },
    { label: "소식", href: "/news" },
    {
      label: "기도",
      href: "/prayer",
      children: ["전체", "건강", "가족", "직장", "학업", "기타"],
    },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-[100] bg-white transition-shadow duration-200 ${
          isScrolled ? "shadow-md" : "border-b border-[#E2E8F0]"
        }`}
      >
        <div className="max-w-[1360px] mx-auto px-4 h-[64px] flex items-center justify-center">
          <div className="flex items-center gap-8">
            <a href="/" className="flex-shrink-0">
              <span className="text-[24px] font-bold text-[#1A202C]">
                Grace Church
              </span>
            </a>

            <nav className="hidden lg:block">
              <ul className="flex items-center">
                {navItems.map((item) => (
                  <li
                    key={item.label}
                    className="relative group"
                  >
                    <a
                      href={item.href}
                      className="px-4 py-5 text-[15px] font-medium text-[#4A5568] hover:text-[#4299E1] flex items-center gap-1 transition-colors"
                    >
                      {item.label}
                      {item.children && <ChevronDown className="w-4 h-4" />}
                    </a>
                    {item.children && (
                      <ul className="absolute left-0 top-[100%] bg-white border border-[#E2E8F0] shadow-lg rounded-md py-2 min-w-[140px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-[110]">
                        {item.children.map((child) => (
                          <li key={child}>
                            <a
                              href="#"
                              className="block px-4 py-2 text-[13px] text-[#4A5568] hover:bg-[#F7FAFC] hover:text-[#4299E1] transition-colors"
                            >
                              {child}
                            </a>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ul>
            </nav>

            <div className="flex items-center gap-2">
            <button className="p-2 text-[#A0AEC0] hover:text-[#4A5568] transition-colors rounded-lg">
              <Search className="w-5 h-5" />
            </button>

              <button className="lg:hidden p-2 text-[#A0AEC0] hover:text-[#4A5568] transition-colors">
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </header>
      <div className="h-[64px]" /> {/* Spacer to prevent content jump */}
    </>
  );
};

export default Header;
"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { authClient } from "@/lib/auth-client";

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const handleSocialLogin = async (provider: "google" | "kakao") => {
    try {
      await authClient.signIn.social({
        provider,
        callbackURL: "/",
      });
    } catch (error) {
      console.error("로그인 에러:", error);
    }
  };

  const handleNaverLogin = async () => {
    try {
      await authClient.signIn.oauth2({
        providerId: "naver",
        callbackURL: "/",
      });
    } catch (error) {
      console.error("네이버 로그인 에러:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-2">
          <DialogTitle className="text-xl font-bold text-center">
            로그인
          </DialogTitle>
          <DialogDescription className="text-center text-[#718096]">
            소셜 계정으로 간편하게 로그인하세요
          </DialogDescription>
        </DialogHeader>

        <div className="p-6 pt-4 space-y-3">
          {/* 카카오 로그인 */}
          <button
            onClick={() => handleSocialLogin("kakao")}
            className="w-full flex items-center justify-center gap-3 h-12 px-4 bg-[#FEE500] text-[#191919] font-medium rounded-lg hover:bg-[#FDD835] transition-colors"
          >
            <KakaoIcon />
            <span>카카오로 로그인</span>
          </button>

          {/* 네이버 로그인 */}
          <button
            onClick={handleNaverLogin}
            className="w-full flex items-center justify-center gap-3 h-12 px-4 bg-[#03C75A] text-white font-medium rounded-lg hover:bg-[#02B150] transition-colors"
          >
            <NaverIcon />
            <span>네이버로 로그인</span>
          </button>

          {/* 구글 로그인 */}
          <button
            onClick={() => handleSocialLogin("google")}
            className="w-full flex items-center justify-center gap-3 h-12 px-4 bg-white text-[#1A202C] font-medium rounded-lg border border-[#E2E8F0] hover:bg-[#F7FAFC] transition-colors"
          >
            <GoogleIcon />
            <span>Google로 로그인</span>
          </button>
        </div>

        <div className="px-6 pb-6">
          <p className="text-xs text-center text-[#A0AEC0]">
            로그인 시{" "}
            <a href="/terms" className="text-[#4299E1] hover:underline">
              이용약관
            </a>
            과{" "}
            <a href="/privacy" className="text-[#4299E1] hover:underline">
              개인정보처리방침
            </a>
            에 동의하게 됩니다.
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// 카카오 아이콘
function KakaoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2.5C5.30566 2.5 1.5 5.52771 1.5 9.27273C1.5 11.6269 3.07465 13.6942 5.44824 14.8699L4.52734 18.1152C4.46294 18.3426 4.71799 18.5263 4.91895 18.3927L8.83398 15.7986C9.21631 15.8501 9.60449 15.8773 10 15.8773C14.6943 15.8773 18.5 12.8496 18.5 9.10455C18.5 5.35947 14.6943 2.5 10 2.5Z"
        fill="#191919"
      />
    </svg>
  );
}

// 네이버 아이콘
function NaverIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M13.5 10.5L6.5 2.5H2.5V17.5H6.5V9.5L13.5 17.5H17.5V2.5H13.5V10.5Z"
        fill="white"
      />
    </svg>
  );
}

// 구글 아이콘
function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M18.1713 8.36791H17.5V8.33333H10V11.6667H14.7096C14.0225 13.607 12.1762 15 10 15C7.23875 15 5 12.7612 5 10C5 7.23875 7.23875 5 10 5C11.2746 5 12.4342 5.48083 13.3171 6.26625L15.6742 3.90917C14.1858 2.52208 12.195 1.66667 10 1.66667C5.39792 1.66667 1.66667 5.39792 1.66667 10C1.66667 14.6021 5.39792 18.3333 10 18.3333C14.6021 18.3333 18.3333 14.6021 18.3333 10C18.3333 9.44125 18.2758 8.89583 18.1713 8.36791Z"
        fill="#FFC107"
      />
      <path
        d="M2.6275 6.12125L5.36542 8.12917C6.10625 6.29542 7.90042 5 10 5C11.2746 5 12.4342 5.48083 13.3171 6.26625L15.6742 3.90917C14.1858 2.52208 12.195 1.66667 10 1.66667C6.79917 1.66667 4.02333 3.47375 2.6275 6.12125Z"
        fill="#FF3D00"
      />
      <path
        d="M10 18.3333C12.1525 18.3333 14.1083 17.5096 15.5871 16.17L13.0079 13.9875C12.1431 14.6452 11.0864 15.0009 10 15C7.8325 15 5.99208 13.6179 5.29875 11.6892L2.58125 13.7829C3.96042 16.4817 6.76125 18.3333 10 18.3333Z"
        fill="#4CAF50"
      />
      <path
        d="M18.1713 8.36791H17.5V8.33333H10V11.6667H14.7096C14.3809 12.5902 13.7889 13.3972 13.0067 13.9879L13.0079 13.9871L15.5871 16.1696C15.4046 16.3354 18.3333 14.1667 18.3333 10C18.3333 9.44125 18.2758 8.89583 18.1713 8.36791Z"
        fill="#1976D2"
      />
    </svg>
  );
}

export default LoginModal;

"use client";

import React from 'react';

/**
 * HeroCarousel Component - Prayer Community Platform
 */
export default function HeroCarousel() {
  return (
    <div className="relative overflow-hidden w-full rounded-2xl">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: "url('/prayer_community_background.png')" }}
      />
      {/* Content */}
      <div className="relative z-10 px-8 py-16 md:py-20 text-center">
        <p className="text-sm md:text-base text-primary-foreground/80 font-medium mb-3 tracking-wide">
          기도로 하나되는 커뮤니티
        </p>
        <h1 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
          기도가 필요한 순간,<br className="hidden md:block" /> 함께 기도합니다
        </h1>
        <p className="text-base md:text-lg text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
          나의 기도 제목을 나누고, 서로를 위해 기도하며, 함께 응답을 경험하세요
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <a
            href="/prayer/new"
            className="inline-flex items-center px-6 py-3 bg-white text-primary font-semibold rounded-xl hover:bg-white/90 transition-colors"
          >
            기도 요청하기
          </a>
          <a
            href="/prayer"
            className="inline-flex items-center px-6 py-3 bg-primary-foreground/10 text-primary-foreground font-semibold rounded-xl hover:bg-primary-foreground/20 border border-primary-foreground/20 transition-colors"
          >
            함께 기도하기
          </a>
        </div>
      </div>
    </div>
  );
}
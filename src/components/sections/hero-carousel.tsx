"use client";

import React from 'react';

/**
 * HeroCarousel Component
 */
export default function HeroCarousel() {
  return (
    <div
      className="relative overflow-hidden bg-[#F7FAFC] w-full max-w-[752px] h-[300px] md:rounded-[10px] mb-6 border border-[#E2E8F0]"
    >
      <div className="w-full h-full flex items-center justify-center">
        <span className="text-[#A0AEC0] text-[14px]">이미지를 추가하세요</span>
      </div>
    </div>
  );
}
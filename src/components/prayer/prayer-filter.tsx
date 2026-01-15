"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Filter } from "lucide-react";

const categories = [
  { value: "", label: "전체" },
  { value: "health", label: "건강", emoji: "🏥" },
  { value: "family", label: "가정", emoji: "👨‍👩‍👧‍👦" },
  { value: "work", label: "직장", emoji: "💼" },
  { value: "study", label: "학업", emoji: "📚" },
  { value: "general", label: "일반", emoji: "🙏" },
  { value: "etc", label: "기타", emoji: "✨" },
];

export default function PrayerFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCategory = searchParams.get("category") || "";

  const handleCategoryChange = (category: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (category) {
      params.set("category", category);
    } else {
      params.delete("category");
    }
    params.delete("page"); // Reset page when changing category
    router.push(`/prayer?${params.toString()}`);
  };

  return (
    <div className="sticky top-[65px] z-40 bg-card border-b border-border">
      <div className="max-w-3xl mx-auto px-4 py-3">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <Filter className="w-4 h-4 text-muted-foreground shrink-0" />
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => handleCategoryChange(cat.value)}
              className={`px-3 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                currentCategory === cat.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary hover:bg-secondary/80 text-foreground"
              }`}
            >
              {cat.emoji && <span className="mr-1">{cat.emoji}</span>}
              {cat.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

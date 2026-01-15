"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Send, Eye, EyeOff, Loader2 } from "lucide-react";

const categories = [
  { value: "health", label: "건강", emoji: "🏥" },
  { value: "family", label: "가정", emoji: "👨‍👩‍👧‍👦" },
  { value: "work", label: "직장", emoji: "💼" },
  { value: "study", label: "학업", emoji: "📚" },
  { value: "general", label: "일반", emoji: "🙏" },
  { value: "etc", label: "기타", emoji: "✨" },
];

export default function NewPrayerPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    type: "request" as "request" | "testimony",
    title: "",
    content: "",
    category: "",
    visibility: "public" as "public" | "pastor_only",
    isAnonymous: false,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!form.category) {
      setError("카테고리를 선택해주세요");
      return;
    }

    if (form.title.length < 2) {
      setError("제목은 2자 이상 입력해주세요");
      return;
    }

    if (form.content.length < 10) {
      setError("내용은 10자 이상 입력해주세요");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/prayer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "기도 요청 등록에 실패했습니다");
      }

      router.push("/");
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-card border-b border-border">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => router.back()}
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-lg font-semibold">기도 요청하기</h1>
        </div>
      </header>

      {/* Form */}
      <main className="max-w-2xl mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Type Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              유형
            </label>
            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "request" })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  form.type === "request"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                🙏 기도 요청
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, type: "testimony" })}
                className={`flex-1 py-3 px-4 rounded-xl border-2 transition-all ${
                  form.type === "testimony"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50"
                }`}
              >
                ✨ 응답 간증
              </button>
            </div>
          </div>

          {/* Category Selection */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-3">
              카테고리
            </label>
            <div className="grid grid-cols-3 gap-2">
              {categories.map((cat) => (
                <button
                  key={cat.value}
                  type="button"
                  onClick={() => setForm({ ...form, category: cat.value })}
                  className={`py-3 px-4 rounded-xl border-2 transition-all text-sm ${
                    form.category === cat.value
                      ? "border-primary bg-primary/5 text-primary"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  {cat.emoji} {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              제목
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              placeholder="기도 제목을 입력해주세요"
              maxLength={100}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {form.title.length}/100
            </p>
          </div>

          {/* Content */}
          <div>
            <label className="block text-sm font-medium text-foreground mb-2">
              내용
            </label>
            <textarea
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              placeholder="기도 내용을 자세히 적어주세요. 함께 기도해 드리겠습니다."
              maxLength={5000}
              rows={8}
              className="w-full px-4 py-3 rounded-xl border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all resize-none"
            />
            <p className="text-xs text-muted-foreground mt-1 text-right">
              {form.content.length}/5000
            </p>
          </div>

          {/* Options */}
          <div className="space-y-4">
            {/* Visibility */}
            <div className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl">
              <div className="flex items-center gap-3">
                {form.visibility === "public" ? (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                )}
                <div>
                  <p className="text-sm font-medium">공개 범위</p>
                  <p className="text-xs text-muted-foreground">
                    {form.visibility === "public"
                      ? "모든 사용자에게 공개됩니다"
                      : "목사님만 볼 수 있습니다"}
                  </p>
                </div>
              </div>
              <select
                value={form.visibility}
                onChange={(e) =>
                  setForm({
                    ...form,
                    visibility: e.target.value as "public" | "pastor_only",
                  })
                }
                className="px-3 py-2 rounded-lg border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                <option value="public">전체 공개</option>
                <option value="pastor_only">목사님만</option>
              </select>
            </div>

            {/* Anonymous */}
            <label className="flex items-center justify-between p-4 bg-secondary/30 rounded-xl cursor-pointer">
              <div>
                <p className="text-sm font-medium">익명으로 작성</p>
                <p className="text-xs text-muted-foreground">
                  이름이 표시되지 않습니다
                </p>
              </div>
              <input
                type="checkbox"
                checked={form.isAnonymous}
                onChange={(e) =>
                  setForm({ ...form, isAnonymous: e.target.checked })
                }
                className="w-5 h-5 rounded border-border text-primary focus:ring-primary/50"
              />
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 text-destructive rounded-xl text-sm">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground font-semibold rounded-xl hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                등록 중...
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                기도 요청 등록
              </>
            )}
          </button>
        </form>
      </main>
    </div>
  );
}

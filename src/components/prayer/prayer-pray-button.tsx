"use client";

import { useState } from "react";
import { HandHeart, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

interface PrayerPrayButtonProps {
  prayerId: string;
  initialCount: number;
  initialPrayed: boolean;
}

export default function PrayerPrayButton({
  prayerId,
  initialCount,
  initialPrayed,
}: PrayerPrayButtonProps) {
  const [count, setCount] = useState(initialCount);
  const [prayed, setPrayed] = useState(initialPrayed);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const togglePrayer = async () => {
    if (loading) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/prayer/${prayerId}/pray`, {
        method: prayed ? "DELETE" : "POST",
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "처리에 실패했습니다");
      }

      setPrayed(Boolean(data.prayed));
      if (typeof data.prayerCount === "number") {
        setCount(data.prayerCount);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "오류가 발생했습니다");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={togglePrayer}
        disabled={loading}
        className={cn(
          "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50",
          prayed
            ? "bg-primary text-primary-foreground hover:bg-primary/90"
            : "bg-primary/10 text-primary hover:bg-primary/20"
        )}
      >
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <HandHeart className="h-4 w-4" />}
        {prayed ? "기도 중" : "저도 기도할게요"}
        <span>{count}</span>
      </button>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}


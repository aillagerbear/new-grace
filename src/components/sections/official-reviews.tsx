import React from 'react';
import { Quote, Heart, ArrowRight, CheckCircle } from 'lucide-react';

const OfficialReviews = () => {
  // TODO: API에서 실제 데이터 가져오기
  const testimonials: {
    content: string;
    author: string;
    role: string;
    answered: boolean;
  }[] = [];

  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-pink-500/10 text-pink-500">
            <Heart className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">응답 후기</h3>
        </div>
        <a
          href="/testimonies"
          className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-primary transition-colors"
        >
          더보기
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Testimonials */}
      <div className="p-5 grid grid-cols-1 md:grid-cols-2 gap-4">
        {testimonials.map((item, idx) => (
          <div
            key={idx}
            className="relative p-4 bg-secondary/30 rounded-xl border border-border/50"
          >
            {item.answered && (
              <span className="absolute top-3 right-3 flex items-center gap-1 text-[11px] text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                <CheckCircle className="w-3 h-3" />
                응답됨
              </span>
            )}
            <Quote className="w-5 h-5 text-primary/30 mb-2" />
            <p className="text-[13px] text-muted-foreground leading-relaxed mb-4 pr-12">
              {item.content}
            </p>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <span className="text-primary-foreground text-[11px] font-medium">
                  {item.author[0]}
                </span>
              </div>
              <div>
                <p className="text-[13px] font-medium text-foreground">{item.author}</p>
                <p className="text-[11px] text-muted-foreground">{item.role}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default OfficialReviews;
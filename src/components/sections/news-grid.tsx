import React from 'react';
import { HandHeart, TrendingUp, Sparkles } from 'lucide-react';

const NewsGrid = () => {
  // TODO: API에서 실제 데이터 가져오기
  const sections: {
    title: string;
    icon: typeof HandHeart;
    items: { title: string; author: string; prayers?: number; badge?: string; time: string }[];
  }[] = [
    {
      title: "최신 기도 요청",
      icon: HandHeart,
      items: []
    },
    {
      title: "많은 분이 기도 중",
      icon: TrendingUp,
      items: []
    },
    {
      title: "최근 응답받은 기도",
      icon: Sparkles,
      items: []
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {sections.map((section) => {
        const Icon = section.icon;
        return (
          <section
            key={section.title}
            className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm hover:shadow-lg hover:shadow-black/5 transition-all duration-300 group"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-[15px] font-semibold text-foreground">
                {section.title}
              </h3>
              <a
                href="#"
                className="ml-auto text-[13px] text-muted-foreground hover:text-primary transition-colors"
              >
                더보기
              </a>
            </div>

            {/* Content */}
            <div className="divide-y divide-border">
              {section.items.map((item, idx) => (
                <a
                  key={idx}
                  href="#"
                  className="flex items-center justify-between px-5 py-3.5 hover:bg-secondary/30 transition-colors"
                >
                  <div className="flex-1 min-w-0 pr-3">
                    <span className="text-[14px] text-foreground line-clamp-1">
                      {item.title}
                    </span>
                    <span className="text-[12px] text-muted-foreground">{item.author}</span>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    {"badge" in item && item.badge ? (
                      <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600">
                        {item.badge}
                      </span>
                    ) : "prayers" in item && item.prayers ? (
                      <span className="text-[11px] text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        🙏 {item.prayers}
                      </span>
                    ) : null}
                    <span className="text-[12px] text-muted-foreground">
                      {item.time}
                    </span>
                  </div>
                </a>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
};

export default NewsGrid;

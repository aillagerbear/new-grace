import React from 'react';
import { BookOpen, Users, Heart, MessageCircle } from 'lucide-react';

const DealsSection = () => {
  const features = [
    {
      icon: Heart,
      title: "기도 요청하기",
      description: "나의 기도 제목을 익명으로 나눌 수 있어요",
      color: "bg-pink-500/10 text-pink-500",
      href: "/prayer/new",
    },
    {
      icon: Users,
      title: "함께 기도하기",
      description: "다른 분들의 기도에 함께 동참해요",
      color: "bg-primary/10 text-primary",
      href: "/pray-together",
    },
    {
      icon: BookOpen,
      title: "응답 이야기",
      description: "기도 응답 후기를 나누고 격려해요",
      color: "bg-emerald-500/10 text-emerald-500",
      href: "/testimonies",
    },
    {
      icon: MessageCircle,
      title: "커뮤니티",
      description: "서로의 이야기를 나누며 교제해요",
      color: "bg-amber-500/10 text-amber-500",
      href: "/community",
    },
  ];

  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-border bg-secondary/30">
        <h3 className="text-[15px] font-semibold text-foreground">🙏 기도하는 손 이용 방법</h3>
      </div>

      {/* Features */}
      <div className="p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        {features.map((feature, idx) => {
          const Icon = feature.icon;
          return (
            <a
              key={idx}
              href={feature.href}
              className="group p-4 bg-secondary/30 rounded-xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 text-center"
            >
              <div className={`inline-flex p-3 rounded-xl ${feature.color} mb-3`}>
                <Icon className="w-6 h-6" />
              </div>
              <h4 className="text-[14px] font-semibold text-foreground group-hover:text-primary transition-colors mb-1">
                {feature.title}
              </h4>
              <p className="text-[12px] text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </a>
          );
        })}
      </div>
    </section>
  );
};

export default DealsSection;

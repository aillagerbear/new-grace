import React from 'react';
import { MessageCircle, Users, ArrowRight, Clock } from 'lucide-react';

const CommunityPreview = () => {
  // TODO: API에서 실제 데이터 가져오기
  const posts: {
    title: string;
    author: string;
    replies: number;
    time: string;
    category: string;
  }[] = [];

  return (
    <section className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border bg-secondary/30">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-emerald-500/10 text-emerald-500">
            <Users className="w-5 h-5" />
          </div>
          <h3 className="text-[15px] font-semibold text-foreground">자유 게시판</h3>
        </div>
        <a
          href="/community"
          className="flex items-center gap-1 text-[13px] text-muted-foreground hover:text-primary transition-colors"
        >
          더보기
          <ArrowRight className="w-4 h-4" />
        </a>
      </div>

      {/* Posts */}
      <div className="divide-y divide-border">
        {posts.map((post, idx) => (
          <a
            key={idx}
            href="#"
            className="flex items-center gap-4 px-5 py-4 hover:bg-secondary/30 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[11px] px-2 py-0.5 rounded-full ${post.category === "질문"
                    ? "bg-blue-500/10 text-blue-600"
                    : post.category === "후기"
                      ? "bg-emerald-500/10 text-emerald-600"
                      : "bg-purple-500/10 text-purple-600"
                  }`}>
                  {post.category}
                </span>
              </div>
              <p className="text-[14px] font-medium text-foreground truncate">
                {post.title}
              </p>
              <div className="flex items-center gap-2 mt-1 text-[12px] text-muted-foreground">
                <span>{post.author}</span>
                <span>·</span>
                <Clock className="w-3 h-3" />
                <span>{post.time}</span>
              </div>
            </div>
            <div className="flex items-center gap-1 shrink-0 text-[12px] text-muted-foreground">
              <MessageCircle className="w-4 h-4" />
              <span>{post.replies}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  );
};

export default CommunityPreview;
import Link from "next/link";
import { ArrowLeft, Sparkles, Heart, MessageCircle, Calendar } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

// 응답 이야기 데이터 (추후 DB 연동)
const testimonies = [
  {
    id: 1,
    title: "암 완치 판정을 받았습니다",
    content: "3년 전 위암 3기 판정을 받고 너무나 힘들었습니다. 하지만 교회 성도님들의 뜨거운 기도와 함께 치료를 받으면서 기적적으로 완치 판정을 받았습니다. 하나님께 감사드립니다.",
    author: "김은혜",
    category: "건강",
    likes: 128,
    comments: 24,
    createdAt: "2024-01-10",
  },
  {
    id: 2,
    title: "취업 응답을 받았어요!",
    content: "2년 동안 취업 준비를 하면서 많이 지치고 힘들었습니다. 포기하고 싶을 때마다 기도로 붙들어주신 성도님들 덕분에 원하는 회사에 합격했습니다!",
    author: "이믿음",
    category: "직장",
    likes: 89,
    comments: 15,
    createdAt: "2024-01-08",
  },
  {
    id: 3,
    title: "가정이 회복되었습니다",
    content: "남편과의 관계가 너무 힘들어서 이혼을 생각했던 적도 있었습니다. 하지만 기도하며 인내하니 하나님께서 남편의 마음을 바꿔주셨고, 지금은 감사함으로 함께 예배드리고 있습니다.",
    author: "박소망",
    category: "가정",
    likes: 156,
    comments: 32,
    createdAt: "2024-01-05",
  },
  {
    id: 4,
    title: "사업이 살아났습니다",
    content: "코로나로 인해 사업이 거의 망할 위기에 처했었습니다. 하지만 포기하지 않고 기도하며 버텼더니 오히려 새로운 기회가 열렸습니다. 하나님의 때가 있음을 믿습니다.",
    author: "최감사",
    category: "직장",
    likes: 67,
    comments: 11,
    createdAt: "2024-01-02",
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function TestimoniesPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 hover:bg-secondary rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-amber-500" />
              응답 이야기
            </h1>
            <p className="text-muted-foreground text-sm">
              기도 응답을 나누고 함께 감사드려요
            </p>
          </div>
        </div>

        {/* Write Testimony Button */}
        <div className="mb-8">
          <Link
            href="/prayer/new?type=testimony"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <Sparkles className="w-5 h-5" />
            응답 이야기 나누기
          </Link>
        </div>

        {/* Testimonies List */}
        <div className="space-y-4">
          {testimonies.map((testimony) => (
            <article
              key={testimony.id}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="px-3 py-1 text-xs bg-amber-500/10 text-amber-600 rounded-full">
                  {testimony.category}
                </span>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  {formatDate(testimony.createdAt)}
                </div>
              </div>

              {/* Content */}
              <h2 className="text-lg font-semibold mb-2">{testimony.title}</h2>
              <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
                {testimony.content}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {testimony.author}
                </span>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <button className="flex items-center gap-1 hover:text-red-500 transition-colors">
                    <Heart className="w-4 h-4" />
                    {testimony.likes}
                  </button>
                  <span className="flex items-center gap-1">
                    <MessageCircle className="w-4 h-4" />
                    {testimony.comments}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-8 text-center">
          <button className="px-6 py-3 border border-border rounded-xl hover:bg-secondary transition-colors">
            더 보기
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

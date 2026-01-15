import Link from "next/link";
import { ArrowLeft, MessageSquare, Eye, Clock, PenLine, ThumbsUp } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

// 자유 게시판 데이터 (추후 DB 연동)
const posts = [
  {
    id: 1,
    title: "새가족 환영합니다!",
    content: "이번 주 새로 등록하신 분들 환영합니다. 함께 신앙생활 잘 해나가요!",
    author: "관리자",
    views: 234,
    likes: 45,
    comments: 12,
    createdAt: "2024-01-15",
    isPinned: true,
  },
  {
    id: 2,
    title: "다음 주 수요예배 장소 변경 안내",
    content: "다음 주 수요예배는 본당 리모델링으로 인해 교육관에서 진행됩니다.",
    author: "사무실",
    views: 189,
    likes: 23,
    comments: 5,
    createdAt: "2024-01-14",
    isPinned: true,
  },
  {
    id: 3,
    title: "찬양팀 모집합니다",
    content: "악기 연주 가능하신 분, 보컬로 함께 하실 분들 찾습니다. 연습은 매주 토요일 오후 2시입니다.",
    author: "찬양팀",
    views: 156,
    likes: 34,
    comments: 18,
    createdAt: "2024-01-13",
    isPinned: false,
  },
  {
    id: 4,
    title: "좋은 책 추천드립니다",
    content: "최근에 읽은 '기도하는 사람'이라는 책이 정말 좋았습니다. 기도 생활에 도움이 많이 됩니다.",
    author: "독서모임",
    views: 98,
    likes: 28,
    comments: 7,
    createdAt: "2024-01-12",
    isPinned: false,
  },
  {
    id: 5,
    title: "주일 점심 식사 봉사자 모집",
    content: "매주 주일 점심 준비를 도와주실 봉사자를 모집합니다. 관심 있으신 분은 댓글 남겨주세요.",
    author: "봉사팀",
    views: 87,
    likes: 19,
    comments: 9,
    createdAt: "2024-01-11",
    isPinned: false,
  },
  {
    id: 6,
    title: "감사 나눔",
    content: "요즘 하나님께서 주신 작은 감사들을 나누고 싶어요. 매일 아침 건강하게 눈뜨는 것도 감사합니다.",
    author: "이감사",
    views: 76,
    likes: 41,
    comments: 14,
    createdAt: "2024-01-10",
    isPinned: false,
  },
];

function formatDate(dateString: string) {
  const date = new Date(dateString);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return "오늘";
  if (diffDays === 1) return "어제";
  if (diffDays < 7) return `${diffDays}일 전`;
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

export default function CommunityPage() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 hover:bg-secondary rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold flex items-center gap-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                자유 게시판
              </h1>
              <p className="text-muted-foreground text-sm">
                성도님들과 자유롭게 소통해요
              </p>
            </div>
          </div>
          <Link
            href="/community/new"
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            <PenLine className="w-4 h-4" />
            글쓰기
          </Link>
        </div>

        {/* Posts List */}
        <div className="bg-card rounded-2xl border border-border overflow-hidden">
          {/* Table Header */}
          <div className="hidden sm:grid grid-cols-[1fr,80px,80px,100px] gap-4 px-5 py-3 bg-secondary/50 text-sm font-medium text-muted-foreground border-b border-border">
            <span>제목</span>
            <span className="text-center">조회</span>
            <span className="text-center">추천</span>
            <span className="text-center">날짜</span>
          </div>

          {/* Posts */}
          <div className="divide-y divide-border">
            {posts.map((post) => (
              <article
                key={post.id}
                className="px-5 py-4 hover:bg-secondary/30 transition-colors cursor-pointer"
              >
                <div className="sm:grid sm:grid-cols-[1fr,80px,80px,100px] sm:gap-4 sm:items-center">
                  {/* Title & Author */}
                  <div className="mb-2 sm:mb-0">
                    <div className="flex items-center gap-2">
                      {post.isPinned && (
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                          공지
                        </span>
                      )}
                      <h3 className="font-medium hover:text-primary transition-colors line-clamp-1">
                        {post.title}
                      </h3>
                      {post.comments > 0 && (
                        <span className="text-xs text-primary">[{post.comments}]</span>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">{post.author}</span>
                  </div>

                  {/* Views */}
                  <div className="hidden sm:flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Eye className="w-3.5 h-3.5" />
                    {post.views}
                  </div>

                  {/* Likes */}
                  <div className="hidden sm:flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    {post.likes}
                  </div>

                  {/* Date */}
                  <div className="hidden sm:flex items-center justify-center gap-1 text-sm text-muted-foreground">
                    <Clock className="w-3.5 h-3.5" />
                    {formatDate(post.createdAt)}
                  </div>

                  {/* Mobile Stats */}
                  <div className="flex sm:hidden items-center gap-4 text-xs text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      {post.views}
                    </span>
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3 h-3" />
                      {post.likes}
                    </span>
                    <span>{formatDate(post.createdAt)}</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        {/* Pagination */}
        <div className="mt-6 flex items-center justify-center gap-2">
          <button className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
            이전
          </button>
          <div className="flex items-center gap-1">
            <button className="w-8 h-8 rounded-lg bg-primary text-primary-foreground text-sm">
              1
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm">
              2
            </button>
            <button className="w-8 h-8 rounded-lg hover:bg-secondary transition-colors text-sm">
              3
            </button>
          </div>
          <button className="px-3 py-2 rounded-lg hover:bg-secondary transition-colors text-sm">
            다음
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}

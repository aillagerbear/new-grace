import Link from "next/link";
import { ArrowLeft, Bell, Calendar, ChevronRight, Pin } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

// 공지사항 데이터 (추후 DB 연동)
const notices = [
  {
    id: 1,
    title: "2024년 신년 특별새벽기도회 안내",
    content: "새해를 맞이하여 신년 특별새벽기도회를 진행합니다. 1월 1일부터 7일까지 매일 새벽 5시에 진행됩니다.",
    author: "관리자",
    createdAt: "2024-01-01",
    isPinned: true,
    isImportant: true,
  },
  {
    id: 2,
    title: "주차장 이용 안내",
    content: "주일 예배 시 주차 공간이 부족하오니 가급적 대중교통을 이용해 주시기 바랍니다. 주차가 필요하신 분은 사전에 신청해 주세요.",
    author: "관리자",
    createdAt: "2024-01-10",
    isPinned: true,
    isImportant: false,
  },
  {
    id: 3,
    title: "성경 통독 프로그램 시작",
    content: "올해 성경 통독을 함께 하실 분들을 모집합니다. 매일 정해진 분량을 함께 읽고 나눔을 나눕니다.",
    author: "교육부",
    createdAt: "2024-01-08",
    isPinned: false,
    isImportant: false,
  },
  {
    id: 4,
    title: "교회 홈페이지 리뉴얼 안내",
    content: "더 나은 서비스를 위해 교회 홈페이지가 새롭게 개편되었습니다. 불편하신 점이 있으시면 말씀해 주세요.",
    author: "관리자",
    createdAt: "2024-01-05",
    isPinned: false,
    isImportant: false,
  },
  {
    id: 5,
    title: "겨울 수련회 일정 공지",
    content: "청년부 겨울 수련회가 2월 첫째 주에 진행됩니다. 참가 신청은 1월 20일까지 해주세요.",
    author: "청년부",
    createdAt: "2024-01-03",
    isPinned: false,
    isImportant: false,
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

export default function NoticePage() {
  const pinnedNotices = notices.filter((n) => n.isPinned);
  const regularNotices = notices.filter((n) => !n.isPinned);

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
              <Bell className="w-6 h-6 text-primary" />
              공지사항
            </h1>
            <p className="text-muted-foreground text-sm">
              교회 소식과 안내사항을 확인하세요
            </p>
          </div>
        </div>

        {/* Pinned Notices */}
        {pinnedNotices.length > 0 && (
          <div className="mb-8">
            <h2 className="text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
              <Pin className="w-4 h-4" />
              고정 공지
            </h2>
            <div className="space-y-3">
              {pinnedNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="bg-card rounded-2xl border border-primary/20 p-5 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        {notice.isImportant && (
                          <span className="px-2 py-0.5 text-xs bg-red-500/10 text-red-500 rounded">
                            중요
                          </span>
                        )}
                        <span className="px-2 py-0.5 text-xs bg-primary/10 text-primary rounded">
                          공지
                        </span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-1">{notice.title}</h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notice.content}
                      </p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                  <div className="mt-3 flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar className="w-3 h-3" />
                    {formatDate(notice.createdAt)}
                  </div>
                </article>
              ))}
            </div>
          </div>
        )}

        {/* Regular Notices */}
        <div>
          <h2 className="text-sm font-medium text-muted-foreground mb-3">
            전체 공지
          </h2>
          <div className="bg-card rounded-2xl border border-border overflow-hidden">
            <div className="divide-y divide-border">
              {regularNotices.map((notice) => (
                <article
                  key={notice.id}
                  className="p-5 hover:bg-secondary/30 transition-colors cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium mb-1 line-clamp-1 hover:text-primary transition-colors">
                        {notice.title}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {notice.content}
                      </p>
                      <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                        <Calendar className="w-3 h-3" />
                        {formatDate(notice.createdAt)}
                        <span className="mx-1">·</span>
                        {notice.author}
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </article>
              ))}
            </div>
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

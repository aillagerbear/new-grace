import Link from "next/link";
import { ArrowLeft, Users, HandHeart, Clock, Heart } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

// 함께 기도 데이터 (추후 DB 연동)
const prayerSessions = [
  {
    id: 1,
    title: "가정을 위한 중보기도",
    description: "가정의 평화와 화목을 위해 함께 기도합니다",
    participants: 24,
    scheduledTime: "매주 수요일 오후 8시",
    isLive: true,
  },
  {
    id: 2,
    title: "청년 사역을 위한 기도",
    description: "다음 세대를 위한 기도 모임입니다",
    participants: 18,
    scheduledTime: "매주 금요일 오후 9시",
    isLive: false,
  },
  {
    id: 3,
    title: "선교사님들을 위한 기도",
    description: "해외에서 수고하시는 선교사님들을 위해 기도합니다",
    participants: 32,
    scheduledTime: "매월 첫째 주 토요일 오전 6시",
    isLive: false,
  },
  {
    id: 4,
    title: "치유와 회복을 위한 기도",
    description: "아픈 성도들의 치유와 회복을 위해 함께 기도합니다",
    participants: 45,
    scheduledTime: "매주 화요일 오전 10시",
    isLive: false,
  },
];

export default function PrayTogetherPage() {
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
            <h1 className="text-2xl font-bold">함께 기도</h1>
            <p className="text-muted-foreground text-sm">
              성도들과 함께하는 중보기도 모임
            </p>
          </div>
        </div>

        {/* Live Banner */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 mb-8 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <span className="relative flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
            <span className="text-sm font-medium text-red-500">LIVE</span>
          </div>
          <h2 className="text-xl font-semibold mb-2">가정을 위한 중보기도</h2>
          <p className="text-muted-foreground mb-4">
            지금 24명의 성도들이 함께 기도하고 있습니다
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors">
            <HandHeart className="w-5 h-5" />
            함께 기도하기
          </button>
        </div>

        {/* Prayer Sessions Grid */}
        <div className="space-y-6">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Users className="w-5 h-5 text-primary" />
            기도 모임 일정
          </h2>

          <div className="grid gap-4 sm:grid-cols-2">
            {prayerSessions.map((session) => (
              <div
                key={session.id}
                className="bg-card rounded-2xl border border-border p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold">{session.title}</h3>
                  {session.isLive && (
                    <span className="px-2 py-1 text-xs bg-red-500/10 text-red-500 rounded-full">
                      LIVE
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  {session.description}
                </p>
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    {session.scheduledTime}
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <Heart className="w-4 h-4" />
                    {session.participants}명
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* How to Join */}
        <div className="mt-12 bg-secondary/30 rounded-2xl p-6">
          <h2 className="text-lg font-semibold mb-4">참여 방법</h2>
          <ol className="space-y-3 text-sm text-muted-foreground">
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                1
              </span>
              <span>참여하고 싶은 기도 모임을 선택하세요</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                2
              </span>
              <span>정해진 시간에 &quot;함께 기도하기&quot; 버튼을 눌러주세요</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">
                3
              </span>
              <span>다른 성도들과 함께 마음을 모아 기도해주세요</span>
            </li>
          </ol>
        </div>
      </main>

      <Footer />
    </div>
  );
}

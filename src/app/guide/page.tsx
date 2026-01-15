import Link from "next/link";
import { ArrowLeft, BookOpen, HelpCircle, ChevronDown, HandHeart, Users, MessageSquare, Sparkles } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

const guideItems = [
  {
    icon: HandHeart,
    title: "기도 요청하기",
    description: "나의 기도 제목을 올리고 성도들에게 중보기도를 요청할 수 있습니다.",
    steps: [
      "상단 메뉴에서 '기도 요청' 버튼을 클릭하세요",
      "기도 제목과 내용을 작성하세요",
      "공개 범위와 카테고리를 선택하세요",
      "'기도 요청하기' 버튼을 눌러 제출하세요",
    ],
  },
  {
    icon: Users,
    title: "함께 기도하기",
    description: "다른 성도들의 기도 요청에 함께 기도할 수 있습니다.",
    steps: [
      "기도 요청 목록에서 기도하고 싶은 제목을 선택하세요",
      "'함께 기도하기' 버튼을 눌러 기도에 참여하세요",
      "기도한 횟수가 기록되어 요청자에게 격려가 됩니다",
    ],
  },
  {
    icon: Sparkles,
    title: "응답 이야기 나누기",
    description: "기도 응답을 받으셨다면 간증을 나눠주세요.",
    steps: [
      "'응답 이야기' 메뉴로 이동하세요",
      "'응답 이야기 나누기' 버튼을 클릭하세요",
      "하나님께서 응답해주신 내용을 작성하세요",
      "다른 성도들에게 믿음의 격려가 됩니다",
    ],
  },
  {
    icon: MessageSquare,
    title: "자유 게시판 이용하기",
    description: "성도들과 자유롭게 소통하고 나눔을 할 수 있습니다.",
    steps: [
      "'자유 게시판' 메뉴로 이동하세요",
      "'글쓰기' 버튼을 눌러 게시글을 작성하세요",
      "다른 성도들의 글에 댓글을 달아 소통하세요",
    ],
  },
];

const faqs = [
  {
    question: "익명으로 기도 요청할 수 있나요?",
    answer: "네, 기도 요청 시 '익명으로 요청하기' 옵션을 선택하시면 이름이 '익명'으로 표시됩니다. 민감한 기도 제목도 안심하고 나눠주세요.",
  },
  {
    question: "기도 요청 수정이나 삭제는 어떻게 하나요?",
    answer: "로그인 후 내가 작성한 기도 요청에서 수정 또는 삭제 버튼을 클릭하시면 됩니다. 응답 완료된 기도는 '응답됨' 표시로 변경할 수도 있습니다.",
  },
  {
    question: "비공개 기도 요청은 누가 볼 수 있나요?",
    answer: "비공개로 설정한 기도 요청은 담임목사님과 기도 사역팀만 볼 수 있습니다. 더욱 깊은 중보기도가 필요할 때 이용해주세요.",
  },
  {
    question: "앱이나 모바일에서도 이용 가능한가요?",
    answer: "네, 모바일 웹브라우저에서도 동일하게 이용 가능합니다. 홈 화면에 추가하시면 앱처럼 편리하게 사용할 수 있습니다.",
  },
];

export default function GuidePage() {
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
              <BookOpen className="w-6 h-6 text-primary" />
              이용 안내
            </h1>
            <p className="text-muted-foreground text-sm">
              서비스 이용 방법을 알려드립니다
            </p>
          </div>
        </div>

        {/* Guide Cards */}
        <div className="grid gap-6 sm:grid-cols-2 mb-12">
          {guideItems.map((item, index) => (
            <div
              key={index}
              className="bg-card rounded-2xl border border-border p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 rounded-xl bg-primary/10">
                  <item.icon className="w-5 h-5 text-primary" />
                </div>
                <h2 className="font-semibold">{item.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                {item.description}
              </p>
              <ol className="space-y-2">
                {item.steps.map((step, stepIndex) => (
                  <li
                    key={stepIndex}
                    className="flex items-start gap-2 text-sm"
                  >
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      {stepIndex + 1}
                    </span>
                    <span className="text-muted-foreground">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </div>

        {/* FAQ Section */}
        <div>
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-primary" />
            자주 묻는 질문
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <details
                key={index}
                className="group bg-card rounded-2xl border border-border"
              >
                <summary className="flex items-center justify-between p-5 cursor-pointer list-none">
                  <span className="font-medium pr-4">{faq.question}</span>
                  <ChevronDown className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pt-0">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>

        {/* Contact CTA */}
        <div className="mt-12 bg-gradient-to-r from-primary/10 to-primary/5 rounded-2xl p-6 text-center">
          <h3 className="font-semibold mb-2">더 궁금한 점이 있으신가요?</h3>
          <p className="text-sm text-muted-foreground mb-4">
            문의하기를 통해 언제든 질문해주세요
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:bg-primary/90 transition-colors"
          >
            문의하기
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}

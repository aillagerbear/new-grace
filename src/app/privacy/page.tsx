import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function PrivacyPage() {
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
              <Shield className="w-6 h-6 text-primary" />
              개인정보처리방침
            </h1>
            <p className="text-muted-foreground text-sm">
              시행일: 2024년 1월 1일
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <p className="text-muted-foreground mb-6">
              은혜교회 기도 나눔 서비스(이하 &quot;서비스&quot;)는 이용자의 개인정보를 중요시하며,
              개인정보보호법 등 관련 법령을 준수하고 있습니다.
            </p>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">1. 수집하는 개인정보 항목</h2>
              <p className="text-muted-foreground mb-3">
                서비스는 회원가입, 서비스 이용 등을 위해 아래와 같은 개인정보를 수집하고 있습니다.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>필수항목: 이름, 이메일 주소, 비밀번호</li>
                <li>선택항목: 프로필 사진, 소속 부서</li>
                <li>자동수집항목: 접속 IP, 접속 일시, 서비스 이용 기록</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">2. 개인정보의 수집 및 이용 목적</h2>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>회원 식별 및 가입의사 확인</li>
                <li>기도 요청 및 응답 서비스 제공</li>
                <li>공지사항 전달 및 불만 처리</li>
                <li>서비스 개선 및 신규 서비스 개발</li>
                <li>서비스 이용 통계 분석</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">3. 개인정보의 보유 및 이용 기간</h2>
              <p className="text-muted-foreground mb-3">
                회원의 개인정보는 원칙적으로 개인정보의 수집 및 이용 목적이 달성되면 지체 없이 파기합니다.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>회원 탈퇴 시: 즉시 파기</li>
                <li>관련 법령에 따른 보존 필요 시: 해당 법령에서 정한 기간</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">4. 개인정보의 제3자 제공</h2>
              <p className="text-muted-foreground">
                서비스는 원칙적으로 이용자의 개인정보를 제3자에게 제공하지 않습니다.
                다만, 아래의 경우에는 예외로 합니다.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1 mt-3">
                <li>이용자가 사전에 동의한 경우</li>
                <li>법령의 규정에 의하거나, 수사 목적으로 법령에 정해진 절차와 방법에 따라 수사기관의 요구가 있는 경우</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">5. 개인정보의 파기 절차 및 방법</h2>
              <p className="text-muted-foreground mb-3">
                서비스는 원칙적으로 개인정보 수집 및 이용 목적이 달성된 후에는 해당 정보를 지체 없이 파기합니다.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>전자적 파일 형태: 기록을 재생할 수 없는 기술적 방법을 사용하여 삭제</li>
                <li>종이 문서: 분쇄기로 분쇄하거나 소각</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">6. 이용자의 권리와 그 행사 방법</h2>
              <p className="text-muted-foreground mb-3">
                이용자는 언제든지 자신의 개인정보를 조회하거나 수정할 수 있으며,
                회원 탈퇴를 통해 개인정보의 수집 및 이용 동의를 철회할 수 있습니다.
              </p>
              <ul className="list-disc pl-5 text-muted-foreground space-y-1">
                <li>개인정보 조회 및 수정: 마이페이지에서 직접 가능</li>
                <li>회원 탈퇴: 설정 메뉴에서 직접 가능</li>
                <li>문의: contact@church.com</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">7. 개인정보 보호책임자</h2>
              <div className="bg-secondary/30 rounded-xl p-4 text-muted-foreground">
                <p>성명: 홍길동</p>
                <p>직책: 개인정보 보호책임자</p>
                <p>이메일: privacy@church.com</p>
                <p>전화: 02-123-4567</p>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">8. 개인정보처리방침의 변경</h2>
              <p className="text-muted-foreground">
                이 개인정보처리방침은 2024년 1월 1일부터 적용됩니다.
                법령, 정책 또는 보안기술의 변경에 따라 내용의 추가, 삭제 및 수정이 있을 경우
                변경사항의 시행 7일 전부터 공지사항을 통해 고지할 것입니다.
              </p>
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

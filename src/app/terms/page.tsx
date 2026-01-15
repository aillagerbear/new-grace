import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";
import Header from "@/components/sections/header";
import Footer from "@/components/sections/footer";

export default function TermsPage() {
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
              <FileText className="w-6 h-6 text-primary" />
              이용약관
            </h1>
            <p className="text-muted-foreground text-sm">
              시행일: 2024년 1월 1일
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="bg-card rounded-2xl border border-border p-6 sm:p-8">
          <div className="prose prose-sm max-w-none dark:prose-invert">
            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제1조 (목적)</h2>
              <p className="text-muted-foreground">
                이 약관은 은혜교회 기도 나눔 서비스(이하 &quot;서비스&quot;)의 이용조건 및 절차,
                이용자와 서비스 제공자의 권리, 의무, 책임사항과 기타 필요한 사항을 규정함을 목적으로 합니다.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제2조 (정의)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>&quot;서비스&quot;란 은혜교회가 제공하는 기도 나눔 온라인 플랫폼을 말합니다.</li>
                <li>&quot;이용자&quot;란 서비스에 접속하여 이 약관에 따라 서비스를 이용하는 회원 및 비회원을 말합니다.</li>
                <li>&quot;회원&quot;이란 서비스에 회원가입을 한 자로서 계속적으로 서비스를 이용할 수 있는 자를 말합니다.</li>
                <li>&quot;기도 요청&quot;이란 회원이 서비스를 통해 다른 회원들에게 중보기도를 요청하는 글을 말합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제3조 (약관의 효력 및 변경)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>이 약관은 서비스를 이용하고자 하는 모든 이용자에 대하여 그 효력을 발생합니다.</li>
                <li>서비스는 합리적인 사유가 발생할 경우 관련 법령을 위배하지 않는 범위에서 약관을 변경할 수 있습니다.</li>
                <li>변경된 약관은 적용일자 7일 전부터 공지사항을 통해 공지합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제4조 (회원가입)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>이용자는 서비스가 정한 가입 양식에 따라 회원정보를 기입한 후 이 약관에 동의한다는 의사표시를 함으로써 회원가입을 신청합니다.</li>
                <li>서비스는 제1항과 같이 회원으로 가입할 것을 신청한 이용자 중 다음 각 호에 해당하지 않는 한 회원으로 등록합니다.
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>가입신청자가 이 약관에 의하여 이전에 회원자격을 상실한 적이 있는 경우</li>
                    <li>등록 내용에 허위, 기재누락, 오기가 있는 경우</li>
                    <li>기타 회원으로 등록하는 것이 서비스 운영에 현저히 지장이 있다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제5조 (서비스의 제공 및 변경)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>서비스는 다음과 같은 서비스를 제공합니다.
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>기도 요청 등록 및 열람 서비스</li>
                    <li>함께 기도하기 서비스</li>
                    <li>기도 응답 나눔 서비스</li>
                    <li>커뮤니티 게시판 서비스</li>
                    <li>기타 서비스가 정하는 서비스</li>
                  </ul>
                </li>
                <li>서비스는 기술적 사양의 변경 등의 경우에는 장차 체결되는 계약에 의해 제공할 서비스의 내용을 변경할 수 있습니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제6조 (이용자의 의무)</h2>
              <p className="text-muted-foreground mb-3">이용자는 다음 행위를 하여서는 안 됩니다.</p>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>신청 또는 변경 시 허위내용의 등록</li>
                <li>타인의 정보 도용</li>
                <li>서비스에 게시된 정보의 변경</li>
                <li>서비스가 정한 정보 이외의 정보(컴퓨터 프로그램 등)의 송신 또는 게시</li>
                <li>서비스 기타 제3자의 저작권 등 지적재산권에 대한 침해</li>
                <li>서비스 기타 제3자의 명예를 손상시키거나 업무를 방해하는 행위</li>
                <li>외설 또는 폭력적인 메시지, 화상, 음성, 기타 공서양속에 반하는 정보를 서비스에 공개 또는 게시하는 행위</li>
                <li>기도 나눔의 취지에 맞지 않는 광고, 홍보성 게시물 작성</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제7조 (게시물의 관리)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>회원의 게시물이 정보통신망법 및 저작권법 등 관련법에 위반되는 내용을 포함하는 경우, 권리자는 관련법이 정한 절차에 따라 해당 게시물의 게시중단 및 삭제 등을 요청할 수 있습니다.</li>
                <li>서비스는 권리자의 요청이 없는 경우라도 다음 각 호에 해당하는 게시물에 대해서는 사전 통지 없이 삭제하거나 이동 또는 등록 거부를 할 수 있습니다.
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>다른 회원 또는 제3자를 비방하거나 명예를 손상시키는 내용인 경우</li>
                    <li>공공질서 및 미풍양속에 위반되는 내용인 경우</li>
                    <li>범죄적 행위에 결부된다고 인정되는 내용인 경우</li>
                    <li>서비스의 저작권, 제3자의 저작권 등 기타 권리를 침해하는 내용인 경우</li>
                    <li>기타 관계 법령에 위배된다고 판단되는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제8조 (저작권의 귀속)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>서비스가 작성한 저작물에 대한 저작권 기타 지적재산권은 서비스에 귀속합니다.</li>
                <li>회원이 서비스 내에 게시한 게시물의 저작권은 해당 게시물의 저작자에게 귀속됩니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제9조 (서비스의 중단)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>서비스는 컴퓨터 등 정보통신설비의 보수점검, 교체 및 고장, 통신두절 등의 사유가 발생한 경우에는 서비스의 제공을 일시적으로 중단할 수 있습니다.</li>
                <li>제1항에 의한 서비스 중단의 경우에는 서비스는 제8조에 정한 방법으로 이용자에게 통지합니다.</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-lg font-semibold mb-4">제10조 (회원 탈퇴 및 자격 상실)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>회원은 서비스에 언제든지 탈퇴를 요청할 수 있으며, 서비스는 즉시 회원 탈퇴를 처리합니다.</li>
                <li>회원이 다음 각 호의 사유에 해당하는 경우, 서비스는 회원자격을 제한 및 정지시킬 수 있습니다.
                  <ul className="list-disc pl-5 mt-2 space-y-1">
                    <li>가입 신청 시에 허위 내용을 등록한 경우</li>
                    <li>다른 사람의 서비스 이용을 방해하거나 그 정보를 도용하는 등 질서를 위협하는 경우</li>
                    <li>서비스를 이용하여 법령 또는 이 약관이 금지하거나 공서양속에 반하는 행위를 하는 경우</li>
                  </ul>
                </li>
              </ol>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-4">제11조 (분쟁해결)</h2>
              <ol className="list-decimal pl-5 text-muted-foreground space-y-2">
                <li>서비스는 이용자가 제기하는 정당한 의견이나 불만을 반영하고 그 피해를 보상처리하기 위하여 피해보상처리기구를 설치, 운영합니다.</li>
                <li>서비스와 이용자 간에 발생한 분쟁은 서비스의 소재지를 관할하는 법원을 관할법원으로 합니다.</li>
              </ol>
            </section>

            <div className="mt-8 pt-6 border-t border-border">
              <p className="text-muted-foreground text-sm">
                <strong>부칙</strong><br />
                이 약관은 2024년 1월 1일부터 시행됩니다.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

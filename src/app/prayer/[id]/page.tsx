import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, Shield } from "lucide-react";
import pool, { ensurePrayerTable } from "@/lib/db";
import {
  canRespondAsPastor,
  canViewPrayer,
  getSessionWithRole,
  type UserRole,
} from "@/lib/auth-helpers";
import PrayerPrayButton from "@/components/prayer/prayer-pray-button";
import PastorResponseEditor from "@/components/prayer/pastor-response-editor";

interface PrayerDetailRow {
  id: string;
  type: "request" | "testimony";
  title: string;
  content: string;
  category: string;
  visibility: "public" | "pastor_only";
  authorId: string;
  authorName: string | null;
  isAnonymous: boolean;
  prayerCount: number;
  isAnswered: boolean;
  createdAt: string;
}

interface PastorResponseRow {
  id: string;
  pastorId: string;
  pastorName: string | null;
  content: string;
  updatedAt: string;
}

function formatDateTime(dateString: string) {
  return new Date(dateString).toLocaleString("ko-KR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

async function getPrayerDetail(prayerId: string) {
  await ensurePrayerTable();
  const session = await getSessionWithRole();

  const prayerResult = await pool.query(
    `SELECT
       id,
       type,
       title,
       content,
       category,
       visibility,
       "authorId",
       "authorName",
       "isAnonymous",
       "prayerCount",
       "isAnswered",
       "createdAt"
     FROM prayer
     WHERE id = $1`,
    [prayerId]
  );

  const prayer = prayerResult.rows[0] as PrayerDetailRow | undefined;
  if (!prayer) return { prayer: null, response: null, userHasPrayed: false, canRespond: false };

  const userRole: UserRole = session?.user.role ?? "user";
  const isAuthor = Boolean(session?.user?.id && session.user.id === prayer.authorId);
  if (!canViewPrayer(prayer.visibility, userRole, isAuthor)) {
    return { prayer: null, response: null, userHasPrayed: false, canRespond: false };
  }

  const responseResult = await pool.query(
    `SELECT id, "pastorId", "pastorName", content, "updatedAt"
     FROM pastor_response
     WHERE "prayerId" = $1`,
    [prayerId]
  );

  let userHasPrayed = false;
  if (session?.user?.id) {
    const prayedResult = await pool.query(
      `SELECT 1
       FROM prayer_reaction
       WHERE "prayerId" = $1 AND "userId" = $2
       LIMIT 1`,
      [prayerId, session.user.id]
    );
    userHasPrayed = Boolean(prayedResult.rows[0]);
  }

  return {
    prayer,
    response: (responseResult.rows[0] as PastorResponseRow | undefined) ?? null,
    userHasPrayed,
    canRespond: session?.user ? canRespondAsPastor(session.user.role) : false,
  };
}

export default async function PrayerDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { prayer, response, userHasPrayed, canRespond } = await getPrayerDetail(id);

  if (!prayer) {
    notFound();
  }

  const authorDisplayName = prayer.isAnonymous ? "익명" : prayer.authorName || "익명";

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 border-b border-border bg-card">
        <div className="mx-auto flex w-full max-w-3xl items-center gap-4 px-4 py-4">
          <Link href="/prayer" className="rounded-lg p-2 hover:bg-secondary transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-lg font-semibold">기도 상세</h1>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-6">
        <article className="rounded-2xl border border-border bg-card p-6">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-secondary px-2 py-0.5 text-xs">{prayer.category}</span>
            {prayer.visibility === "pastor_only" && (
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-xs text-indigo-600">
                목사님 전용
              </span>
            )}
            {prayer.isAnswered && (
              <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs text-emerald-600">
                응답됨
              </span>
            )}
          </div>

          <h2 className="mb-3 text-xl font-semibold">{prayer.title}</h2>
          <p className="whitespace-pre-wrap text-sm leading-7 text-foreground/90">{prayer.content}</p>

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-border pt-4">
            <div className="text-xs text-muted-foreground">
              작성자: {authorDisplayName}
              <span className="mx-2">•</span>
              <Clock className="mr-1 inline h-3.5 w-3.5" />
              {formatDateTime(prayer.createdAt)}
            </div>
            <PrayerPrayButton
              prayerId={prayer.id}
              initialCount={prayer.prayerCount}
              initialPrayed={userHasPrayed}
            />
          </div>
        </article>

        {response && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <div className="mb-3 flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <h3 className="text-base font-semibold">목사 답변</h3>
            </div>
            <p className="mb-4 whitespace-pre-wrap text-sm leading-7">{response.content}</p>
            <p className="text-xs text-muted-foreground">
              {response.pastorName || "목회자"} • {formatDateTime(response.updatedAt)}
            </p>
          </section>
        )}

        {canRespond && (
          <section className="rounded-2xl border border-border bg-card p-6">
            <h3 className="mb-3 text-base font-semibold">목사 답변 작성</h3>
            <PastorResponseEditor prayerId={prayer.id} initialContent={response?.content || ""} />
          </section>
        )}
      </main>
    </div>
  );
}


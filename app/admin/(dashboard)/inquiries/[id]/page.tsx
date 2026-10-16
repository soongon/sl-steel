import Link from "next/link";
import { notFound } from "next/navigation";
import { getInquiry } from "@/lib/inquiries";
import { formatDate } from "@/lib/types";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";
import InquiryStatusButtons from "@/components/admin/InquiryStatusButtons";
import { describeSource } from "@/lib/inquiry-guard";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function InquiryDetailPage({ params }: Props) {
  const { id } = await params;
  const inquiry = await getInquiry(id);
  if (!inquiry) notFound();

  return (
    <div>
      <div className="mb-6">
        <Link
          href="/admin/inquiries"
          className="mb-3 inline-flex items-center gap-1 text-sm text-muted transition-colors hover:text-accent"
        >
          ← 문의 목록
        </Link>
        <h1 className="text-xl font-bold text-foreground">문의 상세</h1>
      </div>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <span className="text-xs font-medium text-steel">이름</span>
            <p className="mt-1 text-base font-semibold text-foreground">
              {inquiry.name}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">연락처</span>
            <p className="mt-1 text-base font-semibold text-foreground">
              <a
                href={`tel:${inquiry.phone}`}
                className="text-accent hover:text-accent-dark"
              >
                {inquiry.phone}
              </a>
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">문의 유형</span>
            <p className="mt-1 text-base text-foreground">
              {inquiry.inquiry_type}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">현장/지역</span>
            <p className="mt-1 text-base text-foreground">
              {inquiry.location || "—"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">접수일</span>
            <p className="mt-1 text-base text-foreground">
              {formatDate(inquiry.created_at)}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">상태</span>
            <p className="mt-1">
              <InquiryStatusBadge status={inquiry.status} />
            </p>
          </div>
        </div>

        {/* 유입·중복·알림 (007) — 마이그레이션 전 DB 는 비어 있다 */}
        <div className="mt-6 grid gap-4 border-t border-border pt-4 sm:grid-cols-3">
          <div>
            <span className="text-xs font-medium text-steel">유입</span>
            <p className="mt-1 text-sm text-foreground">
              {inquiry.source && Object.keys(inquiry.source).length > 0 ? describeSource(inquiry.source) : "—"}
            </p>
            {inquiry.source?.landing_path && (
              <p className="mt-0.5 break-all text-xs text-muted">{inquiry.source.landing_path}</p>
            )}
          </div>
          <div>
            <span className="text-xs font-medium text-steel">제출 횟수</span>
            <p className="mt-1 text-sm text-foreground">
              {inquiry.submit_count && inquiry.submit_count > 1 ? `${inquiry.submit_count}회 (중복 합침)` : "1회"}
            </p>
          </div>
          <div>
            <span className="text-xs font-medium text-steel">알림</span>
            <p className="mt-1 text-sm text-foreground">
              {inquiry.notified_at ? `발송 ${formatDate(inquiry.notified_at)}` : "미발송"}
            </p>
          </div>
        </div>

        {inquiry.message && (
          <div className="mt-6 border-t border-border pt-4">
            <span className="text-xs font-medium text-steel">문의 내용</span>
            <p className="mt-2 whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {inquiry.message}
            </p>
          </div>
        )}

        <div className="mt-6 border-t border-border pt-4">
          <span className="mb-2 block text-xs font-medium text-steel">
            상태 변경
          </span>
          <InquiryStatusButtons
            id={inquiry.id}
            currentStatus={inquiry.status}
          />
        </div>
      </div>
    </div>
  );
}

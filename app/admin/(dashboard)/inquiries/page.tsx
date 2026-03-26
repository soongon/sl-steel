import Link from "next/link";
import { getInquiries } from "@/lib/inquiries";
import { formatDate } from "@/lib/types";
import InquiryStatusBadge from "@/components/admin/InquiryStatusBadge";

export default async function InquiriesPage() {
  const inquiries = await getInquiries();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-xl font-bold text-foreground">문의 관리</h1>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-medium text-steel">
              <th className="px-4 py-3">이름</th>
              <th className="hidden px-4 py-3 sm:table-cell">문의 유형</th>
              <th className="hidden px-4 py-3 md:table-cell">연락처</th>
              <th className="px-4 py-3">상태</th>
              <th className="hidden px-4 py-3 md:table-cell">접수일</th>
              <th className="px-4 py-3 text-right">보기</th>
            </tr>
          </thead>
          <tbody>
            {inquiries.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-12 text-center text-muted">
                  문의가 없습니다.
                </td>
              </tr>
            ) : (
              inquiries.map((inq) => (
                <tr key={inq.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/admin/inquiries/${inq.id}`} className="hover:text-accent">
                      {inq.name}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 text-steel sm:table-cell">
                    {inq.inquiry_type}
                  </td>
                  <td className="hidden px-4 py-3 text-steel md:table-cell">
                    {inq.phone}
                  </td>
                  <td className="px-4 py-3">
                    <InquiryStatusBadge status={inq.status} />
                  </td>
                  <td className="hidden px-4 py-3 text-steel md:table-cell">
                    {formatDate(inq.created_at)}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/inquiries/${inq.id}`}
                      className="text-accent hover:text-accent-dark"
                    >
                      상세
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

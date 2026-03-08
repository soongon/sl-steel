"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { updateInquiryStatus } from "@/lib/inquiries";

const statuses = [
  { value: "new", label: "새 문의", style: "border-red-300 text-red-700 hover:bg-red-50" },
  { value: "read", label: "확인", style: "border-yellow-300 text-yellow-700 hover:bg-yellow-50" },
  { value: "resolved", label: "완료", style: "border-green-300 text-green-700 hover:bg-green-50" },
];

interface Props {
  id: string;
  currentStatus: string;
}

export default function InquiryStatusButtons({ id, currentStatus }: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleClick(status: string) {
    if (status === currentStatus) return;
    setLoading(true);
    try {
      await updateInquiryStatus(id, status);
      router.refresh();
    } catch {
      alert("상태 변경에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex gap-2">
      {statuses.map((s) => (
        <button
          key={s.value}
          type="button"
          disabled={loading || s.value === currentStatus}
          onClick={() => handleClick(s.value)}
          className={`rounded-lg border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-40 ${s.style}`}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

const styles: Record<string, string> = {
  new: "bg-red-100 text-red-700",
  read: "bg-sky-100 text-sky-700",
  resolved: "bg-green-100 text-green-700",
};

const labels: Record<string, string> = {
  new: "새 문의",
  read: "진행중", // 어드민과 같은 이름(저장값 read 그대로)
  resolved: "완료",
};

export default function InquiryStatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${styles[status] ?? "bg-gray-100 text-gray-600"}`}
    >
      {labels[status] ?? status}
    </span>
  );
}

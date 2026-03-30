interface Props {
  status: string;
  hasShareToken?: boolean;
}

export default function StatusBadge({ status, hasShareToken }: Props) {
  const isPublished = status === "published";

  return (
    <div className="flex flex-wrap items-center gap-1">
      <span
        className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
          isPublished
            ? "bg-green-50 text-green-700"
            : "bg-yellow-50 text-yellow-700"
        }`}
      >
        {isPublished ? "발행" : "초안"}
      </span>
      {hasShareToken && (
        <span className="inline-flex items-center gap-0.5 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-semibold text-blue-700">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="h-3 w-3">
            <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
            <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
          </svg>
          공유
        </span>
      )}
    </div>
  );
}

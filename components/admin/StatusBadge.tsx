interface Props {
  status: string;
}

export default function StatusBadge({ status }: Props) {
  const isPublished = status === "published";

  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold ${
        isPublished
          ? "bg-green-50 text-green-700"
          : "bg-yellow-50 text-yellow-700"
      }`}
    >
      {isPublished ? "발행" : "초안"}
    </span>
  );
}

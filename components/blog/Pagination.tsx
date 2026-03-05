import Link from "next/link";

interface PaginationProps {
  page: number;
  totalPages: number;
  category: string;
}

function pageHref(p: number, category: string) {
  const params = new URLSearchParams();
  if (category && category !== "전체") params.set("category", category);
  if (p > 1) params.set("page", String(p));
  const qs = params.toString();
  return `/blog${qs ? `?${qs}` : ""}`;
}

export default function Pagination({ page, totalPages, category }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-center gap-1 py-4">
      {/* Prev */}
      {page > 1 ? (
        <Link
          href={pageHref(page - 1, category)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border bg-card text-sm text-steel transition-colors hover:border-accent hover:text-accent"
        >
          ‹
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded border border-border/50 bg-surface text-sm text-muted/50">
          ‹
        </span>
      )}

      {/* Page numbers */}
      {pages.map((p) => (
        <Link
          key={p}
          href={pageHref(p, category)}
          className={`flex h-8 w-8 items-center justify-center rounded border text-sm transition-colors ${
            p === page
              ? "border-accent bg-accent font-semibold text-white"
              : "border-border bg-card text-steel hover:border-accent hover:text-accent"
          }`}
        >
          {p}
        </Link>
      ))}

      {/* Next */}
      {page < totalPages ? (
        <Link
          href={pageHref(page + 1, category)}
          className="flex h-8 w-8 items-center justify-center rounded border border-border bg-card text-sm text-steel transition-colors hover:border-accent hover:text-accent"
        >
          ›
        </Link>
      ) : (
        <span className="flex h-8 w-8 items-center justify-center rounded border border-border/50 bg-surface text-sm text-muted/50">
          ›
        </span>
      )}
    </div>
  );
}

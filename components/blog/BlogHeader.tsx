import Link from "next/link";

interface BlogHeaderProps {
  categories: { name: string; count: number }[];
  activeCategory: string;
}

export default function BlogHeader({ categories, activeCategory }: BlogHeaderProps) {
  return (
    <div className="border-b border-border bg-card">
      <div className="mx-auto max-w-6xl px-6">
        {/* Title */}
        <div className="pt-6 pb-4">
          <h1 className="text-xl font-bold text-foreground">SL Steel 블로그</h1>
          <p className="mt-1 text-sm text-muted">철근 매입·납품 현장 실무 정보</p>
        </div>

        {/* Category tabs */}
        <div className="flex overflow-x-auto">
          {categories.map(({ name, count }) => {
            const isActive = activeCategory === name;
            const href =
              name === "전체"
                ? "/blog"
                : `/blog?category=${encodeURIComponent(name)}`;
            return (
              <Link
                key={name}
                href={href}
                className={`whitespace-nowrap border-b-2 px-4 py-3 text-sm transition-colors ${
                  isActive
                    ? "border-accent font-semibold text-accent"
                    : "border-transparent text-steel hover:text-foreground"
                }`}
              >
                {name}
                <span
                  className={`ml-1.5 text-xs ${isActive ? "text-accent/70" : "text-muted"}`}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

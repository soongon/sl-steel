import Link from "next/link";
import type { PostMeta } from "@/lib/blog";
import { SITE } from "@/lib/site";

const KEYWORDS = [
  "#철근매입",
  "#잉여철근",
  "#녹슨철근",
  "#절단철근",
  "#현장수거",
  "#건설현장",
  "#크레인트럭",
  "#철근납품",
  "#H빔",
  "#SL스틸",
];

interface SidebarProps {
  categories: { name: string; count: number }[];
  recentPosts: PostMeta[];
  activeCategory: string;
}

export default function Sidebar({ categories, recentPosts, activeCategory }: SidebarProps) {
  const mainPhone = SITE.footer.regions[0].phone;

  return (
    <aside className="flex flex-col gap-4">
      {/* CTA */}
      <div className="rounded-xl border border-accent/20 bg-accent/5 p-5 text-center">
        <h3 className="text-sm font-bold leading-snug text-foreground">
          현장에 남은 철근,
          <br />
          바로 문의하세요
        </h3>
        <p className="mt-2 text-xs leading-relaxed text-muted">
          전화 한 통이면 됩니다.
          <br />
          현장 직방문 후 즉시 정산합니다.
        </p>
        <a
          href={`tel:${mainPhone.replace(/-/g, "")}`}
          className="mt-3 block text-base font-extrabold tracking-tight text-accent"
        >
          {mainPhone}
        </a>
        <Link
          href="/#contact"
          className="mt-3 block rounded-lg bg-accent py-2.5 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          매입 문의하기
        </Link>
      </div>

      {/* Categories */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="h-3.5 w-0.5 rounded-full bg-accent" />
          <h3 className="text-sm font-bold text-foreground">카테고리</h3>
        </div>
        <ul className="py-1">
          {categories.map(({ name, count }) => {
            const isActive = activeCategory === name;
            const href =
              name === "전체"
                ? "/blog"
                : `/blog?category=${encodeURIComponent(name)}`;
            return (
              <li key={name}>
                <Link
                  href={href}
                  className={`flex items-center justify-between px-4 py-2 text-sm transition-colors hover:bg-surface ${
                    isActive ? "font-semibold text-accent" : "text-steel"
                  }`}
                >
                  {name}
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${
                      isActive
                        ? "bg-accent/10 text-accent"
                        : "bg-surface text-muted"
                    }`}
                  >
                    {count}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Recent posts */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="h-3.5 w-0.5 rounded-full bg-accent" />
          <h3 className="text-sm font-bold text-foreground">최근 포스트</h3>
        </div>
        <ul className="py-1">
          {recentPosts.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}`}
                className="group block px-4 py-2.5 hover:bg-surface"
              >
                <p className="line-clamp-2 text-xs font-medium leading-snug text-foreground transition-colors group-hover:text-accent">
                  {post.title}
                </p>
                <p className="mt-0.5 text-xs text-muted">{post.date}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Keywords */}
      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <div className="flex items-center gap-2 border-b border-border/70 px-4 py-3">
          <span className="h-3.5 w-0.5 rounded-full bg-accent" />
          <h3 className="text-sm font-bold text-foreground">키워드</h3>
        </div>
        <div className="flex flex-wrap gap-2 p-4">
          {KEYWORDS.map((tag) => (
            <span
              key={tag}
              className="cursor-default rounded border border-border bg-surface px-2.5 py-1 text-xs text-steel transition-colors hover:border-accent/30 hover:bg-accent/5 hover:text-accent"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </aside>
  );
}

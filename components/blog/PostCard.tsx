import Link from "next/link";
import Image from "next/image";
import type { PostMeta } from "@/lib/blog";

interface PostCardProps {
  post: PostMeta;
  featured?: boolean;
}

export default function PostCard({ post, featured = false }: PostCardProps) {
  if (featured) {
    return (
      <Link
        href={`/blog/${post.slug}`}
        className="group block overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-[var(--shadow-lift)]"
      >
        {/* Hero image */}
        <div className="relative h-52 w-full bg-surface">
          {post.thumbnail ? (
            <Image
              src={post.thumbnail}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 780px"
              priority
            />
          ) : (
            <div className="flex h-full items-center justify-center text-xs font-bold tracking-widest text-steel/40">
              현장 사진
            </div>
          )}
          <span className="absolute left-3 top-3 rounded bg-accent px-2.5 py-1 text-xs font-bold text-white">
            최신글
          </span>
        </div>

        {/* Body */}
        <div className="p-5">
          <div className="flex flex-wrap gap-1.5">
            {post.categories.map((cat) => (
              <span key={cat} className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
                {cat}
              </span>
            ))}
          </div>
          <h2 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
            {post.title}
          </h2>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-steel">
            {post.excerpt}
          </p>
          <p className="mt-3 text-xs text-muted">{post.date}</p>
        </div>
      </Link>
    );
  }

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex gap-4 rounded-xl border border-border bg-card p-4 transition-shadow hover:shadow-[var(--shadow-lift)]"
    >
      {/* Thumbnail */}
      <div className="relative h-[90px] w-[120px] shrink-0 overflow-hidden rounded-lg bg-surface">
        {post.thumbnail ? (
          <Image
            src={post.thumbnail}
            alt={post.title}
            fill
            className="object-cover"
            sizes="120px"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-bold text-steel/40">
            사진
          </div>
        )}
      </div>

      {/* Content */}
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap gap-1">
          {post.categories.map((cat) => (
            <span key={cat} className="inline-block rounded bg-accent/10 px-2 py-0.5 text-xs font-semibold text-accent">
              {cat}
            </span>
          ))}
        </div>
        <h2 className="mt-1.5 line-clamp-2 text-sm font-bold leading-snug text-foreground transition-colors group-hover:text-accent">
          {post.title}
        </h2>
        <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-steel">
          {post.excerpt}
        </p>
        <p className="mt-2 text-xs text-muted">{post.date}</p>
      </div>
    </Link>
  );
}

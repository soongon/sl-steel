import Link from "next/link";
import { getAdminPosts } from "@/lib/admin";
import StatusBadge from "@/components/admin/StatusBadge";
import DeleteButton from "@/components/admin/DeleteButton";

export default async function AdminDashboardPage() {
  const posts = await getAdminPosts();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">블로그 포스트</h1>
        <Link
          href="/admin/posts/new"
          className="rounded-lg bg-accent px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-accent-dark"
        >
          새 포스트
        </Link>
      </div>

      <div className="overflow-hidden rounded-xl border border-border bg-card">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-surface text-left text-xs font-medium text-steel">
              <th className="px-4 py-3">제목</th>
              <th className="hidden px-4 py-3 sm:table-cell">카테고리</th>
              <th className="px-4 py-3">상태</th>
              <th className="hidden px-4 py-3 md:table-cell">발행일</th>
              <th className="px-4 py-3 text-right">작업</th>
            </tr>
          </thead>
          <tbody>
            {posts.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-12 text-center text-muted">
                  포스트가 없습니다.
                </td>
              </tr>
            ) : (
              posts.map((post) => (
                <tr key={post.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-3 font-medium text-foreground">
                    <Link href={`/admin/posts/${post.id}/edit`} className="hover:text-accent">
                      {post.title}
                    </Link>
                  </td>
                  <td className="hidden px-4 py-3 sm:table-cell">
                    <div className="flex flex-wrap gap-1">
                      {post.categories.map((cat) => (
                        <span key={cat} className="inline-block rounded bg-accent/10 px-1.5 py-0.5 text-xs font-semibold text-accent">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <StatusBadge status={post.status} hasShareToken={!!post.share_token} />
                  </td>
                  <td className="hidden px-4 py-3 text-steel md:table-cell">
                    {post.published_at?.slice(0, 10) ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-accent hover:text-accent-dark"
                      >
                        수정
                      </Link>
                      <DeleteButton postId={post.id} postTitle={post.title} />
                    </div>
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

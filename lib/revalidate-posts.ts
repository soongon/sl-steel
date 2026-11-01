import { revalidatePath } from "next/cache";

/** Refresh every list displaying posts; optionally refresh a known detail page. */
export function revalidatePostPages(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/");
  revalidatePath("/used-rebar"); // 매입 사례 카드가 블로그 글을 읽는다
  revalidatePath("/sitemap.xml");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
}

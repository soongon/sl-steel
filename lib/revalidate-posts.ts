import { revalidatePath } from "next/cache";

/** Refresh every list displaying posts; optionally refresh a known detail page. */
export function revalidatePostPages(slug?: string) {
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
  revalidatePath("/admin");
}

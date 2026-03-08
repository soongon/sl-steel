import PostForm from "@/components/admin/PostForm";
import { createPost, getCategories } from "@/lib/admin";

export default async function NewPostPage() {
  const categories = await getCategories();

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-foreground">새 포스트</h1>
      <PostForm categories={categories} action={createPost} />
    </div>
  );
}

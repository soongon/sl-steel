import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import { getAdminPost, getCategories, updatePost } from "@/lib/admin";

interface EditPostPageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: EditPostPageProps) {
  const { id } = await params;
  const [post, categories] = await Promise.all([
    getAdminPost(id),
    getCategories(),
  ]);

  if (!post) notFound();

  async function handleUpdate(formData: FormData) {
    "use server";
    await updatePost(id, formData);
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-bold text-foreground">포스트 수정</h1>
      <PostForm post={post} categories={categories} action={handleUpdate} />
    </div>
  );
}

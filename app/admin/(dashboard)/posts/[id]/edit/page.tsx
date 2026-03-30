import { notFound } from "next/navigation";
import PostForm from "@/components/admin/PostForm";
import ShareLinkButton from "@/components/admin/ShareLinkButton";
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
    return updatePost(id, formData);
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-bold text-foreground">포스트 수정</h1>
        <ShareLinkButton
          postId={id}
          existingToken={post.share_token}
          expiresAt={post.share_expires_at}
        />
      </div>
      <PostForm post={post} categories={categories} action={handleUpdate} />
    </div>
  );
}

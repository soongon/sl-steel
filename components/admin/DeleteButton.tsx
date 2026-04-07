"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { deletePost } from "@/lib/admin";

interface Props {
  postId: string;
  postTitle: string;
}

export default function DeleteButton({ postId, postTitle }: Props) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm(`"${postTitle}" 포스트를 삭제하시겠습니까?`)) return;

    setDeleting(true);
    try {
      const result = await deletePost(postId);
      if (result?.error) {
        alert(result.error);
        setDeleting(false);
        return;
      }
      router.refresh();
    } catch {
      alert("삭제에 실패했습니다.");
      setDeleting(false);
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={deleting}
      className="text-red-500 hover:text-red-600 disabled:opacity-50"
    >
      {deleting ? "삭제 중..." : "삭제"}
    </button>
  );
}

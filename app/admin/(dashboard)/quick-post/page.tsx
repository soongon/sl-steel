import QuickPostForm from "@/components/admin/QuickPostForm";

export default function QuickPostPage() {
  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-6 text-xl font-bold text-foreground">빠른 등록</h1>
      <p className="mb-6 text-sm text-muted">
        Claude.ai에서 생성한 JSON을 붙여넣으면 초안이 자동으로 생성됩니다.
      </p>
      <QuickPostForm />
    </div>
  );
}

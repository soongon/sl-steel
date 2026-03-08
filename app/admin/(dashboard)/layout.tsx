import AdminNav from "@/components/admin/AdminNav";

export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AdminNav />
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </>
  );
}

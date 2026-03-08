import AdminNav from "@/components/admin/AdminNav";
import { getNewInquiryCount } from "@/lib/inquiries";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const newInquiryCount = await getNewInquiryCount();

  return (
    <>
      <AdminNav newInquiryCount={newInquiryCount} />
      <main className="mx-auto max-w-6xl px-6 py-6">{children}</main>
    </>
  );
}

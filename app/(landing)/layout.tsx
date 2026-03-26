import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MobileCTABar from "@/components/MobileCTABar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      {/* pb-16: MobileCTABar 고정 높이만큼 여백 확보 */}
      <div className="h-16 md:hidden" aria-hidden="true" />
      <MobileCTABar />
    </>
  );
}

import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import "./landing.css";
import MobileCTABar from "@/components/MobileCTABar";

export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="top" className="silla-landing">
      <Header />
      {children}
      <Footer />
      {/* 고정 문의 바와 모바일 안전 영역만큼 여백 확보 */}
      <div className="silla-mobile-clearance" aria-hidden="true" />
      <MobileCTABar />
    </div>
  );
}

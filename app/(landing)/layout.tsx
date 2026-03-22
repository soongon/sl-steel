import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import MobileCTABar from "@/components/MobileCTABar";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
      <MobileCTABar />
    </>
  );
}

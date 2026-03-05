import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";

export default function LandingLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      {children}
      <Footer />
    </>
  );
}

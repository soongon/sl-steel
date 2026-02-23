import HeroSection from "@/components/sections/HeroSection";
import StatsSection from "@/components/sections/StatsSection";
import AboutSection from "@/components/sections/AboutSection";
import ProductsSection from "@/components/sections/ProductsSection";
import BusinessSection from "@/components/sections/BusinessSection";
import ProcessSection from "@/components/sections/ProcessSection";
import SystemSection from "@/components/sections/SystemSection";
import WhySection from "@/components/sections/WhySection";
import ContactSection from "@/components/sections/ContactSection";

export default function Home() {
  return (
    <main className="pt-[4.5rem]">
      <HeroSection />
      <StatsSection />
      <AboutSection />
      <ProductsSection />
      <SystemSection />
      <BusinessSection />
      <ProcessSection />
      <WhySection />
      <ContactSection />
    </main>
  );
}

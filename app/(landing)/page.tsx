import HeroSection from "@/components/sections/HeroSection";
import ProcessSection from "@/components/sections/ProcessSection";
import ContactSection from "@/components/sections/ContactSection";
import {
  CompanyIntro,
  BusinessOverview,
  FieldCases,
  Facilities,
} from "@/components/sections/LandingSections";
import { getPosts } from "@/lib/blog";

export default async function Home() {
  const posts = (await getPosts()).slice(0, 3);
  return (
    <main id="main-content">
      <HeroSection />
      <CompanyIntro />
      <BusinessOverview />
      <FieldCases posts={posts} />
      <Facilities />
      <ProcessSection />
      <ContactSection />
    </main>
  );
}

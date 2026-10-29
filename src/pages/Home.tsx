import Hero from "../components/sections/Hero";
import Services from "../components/sections/Services";
import About from "../components/sections/About";
import WorksPreview from "../components/sections/WorksPreview";
import PartsPreview from "../components/sections/PartsPreview";
import SEO from "../components/ui/SEO";
export default function Home() {
  return (
    <>
      <SEO title="Soluções em climatização" />
      <Hero />
      <Services />
      <About />
      <WorksPreview />
      <PartsPreview />
    </>
  );
}

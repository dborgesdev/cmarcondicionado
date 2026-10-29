import ScrollAtmosphere from "./components/ui/ScrollAtmosphere";
import { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/sections/Header";
import Footer from "./components/sections/Footer";
import WhatsAppFloat from "./components/sections/WhatsAppFloat";
import FinalCTA from "./components/sections/FinalCTA";
import Home from "./pages/Home";
import Pieces from "./pages/Pieces";
import Works from "./pages/Works";
import Detail from "./pages/Detail";
import NotFound from "./pages/NotFound";
function NavigationEffects() {
  const { pathname, hash, key } = useLocation();
  const homeNavigationKey = pathname === "/" ? key : undefined;
  useEffect(() => {
    if (hash) {
      requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView(),
      );
    } else window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname, hash, homeNavigationKey]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("revealed");
            observer.unobserve(e.target);
          }
        }),
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".section,.about")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [pathname]);
  return null;
}
export default function App() {
  return (
    <>
      <NavigationEffects />
      <ScrollAtmosphere />
      <a className="skip-link" href="#main">
        Ir para o conteúdo
      </a>
      <Header />
      <main id="main" tabIndex={-1}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/pecas" element={<Pieces />} />
          <Route path="/pecas/:slug" element={<Detail kind="piece" />} />
          <Route path="/trabalhos" element={<Works />} />
          <Route path="/trabalhos/:slug" element={<Detail kind="work" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FinalCTA />
      </main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}

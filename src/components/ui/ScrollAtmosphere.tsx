import { useEffect } from "react";
import { useLocation } from "react-router-dom";
export default function ScrollAtmosphere() {
  const { pathname } = useLocation();
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reduced.matches) return;
    const hero = document.querySelector<HTMLElement>(".hero");
    const panorama = document.querySelector<HTMLElement>(".about-panorama");
    let frame = 0;
    function update() {
      frame = 0;
      if (reduced.matches) return;
      if (hero)
        hero.style.setProperty(
          "--hero-shift",
          `${Math.min(window.scrollY, 900) * 0.12}px`,
        );
      if (panorama) {
        const rect = panorama.getBoundingClientRect();
        if (rect.bottom > 0 && rect.top < window.innerHeight)
          panorama.style.setProperty(
            "--about-shift",
            `${(window.innerHeight / 2 - rect.top - rect.height / 2) * 0.07}px`,
          );
      }
    }
    function scroll() {
      if (!frame) frame = requestAnimationFrame(update);
    }
    scroll();
    window.addEventListener("scroll", scroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scroll);
    };
  }, [pathname]);
  return null;
}

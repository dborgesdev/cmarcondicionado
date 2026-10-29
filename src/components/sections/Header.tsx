import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "../ui/WhatsApp";
const links = [
  { label: "Início", to: "/", section: "inicio" },
  { label: "Serviços", to: "/#servicos", section: "servicos" },
  { label: "Sobre", to: "/#sobre", section: "sobre" },
  { label: "Trabalhos", to: "/trabalhos", section: "trabalhos" },
  { label: "Peças", to: "/pecas", section: "pecas" },
  { label: "Contato", to: "/#contato", section: "contato" },
];
export default function Header() {
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [section, setSection] = useState("inicio");
  const track = useRef<HTMLDivElement>(null);
  const [indicator, setIndicator] = useState({ left: 0, width: 0 });
  const active =
    location.pathname === "/"
      ? section
      : location.pathname.startsWith("/trabalhos")
        ? "trabalhos"
        : location.pathname.startsWith("/pecas")
          ? "pecas"
          : "";
  useEffect(() => {
    const update = () => {
      setScrolled(window.scrollY > 45);
      if (window.scrollY < 80) setSection("inicio");
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  useEffect(() => {
    setOpen(false);
    if (location.pathname !== "/") return;
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length) {
          const closest = visible.sort(
            (a, b) =>
              Math.abs(a.boundingClientRect.top - 160) -
              Math.abs(b.boundingClientRect.top - 160),
          )[0];
          setSection(closest.target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: 0 },
    );
    document
      .querySelectorAll("#inicio,#servicos,#sobre,#trabalhos,#pecas,#contato")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [location.pathname, location.hash, location.key]);
  useLayoutEffect(() => {
    const update = () => {
      const el = track.current?.querySelector<HTMLElement>("[aria-current]");
      setIndicator({ left: el?.offsetLeft ?? 0, width: el?.offsetWidth ?? 0 });
    };
    update();
    const resize = new ResizeObserver(update);
    if (track.current) resize.observe(track.current);
    return () => resize.disconnect();
  }, [active, open]);
  useEffect(() => {
    if (!open) return;
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        document.querySelector<HTMLButtonElement>(".menu-toggle")?.focus();
      }
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return (
    <header className={`header ${scrolled ? "scrolled" : ""}`}>
      <div className="container header-inner">
        <Link to="/" className="brand" aria-label="CM Ar-Condicionado — início">
          <img
            src="/logo-cm-arcondicionado.webp"
            alt="CM Ar-Condicionado"
            width="960"
            height="409"
            className="object-contain"
          />
        </Link>
        <button
          className="menu-toggle icon-button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls="main-navigation"
          aria-label={open ? "Fechar menu" : "Abrir menu"}
        >
          {open ? <X /> : <Menu />}
        </button>
        <nav
          id="main-navigation"
          className={open ? "open" : ""}
          aria-label="Navegação principal"
        >
          <div className="nav-track" ref={track}>
            {links.map((link) => (
              <Link
                key={link.section}
                className={active === link.section ? "active" : ""}
                aria-current={
                  active === link.section
                    ? location.pathname === "/"
                      ? "location"
                      : "page"
                    : undefined
                }
                to={link.to}
              >
                {link.label}
              </Link>
            ))}
            <span
              className="nav-indicator"
              aria-hidden="true"
              style={{
                width: indicator.width,
                transform: `translateX(${indicator.left}px)`,
              }}
            />
          </div>
          <WhatsAppLink className="button header-cta">
            Fale com a CM
            <ArrowUpRight size={17} />
          </WhatsAppLink>
        </nav>
      </div>
    </header>
  );
}

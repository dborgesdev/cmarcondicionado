import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE } from "../../lib/whatsapp";
export default function SEO({
  title,
  description = "Instalação, manutenção e conserto de ar-condicionado. Conheça os serviços da CM Ar-Condicionado e consulte peças pelo WhatsApp.",
  image,
  noindex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  noindex?: boolean;
}) {
  const { pathname } = useLocation();
  useEffect(() => {
    document.title = `${title} | CM Ar-Condicionado`;
    function meta(key: string, content: string, property = false) {
      const attr = property ? "property" : "name";
      let el = document.head.querySelector(`meta[${attr}="${key}"]`);
      if (!el) {
        el = document.createElement("meta");
        el.setAttribute(attr, key);
        document.head.append(el);
      }
      el.setAttribute("content", content);
    }
    meta("description", description);
    meta("robots", noindex ? "noindex,follow" : "index,follow");
    meta("og:title", document.title, true);
    meta("og:description", description, true);
    meta("og:url", SITE + pathname, true);
    meta("og:image", image || `${SITE}/og-cm.jpg`, true);
    meta("twitter:title", document.title);
    meta("twitter:description", description);
    meta("twitter:image", image || `${SITE}/og-cm.jpg`);
    document.head
      .querySelector('link[rel="canonical"]')
      ?.setAttribute("href", SITE + pathname);
  }, [title, description, image, pathname, noindex]);
  return null;
}

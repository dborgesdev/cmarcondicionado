import { useEffect, useId, useRef, useState, type KeyboardEvent } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { Work, Term } from "../../types";
import { WorkCard } from "./Content";

export default function WorksCollection({
  items,
  terms = [],
  carousel = false,
}: {
  items: Work[];
  terms?: Term[];
  carousel?: boolean;
}) {
  const track = useRef<HTMLDivElement>(null);
  const id = useId();
  const [edges, setEdges] = useState({ start: true, end: true });
  function measure() {
    const el = track.current;
    if (el)
      setEdges({
        start: el.scrollLeft <= 2,
        end: el.scrollLeft + el.clientWidth >= el.scrollWidth - 2,
      });
  }
  useEffect(() => {
    const el = track.current;
    if (!carousel || !el) return;
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    measure();
    return () => observer.disconnect();
  }, [carousel, items.length]);
  function move(direction: number) {
    const el = track.current;
    if (!el) return;
    const width =
      el.firstElementChild?.getBoundingClientRect().width ?? el.clientWidth;
    const gap = Number.parseFloat(getComputedStyle(el).columnGap) || 0;
    el.scrollBy({
      left: direction * (width + gap),
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
  }
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      move(event.key === "ArrowLeft" ? -1 : 1);
    }
  }
  const cards = items.map((work) => (
    <WorkCard key={work.id} work={work} terms={terms} />
  ));
  if (!carousel) return <div className="works-grid">{cards}</div>;
  return (
    <div
      className="works-carousel"
      role="region"
      aria-roledescription="carrossel"
      aria-label="Trabalhos realizados recentes"
    >
      <div
        id={id}
        ref={track}
        className="works-carousel-track"
        tabIndex={0}
        aria-label="Trabalhos: use as setas do teclado ou deslize para navegar"
        onKeyDown={onKeyDown}
        onScroll={measure}
      >
        {cards}
      </div>
      <div className="works-carousel-footer">
        <p>
          {String(items.length).padStart(2, "0")} REGISTROS{" "}
          <span aria-hidden="true">/</span>{" "}
          {edges.start && edges.end
            ? "TRABALHOS REALIZADOS"
            : "DESLIZE PARA EXPLORAR"}
        </p>
        <div
          className="works-carousel-controls"
          aria-label="Navegação dos trabalhos"
        >
          <button
            type="button"
            aria-label="Trabalhos anteriores"
            aria-controls={id}
            disabled={edges.start}
            onClick={() => move(-1)}
          >
            <ArrowLeft size={21} />
          </button>
          <button
            type="button"
            aria-label="Próximos trabalhos"
            aria-controls={id}
            disabled={edges.end}
            onClick={() => move(1)}
          >
            <ArrowRight size={21} />
          </button>
        </div>
      </div>
    </div>
  );
}

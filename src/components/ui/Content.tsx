import type { ReactNode } from "react";
import { ArrowRight, RefreshCw, SearchX } from "lucide-react";
import { Link } from "react-router-dom";
import type { Piece, Work, Term } from "../../types";
import { ResponsiveImage } from "./Gallery";
import { WhatsAppLink } from "./WhatsApp";
export function SectionHeading({
  eyebrow,
  title,
  children,
  to,
  link,
}: {
  eyebrow: string;
  title: ReactNode;
  children?: ReactNode;
  to?: string;
  link?: string;
}) {
  return (
    <div className="section-heading">
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        {children && <p className="section-description">{children}</p>}
      </div>
      {to && (
        <Link className="text-link" to={to}>
          {link}
          <ArrowRight size={18} />
        </Link>
      )}
    </div>
  );
}
export function Loading() {
  return (
    <div
      className="loading-grid"
      role="status"
      aria-label="Carregando conteúdo"
    >
      {[1, 2, 3].map((n) => (
        <div className="skeleton" key={n} />
      ))}
      <span className="sr-only">Carregando…</span>
    </div>
  );
}
export function ErrorState({ retry }: { retry: () => void }) {
  return (
    <div className="empty" role="alert">
      <h3>Não foi possível carregar o conteúdo.</h3>
      <p>Verifique sua conexão ou converse com a CM Ar-Condicionado.</p>
      <div className="actions">
        <button className="button outline" onClick={retry}>
          <RefreshCw size={16} />
          Tentar novamente
        </button>
        <WhatsAppLink>Falar pelo WhatsApp</WhatsAppLink>
      </div>
    </div>
  );
}
export function EmptyState({
  title = "Nenhum resultado encontrado.",
  children,
}: {
  title?: string;
  children?: ReactNode;
}) {
  return (
    <div className="empty">
      <SearchX size={30} aria-hidden="true" />
      <h3>{title}</h3>
      <p>
        {children ||
          "Conte o que você precisa. Podemos conversar sobre a sua necessidade pelo WhatsApp."}
      </p>
      <WhatsAppLink>Consultar pelo WhatsApp</WhatsAppLink>
    </div>
  );
}
export const labels: Record<string, string> = {
  nova: "Nova",
  usada: "Usada",
  recondicionada: "Recondicionada",
  disponivel: "Disponível",
  sob_consulta: "Sob consulta",
  indisponivel: "Indisponível",
};
export function Price({ value }: { value?: number }) {
  return (
    <strong className="price">
      {value === undefined
        ? "Consulte o valor"
        : new Intl.NumberFormat("pt-BR", {
            style: "currency",
            currency: "BRL",
          }).format(value)}
    </strong>
  );
}
export function PieceCard({ piece }: { piece: Piece }) {
  return (
    <Link className="piece-card" to={`/pecas/${piece.slug}`}>
      <div className="piece-visual">
        <ResponsiveImage photo={piece.cover} alt={piece.name} />
        <span className="piece-view" aria-hidden="true">
          <ArrowRight size={22} />
        </span>
      </div>
      <div className="card-body">
        <div className="badges">
          {piece.condition && (
            <span>{labels[piece.condition] || piece.condition}</span>
          )}
          <span className={`availability ${piece.availability}`}>
            {labels[piece.availability] || "Sob consulta"}
          </span>
        </div>
        <h3>{piece.name}</h3>
        {piece.code && <p className="code">{piece.code}</p>}
        <Price value={piece.price} />
        <span className="text-link">
          Ver peça e consultar <ArrowRight size={17} />
        </span>
      </div>
    </Link>
  );
}
export function WorkCard({ work, terms = [] }: { work: Work; terms?: Term[] }) {
  return (
    <Link className="work-card" to={`/trabalhos/${work.slug}`}>
      <div className="work-image">
        <ResponsiveImage photo={work.cover} alt={work.name} />
        <span className="round-arrow">
          <ArrowRight />
        </span>
      </div>
      <div className="work-caption">
        <div>
          <p className="eyebrow">
            {terms
              .filter((t) => work.categories.includes(t.id))
              .map((t) => t.name)
              .join(" · ") || "Trabalho realizado"}
          </p>
          <h3>{work.name}</h3>
        </div>
        <span aria-hidden="true">↗</span>
      </div>
    </Link>
  );
}
export function Pagination({
  page,
  hasNext,
  onChange,
}: {
  page: number;
  hasNext: boolean;
  onChange: (page: number) => void;
}) {
  return (
    <nav className="pagination" aria-label="Paginação">
      <button
        className="button outline"
        disabled={page <= 1}
        onClick={() => onChange(page - 1)}
      >
        Anterior
      </button>
      <span aria-live="polite">Página {page}</span>
      <button
        className="button outline"
        disabled={!hasNext}
        onClick={() => onChange(page + 1)}
      >
        Próxima
      </button>
    </nav>
  );
}

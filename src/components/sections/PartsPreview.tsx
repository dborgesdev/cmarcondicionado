import { getPieces } from "../../lib/api";
import { useResource } from "../../hooks/useResource";
import {
  EmptyState,
  ErrorState,
  Loading,
  SectionHeading,
  PieceCard,
} from "../ui/Content";
export default function PartsPreview() {
  const r = useResource(getPieces, "pieces");
  return (
    <section id="pecas" className="section parts">
      <div className="container">
        <SectionHeading
          eyebrow="PEÇAS E COMPONENTES"
          title={
            <>
              Componentes certos.
              <br />
              <em>Novas possibilidades.</em>
            </>
          }
          to="/pecas"
          link="Explorar catálogo"
        >
          Conheça as peças cadastradas e consulte compatibilidade, valor e
          disponibilidade pelo WhatsApp.
        </SectionHeading>
        {r.loading ? (
          <Loading />
        ) : r.error ? (
          <ErrorState retry={r.retry} />
        ) : !r.data?.length ? (
          <EmptyState title="Procurando uma peça específica?">
            Envie o modelo do aparelho e a peça que procura para consultar
            disponibilidade.
          </EmptyState>
        ) : (
          <div className="pieces-grid">
            {r.data.slice(0, 4).map((piece) => (
              <PieceCard key={piece.id} piece={piece} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

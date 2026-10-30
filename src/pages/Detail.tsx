import { Link, useParams } from "react-router-dom";
import DOMPurify from "dompurify";
import { ArrowUpRight, ArrowLeft } from "lucide-react";
import { getPiece, getWork, PIECES_REFRESH_MS } from "../lib/api";
import { useResource } from "../hooks/useResource";
import { pieceMessage, workMessage } from "../lib/whatsapp";
import type { Piece, Work } from "../types";
import Gallery from "../components/ui/Gallery";
import { WhatsAppLink } from "../components/ui/WhatsApp";
import { ErrorState, Loading, Price, labels } from "../components/ui/Content";
import SEO from "../components/ui/SEO";
function SafeContent({ html }: { html: string }) {
  return (
    <div
      className="editor-content"
      dangerouslySetInnerHTML={{
        __html: DOMPurify.sanitize(html, {
          ALLOWED_TAGS: [
            "p",
            "br",
            "strong",
            "em",
            "ul",
            "ol",
            "li",
            "h2",
            "h3",
            "h4",
            "blockquote",
          ],
          ALLOWED_ATTR: [],
        }),
      }}
    />
  );
}
export default function Detail({ kind }: { kind: "piece" | "work" }) {
  const { slug = "" } = useParams();
  const r = useResource<Piece | Work | null>(
    () => (kind === "piece" ? getPiece(slug) : getWork(slug)),
    `${kind}:${slug}`,
    kind === "piece" ? PIECES_REFRESH_MS : 0,
  );
  const isPiece = kind === "piece";
  const parent = isPiece ? "/pecas" : "/trabalhos";
  const item = r.data;
  const piece = item as Piece | undefined | null;
  return (
    <section className={`section detail-page detail-${kind}`}>
      <div className="container">
        <nav className="breadcrumbs" aria-label="Caminho de navegação">
          <Link to="/">Início</Link>
          <span>/</span>
          <Link to={parent}>{isPiece ? "Peças" : "Trabalhos"}</Link>
          {item && (
            <>
              <span>/</span>
              <span aria-current="page">{item.name}</span>
            </>
          )}
        </nav>
        {r.loading ? (
          <>
            <SEO title="Carregando" />
            <Loading />
          </>
        ) : r.error ? (
          <>
            <SEO title="Conteúdo indisponível" noindex />
            <ErrorState retry={r.retry} />
          </>
        ) : !item ? (
          <>
            <SEO
              title={
                isPiece ? "Peça não encontrada" : "Trabalho não encontrado"
              }
              noindex
            />
            <div className="empty">
              <h1>
                {isPiece ? "Peça não encontrada." : "Trabalho não encontrado."}
              </h1>
              <p>
                Este conteúdo pode ter sido removido ou não está disponível para
                consulta pública.
              </p>
              <Link className="button" to={parent}>
                <ArrowLeft size={18} />
                Voltar para {isPiece ? "peças" : "trabalhos"}
              </Link>
            </div>
          </>
        ) : (
          <>
            <SEO title={item.name} image={item.cover?.url} />
            <div className="detail-heading">
              <p className="eyebrow">
                {isPiece ? "PEÇAS E COMPONENTES" : "TRABALHO REALIZADO"}
              </p>
              <h1>{item.name}</h1>
              <span>
                {isPiece
                  ? "INFORMAÇÕES / COMPATIBILIDADE / CONSULTA"
                  : `${item.photos.length} FOTOGRAFIAS / REGISTRO DO TRABALHO`}
              </span>
            </div>
            <div className="detail-grid">
              <Gallery photos={item.photos} name={item.name} />
              <div className="detail-content">
                <h2>
                  {isPiece ? "Conheça a peça." : "Um olhar mais próximo."}
                </h2>
                {!isPiece && (
                  <p className="detail-summary">
                    Explore as fotografias deste trabalho. Para conversar sobre
                    uma necessidade semelhante, entre em contato com a CM
                    Ar-Condicionado.
                  </p>
                )}
                {isPiece && piece && (
                  <>
                    <div className="badges">
                      {piece.condition && (
                        <span>
                          {labels[piece.condition] || piece.condition}
                        </span>
                      )}
                      <span className={`availability ${piece.availability}`}>
                        {labels[piece.availability] || "Sob consulta"}
                      </span>
                    </div>
                    <Price value={piece.price} />
                    <dl className="specifications">
                      {[
                        ["Código", piece.code],
                        ["Marca / fabricante", piece.brand],
                        ["Compatibilidade", piece.compatibility],
                      ]
                        .filter(([, v]) => v)
                        .map(([label, value]) => (
                          <div key={label}>
                            <dt>{label}</dt>
                            <dd>{value}</dd>
                          </div>
                        ))}
                    </dl>
                  </>
                )}
                <SafeContent html={item.html} />
                {!isPiece &&
                  "galleryAvailable" in item &&
                  !item.galleryAvailable && (
                    <p className="notice">
                      As fotografias adicionais deste trabalho ainda não estão
                      disponíveis. A imagem de capa está apresentada ao lado.
                    </p>
                  )}
                <WhatsAppLink
                  message={
                    isPiece && piece ? pieceMessage(piece) : workMessage(item)
                  }
                >
                  {isPiece
                    ? piece?.availability === "indisponivel"
                      ? "Consultar alternativa"
                      : "Consultar esta peça"
                    : "Quero um serviço semelhante"}
                  <ArrowUpRight size={18} />
                </WhatsAppLink>
                {isPiece && (
                  <p className="detail-note">
                    Confirme disponibilidade, compatibilidade e condições no
                    atendimento.
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}

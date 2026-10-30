import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, SlidersHorizontal, ArrowDownRight } from "lucide-react";
import { getPieces, getTerms, PIECES_REFRESH_MS } from "../lib/api";
import { useResource } from "../hooks/useResource";
import {
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
  PieceCard,
} from "../components/ui/Content";
import { ResponsiveImage } from "../components/ui/Gallery";
import SEO from "../components/ui/SEO";
export default function Pieces() {
  const r = useResource(getPieces, "pieces", PIECES_REFRESH_MS);
  const terms = useResource(
    () => getTerms("pieces"),
    "pieceTerms",
    PIECES_REFRESH_MS,
  );
  const [params, setParams] = useSearchParams();
  const search = params.get("busca") || "";
  const [input, setInput] = useState(search);
  useEffect(() => setInput(search), [search]);
  useEffect(() => {
    if (input === search) return;
    const timer = setTimeout(() => {
      setParams(
        (previous) => {
          const next = new URLSearchParams(previous);
          if (input) next.set("busca", input);
          else next.delete("busca");
          next.delete("pagina");
          return next;
        },
        { replace: true },
      );
    }, 350);
    return () => clearTimeout(timer);
  }, [input, search, setParams]);
  function update(key: string, value: string) {
    setParams((previous) => {
      const next = new URLSearchParams(previous);
      if (value) next.set(key, value);
      else next.delete(key);
      if (key !== "pagina") next.delete("pagina");
      return next;
    });
  }
  const category = params.get("categoria") || "";
  const condition = params.get("estado") || "";
  const availability = params.get("disponibilidade") || "";
  const order = params.get("ordem") || "";
  const list = (r.data ?? []).filter(
    (p) =>
      (!search ||
        `${p.name} ${p.code} ${p.brand} ${p.compatibility}`
          .toLocaleLowerCase("pt-BR")
          .includes(search.toLocaleLowerCase("pt-BR"))) &&
      (!category || p.categories.includes(Number(category))) &&
      (!condition || p.condition === condition) &&
      (!availability || p.availability === availability),
  );
  if (order === "nome")
    list.sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  const pages = Math.max(1, Math.ceil(list.length / 12));
  const page = Math.min(
    pages,
    Math.max(1, Math.floor(Number(params.get("pagina")) || 1)),
  );
  return (
    <>
      <SEO title="Peças e componentes" />
      <div className="page-intro parts-intro">
        <div className="container catalogue-intro-grid">
          <div>
            <p className="eyebrow">PEÇAS E COMPONENTES</p>
            <h1>
              A peça certa.
              <br />
              <em>O próximo passo.</em>
            </h1>
            <p>
              Encontre o componente e converse sobre
              <br />
              compatibilidade, condições e disponibilidade.
            </p>
            <a className="text-link" href="#catalogo">
              Explorar peças
              <ArrowDownRight size={21} />
            </a>
          </div>
          <div className="catalogue-cover">
            <span className="catalogue-orbit" aria-hidden="true" />
            {r.data?.[0] && (
              <ResponsiveImage photo={r.data[0].cover} alt={r.data[0].name} />
            )}
            <span className="catalogue-photo-label">
              COMPONENTES / CLIMATIZAÇÃO
            </span>
          </div>
        </div>
      </div>
      <section id="catalogo" className="section catalogue">
        <div className="container">
          <div className="catalogue-toolbar">
            <label className="search-field">
              <Search size={22} />
              <span className="sr-only">
                Buscar peças por nome, marca ou código
              </span>
              <input
                type="search"
                placeholder="Qual peça você procura?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
              />
            </label>
            <div className="catalogue-search-caption">
              <SlidersHorizontal size={19} />
              <span>
                Encontre por nome,
                <br />
                marca ou referência.
              </span>
            </div>
          </div>
          <div className="category-tabs" aria-label="Filtrar por categoria">
            <button
              aria-pressed={!category}
              onClick={() => update("categoria", "")}
            >
              Todas as peças
            </button>
            {terms.data?.map((t) => (
              <button
                key={t.id}
                aria-pressed={category === String(t.id)}
                onClick={() => update("categoria", String(t.id))}
              >
                {t.name}
              </button>
            ))}
          </div>
          <div className="filter-row">
            <label>
              Categoria
              <select
                value={category}
                onChange={(e) => update("categoria", e.target.value)}
              >
                <option value="">Todas as categorias</option>
                {terms.data?.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Estado
              <select
                value={condition}
                onChange={(e) => update("estado", e.target.value)}
              >
                <option value="">Todos os estados</option>
                <option value="nova">Nova</option>
                <option value="usada">Usada</option>
                <option value="recondicionada">Recondicionada</option>
              </select>
            </label>
            <label>
              Disponibilidade
              <select
                value={availability}
                onChange={(e) => update("disponibilidade", e.target.value)}
              >
                <option value="">Todas</option>
                <option value="disponivel">Disponível</option>
                <option value="sob_consulta">Sob consulta</option>
                <option value="indisponivel">Indisponível</option>
              </select>
            </label>
            <label>
              Ordenar por
              <select
                value={order}
                onChange={(e) => update("ordem", e.target.value)}
              >
                <option value="">Mais recentes</option>
                <option value="nome">Nome: A–Z</option>
              </select>
            </label>
          </div>
          {terms.error && (
            <p className="notice">
              As categorias não carregaram.{" "}
              <button onClick={terms.retry}>Tentar novamente</button>
            </p>
          )}
          {params.size > 0 && (
            <button
              className="clear-filters"
              onClick={() => {
                setInput("");
                setParams({});
              }}
            >
              Limpar filtros
            </button>
          )}
          {r.loading ? (
            <Loading />
          ) : r.error ? (
            <ErrorState retry={r.retry} />
          ) : (
            <>
              <div className="catalogue-result-heading">
                <p className="result-count" aria-live="polite">
                  {list.length}{" "}
                  {list.length === 1 ? "peça encontrada" : "peças encontradas"}
                </p>
                <span>DISPONIBILIDADE SOB CONFIRMAÇÃO</span>
              </div>
              {!list.length ? (
                <EmptyState
                  title={
                    r.data?.length
                      ? "Não encontramos essa combinação."
                      : "Qual componente você precisa?"
                  }
                >
                  {r.data?.length
                    ? "Experimente outra busca ou limpe os filtros. Se preferir, conte o que procura pelo WhatsApp."
                    : "Informe o modelo do aparelho e a peça que procura para consultar disponibilidade."}
                </EmptyState>
              ) : (
                <div className="pieces-grid">
                  {list.slice((page - 1) * 12, page * 12).map((piece) => (
                    <PieceCard key={piece.id} piece={piece} />
                  ))}
                </div>
              )}
              {pages > 1 && (
                <Pagination
                  page={page}
                  hasNext={page < pages}
                  onChange={(n) => update("pagina", String(n))}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

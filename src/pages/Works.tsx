import { useSearchParams } from "react-router-dom";
import { ArrowDownRight } from "lucide-react";
import { getWorks, getTerms, WORKS_REFRESH_MS } from "../lib/api";
import { useResource } from "../hooks/useResource";
import {
  EmptyState,
  ErrorState,
  Loading,
  Pagination,
} from "../components/ui/Content";
import WorksCollection from "../components/ui/WorksCollection";
import SEO from "../components/ui/SEO";
export default function Works() {
  const [params, setParams] = useSearchParams();
  const page = Math.max(1, Math.floor(Number(params.get("pagina")) || 1));
  const type = params.get("tipo") || "";
  const r = useResource(
    () => getWorks(page, type),
    `works:${page}:${type}`,
    WORKS_REFRESH_MS,
  );
  const terms = useResource(
    () => getTerms("works"),
    "workTerms",
    WORKS_REFRESH_MS,
  );
  return (
    <>
      <SEO title="Trabalhos realizados" />
      <div className="page-intro works-intro">
        <div className="container">
          <p className="eyebrow">REGISTROS / CM AR-CONDICIONADO</p>
          <div className="internal-title-row">
            <h1>
              Do cuidado
              <br />
              <em>ao resultado.</em>
            </h1>
            <div>
              <ArrowDownRight size={48} strokeWidth={1} />
              <p>
                Explore os trabalhos.
                <br />
                Aproxime o olhar dos detalhes.
              </p>
            </div>
          </div>
          <div className="intro-foot">
            <span>TRABALHOS REALIZADOS</span>
            <span>FOTOGRAFIAS REAIS</span>
          </div>
        </div>
      </div>
      <section className="section work-list">
        <div className="container">
          {!!terms.data?.length && (
            <label className="work-filter">
              Tipo de trabalho
              <select
                value={type}
                onChange={(e) =>
                  setParams(e.target.value ? { tipo: e.target.value } : {})
                }
              >
                <option value="">Todos os tipos</option>
                {terms.data.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </label>
          )}
          {r.loading ? (
            <Loading />
          ) : r.error ? (
            <ErrorState retry={r.retry} />
          ) : (
            <>
              {!r.data?.items.length ? (
                <EmptyState title="Nenhum trabalho encontrado." />
              ) : (
                <WorksCollection items={r.data.items} terms={terms.data} />
              )}
              {(page > 1 || r.data?.hasNext) && (
                <Pagination
                  page={page}
                  hasNext={!!r.data?.hasNext}
                  onChange={(n) => {
                    const next = new URLSearchParams(params);
                    next.set("pagina", String(n));
                    setParams(next);
                    window.scrollTo({ top: 0, behavior: "instant" });
                  }}
                />
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}

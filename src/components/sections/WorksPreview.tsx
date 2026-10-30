import { getWorks, getTerms, WORKS_REFRESH_MS } from "../../lib/api";
import { useResource } from "../../hooks/useResource";
import { EmptyState, ErrorState, Loading, SectionHeading } from "../ui/Content";
import WorksCollection from "../ui/WorksCollection";
export default function WorksPreview() {
  const r = useResource(() => getWorks(), "works:1:", WORKS_REFRESH_MS);
  const terms = useResource(
    () => getTerms("works"),
    "workTerms",
    WORKS_REFRESH_MS,
  );
  return (
    <section id="trabalhos" className="section works">
      <div className="container">
        <SectionHeading
          eyebrow="TRABALHOS REALIZADOS"
          title={
            <>
              O cuidado,
              <br />
              <em>na prática.</em>
            </>
          }
          to="/trabalhos"
          link="Explore todos os trabalhos"
        >
          Um olhar sobre os serviços registrados pela CM Ar-Condicionado.
          Fotografias reais, detalhes de cada trabalho.
        </SectionHeading>
        {r.loading ? (
          <Loading />
        ) : r.error ? (
          <ErrorState retry={r.retry} />
        ) : !r.data?.items.length ? (
          <EmptyState title="Novos registros serão apresentados por aqui." />
        ) : (
          <WorksCollection items={r.data.items} terms={terms.data} carousel />
        )}
      </div>
    </section>
  );
}

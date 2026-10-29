import { Link } from "react-router-dom";
import { ArrowUpRight, Images } from "lucide-react";
import type { Work, Term } from "../../types";
import { ResponsiveImage } from "./Gallery";
import { WorkCard } from "./Content";
export default function WorksCollection({
  items,
  terms = [],
}: {
  items: Work[];
  terms?: Term[];
}) {
  if (items.length === 1) {
    const work = items[0];
    const category = terms
      .filter((t) => work.categories.includes(t.id))
      .map((t) => t.name)
      .join(" · ");
    return (
      <article className="work-feature">
        <Link
          className="work-feature-photo"
          to={`/trabalhos/${work.slug}`}
          aria-label={`Ver trabalho ${work.name}`}
        >
          <ResponsiveImage photo={work.cover} alt={work.name} />
          <span className="photo-corner">
            <Images size={19} />
            Conhecer o registro
          </span>
        </Link>
        <div className="work-feature-story">
          <p className="eyebrow light">
            {category || "EM FOCO / TRABALHO REALIZADO"}
          </p>
          <h3>{work.name}</h3>
          <span className="technical-rule" />
          <p>
            O cuidado também está nos detalhes que você vê. Explore as
            fotografias deste trabalho da CM Ar-Condicionado.
          </p>
          <Link className="work-feature-link" to={`/trabalhos/${work.slug}`}>
            Ver trabalho e fotografias
            <span>
              <ArrowUpRight size={25} />
            </span>
          </Link>
        </div>
      </article>
    );
  }
  return (
    <div className="works-grid">
      {items.map((work) => (
        <WorkCard key={work.id} work={work} terms={terms} />
      ))}
    </div>
  );
}

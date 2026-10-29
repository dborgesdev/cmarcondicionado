import { Link } from "react-router-dom";
import SEO from "../components/ui/SEO";
export default function NotFound() {
  return (
    <section className="section not-found container">
      <SEO title="Página não encontrada" noindex />
      <p className="eyebrow">404</p>
      <h1>Esse caminho não foi encontrado.</h1>
      <p>Volte ao início para conhecer as soluções da CM Ar-Condicionado.</p>
      <Link className="button" to="/">
        Voltar ao início
      </Link>
    </section>
  );
}

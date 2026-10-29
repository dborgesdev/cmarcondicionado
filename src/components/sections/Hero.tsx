import { ArrowDown, ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "../ui/WhatsApp";
import Airflow from "../ui/Airflow";
import { services } from "../../data/services";
export default function Hero() {
  return (
    <section id="inicio" className="hero">
      <img
        className="hero-image"
        src="/hero-climatizacao.webp"
        alt="Ilustração conceitual de aparelho split e condensadora em fachada contemporânea"
        width="1536"
        height="1024"
        fetchPriority="high"
      />
      <div className="hero-shade" />
      <Airflow className="hero-flow" />
      <div className="container hero-content">
        <p className="eyebrow light">
          <span /> SOLUÇÕES EM CLIMATIZAÇÃO
        </p>
        <h1>
          Climatização
          <br />
          com atenção a<br />
          <em>cada detalhe.</em>
        </h1>
        <p className="hero-description">
          Instalação, manutenção e conserto de sistemas de ar-condicionado para
          diferentes necessidades.
        </p>
        <div className="actions">
          <WhatsAppLink>
            Solicitar atendimento <ArrowUpRight size={18} />
          </WhatsAppLink>
          <a className="button ghost" href="#servicos">
            Conhecer serviços <ArrowDown size={18} />
          </a>
        </div>
        <span className="hero-note">
          DO SEU AMBIENTE À NECESSIDADE DO SEU NEGÓCIO
        </span>
      </div>
      <div className="hero-bottom">
        <div className="container expertise">
          {services.map((s) => (
            <a href="#servicos" key={s.id}>
              <s.icon size={27} strokeWidth={1.5} />
              <span>
                <strong>{s.name}</strong>
                <small>{s.subtitle}</small>
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { ArrowUpRight } from "lucide-react";
import { WhatsAppLink } from "../ui/WhatsApp";
export default function FinalCTA() {
  return (
    <section id="contato" className="final-cta">
      <div className="container final-inner">
        <div>
          <p className="eyebrow light">VAMOS CONVERSAR</p>
          <h2>
            O próximo passo para
            <br />o seu ambiente.
          </h2>
          <p>
            Precisa de instalação, manutenção ou uma peça?
            <br />
            Conte para a CM Ar-Condicionado.
          </p>
        </div>
        <WhatsAppLink className="button green">
          Falar pelo WhatsApp
          <ArrowUpRight size={20} />
        </WhatsAppLink>
      </div>
    </section>
  );
}

import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { whatsapp } from "../../lib/whatsapp";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div>
            <Link to="/" className="footer-brand">
              <img
                src="/logo-cm-arcondicionado.webp"
                alt="CM Ar-Condicionado"
                width="960"
                height="409"
                className="object-contain"
                loading="lazy"
              />
            </Link>
            <p>
              Climatização com atenção
              <br />a cada detalhe.
            </p>
          </div>
          <div>
            <h3>Explore</h3>
            <Link to="/">Início</Link>
            <Link to="/#servicos">Serviços</Link>
            <Link to="/#sobre">Sobre a CM</Link>
            <Link to="/trabalhos">Trabalhos realizados</Link>
            <Link to="/pecas">Peças e componentes</Link>
          </div>
          <div>
            <h3>Soluções</h3>
            <Link to="/#servicos">Instalação</Link>
            <Link to="/#servicos">Manutenção preventiva</Link>
            <Link to="/#servicos">Manutenção corretiva</Link>
            <Link to="/#servicos">Conserto</Link>
            <Link to="/#servicos">Chiller industrial</Link>
            <Link to="/#servicos">Hospitalar, sala limpa e UTI</Link>
          </div>
          <div>
            <h3>Contato direto</h3>
            <a
              className="footer-phone"
              href={whatsapp()}
              target="_blank"
              rel="noopener noreferrer"
            >
              (62) 99352-8692 <ArrowUpRight size={18} />
            </a>
            <p>
              Converse sobre o seu equipamento
              <br />e a sua necessidade pelo WhatsApp.
            </p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} CM Ar-Condicionado.</p>
          <a
            href="https://smartlocal.com.br"
            target="_blank"
            rel="noopener noreferrer"
          >
            Desenvolvido por Douglas Borges - Smart Local
          </a>
        </div>
      </div>
    </footer>
  );
}

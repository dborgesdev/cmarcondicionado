import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import { WhatsAppLink } from "../ui/WhatsApp";
import Airflow from "../ui/Airflow";
export default function About() {
  return (
    <section id="sobre" className="about">
      <div className="about-panorama">
        <img
          src="/v2-sobre.webp"
          alt="Composição conceitual de arquitetura e sistemas de climatização"
          width="1536"
          height="1024"
          loading="lazy"
        />
        <Airflow className="about-flow" />
        <div className="container about-statement">
          <p className="eyebrow light">CM AR-CONDICIONADO</p>
          <h2>
            Conforto se sente.
            <br />
            <em>Cuidado se percebe.</em>
          </h2>
          <span className="about-coordinate">
            <ArrowDownRight size={36} /> DO EQUIPAMENTO
            <br />
            AO SEU AMBIENTE.
          </span>
        </div>
      </div>
      <div className="container about-editorial">
        <div className="about-signature">
          <span className="technical-rule" />
          <p>
            CLIMATIZAÇÃO
            <br />
            COM ATENÇÃO
            <br />A CADA DETALHE.
          </p>
        </div>
        <div className="about-panel">
          <p className="eyebrow">O QUE NOS MOVE</p>
          <h3>
            Entender a necessidade.
            <br />
            Cuidar de cada etapa.
          </h3>
          <p>
            A CM Ar-Condicionado atua com instalação, manutenção e conserto de
            sistemas de climatização, além da consulta de peças e componentes.
          </p>
          <p>
            Do ambiente residencial e comercial aos sistemas industriais e
            espaços de requisitos específicos, a conversa começa pelo seu
            equipamento e pelo que você precisa.
          </p>
          <WhatsAppLink className="text-link">
            Converse com a CM
            <ArrowUpRight size={20} />
          </WhatsAppLink>
        </div>
      </div>
    </section>
  );
}

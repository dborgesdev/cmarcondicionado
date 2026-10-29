import { useState } from "react";
import { ArrowUpRight, ClipboardList } from "lucide-react";
import { services } from "../../data/services";
import { useSurfaceMotion } from "../../hooks/useSurfaceMotion";
import Modal from "../ui/Modal";
import { WhatsAppLink } from "../ui/WhatsApp";
function ServiceCard({
  service,
  onOpen,
}: {
  service: (typeof services)[number];
  onOpen: () => void;
}) {
  const motion = useSurfaceMotion();
  return (
    <button
      {...motion}
      className={`service-card service-${service.id}`}
      onClick={onOpen}
    >
      <img
        className="service-photo"
        src={service.image}
        alt=""
        width="900"
        height="700"
        loading="lazy"
      />
      <span className="service-light" aria-hidden="true" />
      <span className="service-icon">
        <service.icon size={25} strokeWidth={1.5} />
      </span>
      <span className="service-body">
        <span className="service-subtitle">{service.subtitle}</span>
        <span className="service-title" role="heading" aria-level={3}>
          {service.name}
        </span>
        <span className="service-description">{service.summary}</span>
        <span className="service-more">
          Conhecer serviço
          <ArrowUpRight size={21} />
        </span>
      </span>
    </button>
  );
}
export default function Services() {
  const [selected, setSelected] = useState<(typeof services)[number] | null>(
    null,
  );
  return (
    <section id="servicos" className="section services">
      <div className="container">
        <div className="services-intro">
          <div>
            <p className="eyebrow">PRECISÃO EM CADA ETAPA</p>
            <h2>
              O seu ambiente.
              <br />
              <em>A solução certa.</em>
            </h2>
          </div>
          <div className="services-lead">
            <span className="technical-rule" aria-hidden="true" />
            <p>
              Da instalação aos cuidados com o equipamento. Conheça as
              possibilidades para a sua casa, seu negócio ou uma necessidade
              específica.
            </p>
            <span className="section-index">SERVIÇOS / CM AR-CONDICIONADO</span>
          </div>
        </div>
        <div className="services-grid">
          {services.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onOpen={() => setSelected(service)}
            />
          ))}
        </div>
      </div>
      {selected && (
        <Modal
          title={selected.title}
          onClose={() => setSelected(null)}
          image={selected.image}
          eyebrow={selected.name}
        >
          <p className="modal-copy">{selected.text}</p>
          <div className="info-box">
            <ClipboardList size={25} />
            <div>
              <strong>Uma conversa com as informações certas.</strong>
              <p>{selected.support}</p>
            </div>
          </div>
          <WhatsAppLink message={selected.message}>
            {selected.cta}
            <ArrowUpRight size={18} />
          </WhatsAppLink>
        </Modal>
      )}
    </section>
  );
}

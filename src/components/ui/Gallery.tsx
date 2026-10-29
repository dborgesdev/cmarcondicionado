import { useState } from "react";
import { ArrowLeft, ArrowRight, Expand, ImageOff } from "lucide-react";
import type { Photo } from "../../types";
import Modal from "./Modal";
export function ResponsiveImage({
  photo,
  alt,
  priority = false,
  className = "",
}: {
  photo?: Photo;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (!photo || failed)
    return (
      <div className={`image-missing ${className}`}>
        <ImageOff aria-hidden="true" />
        <span>Imagem não disponível</span>
      </div>
    );
  return (
    <img
      className={className}
      src={photo.preview || photo.url}
      srcSet={photo.srcSet || undefined}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      alt={photo.alt || alt}
      width={photo.width}
      height={photo.height}
      loading={priority ? "eager" : "lazy"}
      fetchPriority={priority ? "high" : "auto"}
      onError={() => setFailed(true)}
    />
  );
}
export default function Gallery({
  photos,
  name,
}: {
  photos: Photo[];
  name: string;
}) {
  const [selected, setSelected] = useState(0);
  const [open, setOpen] = useState(false);
  if (!photos.length) return <ResponsiveImage alt={name} />;
  const move = (delta: number) =>
    setSelected((n) => (n + delta + photos.length) % photos.length);
  return (
    <div className="gallery">
      <button
        className="gallery-main"
        onClick={() => setOpen(true)}
        aria-label={`Ampliar imagem ${selected + 1} de ${name}`}
      >
        <ResponsiveImage
          key={photos[selected].url}
          photo={photos[selected]}
          alt={`${name} — foto ${selected + 1}`}
          priority
        />
        <span>
          <Expand size={18} /> Ampliar
        </span>
      </button>
      {photos.length > 1 && (
        <div className="thumbnails">
          {photos.map((photo, i) => (
            <button
              key={photo.url}
              onClick={() => setSelected(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-pressed={selected === i}
            >
              <ResponsiveImage
                photo={photo}
                alt={`${name} — miniatura ${i + 1}`}
              />
            </button>
          ))}
        </div>
      )}
      {open && (
        <Modal
          title={`${name} · ${selected + 1}/${photos.length}`}
          onClose={() => setOpen(false)}
          wide
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") {
              e.preventDefault();
              move(1);
            }
            if (e.key === "ArrowLeft") {
              e.preventDefault();
              move(-1);
            }
          }}
        >
          <div className="lightbox">
            <img
              src={photos[selected].url}
              alt={photos[selected].alt || `${name} — foto ${selected + 1}`}
            />
            {photos.length > 1 && (
              <div className="gallery-controls">
                <button
                  className="button outline"
                  aria-label="Foto anterior"
                  onClick={() => move(-1)}
                >
                  <ArrowLeft />
                </button>
                <span aria-live="polite">
                  {selected + 1} / {photos.length}
                </span>
                <button
                  className="button outline"
                  aria-label="Próxima foto"
                  onClick={() => move(1)}
                >
                  <ArrowRight />
                </button>
              </div>
            )}
          </div>
        </Modal>
      )}
    </div>
  );
}

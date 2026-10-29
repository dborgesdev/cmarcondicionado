import {
  useEffect,
  useRef,
  type ReactNode,
  type KeyboardEventHandler,
} from "react";
import { X } from "lucide-react";
export default function Modal({
  title,
  children,
  onClose,
  wide = false,
  onKeyDown,
  image,
  eyebrow,
}: {
  title: string;
  children: ReactNode;
  onClose: () => void;
  wide?: boolean;
  onKeyDown?: KeyboardEventHandler<HTMLDialogElement>;
  image?: string;
  eyebrow?: string;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = ref.current!;
    const previous = document.activeElement as HTMLElement;
    dialog.showModal();
    document.body.style.overflow = "hidden";
    return () => {
      dialog.close();
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, []);
  return (
    <dialog
      ref={ref}
      className={`modal ${wide ? "modal-wide" : ""} ${image ? "service-modal" : ""}`}
      aria-labelledby="dialog-title"
      aria-modal="true"
      onKeyDown={(event) => {
        onKeyDown?.(event);
        if (event.defaultPrevented || event.key !== "Tab") return;
        const elements = Array.from(
          event.currentTarget.querySelectorAll<HTMLElement>(
            'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
          ),
        ).filter((element) => element.getClientRects().length > 0);
        const first = elements[0];
        const last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first?.focus();
        }
      }}
      onCancel={(e) => {
        e.preventDefault();
        onClose();
      }}
      onClick={(e) => {
        if (e.target === ref.current) onClose();
      }}
    >
      <div className="modal-inner">
        <button
          className="icon-button close"
          onClick={onClose}
          aria-label="Fechar janela"
          autoFocus
        >
          <X />
        </button>
        {image ? (
          <div className="modal-masthead">
            <img src={image} alt="" width="900" height="600" />
            <div>
              <p className="eyebrow light">{eyebrow}</p>
              <h2 id="dialog-title">{title}</h2>
            </div>
          </div>
        ) : (
          <h2 id="dialog-title">{title}</h2>
        )}
        <div className="modal-content">{children}</div>
      </div>
    </dialog>
  );
}

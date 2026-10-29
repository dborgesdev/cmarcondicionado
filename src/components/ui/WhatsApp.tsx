import type { ReactNode } from "react";
import { whatsapp } from "../../lib/whatsapp";
export function WhatsAppIcon({ size = 22 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M20.52 3.48A11.85 11.85 0 0 0 12.05 0C5.5 0 .17 5.32.17 11.87c0 2.09.55 4.13 1.59 5.93L.07 24l6.35-1.66a11.9 11.9 0 0 0 5.63 1.43h.01C18.6 23.77 23.94 18.44 23.94 11.9c0-3.18-1.22-6.16-3.42-8.42ZM12.06 21.77a9.8 9.8 0 0 1-5.02-1.37l-.36-.21-3.77.99 1-3.68-.24-.38a9.83 9.83 0 0 1-1.5-5.25c0-5.44 4.44-9.87 9.89-9.87a9.8 9.8 0 0 1 6.98 2.89 9.8 9.8 0 0 1 2.9 6.99c0 5.45-4.44 9.89-9.88 9.89Zm5.42-7.4c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.48-1.75-1.65-2.05-.17-.3-.02-.46.13-.61.13-.13.3-.35.44-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.61-.92-2.21-.24-.58-.48-.5-.67-.51h-.57c-.2 0-.52.07-.79.37s-1.04 1.02-1.04 2.48 1.06 2.87 1.21 3.07c.15.2 2.09 3.19 5.06 4.47.71.31 1.26.49 1.69.63.71.23 1.36.2 1.87.12.57-.09 1.76-.72 2.01-1.41.25-.7.25-1.29.17-1.42-.07-.12-.27-.2-.57-.35Z" />
    </svg>
  );
}
export function WhatsAppLink({
  children,
  message,
  className = "button",
  label,
}: {
  children: ReactNode;
  message?: string;
  className?: string;
  label?: string;
}) {
  return (
    <a
      className={className}
      href={whatsapp(message)}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
    >
      <WhatsAppIcon />
      {children}
    </a>
  );
}

import { useEffect, useRef, type PointerEvent } from "react";
// Only transforms and CSS variables change; no React render per pointer movement.
export function useSurfaceMotion() {
  const frame = useRef(0);
  useEffect(() => () => cancelAnimationFrame(frame.current), []);
  function move(event: PointerEvent<HTMLElement>) {
    if (
      event.pointerType !== "mouse" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return;
    const el = event.currentTarget;
    const rect = el.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    cancelAnimationFrame(frame.current);
    frame.current = requestAnimationFrame(() => {
      el.style.setProperty("--rx", `${(0.5 - y) * 5}deg`);
      el.style.setProperty("--ry", `${(x - 0.5) * 5}deg`);
      el.style.setProperty("--px", `${(x - 0.5) * -12}px`);
      el.style.setProperty("--py", `${(y - 0.5) * -12}px`);
      el.style.setProperty("--light-x", `${x * 100}%`);
      el.style.setProperty("--light-y", `${y * 100}%`);
    });
  }
  function reset(event: PointerEvent<HTMLElement>) {
    cancelAnimationFrame(frame.current);
    for (const key of [
      "--rx",
      "--ry",
      "--px",
      "--py",
      "--light-x",
      "--light-y",
    ])
      event.currentTarget.style.removeProperty(key);
  }
  return { onPointerMove: move, onPointerLeave: reset };
}

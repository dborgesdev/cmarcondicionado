import type { CSSProperties } from "react";
export default function Airflow({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`airflow ${className}`}
      viewBox="0 0 1400 600"
      fill="none"
      aria-hidden="true"
      preserveAspectRatio="none"
    >
      <defs>
        <linearGradient id={`air-${className}`}>
          <stop stopColor="#43BCE8" stopOpacity="0" />
          <stop offset=".5" stopColor="#43BCE8" stopOpacity=".7" />
          <stop offset="1" stopColor="#43BCE8" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[0, 1, 2, 3].map((i) => (
        <path
          key={i}
          d={`M-100 ${450 + i * 30} C400 ${-150 + i * 30},700 ${850 + i * 20},1500 ${100 + i * 25}`}
          stroke={`url(#air-${className})`}
          strokeWidth={i === 1 ? 2 : 1}
          style={{ "--flow-delay": `${i * -0.8}s` } as CSSProperties}
        />
      ))}
    </svg>
  );
}

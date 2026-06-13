// FILE: src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
  elevated?: boolean;
}

export default function Card({ children, className = "", noPad = false, elevated = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] transition-all duration-200 ${
        elevated ? "shadow-elevated hover:shadow-elevated-hover hover:-translate-y-0.5" : ""
      } ${noPad ? "" : "p-5"} ${className}`}
    >
      {children}
    </div>
  );
}

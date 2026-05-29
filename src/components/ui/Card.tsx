// FILE: src/components/ui/Card.tsx
import React from "react";

interface CardProps {
  children: React.ReactNode;
  className?: string;
  noPad?: boolean;
}

export default function Card({ children, className = "", noPad = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] ${noPad ? "" : "p-5"} ${className}`}
    >
      {children}
    </div>
  );
}

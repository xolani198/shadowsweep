import React from "react";

export function LegalDoc({
  title,
  updated,
  intro,
  children,
}: {
  title: string;
  updated: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <article>
      <p className="font-mono-data text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-accent)]">
        Legal
      </p>
      <h1 className="mt-2 text-[32px] font-extrabold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h1>
      <p className="mt-2 text-[12.5px] text-[var(--color-text-muted)]">Last updated: {updated}</p>
      {intro && (
        <p className="mt-6 text-[14px] leading-relaxed text-[var(--color-text-secondary)]">{intro}</p>
      )}
      <div className="mt-8 space-y-7">{children}</div>
    </article>
  );
}

export function LegalSection({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-[16px] font-bold text-[var(--color-text-primary)]">{heading}</h2>
      <div className="mt-2 space-y-3 text-[13.5px] leading-relaxed text-[var(--color-text-secondary)]">
        {children}
      </div>
    </section>
  );
}

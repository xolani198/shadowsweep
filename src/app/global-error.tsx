"use client";

import { useEffect } from "react";

// global-error replaces the root layout, so it must render its own <html>/<body>
// and cannot depend on the theme CSS variables. Keep it self-contained.
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Fatal application error:", error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 16,
          background: "#FFFFFF",
          color: "#0B1F3A",
          fontFamily: "Inter, ui-sans-serif, system-ui, sans-serif",
          textAlign: "center",
          padding: 24,
        }}
      >
        <h1 style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em", margin: 0 }}>
          ShadowSweep hit a fatal error
        </h1>
        <p style={{ fontSize: 14, color: "#3D5573", maxWidth: 420, lineHeight: 1.6, margin: 0 }}>
          The application failed to load. Please retry — if this keeps happening, contact support.
        </p>
        <button
          onClick={reset}
          style={{
            marginTop: 8,
            border: "none",
            borderRadius: 8,
            background: "#1D63ED",
            color: "#FFFFFF",
            fontSize: 13,
            fontWeight: 600,
            padding: "10px 20px",
            cursor: "pointer",
          }}
        >
          Try again
        </button>
      </body>
    </html>
  );
}

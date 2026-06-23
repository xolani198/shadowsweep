import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "ShadowSweep — Discover & Offboard Shadow IT";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #050F1F 0%, #0D2547 60%, #122E59 100%)",
          padding: "64px 72px",
          fontFamily: "sans-serif",
        }}
      >
        {/* Brand row */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              display: "flex",
              width: 56,
              height: 56,
              borderRadius: 14,
              background: "#0B1F3A",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <div style={{ display: "flex", width: 26, height: 18, background: "#2D6BEF", transform: "skewX(-18deg)" }} />
          </div>
          <div style={{ display: "flex", color: "white", fontSize: 30, fontWeight: 800, letterSpacing: -0.5 }}>
            ShadowSweep
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", color: "white", fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Eliminate Shadow IT.
          </div>
          <div style={{ display: "flex", color: "#5E95F5", fontSize: 70, fontWeight: 800, lineHeight: 1.05, letterSpacing: -1.5 }}>
            Reclaim your SaaS stack.
          </div>
          <div style={{ display: "flex", color: "#A4B6CE", fontSize: 27, marginTop: 24, maxWidth: 880, lineHeight: 1.4 }}>
            Discover unauthorized apps, quantify wasted spend, and offboard departing employees in one click.
          </div>
        </div>

        {/* Proof row */}
        <div style={{ display: "flex", gap: 56 }}>
          {[
            { v: "500+", l: "IT teams protected" },
            { v: "$4.2M", l: "Shadow spend recovered" },
            { v: "12 min", l: "Avg. discovery time" },
          ].map((s) => (
            <div key={s.l} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ display: "flex", color: "white", fontSize: 38, fontWeight: 700 }}>{s.v}</div>
              <div style={{ display: "flex", color: "#8CA3C4", fontSize: 20 }}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    ),
    { ...size }
  );
}

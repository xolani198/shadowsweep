// Central runtime configuration derived from environment variables.
//
// DEMO_MODE drives whether the app serves the bundled demo dataset (so the
// marketing demo at /dashboard works out of the box) or behaves as a real,
// empty tenant wired for live integrations. It defaults to ON; set
// NEXT_PUBLIC_DEMO_MODE=false on a production tenant to turn it off.
//
// NEXT_PUBLIC_ values are inlined into the client bundle at build time, so this
// is a deploy-time decision — never put secrets behind a NEXT_PUBLIC_ name.

export const DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE !== "false";

// Absolute site URL, used for canonical/OG metadata and absolute links.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL || "https://shadowsweep-rho.vercel.app"
).replace(/\/$/, "");

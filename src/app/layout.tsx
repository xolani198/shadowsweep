// FILE: src/app/layout.tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { ToastProvider } from "@/components/ui/Toast";
import { SITE_URL } from "@/lib/config";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-jetbrains",
  display: "swap",
});

const DESCRIPTION =
  "ShadowSweep discovers unauthorized SaaS across your org, quantifies wasted spend, and revokes access for departing employees in one click. GDPR and CCPA compliance is built in.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShadowSweep: Discover and Offboard Shadow IT",
    template: "%s · ShadowSweep",
  },
  description: DESCRIPTION,
  applicationName: "ShadowSweep",
  authors: [{ name: "ShadowSweep" }],
  keywords: [
    "shadow IT",
    "SaaS discovery",
    "SaaS management",
    "offboarding",
    "security posture",
    "OAuth audit",
    "GDPR",
    "CCPA",
    "IT security",
  ],
  openGraph: {
    type: "website",
    siteName: "ShadowSweep",
    title: "ShadowSweep: Discover and Offboard Shadow IT",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowSweep: Discover and Offboard Shadow IT",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

// Applies the saved (or system) theme before first paint, so the page never
// flashes the wrong colours and React never has to write storage during mount.
// This is a fixed string with no interpolation and no user input.
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('ss-theme');if(t!=='dark'&&t!=='light'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}if(t==='dark'){document.documentElement.classList.add('dark');}}catch(e){}})();`;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOTSTRAP }} />
      </head>
      <body>
        {/* Keyboard users can jump past the navigation. Hidden until focused. */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-lg focus:bg-[var(--color-accent)] focus:px-4 focus:py-2 focus:text-[13px] focus:font-semibold focus:text-white"
        >
          Skip to main content
        </a>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

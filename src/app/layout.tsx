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
  "ShadowSweep discovers unauthorized SaaS across your org, quantifies wasted spend, and revokes access for departing employees in one click — with GDPR/CCPA compliance built in.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "ShadowSweep — Discover & Offboard Shadow IT",
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
    title: "ShadowSweep — Discover & Offboard Shadow IT",
    description: DESCRIPTION,
    url: SITE_URL,
  },
  twitter: {
    card: "summary_large_image",
    title: "ShadowSweep — Discover & Offboard Shadow IT",
    description: DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body>
        <ThemeProvider>
          <ToastProvider>{children}</ToastProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

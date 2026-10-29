import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import { PORTFOLIO } from "@/data/portfolio";
import "./globals.css";

const sans = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono", display: "swap" });

const { profile } = PORTFOLIO;

export const metadata: Metadata = {
  title: `${profile.name} · DevOps Engineer`,
  description: `${profile.name}, ${profile.role} at ${profile.company}. CI/CD pipelines, containers, AWS and Azure infrastructure, and production monitoring.`,
  icons: { icon: "/favicon.svg" },
  openGraph: {
    title: `${profile.name} · DevOps Engineer`,
    description: profile.headline,
    type: "profile",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f6f8fb" },
    { media: "(prefers-color-scheme: dark)", color: "#080b10" },
  ],
};

// Light is the default; a saved dark preference is applied before first paint.
// `?theme=dark|light` overrides it, which is handy for sharing a specific look.
const themeInit = `try{var q=new URLSearchParams(location.search).get("theme");var t=q||localStorage.getItem("theme");if(t==="dark"||t==="light")document.documentElement.dataset.theme=t}catch(e){}`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: profile.name,
  jobTitle: profile.role,
  worksFor: { "@type": "Organization", name: profile.company },
  address: { "@type": "PostalAddress", addressLocality: "Ghaziabad", addressRegion: "UP", addressCountry: "IN" },
  email: `mailto:${profile.email}`,
  alumniOf: { "@type": "CollegeOrUniversity", name: "Lovely Professional University" },
  sameAs: [profile.linkedin, profile.github],
  knowsAbout: ["DevOps", "CI/CD", "GitHub Actions", "Docker", "AWS", "Azure", "NGINX", "Prometheus", "Grafana", "Linux"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="light" className={`${sans.variable} ${display.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
      </head>
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <a className="skip" href="#main">
          Skip to content
        </a>
        {children}
      </body>
    </html>
  );
}

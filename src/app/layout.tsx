import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import { getSiteContent } from "@/lib/content";
import { GlobalChrome } from "@/components/site/GlobalChrome";
import type { ThemeData, SettingsData } from "@/lib/types";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-sora",
  display: "swap",
});

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const content = await getSiteContent();
  const seo = (content.seo ?? {}) as Record<string, unknown>;
  const settings = (content.settings ?? {}) as Record<string, unknown>;
  const title =
    (seo.title as string) ||
    `${settings.brandName ?? "Studio"} — YouTube Thumbnail Designer`;
  const description =
    (seo.description as string) ??
    "Premium YouTube thumbnail design engineered for maximum CTR.";
  const ogImage = seo.ogImage as string | undefined;

  return {
    metadataBase: process.env.NEXTAUTH_URL
      ? new URL(process.env.NEXTAUTH_URL)
      : undefined,
    title,
    description,
    keywords: (seo.keywords as string[]) ?? [],
    openGraph: {
      title,
      description,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: ogImage ? [ogImage] : undefined,
    },
    themeColor: "#08080a",
  };
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const content = await getSiteContent();
  const theme = (content.theme ?? {}) as Partial<ThemeData>;
  const settings = (content.settings ?? {}) as Partial<SettingsData>;

  const vars = {
    ["--c-primary" as string]: theme.primary ?? "#c1121f",
    ["--c-primary-soft" as string]: theme.primarySoft ?? "#e11d2e",
    ["--c-accent" as string]: theme.accent ?? "#ff5a6a",
    ["--c-primary-glow" as string]: theme.primaryGlow ?? "rgba(193,18,31,0.5)",
    ["--c-bg" as string]: theme.background ?? "#08080a",
    ["--c-surface" as string]: theme.surface ?? "#101015",
    ["--c-surface-light" as string]: theme.surfaceLight ?? "#17171d",
    ["--c-ink" as string]: theme.text ?? "#f6f6f8",
    ["--c-muted" as string]: theme.muted ?? "#9a9aa6",
  } as React.CSSProperties;

  return (
    <html lang="en" className={`${inter.variable} ${sora.variable}`}>
      <body
        style={vars}
        className="bg-bg font-sans text-ink antialiased selection:bg-primary"
      >
        <GlobalChrome
          brand={settings.brandName ?? "Studio"}
          initials={settings.brandInitials ?? "AR"}
          cursor={settings.customCursor ?? true}
          loader={settings.loader ?? true}
        >
          {children}
        </GlobalChrome>
      </body>
    </html>
  );
}

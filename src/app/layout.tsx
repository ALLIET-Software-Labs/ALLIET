import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { jsonLd, siteGraph, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/seo";
import { serviceContent } from "@/data/services";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    template: `%s | ${SITE_NAME}`,
    default: `${SITE_NAME} | AI Systems, Web Products & Automation`,
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  // Pages set their own canonical URL, Open Graph and X metadata via pageMetadata();
  // these are the fallbacks. The share image comes from app/opengraph-image.tsx.
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: SITE_NAME,
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_NAME,
    description: SITE_DESCRIPTION,
  },
  robots: {
    index: true,
    follow: true,
  },
};

import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import Chatbot from "@/components/Chatbot";

// One definition of the ALLIET entity for every page (see siteGraph in src/lib/seo.ts).
const entityGraph = siteGraph(
  Object.entries(serviceContent).map(([slug, s]) => ({ slug, title: s.title, serviceType: s.serviceType })),
  Object.values(serviceContent).flatMap((s) => s.topics.map((t) => t.heading)),
);

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased h-full`}>
      <body className="min-h-full flex flex-col bg-background text-primary selection:bg-accent selection:text-surface font-sans cursor-none md:cursor-auto">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(entityGraph)} />
        <Cursor />
        <Navigation />
        <div className="pt-20 flex-grow flex flex-col">
          {children}
        </div>
        <Footer />
        <Chatbot />
      </body>
    </html>
  );
}

import type { Metadata } from "next";
import { pageMetadata, SITE_NAME } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Work: Case Studies & Projects",
    description: "Client work and our own projects: a multi-agent AI planning system, an offline-first PWA, an AI-driven narrative game, a subscription API and a company website.",
    path: "/work",
  }),
  // A plain-string title in a layout would drop the site-wide "%s | ALLIET Software Labs"
  // template for nested pages (e.g. /work/[project]), so re-declare it here.
  title: { default: "Work: Case Studies & Projects", template: `%s | ${SITE_NAME}` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

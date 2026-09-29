import type { Metadata } from "next";
import { pageMetadata, SITE_NAME } from "@/lib/seo";

// The page itself is a client component, so its metadata lives here.
export const metadata: Metadata = {
  ...pageMetadata({
    title: "Contact ALLIET Software Labs",
    absoluteTitle: true,
    description: "Tell us about your project: a company website, a web product, an AI feature or an automation. Email contact@alliet.company or book a 15-minute call.",
    path: "/contact",
  }),
  // A plain-string title in a layout would drop the site-wide "%s | ALLIET Software Labs"
  // template for nested pages (e.g. /work/[project]), so re-declare it here.
  title: { absolute: "Contact ALLIET Software Labs", template: `%s | ${SITE_NAME}` },
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return children;
}

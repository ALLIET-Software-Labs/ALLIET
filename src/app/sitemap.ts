import type { MetadataRoute } from "next";
import { projects } from "@/data/projects";
import { SITE_URL } from "@/lib/seo";
import { serviceSlugs } from "@/data/services";
import { insights } from "@/data/insights";

// lastModified only where a real date exists (article publication dates); a made-up date is worse than none.
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ["", "/about", "/work", "/services", "/products", "/insights", "/contact", "/privacy-policy", "/terms"];

  return [
    ...staticRoutes.map((path) => ({ url: `${SITE_URL}${path}` })),
    ...projects.map((p) => ({ url: `${SITE_URL}/work/${p.id}` })),
    ...serviceSlugs.map((slug) => ({ url: `${SITE_URL}/services/${slug}` })),
    ...insights.map((a) => ({ url: `${SITE_URL}/insights/${a.slug}`, lastModified: a.published })),
  ];
}

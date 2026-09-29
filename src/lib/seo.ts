import type { Metadata } from "next";

export const SITE_URL = "https://alliet.company";
export const SITE_NAME = "ALLIET Software Labs";
export const SITE_DESCRIPTION =
  "ALLIET Software Labs is an independent software lab in Hyderabad, India, building AI systems, web products and automation for clients, and products of its own.";

// Published on the site (footer / contact page); used for structured data.
export const CONTACT_EMAIL = "contact@alliet.company";
export const SOCIAL_PROFILES = [
  "https://github.com/ALLIET-Software-Labs",
  "https://x.com/allietlabs",
  "https://www.linkedin.com/company/alliet-software-labs",
  "https://www.instagram.com/allietsoftwarelabs/",
];

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of applying the "%s | ALLIET Software Labs" template. */
  absoluteTitle?: boolean;
  /** Page-specific share image; defaults to the site-wide generated image. */
  image?: { url: string; alt: string };
};

// Metadata objects are merged shallowly, so a page that sets `openGraph` replaces the
// root layout's version entirely. Building every page's metadata here keeps canonical URLs,
// Open Graph and X fields complete and consistent.
export function pageMetadata({ title, description, path, absoluteTitle, image }: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${SITE_NAME}`;
  const images = image
    ? [{ url: image.url, alt: image.alt }]
    : [{ url: "/opengraph-image", width: 1200, height: 630, alt: SITE_NAME }];

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      siteName: SITE_NAME,
      url: path,
      title: fullTitle,
      description,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: images.map((i) => i.url),
    },
  };
}

/** Trim to a meta-description-friendly length on a sentence or word boundary. */
export function summarize(text: string, max = 160) {
  if (text.length <= max) return text;
  const sentenceEnd = text.lastIndexOf(". ", max);
  if (sentenceEnd > 80) return text.slice(0, sentenceEnd + 1);
  return text.slice(0, text.lastIndexOf(" ", max - 1)) + "…";
}

/** Serialize JSON-LD safely for a <script> tag (per the Next.js JSON-LD guide). */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

/** BreadcrumbList starting from the homepage. Pass the trail below Home. */
export function breadcrumbs(items: { name: string; path: string }[]) {
  const trail = [{ name: "Home", path: "" }, ...items];
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export const ORGANIZATION_ID = `${SITE_URL}/#organization`;
export const WEBSITE_ID = `${SITE_URL}/#website`;

/**
 * Site-wide entity graph, rendered once in the root layout so every page carries the same
 * definition of the organization and website. Only facts published on the site are used:
 * name and wordmark, URL, official logo, city, description, contact email, the services on
 * /services, and the social profiles linked in the footer. No street address, phone, founders,
 * ratings or awards are published, so none are claimed.
 */
export function siteGraph(services: { slug: string; title: string; serviceType: string }[], topics: string[]) {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": ORGANIZATION_ID,
        name: SITE_NAME,
        alternateName: "ALLIET",
        url: SITE_URL,
        logo: `${SITE_URL}/alliet-logo.png`,
        description: SITE_DESCRIPTION,
        email: CONTACT_EMAIL,
        address: {
          "@type": "PostalAddress",
          addressLocality: "Hyderabad",
          addressRegion: "Telangana",
          addressCountry: "IN",
        },
        sameAs: SOCIAL_PROFILES,
        knowsAbout: topics,
        hasOfferCatalog: {
          "@type": "OfferCatalog",
          name: "Services",
          url: `${SITE_URL}/services`,
          itemListElement: services.map((s) => ({
            "@type": "Offer",
            itemOffered: {
              "@type": "Service",
              "@id": `${SITE_URL}/services/${s.slug}#service`,
              name: s.title,
              serviceType: s.serviceType,
              url: `${SITE_URL}/services/${s.slug}`,
            },
          })),
        },
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: SITE_NAME,
        alternateName: "ALLIET",
        url: SITE_URL,
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

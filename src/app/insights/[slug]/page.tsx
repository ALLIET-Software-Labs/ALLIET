import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { insights } from "@/data/insights";
import { projects } from "@/data/projects";
import { serviceContent } from "@/data/services";
import { breadcrumbs, jsonLd, ORGANIZATION_ID, pageMetadata, SITE_NAME, SITE_URL } from "@/lib/seo";

// Articles are known at build time and prerendered; unknown slugs hit notFound() below.

export function generateStaticParams() {
  return insights.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = insights.find((a) => a.slug === slug);
  if (!article) return { title: "Article Not Found" };
  const meta = pageMetadata({ title: article.seoTitle, description: article.description, path: `/insights/${article.slug}` });
  return {
    ...meta,
    openGraph: { ...meta.openGraph, type: "article", publishedTime: article.published, authors: [SITE_NAME] },
  };
}

export default async function InsightArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = insights.find((a) => a.slug === slug);
  if (!article) notFound();

  const project = article.relatedProject ? projects.find((p) => p.id === article.relatedProject) : undefined;
  const service = article.relatedService ? serviceContent[article.relatedService] : undefined;
  const publishedLabel = new Date(`${article.published}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    datePublished: article.published,
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
    ...(article.relatedProject ? { about: { "@id": `${SITE_URL}/work/${article.relatedProject}#work` } } : {}),
    mainEntityOfPage: `${SITE_URL}/insights/${article.slug}`,
    image: `${SITE_URL}/opengraph-image`,
  };

  return (
    <div className="flex flex-col min-h-screen pt-16 pb-24">
      <main className="flex-grow container mx-auto px-6 max-w-3xl">
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleSchema)} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(breadcrumbs([
            { name: "Insights", path: "/insights" },
            { name: article.title, path: `/insights/${article.slug}` },
          ]))}
        />
        <FadeIn>
          <Link href="/insights" className="text-text-secondary hover:text-primary transition-colors mb-16 inline-block" data-cursor="cta">
            ← Back to Insights
          </Link>
          <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">{article.category}</p>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-6 leading-[1.1]">{article.title}</h1>
          <p className="text-text-secondary mb-12">
            <time dateTime={article.published}>{publishedLabel}</time> · {SITE_NAME}
          </p>

          <article className="space-y-6 text-text-secondary leading-relaxed text-lg">
            {article.body.map((block, i) => {
              if (block.type === "h2") return <h2 key={i} className="text-2xl font-bold text-primary pt-6">{block.text}</h2>;
              if (block.type === "ul") return (
                <ul key={i} className="list-disc pl-6 space-y-2">
                  {block.items.map((item) => <li key={item}>{item}</li>)}
                </ul>
              );
              return <p key={i}>{block.text}</p>;
            })}
          </article>

          <aside className="mt-16 pt-8 border-t border-border space-y-3 text-text-secondary">
            {project && (
              <p>Case study: <Link href={`/work/${project.id}`} className="text-primary underline decoration-border underline-offset-4 hover:text-accent">{project.title}</Link></p>
            )}
            {service && article.relatedService && (
              <p>Related service: <Link href={`/services#${article.relatedService}`} className="text-primary underline decoration-border underline-offset-4 hover:text-accent">{service.title}</Link></p>
            )}
            <p>Working on something similar? <Link href="/contact" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">Tell us about it</Link>.</p>
          </aside>
        </FadeIn>
      </main>
    </div>
  );
}

import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { projects } from "@/data/projects";
import { breadcrumbs, jsonLd, ORGANIZATION_ID, pageMetadata, SITE_URL, summarize } from "@/lib/seo";
import { serviceContent } from "@/data/services";
import { insights } from "@/data/insights";

// Every case study is known at build time, so each one is prerendered as static HTML.
export function generateStaticParams() {
  return projects.map((p) => ({ project: p.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ project: string }> }): Promise<Metadata> {
  const { project } = await params;
  const projectData = projects.find(p => p.id === project);
  
  if (!projectData) {
    return { title: "Project Not Found" };
  }

  return pageMetadata({
    title: `${projectData.title} Case Study`,
    description: summarize(projectData.overview),
    path: `/work/${projectData.id}`,
    image: { url: projectData.img, alt: `${projectData.title} project visual` },
  });
}

export default async function ProjectPage({ params }: { params: Promise<{ project: string }> }) {
  const resolvedParams = await params;
  const { project } = resolvedParams;

  const projectData = projects.find(p => p.id === project);

  if (!projectData) {
    notFound();
  }

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd({
            "@context": "https://schema.org",
            "@type": "CreativeWork",
            "@id": `${SITE_URL}/work/${projectData.id}#work`,
            name: projectData.title,
            description: projectData.overview,
            url: `${SITE_URL}/work/${projectData.id}`,
            image: `${SITE_URL}${projectData.img}`,
            creator: { "@id": ORGANIZATION_ID },
            ...(projectData.year ? { dateCreated: projectData.year } : {}),
            ...(projectData.tech ? { keywords: projectData.tech } : {}),
            about: (projectData.services ?? []).map((slug) => ({ "@id": `${SITE_URL}/services/${slug}#service` })),
          })}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(breadcrumbs([
            { name: "Work", path: "/work" },
            { name: projectData.title, path: `/work/${projectData.id}` },
          ]))}
        />
        <FadeIn>
          <Link href="/work" className="text-text-secondary hover:text-primary transition-colors mb-16 inline-block" data-cursor="cta">
            ← Back to all work
          </Link>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8">
              <p className="text-sm uppercase tracking-widest text-text-secondary mb-4">Case Study</p>
              <h1 className="text-5xl font-bold tracking-tight text-primary mb-6">{projectData.title}</h1>
              <div className="flex gap-2 flex-wrap mb-12">
                 <span className="text-xs bg-surface border border-border px-2 py-1 rounded">{projectData.category}</span>
              </div>
            </div>
          </div>
        </FadeIn>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          <div className="lg:col-span-8">
            <FadeIn delay={100}>
              <div className="relative bg-surface-alt rounded-lg border border-border w-full aspect-video flex items-center justify-center overflow-hidden mb-16 shadow-lg" data-cursor="image">
                <Image src={projectData.img} alt={`${projectData.title} project visual`} fill sizes="(min-width: 1024px) 66vw, 100vw" className="object-cover" preload />
              </div>
            </FadeIn>

            <FadeIn delay={200}>
              <div className="space-y-16">
                 <section>
                   <h2 className="text-2xl font-bold mb-4">Overview</h2>
                   <p className="text-text-secondary leading-relaxed">{projectData.overview}</p>
                 </section>
                 
                 <section>
                   <h2 className="text-2xl font-bold mb-4">The Problem</h2>
                   <p className="text-text-secondary leading-relaxed">{projectData.problem}</p>
                 </section>

                 <section>
                   <h2 className="text-2xl font-bold mb-4">Our Approach</h2>
                   <p className="text-text-secondary leading-relaxed">{projectData.approach}</p>
                 </section>
                 
                 <section>
                   <h2 className="text-2xl font-bold mb-4">Architecture & Features</h2>
                   <p className="text-text-secondary leading-relaxed mb-8">{projectData.architecture}</p>
                 </section>
              </div>
            </FadeIn>
          </div>
          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-border pt-8 lg:pt-0 lg:pl-16">
             <FadeIn delay={300} className="sticky top-32 space-y-8">
                <div>
                  <h3 className="font-semibold mb-2">Role</h3>
                  <p className="text-sm text-text-secondary">{projectData.role}</p>
                </div>
                {projectData.services?.length > 0 && (
                <div>
                  <h3 className="font-semibold mb-2">Related services</h3>
                  <div className="flex flex-col gap-2">
                    {projectData.services.filter((slug) => Object.hasOwn(serviceContent, slug)).map((slug) => (
                      <Link key={slug} href={`/services#${slug}`} className="text-sm text-primary hover:text-accent underline decoration-border underline-offset-4" data-cursor="cta">{serviceContent[slug].title}</Link>
                    ))}
                    {insights.filter((a) => a.relatedProject === projectData.id).map((a) => (
                      <Link key={a.slug} href={`/insights/${a.slug}`} className="text-sm text-primary hover:text-accent underline decoration-border underline-offset-4" data-cursor="cta">Read: {a.title}</Link>
                    ))}
                  </div>
                </div>
                )}
                {projectData.tech && (
                <div>
                  <h3 className="font-semibold mb-2">Technology</h3>
                  <p className="text-sm text-text-secondary">{projectData.tech}</p>
                </div>
                )}
                {(projectData.live || projectData.github) && (
                <div>
                  <h3 className="font-semibold mb-2">Links</h3>
                  <div className="flex flex-col gap-2">
                    {projectData.live && (
                      <a href={projectData.live} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-accent underline decoration-border underline-offset-4" data-cursor="cta">Live Project ↗</a>
                    )}
                    {projectData.github && (
                      <a href={projectData.github} target="_blank" rel="noopener noreferrer" className="text-sm text-primary hover:text-accent underline decoration-border underline-offset-4" data-cursor="cta">GitHub Repository ↗</a>
                    )}
                  </div>
                </div>
                )}
             </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}

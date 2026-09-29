import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import FadeIn from "@/components/FadeIn";
import { serviceContent, serviceSlugs } from "@/data/services";
import { breadcrumbs, jsonLd, ORGANIZATION_ID, pageMetadata, SITE_URL } from "@/lib/seo";
import { projects } from "@/data/projects";
import { insights } from "@/data/insights";

// The four service pages are known at build time, so they are prerendered as static HTML.
export function generateStaticParams() {
  return serviceSlugs.map((service) => ({ service }));
}

export async function generateMetadata({ params }: { params: Promise<{ service: string }> }): Promise<Metadata> {
  const { service } = await params;
  if (!Object.hasOwn(serviceContent, service)) notFound();
  const data = serviceContent[service];
  return pageMetadata({
    title: data.seoTitle,
    description: data.seoDescription,
    path: `/services/${service}`,
  });
}

export default async function ServicePage({ params }: { params: Promise<{ service: string }> }) {
  const resolvedParams = await params;
  const { service } = resolvedParams;
  const name = service.replace("-", " ");
  // Only known services render; otherwise arbitrary slugs would be echoed into the page.
  if (!Object.hasOwn(serviceContent, service)) notFound();
  const data = serviceContent[service];
  const related = data.relatedWork
    .map((id) => projects.find((p) => p.id === id))
    .filter((p): p is (typeof projects)[number] => Boolean(p));
  const insight = data.relatedInsight ? insights.find((a) => a.slug === data.relatedInsight) : undefined;

  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    "@id": `${SITE_URL}/services/${service}#service`,
    name: data.title,
    serviceType: data.serviceType,
    description: data.seoDescription,
    url: `${SITE_URL}/services/${service}`,
    provider: { "@id": ORGANIZATION_ID },
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={jsonLd(breadcrumbs([
            { name: "Services", path: "/services" },
            { name: data.title, path: `/services/${service}` },
          ]))}
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(serviceSchema)} />
        <FadeIn>
          <Link href="/services" className="text-text-secondary hover:text-primary transition-colors mb-16 inline-block" data-cursor="cta">
            ← Back to all services
          </Link>
          <div className="max-w-3xl">
            <h1 className="text-5xl font-bold tracking-tight text-primary mb-8 capitalize">{data ? data.title : name}</h1>
            <p className="text-xl text-text-secondary mb-16 leading-relaxed">
              {data ? data.intro : `Tell us about the ${name} work you have in mind, and we'll tell you honestly how we would approach it.`}
            </p>
            
            <div className="space-y-16">
               <section className="bg-surface-alt p-8 rounded-lg border border-border">
                 <h2 className="text-xl font-bold mb-4">Problem → Approach</h2>
                 <p className="text-text-secondary">{data ? data.approach : "We start by understanding the problem and the systems already in place, build the riskiest part first, and keep the architecture simple enough to maintain."}</p>
               </section>
               
               <section>
                 <h2 className="text-2xl font-bold mb-6">What we build</h2>
                 <ul className="space-y-4 text-text-secondary list-disc pl-6">
                   {(data ? data.builds : [
                     "Software designed around your domain, not a template",
                     "Production systems with the risky parts proven first",
                     "Codebases the next engineer can read and extend",
                   ]).map((item) => (
                     <li key={item}>{item}</li>
                   ))}
                 </ul>
               </section>

               <section>
                 <h2 className="text-2xl font-bold mb-6">What this covers</h2>
                 <div className="space-y-10">
                   {data.topics.map((topic) => (
                     <div key={topic.heading}>
                       <h3 className="text-xl font-bold text-primary mb-3">{topic.heading}</h3>
                       <p className="text-text-secondary leading-relaxed">{topic.body}</p>
                     </div>
                   ))}
                 </div>
               </section>

               <section>
                 <h2 className="text-2xl font-bold mb-6">Technologies we use here</h2>
                 <div className="flex flex-wrap gap-2">
                   {data.tech.map((t) => (
                     <span key={t} className="text-[11px] border border-border px-2 py-1 rounded bg-surface-alt text-primary font-medium">{t}</span>
                   ))}
                 </div>
               </section>

               {related.length > 0 && (
                 <section>
                   <h2 className="text-2xl font-bold mb-6">Related work</h2>
                   <ul className="space-y-4">
                     {related.map((p) => (
                       <li key={p.id}>
                         <Link href={`/work/${p.id}`} className="group block border-t border-border pt-4" data-cursor="cta">
                           <span className="font-bold text-primary group-hover:text-accent transition-colors">{p.title} →</span>
                           <span className="block text-text-secondary text-sm mt-1">{p.category}</span>
                         </Link>
                       </li>
                     ))}
                   </ul>
                   {insight && (
                     <p className="text-text-secondary mt-8">
                       Further reading:{" "}
                       <Link href={`/insights/${insight.slug}`} className="text-primary underline decoration-border underline-offset-4 hover:text-accent">{insight.title}</Link>
                     </p>
                   )}
                 </section>
               )}

               {data.faqs.length > 0 && (
                 <section>
                   <h2 className="text-2xl font-bold mb-6">Questions</h2>
                   <div className="space-y-8">
                     {data.faqs.map((f) => (
                       <div key={f.q}>
                         <h3 className="text-lg font-bold text-primary mb-2">{f.q}</h3>
                         <p className="text-text-secondary leading-relaxed">{f.a}</p>
                       </div>
                     ))}
                   </div>
                 </section>
               )}

               <section>
                  <Link href="/contact" className="inline-flex items-center justify-center bg-primary text-surface px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors" data-cursor="cta">
                    Discuss a project →
                  </Link>
               </section>
            </div>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

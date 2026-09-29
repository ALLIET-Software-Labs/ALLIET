import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { insights } from "@/data/insights";

export const metadata = pageMetadata({
  title: "Insights: Engineering Notes on AI & Software",
  description: "Engineering notes from ALLIET Software Labs on AI systems, AI agents, web products and software design, written from the projects we build.",
  path: "/insights",
});

export default function InsightsPage() {
  return (
    <div className="flex flex-col min-h-full flex-grow">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <FadeIn>
          <h1 className="text-5xl font-bold tracking-tight text-primary mb-8">Insights</h1>
          <p className="text-xl text-text-secondary max-w-2xl mb-16">
            Technical writing from ALLIET Software Labs on software engineering, product design, and applying AI in practice.
          </p>
        </FadeIn>

        <FadeIn delay={100} className="relative bg-surface rounded-lg border border-border w-full aspect-video md:aspect-[21/9] overflow-hidden mb-16 shadow-lg hover:shadow-xl transition-shadow group cursor-pointer" data-cursor="image">
          <Image src="/images/insights_visual_new.webp" alt="ALLIET Insights Lab" fill sizes="100vw" preload className="object-cover group-hover:scale-[1.02] transition-transform duration-700 opacity-90" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 md:via-background/40 to-transparent flex flex-col justify-end p-8 md:p-12">
            <span className="text-accent text-sm font-semibold tracking-widest uppercase mb-4">Notes from the lab</span>
            <h2 className="text-3xl md:text-5xl font-bold text-primary max-w-3xl mb-4 group-hover:text-accent transition-colors drop-shadow-md">Engineering notes, written after the work.</h2>
            <p className="text-text-secondary max-w-2xl text-lg drop-shadow-md">This is where we&apos;ll write up what we learn building real systems: the decisions, trade-offs and mistakes behind projects like Syntapse, DeskGlow and MEMORABLE. The first article is below; the others are in preparation.</p>
          </div>
        </FadeIn>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Published articles link through; the rest are honest "Planned" placeholders. */}
          {[
            ...insights.map((a) => ({ title: a.title, category: a.category, href: `/insights/${a.slug}` })),
            { title: "Zero-backend by design: an offline-first PWA", category: "Web Apps", href: undefined },
            { title: "Designing a game that doesn't need its language model", category: "Game Dev", href: undefined },
          ].map((article, i) => {
            const inner = (
              <>
                <div>
                  <span className="text-xs font-semibold tracking-widest uppercase text-text-secondary mb-4 block">{article.category}</span>
                  <h3 className="text-xl font-bold text-primary group-hover:text-accent transition-colors">{article.title}</h3>
                </div>
                <div className="text-sm text-text-secondary flex items-center gap-2 group-hover:text-primary transition-colors">
                  {article.href ? "Read" : "Planned"} <span className="opacity-0 group-hover:opacity-100 transition-opacity">→</span>
                </div>
              </>
            );
            return (
              <FadeIn key={article.title} delay={(i + 2) * 100} className="group p-8 bg-surface-alt rounded-lg border border-border flex flex-col justify-between h-64 hover:border-accent/50 transition-colors cursor-pointer" data-cursor="cta">
                {article.href ? (
                  <Link href={article.href} className="flex flex-col justify-between h-full">{inner}</Link>
                ) : inner}
              </FadeIn>
            );
          })}
        </div>
      </main>
    </div>
  );
}

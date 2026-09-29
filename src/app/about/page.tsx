import FadeIn from "@/components/FadeIn";
import Image from "next/image";
import Link from "next/link";
import MagneticCTA from "@/components/MagneticCTA";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About ALLIET Software Labs, Hyderabad",
  absoluteTitle: true,
  description: "An independent engineering and product studio: how ALLIET Software Labs works, what it has built, and why it develops its own software alongside client work.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-4xl">
            <FadeIn>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[1.1]">
                We build software. <br />
                <span className="text-text-secondary">Carefully, and in the open.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed">
                ALLIET Software Labs is an independent engineering and product studio based in Hyderabad, India. We build AI systems, web products and automation for clients, and develop software of our own alongside it.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* HERO VISUAL */}
        <section className="container mx-auto px-6 pb-32">
          <FadeIn delay={300} className="relative w-full aspect-[16/9] md:aspect-[21/9] rounded-lg overflow-hidden border border-border group" data-cursor="image">
            <div className="absolute inset-0 bg-primary/10 group-hover:bg-transparent transition-colors duration-700 z-10 mix-blend-overlay"></div>
            <Image 
              src="/images/about_studio_visual.jpg" 
              alt="ALLIET Software Labs studio" 
              fill 
              className="object-cover scale-100 group-hover:scale-105 transition-transform duration-1000 ease-out" 
              sizes="100vw"
              preload
            />
          </FadeIn>
        </section>

        {/* THE STORY */}
        <section className="bg-surface py-32 border-y border-border">
          <div className="container mx-auto px-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16 md:gap-24">
              <FadeIn>
                <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">Our Story</h2>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                  A lab, <br />
                  not an agency.
                </h3>
              </FadeIn>
              <FadeIn delay={150} className="space-y-6 text-lg text-text-secondary leading-relaxed">
                <p>
                  ALLIET started from a simple observation: too much software is either bloated enterprise tooling or a rushed prototype nobody can maintain. Fast-moving teams need something in between — software small enough to understand and solid enough to rely on.
                </p>
                <p>
                  We call it a lab because a real share of our time goes into building things for ourselves: <Link href="/work/syntapse" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">a multi-agent planning system with shared memory</Link>, <Link href="/work/deskglow" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">an offline-first ambient display</Link>, <Link href="/work/memorable" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">a narrative game with a language model in the loop</Link>, <Link href="/work/payloop" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">a subscription reminder service</Link>. Most of it is open-source. Each one taught us something we now bring to client work.
                </p>
                <p>
                  Client work runs alongside it — the <Link href="/work/mm-cartons" className="text-primary underline decoration-border underline-offset-4 hover:text-accent">M.M. Cartons company website</Link>, for example, which we built, deployed and managed. For clients, that means an engineering partner that has already run into the awkward edge cases, and a small studio where the people you talk to are the people building your software.
                </p>
              </FadeIn>
            </div>
          </div>
        </section>

        {/* CORE PRINCIPLES */}
        <section className="py-32 container mx-auto px-6">
          <FadeIn className="mb-16">
            <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">Philosophy</h2>
            <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">How we work</h3>
          </FadeIn>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                num: "01",
                title: "Build the risky part first",
                desc: "The model call, the integration, the sync logic — whatever is most likely to fail gets built and tested first, so problems surface in week one rather than at launch.",
              },
              {
                num: "02",
                title: "Architectural clarity",
                desc: "Complexity is the enemy of reliability. We prefer fewer moving parts, plain data models and code the next engineer can read without us in the room.",
              },
              {
                num: "03",
                title: "Honest about AI",
                desc: "Language models are useful and unreliable. We design for both: grounded context, validated output, and a sensible fallback when the model is wrong or unavailable.",
              }
            ].map((principle, i) => (
              <FadeIn key={principle.num} delay={i * 100}>
                <div className="group h-full bg-background border border-border p-8 rounded-lg hover:border-accent hover:shadow-lg transition-all duration-500 relative overflow-hidden" data-cursor="text">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent/5 rounded-bl-full translate-x-16 -translate-y-16 group-hover:translate-x-8 group-hover:-translate-y-8 transition-transform duration-500"></div>
                  <span className="text-accent font-bold text-lg mb-6 block font-mono">{principle.num}</span>
                  <h4 className="text-xl font-bold text-primary mb-4">{principle.title}</h4>
                  <p className="text-text-secondary leading-relaxed">{principle.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-surface py-32 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Working on something?</h2>
              <p className="text-xl text-surface/70 max-w-2xl mx-auto mb-12">
                Tell us where it stands and what&apos;s in the way. We&apos;ll give you a straight answer on whether we can help.
              </p>
              <MagneticCTA href="/contact" className="bg-surface text-primary px-8 py-4 rounded-full font-medium hover:bg-surface-alt transition-colors inline-block" data-cursor="cta">
                Start a project →
              </MagneticCTA>
            </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}

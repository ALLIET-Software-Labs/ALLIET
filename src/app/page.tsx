import Image from "next/image";
import Link from "next/link";
import EngineeringDemo from "@/components/EngineeringDemo";
import FadeIn from "@/components/FadeIn";
import InteractiveServices from "@/components/InteractiveServices";
import MagneticCTA from "@/components/MagneticCTA";
import InteractiveHeroVisual from "@/components/InteractiveHeroVisual";
import FeaturedWork from "@/components/FeaturedWork";
import { pageMetadata, SITE_DESCRIPTION } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "ALLIET Software Labs | AI Development, Web Products & Automation",
  description: SITE_DESCRIPTION,
  path: "/",
  absoluteTitle: true,
});

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 pt-12 pb-12 md:pt-16 md:pb-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-72px)]">
          <FadeIn className="space-y-8" delay={100}>
            <div className="inline-block border border-border px-3 py-1 text-xs uppercase tracking-widest text-text-secondary rounded-full">
              AI • Software • Automation
            </div>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.1] text-primary">
              Ideas to <br />
              <span className="text-text-secondary">Intelligent</span> <br />
              Products.
            </h1>
            <p className="text-lg md:text-xl text-text-secondary max-w-lg leading-relaxed">
              ALLIET Software Labs is an independent software lab. We design and build AI systems, web products and automation for clients — and develop products of our own alongside that work.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <MagneticCTA href="/contact" className="bg-primary text-surface px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors shadow-lg" data-cursor="cta">
                Build with us →
              </MagneticCTA>
              <Link href="/work" className="border border-border text-primary px-8 py-4 rounded-full font-medium hover:bg-surface-alt transition-colors flex items-center gap-2" data-cursor="cta">
                See our work
              </Link>
            </div>
          </FadeIn>
          <FadeIn delay={300} className="h-full flex items-center">
            <div className="w-full max-h-[calc(100vh-120px)] overflow-hidden">
              <InteractiveHeroVisual />
            </div>
          </FadeIn>
        </section>

        {/* SERVICES / WHAT WE DO */}
        <section className="bg-surface py-32 border-y border-border">
          <FadeIn className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 md:mb-24">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">01. What we do</h2>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-primary max-w-2xl">
                  Software that has to work, <br className="hidden md:block"/> not just demo well.
                </h3>
              </div>
              <p className="text-text-secondary max-w-sm mt-6 md:mt-0 leading-relaxed">
                Most of our work sits where AI meets ordinary engineering. A model is only useful once it&apos;s connected to real data, a usable interface and the systems people already rely on.
              </p>
            </div>

            <InteractiveServices />
          </FadeIn>
        </section>
        {/* PROJECT SHOWCASE */}
        <section className="py-32">
          <FadeIn>
            <FeaturedWork />
          </FadeIn>
        </section>

        {/* ENGINEERING DEMO */}
        <section className="bg-background py-32 border-b border-border">
          <FadeIn className="container mx-auto px-6">
            <div className="mb-16 text-center max-w-2xl mx-auto">
              <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">03. Architecture</h2>
              <h3 className="text-3xl md:text-4xl font-bold tracking-tight text-primary">
                How we structure an AI system.
              </h3>
              <p className="text-text-secondary mt-4">
                A language model is one component, not the whole system. Requests are routed, grounded in real context and checked before anything acts on them. The walkthrough below is a simulation of that flow — no live model is running.
              </p>
            </div>
            <EngineeringDemo />
          </FadeIn>
        </section>

        {/* ABOUT SECTION */}
        <section className="bg-primary text-surface py-32">
          <FadeIn className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-sm uppercase tracking-widest text-surface/60 mb-6">04. About ALLIET</h2>
              <h3 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">
                Small by <br/> design.
              </h3>
              <p className="text-surface/80 max-w-md leading-relaxed mb-8">
                ALLIET Software Labs is an engineering and product studio. We take on a focused set of client projects and spend the rest of our time on our own software. The two keep each other in check: client work keeps us practical, and building our own products keeps us honest about what it takes to ship.
              </p>
              <Link href="/about" className="text-surface font-medium border-b border-surface/30 hover:border-surface pb-1 transition-colors">
                About the studio →
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
               <div>
                 <div className="w-12 h-12 border border-surface/20 rounded-full flex items-center justify-center mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 8V12L15 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <h4 className="font-bold mb-2">Client work</h4>
                 <p className="text-sm text-surface/60">Software built to your brief, documented and handed over cleanly.</p>
               </div>
               <div>
                 <div className="w-12 h-12 border border-surface/20 rounded-full flex items-center justify-center mb-4">
                   <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M21 16V8C21 6.89543 20.1046 6 19 6H5C3.89543 6 3 6.89543 3 8V16C3 17.1046 3.89543 18 5 18H19C20.1046 18 21 17.1046 21 16Z" stroke="currentColor" strokeWidth="2"/>
                      <path d="M12 22V18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M8 22H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                   </svg>
                 </div>
                 <h4 className="font-bold mb-2">Own products</h4>
                 <p className="text-sm text-surface/60">Tools we build because we think they should exist.</p>
               </div>
            </div>
          </FadeIn>
        </section>
        {/* TECH STACK */}
        <section className="py-32 bg-surface border-y border-border">
          <FadeIn className="container mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">05. Tech Stack</h2>
                <h3 className="text-4xl md:text-5xl font-bold tracking-tight text-primary">
                  What we build with.
                </h3>
              </div>
              <p className="text-text-secondary max-w-sm text-sm md:text-base leading-relaxed mt-6 md:mt-0">
                The stack behind the work on this site. We favour open, well-documented tools — and we&apos;ll use whatever your existing system already runs on.
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
               {[
                 "React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion",
                 "Node.js", "Express", "Python", "MongoDB", "Redis",
                 "Docker", "Cognee", "Ollama", "Groq", "Vercel"
               ].map((tech, i) => (
                 <div key={i} className="flex items-center justify-center p-6 bg-background rounded-lg border border-border hover:border-accent/50 transition-colors">
                   <span className="font-medium text-sm text-primary">{tech}</span>
                 </div>
               ))}
            </div>
          </FadeIn>
        </section>

        {/* CONTACT / CTA */}
        <section className="py-32 bg-background relative overflow-hidden">
          <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
             <FadeIn className="relative z-10" direction="right">
                <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-6">06. Start a conversation</h2>
                <h3 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-6 leading-[1.1]">
                  Tell us what <br/>
                  you&apos;re building.
                </h3>
                <p className="text-lg text-text-secondary max-w-md mb-10 leading-relaxed">
                  An early idea, a prototype that needs to become a product, or a process that should have been automated years ago. A short message is enough to start — we&apos;ll ask the right questions.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link href="/contact" className="bg-primary text-surface px-8 py-4 rounded-full font-medium hover:bg-primary/90 transition-colors" data-cursor="cta">
                    Start a project →
                  </Link>
                  <a href="mailto:contact@alliet.company" className="border border-border text-primary px-8 py-4 rounded-full font-medium hover:bg-surface-alt transition-colors flex items-center gap-2" data-cursor="cta">
                    contact@alliet.company
                  </a>
                </div>
             </FadeIn>
             <FadeIn className="relative aspect-square md:aspect-auto md:h-full min-h-[400px] rounded-lg border border-border overflow-hidden bg-surface-alt" direction="left" data-cursor="image">
                <Image src="/images/contact_visual.jpg" alt="Ideas to Systems Visualization" fill sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
             </FadeIn>
          </div>
        </section>
      </main>
    </div>
  );
}

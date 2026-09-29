import Link from "next/link";
import FadeIn from "@/components/FadeIn";
import MagneticCTA from "@/components/MagneticCTA";
import ServiceItem from "@/components/ServiceItem";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "AI, Web & Automation Services",
  description: "AI systems, digital products, automation and software engineering: the four areas ALLIET Software Labs works in, and what each one covers.",
  path: "/services",
});

const serviceCategories = [
  {
    id: "ai-systems",
    category: "AI Systems",
    items: [
      { name: "LLM features & agents", desc: "Language models added where they earn their place: drafting, extraction, classification, conversational interfaces. Built with validation and a fallback path, not just a prompt." },
      { name: "Memory & retrieval", desc: "Giving AI systems context that persists — retrieval over your own documents, knowledge graphs, and shared memory between agents. It's the problem Syntapse was built around." },
      { name: "Local & hosted models", desc: "Hosted inference where speed matters, as with Groq in MEMORABLE, or open models run locally through Ollama when data should stay on your own machines, as in Syntapse." }
    ],
    tech: ["Python", "Cognee", "Memgraph", "Redis", "Groq", "Ollama"]
  },
  {
    id: "digital-products",
    category: "Digital Products",
    items: [
      { name: "Web applications", desc: "Full-stack web apps from first prototype to production, with React and Next.js on the front and Node.js behind them." },
      { name: "Company websites", desc: "Fast, responsive websites for businesses, built, deployed and maintained after launch. Our work for M.M. Cartons is an example." },
      { name: "Progressive web apps", desc: "Installable, offline-capable web apps that run on phones, tablets and desktops, like DeskGlow, which keeps all of its data on the device." },
      { name: "Interface design", desc: "Interfaces designed in the same pass as the engineering, so states, motion and edge cases are decided up front rather than improvised at the end." },
      { name: "Games & interactive fiction", desc: "Smaller interactive projects, including narrative games that use generative AI without depending on it. See MEMORABLE." }
    ],
    tech: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"]
  },
  {
    id: "automation",
    category: "Automation & Integration",
    items: [
      { name: "Workflow automation", desc: "Scheduled jobs, reminders and multi-step workflows that replace a spreadsheet and someone's memory. PayLoop's renewal reminders are a small, working example." },
      { name: "Third-party API integration", desc: "Connecting an application to the services around it — email delivery, scheduling, data sources — so information moves without copy and paste." },
      { name: "Email & notifications", desc: "Transactional email and reminder pipelines that send the right message at the right time, and stop when they should." }
    ],
    tech: ["Node.js", "Upstash Workflow", "Nodemailer", "Day.js", "REST APIs"]
  },
  {
    id: "software-engineering",
    category: "Software Engineering",
    items: [
      { name: "Backend services & APIs", desc: "Node.js and Express services with authentication, validation and rate limiting in place from the first commit, not bolted on later." },
      { name: "Authentication & security", desc: "JWT authentication, hashed credentials, rate limiting and bot protection — handled as part of the design, not as a later patch." },
      { name: "Data modelling", desc: "Plain, deliberate data models on MongoDB, Redis or a graph database, chosen for how the data is actually read and written." },
      { name: "Deployment & maintenance", desc: "Getting software live on platforms such as Vercel and Render, and keeping it healthy afterwards with fixes, updates and performance work." }
    ],
    tech: ["Node.js", "Express", "MongoDB", "Redis", "Arcjet", "Docker"]
  }
];

export default function ServicesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="container mx-auto px-6 pt-16 pb-24 md:pt-24 md:pb-32">
          <div className="max-w-4xl">
            <FadeIn>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-8 leading-[1.1]">
                Capabilities & <br />
                <span className="text-text-secondary">Engineering Services.</span>
              </h1>
            </FadeIn>
            <FadeIn delay={150}>
              <p className="text-xl md:text-2xl text-text-secondary max-w-2xl leading-relaxed">
                Four areas of work. They overlap constantly — most real projects need a little of each — but this is where we can help, and what that help looks like.
              </p>
            </FadeIn>
          </div>
        </section>

        {/* INTERACTIVE SERVICES LIST */}
        <section className="border-t border-border bg-surface pb-32">
          <div className="container mx-auto px-6">
            {serviceCategories.map((group, groupIndex) => (
              <div key={group.category} id={group.id} className="py-16 border-b border-border grid grid-cols-1 md:grid-cols-12 gap-12 group/section scroll-mt-24 md:scroll-mt-32">
                <div className="md:col-span-4">
                  <FadeIn delay={100} className="sticky top-32">
                    <span className="text-text-secondary font-bold font-mono text-sm mb-4 block">0{groupIndex + 1}</span>
                    <h2 className="text-3xl font-bold text-primary tracking-tight mb-8"><Link href={`/services#${group.id}`}>{group.category}</Link></h2>
                    
                    <Link href="/contact" className="inline-flex items-center gap-2 text-primary font-bold hover:text-text-secondary transition-colors" data-cursor="cta">
                      Talk to us about this →
                    </Link>
                    
                    <div className="mt-8">
                      <h3 className="text-xs font-bold mb-3 text-text-secondary uppercase tracking-wider">Technologies</h3>
                      <div className="flex flex-wrap gap-2">
                        {group.tech.map((t, i) => (
                          <span key={i} className="text-[11px] border border-border px-2 py-1 rounded bg-surface-alt text-primary font-medium">
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </FadeIn>
                </div>
                
                <div className="md:col-span-8">
                  <div className="flex flex-col">
                    {group.items.map((item, itemIndex) => (
                      <FadeIn key={item.name} delay={150 + (itemIndex * 50)}>
                        <ServiceItem name={item.name} desc={item.desc} />
                      </FadeIn>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-primary text-surface py-32 border-t border-border">
          <div className="container mx-auto px-6 text-center">
            <FadeIn>
              <h2 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">Not sure where it fits?</h2>
              <p className="text-xl text-surface/70 max-w-2xl mx-auto mb-12">
                Send us the problem rather than a finished spec. We&apos;ll tell you how we would approach it — and if we&apos;re not the right fit, we&apos;ll say so.
              </p>
              <MagneticCTA href="/contact" className="bg-surface text-primary px-8 py-4 rounded-full font-medium hover:bg-surface-alt transition-colors inline-block" data-cursor="cta">
                Discuss your project →
              </MagneticCTA>
            </FadeIn>
          </div>
        </section>

      </main>
    </div>
  );
}

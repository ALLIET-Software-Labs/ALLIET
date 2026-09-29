import FadeIn from "@/components/FadeIn";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Products in Development",
  description: "Software ALLIET Software Labs is building for itself. First up: a Chrome extension for AI assistance in the browser, currently in development.",
  path: "/products",
});

export default function ProductsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <FadeIn>
          <h1 className="text-5xl font-bold tracking-tight text-primary mb-8">Products</h1>
          <p className="text-xl text-text-secondary max-w-2xl mb-16">
            We build what we believe should exist. Alongside client work, ALLIET develops its own software. It&apos;s early, and we&apos;d rather describe it plainly than dress it up.
          </p>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <FadeIn delay={100} className="p-12 bg-surface-alt rounded-lg border border-border flex flex-col justify-center min-h-[400px]">
              <span className="text-xs font-semibold tracking-widest uppercase text-accent mb-4 block">Incubating</span>
              <h3 className="text-4xl font-bold text-primary mb-4">Untitled Chrome extension</h3>
              <p className="text-text-secondary max-w-md mb-8">An optimized Chrome extension that brings Homey-style AI assistance directly into your browser, helping you work faster with contextual tools and workflows. In development; the name will follow.</p>
              <div className="text-sm font-medium text-text-secondary border border-border px-4 py-2 rounded self-start">
                Not yet public
              </div>
           </FadeIn>
        </div>
      </main>
    </div>
  );
}

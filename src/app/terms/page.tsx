import FadeIn from "@/components/FadeIn";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Terms of Service",
  description: "The terms for using the ALLIET Software Labs website, its contact form and its booking integration.",
  path: "/terms",
});

export default function TermsPage() {
  return (
    <div className="flex flex-col min-h-screen pt-32 pb-24">
      <main className="flex-grow container mx-auto px-6 max-w-3xl">
        <FadeIn>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-primary mb-8">
            Terms of Service
          </h1>
          <p className="text-text-secondary mb-12">Last Updated: September 29, 2026</p>

          <div className="space-y-8 text-text-secondary leading-relaxed">
            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">1. General</h2>
              <p>Welcome to the ALLIET Software Labs website. This website is provided primarily for informational purposes, to showcase our engineering portfolio, and to provide a means to contact us regarding potential projects.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">2. Technical Capabilities & Portfolio</h2>
              <p>The projects and case studies showcased on this website represent our past work and technical capabilities. The architectural and interactive demonstrations (e.g., the Engineering Demo) are simulations meant for illustrative purposes and do not constitute live, functioning products offered for public use.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">3. Acceptable Use</h2>
              <p>By accessing or using this website, you agree not to:</p>
              <ul className="list-disc pl-6 mt-2 space-y-2">
                <li>Attempt to bypass, exploit, or disrupt any security measures, rate limits, or backend systems.</li>
                <li>Submit spam, malicious payloads, or unsolicited commercial offers through our contact forms, AI assistant, or scheduling systems.</li>
                <li>Use the AI assistant for purposes unrelated to ALLIET Software Labs, or attempt to extract its instructions or misuse it.</li>
                <li>Scrape, copy, or redistribute the website&apos;s design, code, or content without prior written permission.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">4. Intellectual Property</h2>
              <p>All content, designs, concepts, and code presented on this website are the intellectual property of ALLIET Software Labs unless otherwise explicitly stated or attributed. Reference to third-party technologies or frameworks does not imply endorsement or ownership of those technologies.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">5. AI Assistant</h2>
              <p>The &ldquo;Ask ALLIET&rdquo; assistant answers questions about ALLIET Software Labs using an AI language model. Its answers are generated automatically and may occasionally be incomplete or wrong. They are for general information only and are not quotes, commitments or professional advice. For anything that matters, please confirm with us at <a href="mailto:contact@alliet.company" className="text-primary hover:underline">contact@alliet.company</a>.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">6. External Services</h2>
              <p>Our website utilizes external third-party services (such as Cal.com for scheduling, Resend for email routing, and Groq for the AI assistant). While we carefully select the tools we integrate, we do not assume liability for the availability, functionality, or policies of these external platforms.</p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-primary mb-4">7. Contact</h2>
              <p>For any inquiries regarding these terms or your use of this website, please email us at <a href="mailto:contact@alliet.company" className="text-primary hover:underline">contact@alliet.company</a>.</p>
            </section>
          </div>
        </FadeIn>
      </main>
    </div>
  );
}

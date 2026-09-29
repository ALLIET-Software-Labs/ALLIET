"use client";
import { useState, useRef } from "react";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import InteractiveContactVisual from "@/components/InteractiveContactVisual";

async function loadCal() {
  const { getCalApi } = await import("@calcom/embed-react");
  const cal = await getCalApi();
  cal("ui", {
    theme: "dark",
    styles: { branding: { brandColor: "#0F1115" } },
    hideEventTypeDetails: false,
    layout: "month_view"
  });
  return cal;
}

const CATEGORIES = ["AI system", "Web product", "Automation or integration", "Backend / software engineering", "Not sure yet"];

export default function ContactPage() {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [honeypot, setHoneypot] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  // Cal.com is loaded on demand: hovering/focusing the booking button warms it up and
  // clicking opens the modal. Visitors who never book don't download the embed at all.
  const calRef = useRef<ReturnType<typeof loadCal> | null>(null);
  const warmUpCal = () => {
    if (!calRef.current) calRef.current = loadCal();
    return calRef.current;
  };
  const openBooking = async () => {
    try {
      const cal = await warmUpCal();
      cal("modal", { calLink: "alliet/15min", config: { layout: "month_view" } });
    } catch (err) {
      console.error(err);
      calRef.current = null; // allow a retry if the script failed to load
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ category: selectedCategory, email, message, _honeypot: honeypot }),
      });

      if (!res.ok) throw new Error("Failed to send");
      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("error");
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <FadeIn>
          <h1 className="text-5xl font-bold tracking-tight text-primary mb-8">Tell us about the project.</h1>
          <p className="text-xl text-text-secondary max-w-2xl mb-16">
            A company website, a new product, an AI feature, or a workflow that needs automating. Tell us what you&apos;re trying to do and where it stands today — a few sentences is plenty.
          </p>
        </FadeIn>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
          <FadeIn delay={100} className="relative aspect-[4/5] md:aspect-square bg-surface-alt rounded-lg border border-border overflow-hidden order-2 md:order-1">
            <InteractiveContactVisual />
          </FadeIn>
          
          <FadeIn delay={200} className="order-1 md:order-2 flex flex-col justify-center">
            {status === "success" ? (
              <div className="bg-surface-alt p-12 rounded-lg border border-accent/30 mb-12 text-center animate-in fade-in zoom-in-95 duration-500">
                <div className="w-16 h-16 bg-accent/10 text-accent rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M20 6L9 17L4 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <h2 className="text-2xl font-bold text-primary mb-4">Message received</h2>
                <p className="text-text-secondary">
                  Thanks — we read every message ourselves and will reply by email once we&apos;ve had a proper look at what you sent.
                </p>
                <button 
                  onClick={() => {
                    setStatus("idle");
                    setMessage("");
                    setEmail("");
                    setSelectedCategory(null);
                  }}
                  className="mt-8 px-6 py-2 border border-border rounded-full text-sm hover:border-primary transition-colors"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <div className="bg-surface-alt p-8 rounded-lg border border-border mb-12">
                <form onSubmit={handleSubmit}>
                  {!selectedCategory ? (
                    <div className="animate-in fade-in slide-in-from-bottom-4">
                      <h2 className="font-semibold text-lg mb-6">What kind of work is it?</h2>
                      <div className="space-y-4">
                        {CATEGORIES.map((cat) => (
                          <button 
                            key={cat}
                            type="button"
                            onClick={() => { setSelectedCategory(cat); setShowCustomInput(false); }}
                            className="w-full text-left p-4 rounded border border-border hover:border-accent transition-colors bg-background" 
                            data-cursor="cta"
                          >
                            {cat}
                          </button>
                        ))}
                        {/* Other option */}
                        {!showCustomInput ? (
                          <button
                            type="button"
                            onClick={() => setShowCustomInput(true)}
                            className="w-full text-left p-4 rounded border border-border hover:border-accent transition-colors bg-background text-text-secondary"
                            data-cursor="cta"
                          >
                            Something else…
                          </button>
                        ) : (
                          <div className="animate-in fade-in slide-in-from-bottom-2">
                            <input
                              autoFocus
                              type="text"
                              value={customCategory}
                              onChange={(e) => setCustomCategory(e.target.value)}
                              placeholder="Describe it in a few words…"
                              className="w-full bg-background border border-accent rounded p-4 text-primary focus:outline-none transition-colors"
                            />
                            <button
                              type="button"
                              disabled={!customCategory.trim()}
                              onClick={() => setSelectedCategory(customCategory.trim())}
                              className="mt-2 w-full p-3 bg-primary text-surface rounded text-sm font-medium hover:bg-primary/90 transition-colors disabled:opacity-40"
                            >
                              Continue &rarr;
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="animate-in fade-in slide-in-from-right-4">
                      <div className="flex items-center gap-3 mb-6">
                        <button 
                          type="button" 
                          onClick={() => setSelectedCategory(null)}
                          className="text-text-secondary hover:text-primary transition-colors text-sm flex items-center gap-1"
                        >
                          &larr; Back
                        </button>
                        <span className="text-sm font-medium px-3 py-1 bg-background border border-border rounded-full">
                          {selectedCategory}
                        </span>
                      </div>
                      
                      <div className="space-y-6">
                        <div>
                          <label htmlFor="email" className="block text-xs font-bold text-text-secondary tracking-widest uppercase mb-2">Email</label>
                          <input 
                            id="email"
                            type="email" 
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-background border border-border rounded p-4 text-primary focus:outline-none focus:border-accent transition-colors"
                            placeholder="you@company.com"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="message" className="block text-xs font-bold text-text-secondary tracking-widest uppercase mb-2">About the project</label>
                          <textarea 
                            id="message"
                            required
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={4}
                            className="w-full bg-background border border-border rounded p-4 text-primary focus:outline-none focus:border-accent transition-colors resize-none"
                            placeholder="What are you trying to build or fix? Where is it today, and is there a deadline we should know about?"
                          ></textarea>
                        </div>
                        
                        {status === "error" && (
                           <div className="text-red-500 text-sm p-3 bg-red-500/10 rounded border border-red-500/20">
                             Your message didn&apos;t send. Please email us directly at contact@alliet.company.
                           </div>
                        )}

                        {/* Honeypot field (hidden) */}
                        <div className="absolute left-[-9999px]" aria-hidden="true">
                          <label htmlFor="bot-check">Do not fill this out if you are human</label>
                          <input 
                            type="text" 
                            id="bot-check"
                            name="bot-check"
                            tabIndex={-1}
                            value={honeypot}
                            onChange={(e) => setHoneypot(e.target.value)}
                            autoComplete="off"
                          />
                        </div>

                        <button 
                          type="submit" 
                          disabled={status === "submitting"}
                          className="w-full p-4 bg-primary text-surface rounded font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                          data-cursor="cta"
                        >
                          {status === "submitting" ? "Sending…" : "Send message →"}
                        </button>
                        <p className="text-xs text-text-secondary text-center mt-4">
                          By submitting this form, you agree to our <a href="/privacy-policy" className="underline hover:text-primary">Privacy Policy</a>.
                        </p>
                      </div>
                    </div>
                  )}
                </form>
              </div>
            )}
            
            <div className="mb-12">
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">Email</h3>
              <a href="mailto:contact@alliet.company" className="text-2xl font-medium text-primary hover:text-accent transition-colors" data-cursor="cta">contact@alliet.company</a>
            </div>
            
            <div>
              <h3 className="text-sm font-semibold text-text-secondary uppercase tracking-widest mb-4">Or talk it through</h3>
              <button 
                type="button"
                onPointerEnter={() => { warmUpCal().catch(() => { calRef.current = null; }); }}
                onFocus={() => { warmUpCal().catch(() => { calRef.current = null; }); }}
                onClick={openBooking}
                className="inline-block px-6 py-3 border-2 border-primary text-primary rounded-full text-sm font-medium hover:bg-primary hover:text-surface transition-colors" 
                data-cursor="cta"
              >
                Book a 15-minute call &rarr;
              </button>
            </div>
          </FadeIn>
        </div>
      </main>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import FadeIn from "./FadeIn";

const services = [
  { 
    id: "ai-systems", 
    title: "AI Systems", 
    desc: "Language-model features and agent systems built as software, not as a clever prompt: retrieval, memory, tool use, and a plan for when the model is wrong or unavailable.",
    tools: ["Python", "Cognee", "Memgraph", "Redis", "Groq", "Ollama"],
    features: [
      "LLM features & agents", 
      "Memory & retrieval", 
      "Multi-agent orchestration",
      "Local & hosted models"
    ]
  },
  { 
    id: "digital-products", 
    title: "Digital Products", 
    desc: "Company websites, web apps, installable PWAs and interactive products — designed and engineered in the same pass, then deployed and looked after.",
    tools: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Framer Motion", "Vite"],
    features: [
      "Web applications", 
      "Company websites", 
      "Progressive web apps", 
      "Interface design",
      "Games & interactive fiction"
    ]
  },
  { 
    id: "automation", 
    title: "Automation & Integration", 
    desc: "Scheduled workflows, reminders and third-party integrations that take repetitive work off people's plates and keep systems in step without manual follow-up.",
    tools: ["Node.js", "Upstash Workflow", "Nodemailer", "Day.js", "REST APIs"],
    features: [
      "Workflow automation", 
      "Third-party API integration", 
      "Email & notifications",
      "Scheduled jobs & reminders"
    ]
  },
  { 
    id: "software-engineering", 
    title: "Software Engineering", 
    desc: "The work underneath everything else: APIs, data models, authentication, security and deployment, built so the next engineer can read it and the system holds up in use.",
    tools: ["Node.js", "Express", "MongoDB", "Redis", "Arcjet", "Docker"],
    features: [
      "Backend services & APIs", 
      "Authentication & security", 
      "Data modelling",
      "Deployment & maintenance"
    ]
  },
];

export default function InteractiveServices() {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
      <div className="lg:col-span-5 space-y-4">
        {services.map((service, i) => (
          <button 
            key={service.id}
            onMouseEnter={() => setActiveIdx(i)}
            onClick={() => setActiveIdx(i)}
            className={`w-full text-left p-6 rounded-lg transition-all duration-300 border ${
              activeIdx === i 
                ? "bg-surface-alt border-border shadow-sm" 
                : "bg-transparent border-transparent hover:bg-surface-alt/50"
            }`}
          >
            <div className="flex items-center gap-6">
              <span className={`text-sm font-medium ${activeIdx === i ? "text-primary" : "text-text-secondary"}`}>0{i + 1}</span>
              <h4 className={`text-2xl font-bold transition-colors ${activeIdx === i ? "text-primary" : "text-text-secondary"}`}>
                {service.title}
              </h4>
            </div>
          </button>
        ))}
      </div>

      <div className="lg:col-span-7 relative bg-surface-alt rounded-lg border border-border p-8 md:p-12 min-h-[450px] flex flex-col justify-between">
         <div 
           key={activeIdx}
           className="animate-in fade-in duration-500"
         >
           <h4 className="text-sm uppercase tracking-widest text-text-secondary mb-6 font-mono">What this covers</h4>
           <p className="text-xl md:text-2xl text-primary leading-relaxed mb-12">
             {services[activeIdx].desc}
           </p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
             <div>
               <h5 className="text-sm font-bold mb-4 text-text-secondary uppercase">Typical work</h5>
               <ul className="space-y-3">
                 {services[activeIdx].features.map((f, i) => (
                   <li key={i} className="text-sm md:text-base text-primary flex items-start gap-3">
                     <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 shrink-0"></span> 
                     <span className="leading-tight">{f}</span>
                   </li>
                 ))}
               </ul>
             </div>
             <div>
               <h5 className="text-sm font-bold mb-4 text-text-secondary uppercase">Technologies</h5>
               <div className="flex flex-wrap gap-2">
                 {services[activeIdx].tools.map((t, i) => (
                   <span key={i} className="text-xs border border-border px-3 py-1.5 rounded-full bg-surface text-primary font-medium">
                     {t}
                   </span>
                 ))}
               </div>
             </div>
           </div>
         </div>
         
         <Link href={`/services#${services[activeIdx].id}`} className="inline-flex items-center gap-2 text-primary font-bold hover:opacity-70 transition-opacity self-start mt-8" data-cursor="cta">
           Explore {services[activeIdx].title.toLowerCase()} →
         </Link>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import FadeIn from "@/components/FadeIn";
import { m, AnimatePresence, LazyMotion } from "framer-motion";

const loadMotionFeatures = () => import("@/components/motion-features").then((mod) => mod.default);

import { projects, categories } from "@/data/projects";

export default function WorkPage() {
  const [filter, setFilter] = useState("All");

  const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <div className="flex flex-col min-h-full flex-grow">
      <main className="flex-grow container mx-auto px-6 pt-16 pb-32">
        <FadeIn>
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-primary mb-6">Selected Work</h1>
              <p className="text-xl text-text-secondary max-w-2xl">
                Client work alongside projects we built for ourselves: AI systems, web apps, a game and the backend work behind them. Each one comes with notes on what we built and why.
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {categories.map(c => (
                <button 
                  key={c}
                  onClick={() => setFilter(c)}
                  className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${
                    filter === c 
                      ? "bg-primary text-surface" 
                      : "border border-border text-primary hover:bg-surface-alt"
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </FadeIn>

        <m.div layout className="grid grid-cols-1 md:grid-cols-12 gap-6">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((p, i) => {
              // Determine column span based on size and current filter
              // If filtered, make everything standard size for better flow, otherwise use editorial sizing
              const isFiltered = filter !== "All";
              let colSpan = "md:col-span-6 lg:col-span-4"; // default medium
              
              if (!isFiltered) {
                if (p.size === "large") colSpan = "md:col-span-12 lg:col-span-8";
                else if (p.size === "small") colSpan = "md:col-span-6 lg:col-span-4";
                else if (p.size === "medium") colSpan = "md:col-span-6 lg:col-span-6";
              }

              return (
                <m.div 
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0, delay: !isFiltered ? i * 0.05 : 0 }}
                  key={p.id} 
                  className={colSpan}
                >
                  <Link href={`/work/${p.id}`} className="group flex flex-col h-full" data-cursor="project">
                    <div className={`relative bg-surface-alt rounded-lg border border-border w-full overflow-hidden shadow-sm group-hover:shadow-lg transition-all duration-500 mb-6 ${
                      (!isFiltered && p.size === "large") ? "aspect-video" : "aspect-square md:aspect-[4/3]"
                    }`}>
                      <Image src={p.img} alt={p.title} fill sizes={(!isFiltered && p.size === "large") ? "(min-width: 1024px) 66vw, 100vw" : (!isFiltered && p.size === "medium") ? "(min-width: 768px) 50vw, 100vw" : "(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"} className="object-cover group-hover:scale-[1.02] transition-transform duration-700" />
                    </div>
                    <div className="flex justify-between items-start mt-auto">
                      <div>
                        <h3 className="text-2xl font-bold text-primary mb-1 group-hover:text-accent transition-colors">{p.title}</h3>
                        <p className="text-text-secondary text-sm">{p.category}</p>
                      </div>
                      {p.year && (
                        <span className="text-xs font-mono text-text-secondary bg-surface-alt px-2 py-1 rounded border border-border">{p.year}</span>
                      )}
                    </div>
                  </Link>
                </m.div>
              );
            })}
          </AnimatePresence>
        </m.div>
      </main>
    </div>
    </LazyMotion>
  );
}

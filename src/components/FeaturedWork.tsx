"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { projects } from "@/data/projects";
import { m, AnimatePresence, LazyMotion } from "framer-motion";

const loadMotionFeatures = () => import("@/components/motion-features").then((mod) => mod.default);

export default function FeaturedWork() {
  const [filter, setFilter] = useState("All");

  const categories = ["All", ...Array.from(new Set(projects.map(p => p.category)))];
  const filteredProjects = projects.filter(p => filter === "All" || p.category === filter);

  return (
    <LazyMotion features={loadMotionFeatures} strict>
    <div className="container mx-auto px-6">
      <div className="flex flex-col md:flex-row justify-between items-end mb-16">
        <div>
          <h2 className="text-sm uppercase tracking-widest text-text-secondary mb-4">02. Selected Work</h2>
        </div>
        <div className="flex gap-4 mt-6 md:mt-0 overflow-x-auto pb-2 md:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-1.5 rounded-full text-sm whitespace-nowrap transition-colors ${
                filter === cat
                  ? "bg-primary text-surface"
                  : "border border-border text-primary hover:bg-surface-alt"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <m.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredProjects.length === 0 && (
            <m.div 
              key="empty"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }} 
              className="col-span-full py-12 text-center text-text-secondary"
            >
              No projects found for this category.
            </m.div>
          )}
          
          {filteredProjects.map((p, idx) => {
            const isFeatured = filter === "All" && idx === 0;

            if (isFeatured) {
              return (
                <m.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.4, type: "spring", bounce: 0 }}
                  key={`featured-${p.id}`}
                  className="col-span-1 md:col-span-2"
                >
                  <Link href={`/work/${p.id}`} className="group h-full block bg-surface-alt rounded-lg border border-border overflow-hidden shadow-sm hover:shadow-lg transition-all duration-500" data-cursor="project">
                    <div className="grid grid-cols-1 md:grid-cols-2 h-full">
                      <div className="p-8 md:p-12 flex flex-col justify-center relative z-10">
                        <h3 className="text-3xl font-bold mb-4 group-hover:text-accent transition-colors">{p.title}</h3>
                        <p className="text-text-secondary mb-8 line-clamp-3 leading-relaxed">{p.overview}</p>
                        <div className="flex gap-2 flex-wrap mb-8">
                          <span className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full font-medium">{p.category}</span>
                          {(p.tech ?? "").split(",").filter(Boolean).slice(0, 3).map(t => (
                             <span key={t} className="text-xs bg-surface border border-border px-3 py-1.5 rounded-full font-medium">{t.trim()}</span>
                          ))}
                        </div>
                        <div className="mt-auto flex items-center gap-2 text-sm font-bold text-primary hover:text-text-secondary transition-colors">
                          View case study →
                        </div>
                      </div>
                      {/* Visual */}
                      <div className="relative min-h-[300px] md:h-full bg-border overflow-hidden">
                        <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors z-10 duration-500"></div>
                        <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out" />
                      </div>
                    </div>
                  </Link>
                </m.div>
              );
            }

            // Secondary layout
            return (
              <m.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4, type: "spring", bounce: 0 }}
                key={p.id}
                className="col-span-1"
              >
                <Link href={`/work/${p.id}`} className="group block h-full bg-background rounded-lg border border-border p-4 flex flex-col shadow-sm hover:shadow-md transition-all duration-500" data-cursor="project">
                   <div className="relative w-full aspect-video bg-surface-alt mb-6 rounded border border-border/50 overflow-hidden group-hover:scale-[1.02] transition-transform duration-500">
                     <Image src={p.img} alt={p.title} fill sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw" className="object-cover" />
                   </div>
                   <div className="px-2 pb-2 mt-auto">
                      <h3 className="text-xl font-bold mb-1 group-hover:text-accent transition-colors">{p.title}</h3>
                      <p className="text-text-secondary text-sm line-clamp-1">{p.category}</p>
                   </div>
                </Link>
              </m.div>
            );
          })}
        </AnimatePresence>
      </m.div>
    </div>
    </LazyMotion>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";

interface FadeInProps {
  children: React.ReactNode;
  delay?: number;
  direction?: "up" | "down" | "left" | "right" | "none";
  className?: string;
}

const EASE = "cubic-bezier(0.16, 1, 0.3, 1)";

// "css": server-rendered state. The fade runs as a CSS animation from the first paint, so
//        above-the-fold content never waits for hydration (this was the main LCP delay).
// "hidden" / "visible": after hydration, elements that are still below the fold switch to the
//        original scroll-triggered reveal. They are off-screen at that moment, so there is no flash.
type Mode = "css" | "hidden" | "visible";

export default function FadeIn({ children, delay = 0, direction = "up", className = "" }: FadeInProps) {
  const [mode, setMode] = useState<Mode>("css");
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Reduced motion: the CSS animation is already disabled by a media query.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Already on screen (or scrolled past): the CSS animation has it covered.
    if (el.getBoundingClientRect().top < window.innerHeight) return;

    setMode("hidden");
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMode("visible");
          observer.disconnect();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );
    observer.observe(el);

    return () => observer.disconnect();
  }, []);

  const getTransform = () => {
    switch (direction) {
      case "up": return "translateY(24px)";
      case "down": return "translateY(-24px)";
      case "left": return "translateX(24px)";
      case "right": return "translateX(-24px)";
      default: return "translate(0)";
    }
  };

  const style: React.CSSProperties =
    mode === "css"
      ? { animation: `alliet-fade-${direction} 700ms ${EASE} ${delay}ms both` }
      : {
          opacity: mode === "visible" ? 1 : 0,
          transform: mode === "visible" ? "translate(0)" : getTransform(),
          transition: mode === "visible"
            ? `opacity 700ms ${EASE} ${delay}ms, transform 700ms ${EASE} ${delay}ms`
            : "none",
        };

  return (
    <div ref={ref} className={`alliet-fade ${className}`} style={style}>
      {children}
    </div>
  );
}

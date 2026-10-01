"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";

export default function InteractiveHeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);
  const layerBaseRef = useRef<HTMLDivElement>(null);
  const layerAnnotation1Ref = useRef<HTMLDivElement>(null);
  const layerAnnotation2Ref = useRef<HTMLDivElement>(null);
  const startLoopRef = useRef<() => void>(() => {});
  const [isHovered, setIsHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Check for mobile layout based strictly on width so touch-laptops don't break
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => {
       // Just keeping this for future use if needed
    };
    mediaQuery.addEventListener("change", handler);

    let animationFrameId = 0;
    let currentX = 0;
    let currentY = 0;

    // Use a ref to access latest state without dependency array issues.
    // `start` lets the React handlers wake the loop, which otherwise stays idle.
    const targetRef = { x: 0, y: 0, hovered: false, start: () => {} };
    
    // We attach the update function to the window to let React handlers update it
    (window as any)._heroTarget = targetRef;

    // Runs only while hovered or while easing back to rest (previously every frame, forever).
    const animate = () => {
      const target = (window as any)._heroTarget;
      if (!target) return;
      
      // Linear interpolation (lerp) for smooth parallax
      currentX += (target.x - currentX) * 0.08;
      currentY += (target.y - currentY) * 0.08;

      const settled = !target.hovered && Math.abs(target.x - currentX) < 0.001 && Math.abs(target.y - currentY) < 0.001;
      if (settled) {
        currentX = target.x;
        currentY = target.y;
      }

      if (!isMobile) {
        if (layerBaseRef.current) {
          // Move background in opposite direction
          layerBaseRef.current.style.transform = `translate(${currentX * -4}px, ${currentY * -4}px) scale(1.05)`;
        }
        if (layerAnnotation1Ref.current) {
           const tY = target.hovered ? 0 : 8; // slide up effect
           layerAnnotation1Ref.current.style.transform = `translate(${currentX * 6}px, calc(${currentY * 6}px + ${tY}px))`;
           layerAnnotation1Ref.current.style.opacity = target.hovered ? '1' : '0';
        }
        if (layerAnnotation2Ref.current) {
           const tY = target.hovered ? 0 : -8;
           layerAnnotation2Ref.current.style.transform = `translate(${currentX * 4}px, calc(${currentY * 4}px + ${tY}px))`;
           layerAnnotation2Ref.current.style.opacity = target.hovered ? '1' : '0';
        }
      }

      animationFrameId = settled ? 0 : requestAnimationFrame(animate);
    };
    targetRef.start = () => {
      if (!isMobile && !animationFrameId) animationFrameId = requestAnimationFrame(animate);
    };
    startLoopRef.current = targetRef.start;
    // One frame on mount applies the resting styles (hidden annotations), then the loop stops.
    targetRef.start();

    return () => {
      window.removeEventListener("resize", checkMobile);
      cancelAnimationFrame(animationFrameId);
      mediaQuery.removeEventListener("change", handler);
      delete (window as any)._heroTarget;
    };
  }, [isMobile]);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isMobile) return;
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect && (window as any)._heroTarget) {
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      (window as any)._heroTarget.x = x;
      (window as any)._heroTarget.y = y;
      startLoopRef.current();
    }
  };

  const handleMouseEnter = () => {
    if (isMobile) return;
    setIsHovered(true);
    if ((window as any)._heroTarget) {
       (window as any)._heroTarget.hovered = true;
       startLoopRef.current();
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if ((window as any)._heroTarget) {
       (window as any)._heroTarget.hovered = false;
       (window as any)._heroTarget.x = 0;
       (window as any)._heroTarget.y = 0;
       startLoopRef.current();
    }
  };

  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full max-h-[70vh] aspect-[4/5] bg-surface-alt rounded-lg border border-border overflow-hidden group"
      data-cursor="image"
    >
      {/* Base Image with scale to prevent edge bleed during parallax */}
      <div ref={layerBaseRef} className="absolute inset-0 w-full h-full scale-105 origin-center will-change-transform">
        <Image src="/images/hero_architectural_visual.jpg" alt="ALLIET Software Labs Architecture" fill sizes="(min-width: 1024px) 50vw, calc(100vw - 48px)" className="object-cover" preload />
      </div>

      {/* Technical Annotation 1 */}
      <div 
        ref={layerAnnotation1Ref}
        className={`absolute top-6 left-6 md:top-10 md:left-10 pointer-events-none will-change-transform transition-opacity duration-500 ease-out ${isMobile ? 'opacity-0' : ''}`}
      >
        <div className="bg-background/95 backdrop-blur-md border border-border/60 p-4 rounded shadow-2xl">
          <div className="text-[10px] uppercase tracking-widest text-text-secondary font-mono mb-2 border-b border-border/50 pb-2">
            SYSTEM 01
          </div>
          <div className="text-[11px] text-primary font-mono flex flex-col gap-1.5 font-medium">
            <span>INPUT &rarr;</span>
            <span>CONTEXT &rarr;</span>
            <span className="text-accent">INTELLIGENCE</span>
          </div>
        </div>
      </div>

      {/* Technical Annotation 2 */}
      <div 
        ref={layerAnnotation2Ref}
        className={`absolute bottom-6 right-6 md:bottom-10 md:right-10 text-right pointer-events-none will-change-transform transition-opacity duration-500 ease-out ${isMobile ? 'opacity-0' : ''}`}
      >
        <div className="bg-background/95 backdrop-blur-md border border-border/60 p-3 rounded shadow-2xl inline-block">
          <div className="text-[10px] uppercase tracking-widest text-text-secondary font-mono">
            ARCHITECTURE / 01
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";
import React, { useRef, useEffect } from "react";
import Link from "next/link";

export default function MagneticCTA({ href, children, className, ...props }: any) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  
  useEffect(() => {
    const el = buttonRef.current;
    if (!el) return;
    
    let animationFrameId = 0;
    let isHovered = false;
    let prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const handler = (e: MediaQueryListEvent) => prefersReducedMotion = e.matches;
    mediaQuery.addEventListener("change", handler);

    let currentX = 0;
    let currentY = 0;
    let targetX = 0;
    let targetY = 0;

    // The loop only runs while the pointer is over the button or the button is still
    // easing back to rest; previously it ran every frame for the lifetime of the page.
    const animate = () => {
      // Lerp for smooth magnetic effect
      currentX += (targetX - currentX) * 0.1;
      currentY += (targetY - currentY) * 0.1;

      const settled = !isHovered && Math.abs(targetX - currentX) < 0.05 && Math.abs(targetY - currentY) < 0.05;
      if (settled) {
        currentX = targetX;
        currentY = targetY;
      }
      
      if (el) {
        if (!prefersReducedMotion) {
          el.style.transform = `translate(${currentX}px, ${currentY}px)`;
        } else {
          el.style.transform = 'none';
        }
      }
      animationFrameId = settled ? 0 : requestAnimationFrame(animate);
    };
    const start = () => {
      if (!animationFrameId) animationFrameId = requestAnimationFrame(animate);
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (prefersReducedMotion) return;
      const rect = el.getBoundingClientRect();
      const x = (e.clientX - (rect.left + rect.width / 2)) * 0.2; // ~4-6px max
      const y = (e.clientY - (rect.top + rect.height / 2)) * 0.2;
      targetX = x;
      targetY = y;
      start();
    };

    const handleMouseEnter = () => {
      isHovered = true;
      start();
    };

    const handleMouseLeave = () => {
      isHovered = false;
      targetX = 0;
      targetY = 0;
      start();
    };

    el.addEventListener('mousemove', handleMouseMove);
    el.addEventListener('mouseenter', handleMouseEnter);
    el.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      cancelAnimationFrame(animationFrameId);
      mediaQuery.removeEventListener("change", handler);
      el.removeEventListener('mousemove', handleMouseMove);
      el.removeEventListener('mouseenter', handleMouseEnter);
      el.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Link
      href={href}
      ref={buttonRef}
      className={`relative inline-flex items-center justify-center group will-change-transform ${className}`}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center pointer-events-none">
        {typeof children === "string" && children.includes("→") ? (
          <>
            {children.replace("→", "").trim()}
            <span className="ml-2 transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </>
        ) : (
          children
        )}
      </span>
    </Link>
  );
}

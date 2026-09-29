"use client";

import { useEffect, useState } from "react";

export default function Cursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [hidden, setHidden] = useState(true);
  const [text, setText] = useState("");
  const [isHovering, setIsHovering] = useState(false);
  const [isPointer, setIsPointer] = useState(false);

  useEffect(() => {
    // Check if device supports hover (not a touch device)
    if (window.matchMedia("(hover: none)").matches) return;

    // Check for reduced motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const onMouseMove = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      if (hidden) setHidden(false);
    };

    const onMouseLeave = () => setHidden(true);
    const onMouseEnter = () => setHidden(false);

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      
      // Find closest interactable ancestor
      const clickable = target.closest('a, button, [role="button"], input, select, textarea');
      const projectCard = target.closest('[data-cursor="project"]');
      const imageEl = target.closest('img, [data-cursor="image"]');
      const ctaEl = target.closest('[data-cursor="cta"]');

      if (projectCard) {
        setText("VIEW CASE →");
        setIsHovering(true);
        setIsPointer(false);
      } else if (ctaEl) {
        setText("OPEN →");
        setIsHovering(true);
        setIsPointer(false);
      } else if (imageEl) {
        setText("EXPLORE");
        setIsHovering(true);
        setIsPointer(false);
      } else if (clickable) {
        setText("");
        setIsHovering(false);
        setIsPointer(true);
      } else {
        setText("");
        setIsHovering(false);
        setIsPointer(false);
      }
    };

    window.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseleave", onMouseLeave);
    document.addEventListener("mouseenter", onMouseEnter);
    document.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseleave", onMouseLeave);
      document.removeEventListener("mouseenter", onMouseEnter);
      document.removeEventListener("mouseover", handleMouseOver);
    };
  }, [hidden]);

  if (hidden) return null;

  return (
    <div
      className={`fixed top-0 left-0 pointer-events-none z-[100] transition-transform duration-100 ease-out hidden md:flex items-center justify-center rounded-full
        ${isHovering ? "bg-accent text-surface px-4 py-2" : "bg-primary w-4 h-4"}
        ${isPointer && !isHovering ? "scale-50 opacity-50" : ""}
      `}
      style={{
        transform: `translate3d(${position.x}px, ${position.y}px, 0) translate(-50%, -50%)`,
        mixBlendMode: isHovering ? "normal" : "difference",
      }}
    >
      {isHovering && <span className="text-[10px] font-bold tracking-widest whitespace-nowrap">{text}</span>}
    </div>
  );
}

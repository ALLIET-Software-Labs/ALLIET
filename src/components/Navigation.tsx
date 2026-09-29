"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navigation() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  return (
    <header 
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-background/90 backdrop-blur-md border-b border-border/50 py-4" : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group hover:opacity-80 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/alliet-logo.png" alt="ALLIET Software Labs" className="h-6 sm:h-7 w-auto object-contain" />
        </Link>
        
        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link href="/" className={`hover:text-accent transition-colors ${pathname === "/" ? "text-primary" : "text-text-secondary"}`}>Home</Link>
          <Link href="/about" className={`hover:text-accent transition-colors ${pathname === "/about" ? "text-primary" : "text-text-secondary"}`}>About</Link>
          <Link href="/work" className={`hover:text-accent transition-colors ${pathname.startsWith("/work") ? "text-primary" : "text-text-secondary"}`}>Work</Link>
          <Link href="/services" className={`hover:text-accent transition-colors ${pathname.startsWith("/services") ? "text-primary" : "text-text-secondary"}`}>Services</Link>
          <Link href="/products" className={`hover:text-accent transition-colors ${pathname.startsWith("/products") ? "text-primary" : "text-text-secondary"}`}>Products</Link>
          <Link href="/insights" className={`hover:text-accent transition-colors ${pathname === "/insights" ? "text-primary" : "text-text-secondary"}`}>Insights</Link>
        </nav>
        
        <div className="hidden md:block">
          <Link href="/contact" className="bg-primary text-surface px-5 py-2.5 rounded-full text-sm font-medium hover:bg-primary/90 transition-colors">
            Start a project →
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button 
          className="md:hidden flex flex-col items-end gap-1.5 p-2"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileMenuOpen}
        >
          <span className={`block w-6 h-0.5 bg-primary transition-transform ${mobileMenuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
          <span className={`block w-4 h-0.5 bg-primary transition-opacity ${mobileMenuOpen ? "opacity-0" : ""}`}></span>
          <span className={`block w-6 h-0.5 bg-primary transition-transform ${mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full h-screen bg-background border-t border-border p-6 flex flex-col gap-6 text-xl font-medium">
          <Link href="/" className="hover:text-accent transition-colors">Home</Link>
          <Link href="/about" className="hover:text-accent transition-colors">About</Link>
          <Link href="/work" className="hover:text-accent transition-colors">Work</Link>
          <Link href="/services" className="hover:text-accent transition-colors">Services</Link>
          <Link href="/products" className="hover:text-accent transition-colors">Products</Link>
          <Link href="/insights" className="hover:text-accent transition-colors">Insights</Link>
          <Link href="/contact" className="mt-4 bg-primary text-surface px-6 py-4 rounded-full text-base font-medium text-center hover:bg-primary/90 transition-colors">
            Start a project →
          </Link>
        </div>
      )}
    </header>
  );
}

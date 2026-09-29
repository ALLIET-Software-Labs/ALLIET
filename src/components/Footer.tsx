import Link from "next/link";
import { serviceContent } from "@/data/services";

export default function Footer() {
  return (
    <footer className="bg-primary text-surface py-20">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="font-bold text-2xl tracking-tight mb-4 block hover:text-surface/80 transition-colors">ALLIET</Link>
            <p className="text-surface/60 text-sm max-w-xs">An independent software lab building AI systems, digital products and automation — for clients, and for ourselves.</p>
          </div>
          <div>
            <h2 className="font-semibold mb-6">Services</h2>
            <ul className="space-y-3 text-surface/60 text-sm">
              {Object.entries(serviceContent).map(([slug, s]) => (
                <li key={slug}><Link href={`/services#${slug}`} className="hover:text-surface transition-colors">{s.title}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-6">Navigation</h2>
            <ul className="space-y-3 text-surface/60 text-sm">
              <li><Link href="/work" className="hover:text-surface transition-colors">Work</Link></li>
              <li><Link href="/services" className="hover:text-surface transition-colors">Services</Link></li>
              <li><Link href="/products" className="hover:text-surface transition-colors">Products</Link></li>
              <li><Link href="/about" className="hover:text-surface transition-colors">About</Link></li>
              <li><Link href="/insights" className="hover:text-surface transition-colors">Insights</Link></li>
              <li><Link href="/contact" className="hover:text-surface transition-colors">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h2 className="font-semibold mb-6">Connect</h2>
            <ul className="space-y-3 text-surface/60 text-sm">
              <li><a href="https://github.com/ALLIET-Software-Labs" target="_blank" rel="noopener noreferrer" className="hover:text-surface transition-colors">GitHub</a></li>
              <li><a href="https://x.com/allietlabs" target="_blank" rel="noopener noreferrer" className="hover:text-surface transition-colors">X</a></li>
              <li><a href="https://www.linkedin.com/company/alliet-software-labs" target="_blank" rel="noopener noreferrer" className="hover:text-surface transition-colors">LinkedIn</a></li>
              <li><a href="https://www.instagram.com/allietsoftwarelabs/" target="_blank" rel="noopener noreferrer" className="hover:text-surface transition-colors">Instagram</a></li>
              <li className="pt-4"><a href="mailto:contact@alliet.company" className="hover:text-surface transition-colors">contact@alliet.company</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-surface/20 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-surface/60 gap-4">
          <p>© 2026 ALLIET Software Labs · Hyderabad, India</p>
          <div className="flex gap-4">
            <Link href="/privacy-policy" className="hover:text-surface transition-colors">Privacy Policy</Link>
            <Link href="/terms" className="hover:text-surface transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

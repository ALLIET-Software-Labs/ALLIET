"use client";

import { useState } from "react";

interface ServiceItemProps {
  name: string;
  desc: string;
}

export default function ServiceItem({ name, desc }: ServiceItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`group relative py-8 border-t border-border first:border-t-0 hover:bg-surface-alt transition-colors duration-300 -mx-6 px-6 sm:mx-0 sm:px-4 rounded-lg cursor-pointer overflow-hidden ${isOpen ? 'bg-surface-alt' : ''}`} 
      onClick={() => setIsOpen(!isOpen)}
    >
      <div className={`absolute left-0 top-0 w-1 h-full bg-primary transition-transform duration-300 origin-top ${isOpen ? 'scale-y-100' : 'scale-y-0 group-hover:scale-y-100'}`}></div>
      
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-4 relative z-10">
        <h3 className="text-2xl font-semibold text-primary transition-colors duration-300 flex justify-between w-full items-center">
          {name}
        </h3>
      </div>
      
      <div className={`grid transition-all duration-500 ease-in-out ${isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr] md:group-hover:grid-rows-[1fr]"}`}>
        <div className="overflow-hidden">
          <p className="text-lg text-text-secondary pt-4 max-w-xl leading-relaxed">
            {desc}
          </p>
        </div>
      </div>
      
      {/* Mobile-only toggle indicator that doesn't rely on hover */}
      <div className="md:hidden absolute right-6 top-9 transition-transform duration-300" style={{ transform: isOpen ? 'rotate(45deg)' : 'rotate(0deg)' }}>
        <span className="text-primary/50 text-3xl font-light leading-none block -mt-1">+</span>
      </div>
    </div>
  );
}

import React from "react";
import { cn } from "@/lib/utils";

// GALERIE wordmark — serif italic title with a lavender→violet gradient bloom.
export default function Logo({ className, size = "md", glow = false }) {
  const sizes = {
    sm: "text-2xl",
    md: "text-3xl",
    lg: "text-5xl md:text-6xl",
    xl: "text-6xl md:text-8xl lg:text-[9rem]",
  };
  return (
    <span
      className={cn(
        "relative inline-block font-serif italic select-none leading-[1.05] tracking-tight",
        sizes[size],
        className
      )}
    >
      {glow && (
        <>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -inset-x-6 px-6 text-gradient-violet blur-[18px] opacity-90">Galerie</span>
          <span aria-hidden="true" className="pointer-events-none absolute inset-y-0 -inset-x-6 px-6 text-gradient-violet blur-[64px] opacity-70">Galerie</span>
        </>
      )}
      {/* inline-block so the gradient fill also covers the italic overhang of the final letter */}
      <span className="relative inline-block -mx-6 px-6 text-gradient-violet">Galerie</span>
    </span>
  );
}
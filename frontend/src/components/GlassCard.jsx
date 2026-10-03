import React from "react";
import { cn } from "@/lib/utils";

// Reusable glassmorphic card with optional violet ambient glow at the base.
export default function GlassCard({ className, glow = false, children, ...props }) {
  return (
    <div
      className={cn(
        "relative rounded-3xl glass-strong overflow-hidden",
        glow && "glow-soft",
        className
      )}
      {...props}
    >
      {glow && <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />}
      <div className="relative z-10 h-full">{children}</div>
    </div>
  );
}
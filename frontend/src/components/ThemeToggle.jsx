import React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/lib/theme";
import { cn } from "@/lib/utils";

export default function ThemeToggle({ className }) {
  const { theme, toggle } = useTheme();
  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className={cn(
        "relative h-9 w-9 rounded-full glass flex items-center justify-center text-foreground/80 hover:text-foreground transition-colors group",
        className
      )}
    >
      <div className="relative w-4 h-4">
        <Sun className={cn("absolute inset-0 w-4 h-4 transition-all duration-500", theme === "dark" ? "opacity-0 rotate-90 scale-0" : "opacity-100 rotate-0 scale-100")} />
        <Moon className={cn("absolute inset-0 w-4 h-4 transition-all duration-500", theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0")} />
      </div>
    </button>
  );
}
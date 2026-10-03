import React from "react";
import { Outlet, NavLink, useLocation } from "react-router-dom";
import { LayoutDashboard, Package, Boxes, ShoppingCart, IndianRupee, ShieldCheck, TrendingUp, MessageSquareQuote, Sparkles, BarChart3 } from "lucide-react";
import AssistantDock from "@/components/AssistantDock";
import Logo from "@/components/Logo";
import { useApp } from "@/lib/AppContext";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/studio", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/studio/products", label: "Products", icon: Package },
  { to: "/studio/inventory", label: "Inventory", icon: Boxes },
  { to: "/studio/orders", label: "Orders", icon: ShoppingCart },
  { to: "/studio/revenue", label: "Revenue", icon: IndianRupee },
  { to: "/studio/trust", label: "Trust & Reputation", icon: ShieldCheck },
  { to: "/studio/demand", label: "Demand Intelligence", icon: TrendingUp },
  { to: "/studio/reviews", label: "Review Integrity", icon: MessageSquareQuote },
  { to: "/studio/insights", label: "AI Insights", icon: Sparkles },
  { to: "/studio/intelligence", label: "Intelligence", icon: BarChart3 },
];

export default function StudioLayout() {
  const { user } = useApp();
  const location = useLocation();

  return (
    <div className="pt-24 min-h-screen flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 shrink-0 sticky top-24 h-[calc(100vh-6rem)] px-4 py-5">
        <div className="rounded-3xl glass-strong p-4 flex-1 flex flex-col">
          <div className="px-2 mb-4">
            <p className="text-[10px] uppercase tracking-widest text-muted-foreground">My Studio</p>
            <p className="font-display font-600 text-sm text-foreground truncate">{user?.studio || "Nova Electronics"}</p>
          </div>
          <nav className="flex-1 space-y-1 overflow-y-auto no-scrollbar">
            {NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={({ isActive }) => cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors",
                  isActive ? "bg-accent/15 text-accent font-medium" : "text-foreground/70 hover:text-foreground hover:bg-foreground/5"
                )}
              >
                <item.icon className="w-4 h-4" />
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 pt-3 border-t border-border/50">
            <div className="rounded-2xl glass p-3 text-center">
              <Logo size="sm" />
              <p className="text-[10px] text-muted-foreground mt-1">Vendor Studio</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile nav scroll */}
      <div className="lg:hidden fixed top-[68px] inset-x-0 z-30 px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) => cn(
                "shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                isActive ? "bg-accent text-white" : "glass text-foreground/70"
              )}
            >
              {item.label}
            </NavLink>
          ))}
        </div>
      </div>

      <main className="flex-1 min-w-0 px-4 lg:pl-2 pb-32 pt-14 lg:pt-5 max-w-5xl">
        <Outlet />
      </main>

      <AssistantDock />
    </div>
  );
}

export function StudioHeader({ eyebrow, title, subtitle, action }) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-4 mb-6">
      <div>
        <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{eyebrow}</p>
        <h1 className="font-display font-700 text-2xl md:text-3xl text-foreground">{title}</h1>
        {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatTile({ label, value, sub, trend, color = "accent" }) {
  return (
    <div className="rounded-3xl glass-strong p-5 relative overflow-hidden">
      <div className={cn("pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full blur-2xl opacity-30", color === "accent" ? "bg-accent" : "bg-emerald-500")} />
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</p>
      <p className="font-display font-700 text-2xl text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
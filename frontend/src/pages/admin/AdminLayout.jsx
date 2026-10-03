import React from "react";
import { Outlet, NavLink } from "react-router-dom";
import { LayoutDashboard, Users, Store, Package, ShoppingCart, MessageSquare, BarChart3, Activity } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/admin", label: "Overview", icon: LayoutDashboard, end: true },
  { to: "/admin/users", label: "Users", icon: Users },
  { to: "/admin/vendors", label: "Vendors", icon: Store },
  { to: "/admin/products", label: "Products", icon: Package },
  { to: "/admin/orders", label: "Orders", icon: ShoppingCart },
  { to: "/admin/reviews", label: "Reviews", icon: MessageSquare },
  { to: "/admin/intelligence", label: "Marketplace Intelligence", icon: BarChart3 },
  { to: "/admin/activity", label: "System Activity", icon: Activity },
];

export default function AdminLayout() {
  return (
    <div className="pt-24 min-h-screen flex">
      <aside className="hidden lg:flex flex-col w-60 shrink-0 sticky top-24 h-[calc(100vh-6rem)] px-4 py-5">
        <div className="rounded-3xl glass-strong p-4 flex-1">
          <p className="text-[10px] uppercase tracking-widest text-muted-foreground px-2 mb-3">Admin Console</p>
          <nav className="space-y-1">
            {NAV.map((item) => (
              <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn("flex items-center gap-3 px-3 py-2.5 rounded-2xl text-sm transition-colors", isActive ? "bg-accent/15 text-accent font-medium" : "text-foreground/70 hover:text-foreground hover:bg-foreground/5")}>
                <item.icon className="w-4 h-4" /> {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </aside>
      <div className="lg:hidden fixed top-[68px] inset-x-0 z-30 px-4">
        <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
          {NAV.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.end} className={({ isActive }) => cn("shrink-0 px-3 py-1.5 rounded-full text-xs font-medium", isActive ? "bg-accent text-white" : "glass text-foreground/70")}>{item.label}</NavLink>
          ))}
        </div>
      </div>
      <main className="flex-1 min-w-0 px-4 lg:pl-2 pb-20 pt-14 lg:pt-5 max-w-5xl">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminHeader({ eyebrow, title, subtitle }) {
  return (
    <div className="mb-6">
      <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{eyebrow}</p>
      <h1 className="font-display font-700 text-2xl md:text-3xl text-foreground">{title}</h1>
      {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
    </div>
  );
}

export function Tile({ label, value, sub }) {
  return (
    <div className="rounded-3xl glass-strong p-5 relative overflow-hidden">
      <div className="pointer-events-none absolute -right-6 -top-6 w-24 h-24 rounded-full bg-accent blur-2xl opacity-20" />
      <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1.5">{label}</p>
      <p className="font-display font-700 text-2xl text-foreground">{value}</p>
      {sub && <p className="text-xs text-muted-foreground mt-1">{sub}</p>}
    </div>
  );
}
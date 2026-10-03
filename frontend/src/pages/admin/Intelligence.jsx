import React from "react";
import { AdminHeader, Tile } from "@/pages/admin/AdminLayout";
import { TrendChart } from "@/components/StudioChart";
import { CATEGORIES, PRODUCTS, VENDOR_DEMAND, getProduct } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function AdminIntelligence() {
  return (
    <div>
      <AdminHeader eyebrow="Admin" title="Marketplace Intelligence" subtitle="Category demand · historical vs live · risk across vendors" />
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-1">Historical (Olist)</h3>
          <p className="text-xs text-muted-foreground mb-3">training dataset</p>
          <TrendChart data={[120, 140, 135, 160, 180, 175, 200, 220, 210, 250, 270, 290]} height={150} color="#6366f1" />
        </div>
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-1">Live GALERIE</h3>
          <p className="text-xs text-accent mb-3">real marketplace</p>
          <TrendChart data={[100, 130, 150, 165, 190, 210, 230, 250, 270, 300, 320, 345]} height={150} />
        </div>
      </div>

      <h3 className="font-display font-600 text-base text-foreground mb-3">Category demand</h3>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        {CATEGORIES.slice(0, 8).map((c) => {
          const count = PRODUCTS.filter((p) => p.category === c.id).length;
          const level = count > 4 ? "High" : count > 2 ? "Stable" : "Low";
          return (
            <div key={c.id} className="rounded-2xl glass-strong p-4 flex items-center gap-3">
              <div className="flex-1">
                <p className="text-sm text-foreground font-medium">{c.name}</p>
                <p className="text-[11px] text-muted-foreground">{count} listings · ₹{c.min.toLocaleString("en-IN")}–{c.max.toLocaleString("en-IN")}</p>
              </div>
              <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", level === "High" ? "bg-accent/15 text-accent" : level === "Stable" ? "bg-amber-500/15 text-amber-400" : "bg-muted text-muted-foreground")}>{level}</span>
            </div>
          );
        })}
      </div>

      <h3 className="font-display font-600 text-base text-foreground mb-3">Inventory risk across vendors</h3>
      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_90px_90px_90px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Product</span><span className="text-right">Cover</span><span className="text-right">Velocity</span><span className="text-right">Risk</span>
        </div>
        {VENDOR_DEMAND.sort((a, b) => a.cover - b.cover).map((d) => {
          const p = getProduct(d.product);
          const risk = d.cover <= 7 ? "Critical" : d.cover <= 15 ? "Watch" : "OK";
          return (
            <div key={d.product} className="grid grid-cols-[1fr_90px_90px_90px] gap-3 px-5 py-3.5 items-center border-b border-border/30">
              <span className="text-sm text-foreground truncate">{p.name}</span>
              <span className={cn("text-right text-sm", d.cover <= 7 ? "text-destructive font-medium" : "text-muted-foreground")}>{d.cover}d</span>
              <span className="text-right text-sm text-muted-foreground">{d.velocity}/day</span>
              <span className={cn("text-right text-xs font-semibold", risk === "Critical" ? "text-destructive" : risk === "Watch" ? "text-amber-400" : "text-emerald-400")}>{risk}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
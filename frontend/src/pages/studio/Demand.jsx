import React from "react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { TrendChart } from "@/components/StudioChart";
import { VENDOR_DEMAND, getProduct } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function StudioDemand() {
  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Demand Intelligence" subtitle="Historical (Olist) vs live GALERIE data · forecasts" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="High demand" value={String(VENDOR_DEMAND.filter((d) => d.level === "High").length)} />
        <StatTile label="Avg confidence" value="88%" />
        <StatTile label="Forecast error" value="9.2%" sub="last quarter" />
        <StatTile label="Restock suggested" value="3" color="emerald" />
      </div>

      {/* Historical vs live split */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-600 text-base text-foreground">Historical (Olist)</h3>
            <span className="px-2 py-0.5 rounded-full glass text-[10px] text-muted-foreground">training data</span>
          </div>
          <TrendChart data={[40, 52, 48, 61, 70, 65, 78, 82, 88, 95, 102, 110]} height={140} color="#6366f1" />
          <p className="text-xs text-muted-foreground mt-2">Backtest error 9.2% — model used to forecast live demand.</p>
        </div>
        <div className="rounded-3xl glass-strong p-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-display font-600 text-base text-foreground">Live GALERIE</h3>
            <span className="px-2 py-0.5 rounded-full bg-accent/15 text-accent text-[10px]">real-time</span>
          </div>
          <TrendChart data={[30, 45, 50, 58, 72, 80, 88, 96, 104, 112, 120, 128]} height={140} color="#8b5cf6" />
          <p className="text-xs text-muted-foreground mt-2">Velocity trending up — 3 products spiking this week.</p>
        </div>
      </div>

      {/* Product demand table */}
      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_90px_90px_80px_80px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Product</span><span className="text-right">Level</span><span className="text-right">Actual</span><span className="text-right">Forecast</span><span className="text-right">Conf.</span><span className="text-right">Cover</span>
        </div>
        {VENDOR_DEMAND.map((d) => {
          const p = getProduct(d.product);
          return (
            <div key={d.product} className="grid grid-cols-[1fr_80px_90px_90px_80px_80px] gap-3 px-5 py-3.5 items-center border-b border-border/30">
              <div className="flex items-center gap-3 min-w-0">
                <img src={p.image} alt="" className="w-9 h-9 rounded-lg object-cover" />
                <span className="text-sm text-foreground truncate">{p.name}</span>
              </div>
              <span className={cn("text-right text-xs font-semibold", d.level === "High" ? "text-accent" : d.level === "Stable" ? "text-amber-400" : "text-muted-foreground")}>{d.level}</span>
              <span className="text-right text-sm text-muted-foreground">{d.actual}</span>
              <span className="text-right text-sm text-foreground">{d.forecast}</span>
              <span className="text-right text-sm text-muted-foreground">{Math.round(d.confidence * 100)}%</span>
              <span className={cn("text-right text-sm font-medium", d.cover <= 7 ? "text-destructive" : "text-muted-foreground")}>{d.cover}d</span>
            </div>
          );
        })}
      </div>

      <div className="mt-5 rounded-2xl glass p-4 flex items-center gap-3">
        <div className="h-9 w-9 rounded-xl bg-accent/20 flex items-center justify-center"><span className="text-accent">→</span></div>
        <p className="text-sm text-muted-foreground flex-1">Sony WH-1000XM5 forecast: 115 units next month (88% confidence). Current cover 9 days.</p>
        <button className="px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">Create restock draft</button>
      </div>
    </div>
  );
}
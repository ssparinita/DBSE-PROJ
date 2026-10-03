import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, TrendingUp, Sparkles, MessageSquareQuote, ChevronRight } from "lucide-react";
import { StudioHeader } from "@/pages/studio/StudioLayout";
import { VENDOR_TRUST, VENDOR_DEMAND, VENDOR_INSIGHTS, REVIEWS } from "@/lib/mockData";

// Combined intelligence view — shows how Trust, Reviews, Insights & Demand
// are ONE connected system with cross-linking.
export default function StudioIntelligence() {
  const flagged = REVIEWS.filter((r) => r.status === "flagged").length;
  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Intelligence" subtitle="Trust · Reviews · Demand · Insights — one connected system" />

      <div className="rounded-3xl glass-strong p-5 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />
        <div className="relative z-10 grid md:grid-cols-4 gap-4">
          <Link to="/studio/trust" className="rounded-2xl glass p-4 hover:border-accent/40 transition-colors group">
            <ShieldCheck className="w-5 h-5 text-accent mb-2" />
            <p className="font-display font-700 text-2xl text-foreground">{VENDOR_TRUST.score}</p>
            <p className="text-xs text-muted-foreground">Trust score</p>
            <p className="text-[11px] text-accent mt-2 flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></p>
          </Link>
          <Link to="/studio/reviews" className="rounded-2xl glass p-4 hover:border-accent/40 transition-colors group">
            <MessageSquareQuote className="w-5 h-5 text-accent mb-2" />
            <p className="font-display font-700 text-2xl text-foreground">{flagged}</p>
            <p className="text-xs text-muted-foreground">Reviews flagged</p>
            <p className="text-[11px] text-accent mt-2 flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></p>
          </Link>
          <Link to="/studio/demand" className="rounded-2xl glass p-4 hover:border-accent/40 transition-colors group">
            <TrendingUp className="w-5 h-5 text-accent mb-2" />
            <p className="font-display font-700 text-2xl text-foreground">{VENDOR_DEMAND.filter((d) => d.level === "High").length}</p>
            <p className="text-xs text-muted-foreground">High-demand SKUs</p>
            <p className="text-[11px] text-accent mt-2 flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></p>
          </Link>
          <Link to="/studio/insights" className="rounded-2xl glass p-4 hover:border-accent/40 transition-colors group">
            <Sparkles className="w-5 h-5 text-accent mb-2" />
            <p className="font-display font-700 text-2xl text-foreground">{VENDOR_INSIGHTS.length}</p>
            <p className="text-xs text-muted-foreground">Open insights</p>
            <p className="text-[11px] text-accent mt-2 flex items-center gap-1">Open <ChevronRight className="w-3 h-3" /></p>
          </Link>
        </div>
      </div>

      <h3 className="font-display font-600 text-base text-foreground mb-3">Cross-linked drivers</h3>
      <div className="space-y-2.5">
        <DriverCard
          title="Slow first response (3.1h) is lowering your trust score"
          evidence="14-day avg 3.1h vs 2h target — costs ~1.5 trust points"
          links={[{ label: "Trust", to: "/studio/trust" }, { label: "Tickets", to: "/studio/orders" }, { label: "Insight", to: "/studio/insights" }]}
        />
        <DriverCard
          title="2 reviews flagged for manipulation"
          evidence="Burst timing + 0.94 text similarity + 1-day-old accounts"
          links={[{ label: "Reviews", to: "/studio/reviews" }, { label: "Trust", to: "/studio/trust" }, { label: "Insight", to: "/studio/insights" }]}
        />
        <DriverCard
          title="Galaxy Buds2 Pro demand spike vs low inventory"
          evidence="Velocity 7/day, 4 days cover, forecast 80 next month"
          links={[{ label: "Demand", to: "/studio/demand" }, { label: "Inventory", to: "/studio/inventory" }, { label: "Insight", to: "/studio/insights" }]}
        />
      </div>
    </div>
  );
}

function DriverCard({ title, evidence, links }) {
  return (
    <div className="rounded-2xl glass-strong p-4">
      <p className="text-sm text-foreground font-medium mb-1">{title}</p>
      <p className="text-xs text-muted-foreground mb-3">Evidence: {evidence}</p>
      <div className="flex flex-wrap gap-2">
        {links.map((l) => (
          <Link key={l.label} to={l.to} className="px-3 py-1.5 rounded-full glass text-xs text-accent hover:border-accent/40 transition-colors">{l.label} →</Link>
        ))}
      </div>
    </div>
  );
}
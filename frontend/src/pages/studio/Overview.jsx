import React from "react";
import { Link } from "react-router-dom";
import { AlertTriangle, Clock, Star, Reply, RotateCcw, ShieldAlert, ChevronRight, TrendingUp, IndianRupee, Package, Boxes } from "lucide-react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { TrendChart } from "@/components/StudioChart";
import { VENDOR_REVENUE, VENDOR_TRUST, VENDOR_INSIGHTS, VENDOR_DEMAND, PRODUCTS, getProduct } from "@/lib/mockData";
import { formatINR, formatINRCompact } from "@/lib/format";

const QUEUE = [
  { icon: Clock, label: "2 orders to ship by 5 PM today", to: "/studio/orders", color: "text-amber-400" },
  { icon: AlertTriangle, label: "Galaxy Buds2 Pro stock-out in 4 days", to: "/studio/inventory", color: "text-destructive" },
  { icon: Reply, label: "1 review needs a reply", to: "/studio/reviews", color: "text-accent" },
  { icon: RotateCcw, label: "1 refund request pending", to: "/studio/orders", color: "text-amber-400" },
  { icon: ShieldAlert, label: "Trust score at risk — response time slipped", to: "/studio/trust", color: "text-destructive" },
];

export default function StudioOverview() {
  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Overview" subtitle="What should I do today" />

      {/* Action queue */}
      <div className="rounded-3xl glass-strong p-5 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 ambient-glow opacity-50" />
        <div className="relative z-10">
          <h2 className="font-display font-600 text-lg text-foreground mb-4">Prioritized action queue</h2>
          <div className="space-y-2">
            {QUEUE.map((q, i) => (
              <Link key={i} to={q.to} className="flex items-center gap-3 px-4 py-3 rounded-2xl glass hover:border-accent/40 transition-colors group">
                <q.icon className={"w-4 h-4 " + q.color} />
                <span className="text-sm text-foreground/90 flex-1">{q.label}</span>
                <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* KPI tiles */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Revenue (30d)" value={formatINRCompact(VENDOR_REVENUE.last30)} sub="+12% vs prev" />
        <StatTile label="Orders" value="48" sub="3 to ship" />
        <StatTile label="Products" value={String(PRODUCTS.length)} sub="6 categories" />
        <StatTile label="Trust score" value={`${VENDOR_TRUST.score}/100`} sub={VENDOR_TRUST.standing} color="emerald" />
      </div>

      {/* Revenue trend + insights */}
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-1">Revenue trend</h3>
          <p className="text-xs text-muted-foreground mb-3">Last 12 weeks · ₹</p>
          <TrendChart data={VENDOR_REVENUE.trend} height={160} />
        </div>
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">Live insights</h3>
          <div className="space-y-2.5">
            {VENDOR_INSIGHTS.map((i) => (
              <Link key={i.id} to={i.page === "inventory" ? "/studio/inventory" : i.page === "reviews" ? "/studio/reviews" : i.page === "trust" ? "/studio/trust" : i.page === "demand" ? "/studio/demand" : "/studio/insights"} className="block px-3 py-2.5 rounded-2xl glass hover:border-accent/40 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm text-foreground/90 leading-tight">{i.title}</p>
                  {i.urgent && <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-400 text-[10px] font-bold shrink-0">URGENT</span>}
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{i.evidence} · {i.confidence}% confidence</p>
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* Top products */}
      <div className="rounded-3xl glass-strong p-5">
        <h3 className="font-display font-600 text-base text-foreground mb-4">Top products by revenue</h3>
        <div className="space-y-3">
          {VENDOR_REVENUE.byProduct.map((row) => {
            const p = getProduct(row.product);
            return (
              <div key={row.product} className="flex items-center gap-3">
                <img src={p.image} alt="" className="w-10 h-10 rounded-xl object-cover" />
                <span className="flex-1 text-sm text-foreground/90 truncate">{p.name}</span>
                <span className="text-xs text-muted-foreground">{row.units} sold</span>
                <span className="text-sm font-semibold text-foreground w-24 text-right">{formatINR(row.revenue)}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
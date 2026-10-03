import React from "react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { TrendChart, MiniBars } from "@/components/StudioChart";
import { VENDOR_REVENUE, getProduct } from "@/lib/mockData";
import { formatINR, formatINRCompact } from "@/lib/format";

export default function StudioRevenue() {
  const bars = VENDOR_REVENUE.byProduct.map((r) => ({ label: r.product, v: r.revenue }));
  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Revenue" subtitle="Item-level commission transparency · ₹" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Total revenue" value={formatINRCompact(VENDOR_REVENUE.total)} />
        <StatTile label="Last 30 days" value={formatINRCompact(VENDOR_REVENUE.last30)} sub="+12%" />
        <StatTile label="Commission paid" value={formatINRCompact(VENDOR_REVENUE.commission)} sub="~8% blended" />
        <StatTile label="Net earnings" value={formatINRCompact(VENDOR_REVENUE.net)} color="emerald" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">12-week trend</h3>
          <TrendChart data={VENDOR_REVENUE.trend} height={180} />
        </div>
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">Revenue by product</h3>
          <MiniBars data={bars} height={180} />
        </div>
      </div>
      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_90px_90px_100px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Product</span><span className="text-right">Units</span><span className="text-right">Gross</span><span className="text-right">Comm.</span><span className="text-right">Net</span>
        </div>
        {VENDOR_REVENUE.byProduct.map((r) => {
          const p = getProduct(r.product);
          const comm = Math.round(r.revenue * 0.085);
          return (
            <div key={r.product} className="grid grid-cols-[1fr_80px_90px_90px_100px] gap-3 px-5 py-3.5 items-center border-b border-border/30">
              <span className="text-sm text-foreground truncate">{p.name}</span>
              <span className="text-right text-sm text-muted-foreground">{r.units}</span>
              <span className="text-right text-sm text-foreground">{formatINRCompact(r.revenue)}</span>
              <span className="text-right text-sm text-destructive">−{formatINRCompact(comm)}</span>
              <span className="text-right text-sm font-semibold text-emerald-400">{formatINRCompact(r.revenue - comm)}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
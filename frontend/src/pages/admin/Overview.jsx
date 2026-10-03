import React from "react";
import { AdminHeader, Tile } from "@/pages/admin/AdminLayout";
import { TrendChart } from "@/components/StudioChart";
import { ADMIN_STATS, VENDORS, PRODUCTS, ORDERS } from "@/lib/mockData";
import { formatINRCompact } from "@/lib/format";

export default function AdminOverview() {
  return (
    <div>
      <AdminHeader eyebrow="Admin" title="Marketplace overview" subtitle="GMV, orders, vendors & commission · all in ₹" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Tile label="GMV" value={formatINRCompact(ADMIN_STATS.gmv)} sub="+18% MoM" />
        <Tile label="Orders" value={String(ADMIN_STATS.orders)} sub="1284 total" />
        <Tile label="Active vendors" value={String(ADMIN_STATS.vendors)} />
        <Tile label="Commission earned" value={formatINRCompact(ADMIN_STATS.commission)} sub="~8% blended" />
      </div>
      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">GMV trend (12 weeks)</h3>
          <TrendChart data={[220, 260, 240, 310, 340, 320, 380, 420, 400, 460, 510, 560]} height={180} />
        </div>
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">Commission earned</h3>
          <TrendChart data={[18, 21, 19, 25, 27, 26, 30, 34, 32, 37, 41, 45]} height={180} color="#10b981" />
        </div>
      </div>
      <div className="rounded-3xl glass-strong p-5">
        <h3 className="font-display font-600 text-base text-foreground mb-4">Top vendors by trust</h3>
        <div className="space-y-3">
          {[...VENDORS].sort((a, b) => b.trust - a.trust).map((v) => (
            <div key={v.id} className="flex items-center gap-3">
              <img src={v.logo} alt="" className="w-9 h-9 rounded-full object-cover" />
              <span className="flex-1 text-sm text-foreground">{v.studio}</span>
              <span className="text-xs text-muted-foreground">{v.city}</span>
              <div className="w-28 h-2 rounded-full bg-muted overflow-hidden"><div className="h-full bg-accent rounded-full" style={{ width: `${v.trust}%` }} /></div>
              <span className="text-sm font-semibold text-foreground w-10 text-right">{v.trust}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
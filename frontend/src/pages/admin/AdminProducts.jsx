import React from "react";
import { AdminHeader } from "@/pages/admin/AdminLayout";
import { PRODUCTS, getCategory, priceFlag, getVendor } from "@/lib/mockData";
import { formatINR } from "@/lib/format";
import { AlertTriangle } from "lucide-react";

export default function AdminProducts() {
  const flagged = PRODUCTS.map((p) => ({ p, flag: priceFlag(p) })).filter((x) => x.flag);
  return (
    <div>
      <AdminHeader eyebrow="Admin" title="Products" subtitle="Out-of-range price flag queue" />
      <div className="rounded-3xl glass-strong p-5 mb-6 border border-amber-500/30">
        <div className="flex items-center gap-2 mb-1">
          <AlertTriangle className="w-5 h-5 text-amber-400" />
          <h3 className="font-display font-600 text-base text-foreground">Price validation queue</h3>
          <span className="ml-auto px-2.5 py-1 rounded-full bg-amber-500/15 text-amber-400 text-xs font-bold">{flagged.length} flagged</span>
        </div>
        <p className="text-xs text-muted-foreground">Listings outside their category's expected ₹ range feed the vendor Trust score.</p>
      </div>
      {flagged.length === 0 ? (
        <p className="text-sm text-muted-foreground">All listings within expected ranges. ✓</p>
      ) : (
        <div className="rounded-3xl glass-strong overflow-hidden">
          {flagged.map(({ p, flag }) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3.5 border-b border-border/30">
              <img src={p.image} alt="" className="w-10 h-10 rounded-lg object-cover" />
              <div className="flex-1 min-w-0">
                <p className="text-sm text-foreground truncate">{p.name}</p>
                <p className="text-[11px] text-amber-400">{flag}</p>
              </div>
              <span className="text-sm font-medium text-foreground">{formatINR(p.price)}</span>
              <span className="text-xs text-muted-foreground">{getVendor(p.vendor)?.studio}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
import React from "react";
import { AdminHeader } from "@/pages/admin/AdminLayout";
import { VENDORS, PRODUCTS, REVIEWS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function AdminVendors() {
  return (
    <div>
      <AdminHeader eyebrow="Admin" title="Vendors" subtitle="Trust scores, reliability signals & status" />
      <div className="space-y-3">
        {VENDORS.map((v) => {
          const productCount = PRODUCTS.filter((p) => p.vendor === v.id).length;
          const reviews = REVIEWS.filter((r) => r.vendor === v.id);
          const flagged = reviews.filter((r) => r.status === "flagged").length;
          const standing = v.trust >= 90 ? "Trusted" : v.trust >= 80 ? "Good" : "At risk";
          return (
            <div key={v.id} className="rounded-3xl glass-strong p-5">
              <div className="flex items-center gap-4 mb-4">
                <img src={v.logo} alt="" className="w-12 h-12 rounded-2xl object-cover" />
                <div className="flex-1 min-w-0">
                  <p className="font-display font-600 text-base text-foreground">{v.studio}</p>
                  <p className="text-xs text-muted-foreground">{v.city} · joined {v.joined}</p>
                </div>
                <span className={cn("px-2.5 py-1 rounded-full text-[10px] font-bold", standing === "Trusted" ? "bg-emerald-500/15 text-emerald-400" : standing === "Good" ? "bg-accent/15 text-accent" : "bg-destructive/15 text-destructive")}>{standing}</span>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <Metric label="Trust score" value={`${v.trust}/100`} />
                <Metric label="Products" value={String(productCount)} />
                <Metric label="Reviews" value={String(reviews.length)} />
                <Metric label="Flagged" value={String(flagged)} bad={flagged > 0} />
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2">
                <Signal label="On-time delivery" value="94%" />
                <Signal label="Refund rate" value="4.1%" />
                <Signal label="Response time" value="3.1h" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Metric({ label, value, bad }) {
  return <div className="rounded-2xl glass p-3"><p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p><p className={cn("font-display font-700 text-lg", bad ? "text-destructive" : "text-foreground")}>{value}</p></div>;
}
function Signal({ label, value }) {
  return <div className="rounded-xl glass px-3 py-2"><p className="text-[10px] text-muted-foreground">{label}</p><p className="text-sm font-medium text-foreground">{value}</p></div>;
}
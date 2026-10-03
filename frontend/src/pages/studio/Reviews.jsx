import React, { useState } from "react";
import { Star, ShieldCheck, Flag, Reply, ChevronDown, ChevronUp } from "lucide-react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { REVIEWS, getProduct } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const FILTERS = ["All", "Normal", "Needs review", "Flagged"];
const STATUS = {
  normal: "bg-emerald-500/15 text-emerald-400",
  needs_review: "bg-amber-500/15 text-amber-400",
  flagged: "bg-destructive/15 text-destructive",
};

export default function StudioReviews() {
  const [filter, setFilter] = useState("All");
  const [expanded, setExpanded] = useState(null);
  const list = REVIEWS.filter((r) => filter === "All" || (filter === "Needs review" ? r.status === "needs_review" : r.status === filter.toLowerCase()));
  const verified = Math.round((REVIEWS.filter((r) => r.verified).length / REVIEWS.length) * 100);

  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Review Integrity" subtitle="Evidence-based detection · a flag is not a penalty" />
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile label="Avg rating" value="4.5" />
        <StatTile label="Total reviews" value={String(REVIEWS.length)} />
        <StatTile label="Verified share" value={`${verified}%`} color="emerald" />
        <StatTile label="Flagged" value={String(REVIEWS.filter((r) => r.status === "flagged").length)} />
      </div>

      <div className="flex items-center gap-2 mb-4 overflow-x-auto no-scrollbar">
        {FILTERS.map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn("shrink-0 px-3.5 py-2 rounded-full text-xs font-medium transition-colors", filter === f ? "bg-foreground text-background" : "glass text-foreground/70")}>{f}</button>
        ))}
      </div>

      <div className="space-y-3">
        {list.map((r) => {
          const p = getProduct(r.product);
          const open = expanded === r.id;
          return (
            <div key={r.id} className="rounded-3xl glass-strong p-5">
              <div className="flex items-start justify-between gap-3 mb-2">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground text-sm">{r.author}</span>
                  {r.verified && <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 text-[10px] font-bold">VERIFIED</span>}
                  <span className={cn("px-2 py-0.5 rounded-full text-[10px] font-bold", STATUS[r.status])}>{r.status.replace("_", " ")}</span>
                </div>
                <div className="flex">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={cn("w-3.5 h-3.5", i < r.rating ? "fill-accent text-accent" : "text-foreground/20")} />)}</div>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed mb-2">{r.body}</p>
              <div className="flex items-center gap-3 text-xs text-muted-foreground">
                <span>{p?.name}</span><span>·</span><span>{r.date}</span><span>·</span><span>{r.helpful} helpful</span>
                <button onClick={() => setExpanded(open ? null : r.id)} className="ml-auto flex items-center gap-1 text-accent hover:underline">
                  {open ? "Hide signals" : "Review intelligence signals"} {open ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                </button>
              </div>
              {open && (
                <div className="mt-4 pt-4 border-t border-border/50 grid grid-cols-2 md:grid-cols-4 gap-3">
                  <Signal label="Account age" value={`${r.signals.accountAgeDays}d`} bad={r.signals.accountAgeDays < 7} />
                  <Signal label="Text similarity" value={`${Math.round(r.signals.textSimilarity * 100)}%`} bad={r.signals.textSimilarity > 0.7} />
                  <Signal label="Burst timing" value={r.signals.burst ? "Yes" : "No"} bad={r.signals.burst} />
                  <Signal label="Verified purchase" value={r.verified ? "Yes" : "No"} bad={!r.verified} />
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <button className="px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/80 hover:text-foreground flex items-center gap-1"><Reply className="w-3.5 h-3.5" /> Reply</button>
                <button className="px-3 py-1.5 rounded-full glass text-xs font-medium text-foreground/80 hover:text-foreground flex items-center gap-1"><Flag className="w-3.5 h-3.5" /> Report</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function Signal({ label, value, bad }) {
  return (
    <div className="rounded-xl glass p-3">
      <p className="text-[10px] uppercase tracking-widest text-muted-foreground">{label}</p>
      <p className={cn("text-sm font-semibold", bad ? "text-destructive" : "text-foreground")}>{value}</p>
    </div>
  );
}
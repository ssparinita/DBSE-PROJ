import React from "react";
import { ShieldCheck, TrendingUp, TrendingDown, Sparkles, ArrowRight } from "lucide-react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { TrendChart } from "@/components/StudioChart";
import { VENDOR_TRUST, REVIEWS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

export default function StudioTrust() {
  const verifiedShare = Math.round((REVIEWS.filter((r) => r.verified).length / REVIEWS.length) * 100);
  const flagged = REVIEWS.filter((r) => r.status === "flagged").length;
  return (
    <div>
      <StudioHeader eyebrow="My Studio" title="Trust & Reputation" subtitle="Composite score from real signals · explainable" />

      {/* Score hero */}
      <div className="rounded-3xl glass-strong p-6 mb-6 relative overflow-hidden">
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow" />
        <div className="relative z-10 grid md:grid-cols-[200px_1fr] gap-6 items-center">
          <div className="text-center">
            <div className="relative h-36 w-36 mx-auto">
              <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(var(--accent))" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(VENDOR_TRUST.score / 100) * 327} 327`} />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display font-700 text-4xl text-foreground">{VENDOR_TRUST.score}</span>
                <span className="text-[10px] uppercase tracking-widest text-muted-foreground">/ 100</span>
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-accent">{VENDOR_TRUST.standing}</p>
            <p className="text-[11px] text-muted-foreground">{VENDOR_TRUST.eligible ? "Trusted Studio badge" : "90+ for badge"}</p>
          </div>
          <div>
            <h3 className="font-display font-600 text-lg text-foreground mb-1">Trust score over 8 weeks</h3>
            <TrendChart data={VENDOR_TRUST.trend} height={140} color="#10b981" />
          </div>
        </div>
      </div>

      {/* Review integrity summary — placed high (core differentiator) */}
      <div className="rounded-3xl glass-strong p-5 mb-6 border border-accent/30">
        <div className="flex items-center gap-2 mb-3">
          <ShieldCheck className="w-5 h-5 text-accent" />
          <h3 className="font-display font-600 text-base text-foreground">Review Integrity</h3>
          <span className="ml-auto text-xs text-muted-foreground">core differentiator</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="rounded-2xl glass p-4"><p className="text-xs text-muted-foreground">Verified share</p><p className="font-display font-700 text-xl text-foreground">{verifiedShare}%</p></div>
          <div className="rounded-2xl glass p-4"><p className="text-xs text-muted-foreground">Flagged</p><p className="font-display font-700 text-xl text-destructive">{flagged}</p></div>
          <div className="rounded-2xl glass p-4"><p className="text-xs text-muted-foreground">Confirmed manipulation</p><p className="font-display font-700 text-xl text-foreground">0</p></div>
          <div className="rounded-2xl glass p-4"><p className="text-xs text-muted-foreground">Avg rating</p><p className="font-display font-700 text-xl text-foreground">4.5</p></div>
        </div>
      </div>

      {/* Signals */}
      <h3 className="font-display font-600 text-base text-foreground mb-3">Trust signals</h3>
      <div className="grid md:grid-cols-2 gap-3 mb-6">
        {VENDOR_TRUST.signals.map((s) => {
          const pct = s.invert ? Math.max(0, 100 - s.value * 10) : s.value;
          const good = s.invert ? s.value <= s.target : s.value >= s.target;
          return (
            <div key={s.label} className="rounded-2xl glass-strong p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-foreground/90">{s.label}</span>
                <span className={cn("text-sm font-semibold", good ? "text-emerald-400" : "text-amber-400")}>
                  {s.value}{s.unit || "%"}{s.invert ? "" : "%"}
                </span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className={cn("h-full rounded-full", good ? "bg-emerald-400" : "bg-amber-400")} style={{ width: `${pct}%` }} />
              </div>
              <p className="text-[11px] text-muted-foreground mt-1.5">Target {s.target}{s.unit || "%"} · {good ? "on track" : "needs work"}</p>
            </div>
          );
        })}
      </div>

      {/* What-if simulator */}
      <div className="rounded-3xl glass-strong p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-5 h-5 text-accent" />
          <h3 className="font-display font-600 text-base text-foreground">Next best improvement</h3>
        </div>
        <div className="space-y-2.5">
          {VENDOR_TRUST.whatIf.map((w) => (
            <div key={w.action} className="flex items-center gap-3 px-4 py-3 rounded-2xl glass">
              <TrendingUp className="w-4 h-4 text-emerald-400" />
              <span className="text-sm text-foreground/90 flex-1">{w.action}</span>
              <span className="px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-400 text-xs font-bold">+{w.delta} pts</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-3">What raises the score: faster responses, more verified reviews, lower refunds. What lowers it: cancellations, quality complaints, slow shipping.</p>
      </div>
    </div>
  );
}
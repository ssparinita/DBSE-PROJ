import React from "react";
import { Link } from "react-router-dom";
import { Sparkles, ArrowRight, ShieldCheck, TrendingUp, Mic, Cpu } from "lucide-react";
import Logo from "@/components/Logo";
import { Footer } from "@/pages/Home";

export default function About() {
  return (
    <div className="pt-28 pb-10 px-4 max-w-4xl mx-auto">
      <div className="text-center mb-12">
        <Logo size="lg" className="block mb-5" />
        <p className="font-serif italic text-xl md:text-2xl text-foreground/70 max-w-2xl mx-auto leading-relaxed">
          A futuristic marketplace where art meets intelligence — curated objects, real trust, and an AI that comes to you.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-12">
        {[
          { icon: ShieldCheck, title: "Trust first", desc: "Every vendor earns a composite trust score from real signals. Reviews are scored, not assumed." },
          { icon: TrendingUp, title: "Intelligence layer", desc: "Demand forecasts, review integrity and AI insights — all explainable, all grounded in live data." },
          { icon: Mic, title: "Ask Studio", desc: "An ambient AI assistant with voice. It surfaces what matters before you have to look for it." },
        ].map((f) => (
          <div key={f.title} className="rounded-3xl glass-strong p-6 relative overflow-hidden">
            <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow opacity-50" />
            <div className="relative z-10">
              <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center mb-4"><f.icon className="w-5 h-5 text-accent" /></div>
              <h3 className="font-display font-600 text-lg text-foreground mb-1.5">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl glass-strong p-8 text-center mb-12">
        <Sparkles className="w-6 h-6 text-accent mx-auto mb-3" />
        <h2 className="font-display font-700 text-2xl text-foreground mb-2">Built for the college tech expo</h2>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto mb-5">
          A general lifestyle marketplace with an art-gallery aesthetic — phones, laptops, fashion, home and decor.
          All prices in ₹. Three role experiences. One connected intelligence system.
        </p>
        <Link to="/shop" className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold">
          Explore the gallery <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <Footer />
    </div>
  );
}
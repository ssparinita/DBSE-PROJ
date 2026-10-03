import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, TrendingUp, Palette, Cpu, Shirt, Home as HomeIcon, ArrowDownRight } from "lucide-react";
import Logo from "@/components/Logo";
import GalleryCarousel from "@/components/GalleryCarousel";
import ProductCard from "@/components/ProductCard";
import { PRODUCTS, CATEGORIES, VENDORS, getProduct } from "@/lib/mockData";
import { cn } from "@/lib/utils";

const COLLECTIONS = [
  { name: "Future Tech", desc: "Devices that feel ahead of their time", icon: Cpu, count: 12 },
  { name: "Atelier Mode", desc: "Considered fashion for the new generation", icon: Shirt, count: 8 },
  { name: "Living Spaces", desc: "Objects that make a house feel curated", icon: HomeIcon, count: 9 },
  { name: "Art & Decor", desc: "Walls worth staring at", icon: Palette, count: 5 },
];

export default function Home() {
  const trending = PRODUCTS.filter((p) => p.tags?.includes("trending")).slice(0, 8);
  const featured = PRODUCTS.filter((p) => p.tags?.includes("featured")).slice(0, 4);
  // One piece from each Studio — the pieces on the gallery floor this week.
  const galleryPieces = ["p5", "p8", "p16", "p20", "p23", "p26"].map(getProduct).filter(Boolean);

  return (
    <div className="pt-24">
      {/* HERO */}
      <section className="relative min-h-[calc(100vh-6rem)] flex flex-col justify-center px-4 pt-4 pb-12">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 ambient-glow-top opacity-80" />
        <div
          className="pointer-events-none absolute left-[4%] top-[22%] h-72 w-[52%] rounded-full blur-[120px] opacity-80"
          style={{ background: "radial-gradient(60% 60% at 50% 50%, hsl(var(--glow) / 0.5), transparent 72%)" }}
        />
        <div className="relative z-10 w-full max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1.5fr_1fr] gap-8 lg:gap-12 items-end mb-8 lg:mb-10">
            <div>
              <p className="text-[11px] uppercase tracking-[0.35em] text-accent mb-4 animate-float-up">
                This week at Galerie
              </p>
              <Logo size="xl" glow className="block mb-2" />
              <h2 className="font-display font-600 text-2xl md:text-4xl leading-tight text-foreground animate-float-up">
                Six independent Studios.{" "}
                <span className="font-serif italic font-400 text-accent">One gallery floor.</span>
              </h2>
              <p className="mt-5 max-w-xl text-foreground/75 leading-relaxed animate-float-up">
                Every piece here is made and shipped by the Studio that signs it. Reviews come only from
                verified purchases, and every Studio publishes its delivery record before you buy.
              </p>
            </div>

            <div className="flex lg:justify-end items-end gap-8 lg:gap-10 animate-float-up">
              {[
                { k: "Studios", v: "241" },
                { k: "Verified reviews", v: "96%" },
                { k: "Avg. dispatch", v: "1.8 days" },
              ].map((s) => (
                <div key={s.k}>
                  <p className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1.5">{s.k}</p>
                  <p className="font-display font-700 text-2xl md:text-3xl text-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>

          <GalleryCarousel products={galleryPieces} />

          <div className="mt-8 flex items-center justify-center gap-3 flex-wrap">
            <Link
              to="/shop"
              className="group inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              Explore Collection
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              to="/about"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full glass text-sm font-medium text-foreground/80 hover:text-foreground transition-colors"
            >
              The Gallery
            </Link>
          </div>
          <p className="mt-5 text-center text-xs text-muted-foreground">
            Scroll, drag or swipe the floor to move between pieces
          </p>
        </div>
      </section>

      {/* FEATURED COLLECTIONS */}
      <Section
        eyebrow="Featured Collections"
        title="Curated worlds"
        subtitle="Themed selections across the marketplace"
      >
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {COLLECTIONS.map((c) => (
            <Link
              key={c.name}
              to="/shop"
              className="group relative rounded-3xl overflow-hidden glass-strong p-6 hover:glow-soft transition-all duration-500 hover:-translate-y-1"
            >
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 ambient-glow opacity-60" />
              <div className="relative z-10">
                <div className="h-11 w-11 rounded-2xl glass flex items-center justify-center mb-4">
                  <c.icon className="w-5 h-5 text-accent" />
                </div>
                <h3 className="font-display font-600 text-lg text-foreground mb-1">{c.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">{c.desc}</p>
                <span className="text-xs text-accent font-medium">{c.count} pieces →</span>
              </div>
            </Link>
          ))}
        </div>
      </Section>

      {/* TRENDING */}
      <Section
        eyebrow="Trending now"
        title="What the gallery is moving"
        subtitle="Live demand signals across vendors"
        to="/shop"
        toLabel="View all"
      >
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {trending.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </Section>

      {/* CATEGORIES */}
      <Section eyebrow="Browse" title="By category" subtitle="Real goods at real Indian prices">
        <div className="flex flex-wrap gap-2.5">
          {CATEGORIES.map((c) => (
            <Link
              key={c.id}
              to={`/shop?cat=${c.id}`}
              className="px-4 py-2.5 rounded-full glass text-sm font-medium text-foreground/80 hover:text-foreground hover:border-accent/40 transition-colors"
            >
              {c.name}
            </Link>
          ))}
        </div>
      </Section>

      {/* INTELLIGENCE BANNER */}
      <section className="px-4 mb-20">
        <div className="max-w-6xl mx-auto relative rounded-[32px] overflow-hidden glass-strong p-8 md:p-12">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/3 ambient-glow" />
          <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full glass text-[11px] uppercase tracking-[0.25em] text-accent mb-4">
                <TrendingUp className="w-3 h-3" /> Intelligence layer
              </div>
              <h2 className="font-display font-700 text-3xl md:text-4xl text-foreground leading-tight mb-3">
                Trust is a first-class feature.
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Every review is scored. Every vendor earns a composite trust score from real signals —
                delivery, verified reviews, refunds, response time. AI sits on top of live data, and every
                insight shows its evidence.
              </p>
              <Link to="/studio/intelligence" className="inline-flex items-center gap-2 text-accent font-medium text-sm group">
                Explore the intelligence <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                { k: "Vendors", v: VENDORS.length },
                { k: "Products", v: PRODUCTS.length },
                { k: "Avg trust", v: "89 / 100" },
                { k: "Verified reviews", v: "78%" },
              ].map((s) => (
                <div key={s.k} className="rounded-2xl glass p-5">
                  <p className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{s.k}</p>
                  <p className="font-display font-700 text-2xl text-foreground">{s.v}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

function Section({ eyebrow, title, subtitle, to, toLabel, children }) {
  return (
    <section className="px-4 mb-20 max-w-6xl mx-auto w-full">
      <div className="flex items-end justify-between mb-6 gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.25em] text-accent mb-2">{eyebrow}</p>
          <h2 className="font-display font-700 text-2xl md:text-3xl text-foreground">{title}</h2>
          {subtitle && <p className="text-sm text-muted-foreground mt-1">{subtitle}</p>}
        </div>
        {to && (
          <Link to={to} className="shrink-0 inline-flex items-center gap-1.5 text-sm text-foreground/70 hover:text-foreground transition-colors">
            {toLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      {children}
    </section>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border/40 px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <Logo size="sm" />
            <p className="text-xs text-muted-foreground mt-2">Curated objects, art & design. All prices in ₹.</p>
          </div>
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <Link to="/shop" className="hover:text-foreground transition-colors">Shop</Link>
            <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
            <span className="text-xs">© 2026 GALERIE</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
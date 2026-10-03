import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import StageCard from "@/components/gallery/StageCard";
import { Image } from "@/components/ui/image";
import { PRODUCTS } from "@/lib/mockData";
import { cn } from "@/lib/utils";

// Spatial 3D cover-flow gallery: several pieces are always visible at once and
// the centered piece scales forward while the rest recede. Driven by wheel
// scroll, drag / touch swipe, keyboard arrows and the nav controls.
export default function GalleryCarousel({ products }) {
  const items = useMemo(() => (products && products.length ? products : PRODUCTS.slice(0, 6)), [products]);
  const n = items.length;

  const [index, setIndex] = useState(0);
  const [w, setW] = useState(1200);
  const stageRef = useRef(null);
  const wheelAt = useRef(0);

  // measure the stage so cards scale to the viewport
  useEffect(() => {
    const el = stageRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(entries[0].contentRect.width));
    ro.observe(el);
    setW(el.clientWidth);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    if (index >= n) setIndex(0);
  }, [n, index]);

  const go = (dir) => setIndex((i) => (i + dir + n) % n);

  // keyboard navigation
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + n) % n);
      else if (e.key === "ArrowRight") setIndex((i) => (i + 1) % n);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [n]);

  // responsive geometry
  const cw = w < 480 ? 236 : w < 768 ? 300 : w < 1120 ? 370 : 430;
  const ch = Math.round(cw * 1.26);
  const gap = Math.round(cw * 0.72);
  const stageH = ch + 140;

  const onWheel = (e) => {
    const now = Date.now();
    if (now - wheelAt.current < 480) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 24) return;
    wheelAt.current = now;
    go(d > 0 ? 1 : -1);
  };

  const onDragEnd = (_, info) => {
    const power = info.offset.x + info.velocity.x * 0.4;
    if (power < -70) go(1);
    else if (power > 70) go(-1);
  };

  const active = items[Math.min(index, n - 1)];

  return (
    <div className="relative w-full select-none">
      {/* blurred architectural glow taken from the active piece */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <Image
          key={active?.id}
          src={active?.image}
          alt=""
          aria-hidden="true"
          className="w-[62%] max-w-[820px] aspect-square object-cover blur-[110px] opacity-25"
        />
      </div>

      <div className="relative" style={{ perspective: "1800px" }}>
        <motion.div
          ref={stageRef}
          className="relative preserve-3d"
          style={{ height: stageH }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.13}
          onDragEnd={onDragEnd}
          onWheel={onWheel}
        >
          {items.map((product, i) => {
            let o = i - index;
            if (o > n / 2) o -= n;
            if (o < -n / 2) o += n;
            return (
              <StageCard
                key={product.id}
                product={product}
                offset={o}
                cw={cw}
                ch={ch}
                gap={gap}
                onSelect={(off) => setIndex((index + off + n) % n)}
              />
            );
          })}
        </motion.div>

        {/* nav controls, vertically centered on the floor */}
        <button
          onClick={() => go(-1)}
          aria-label="Previous piece"
          className="absolute left-1 md:left-4 top-1/2 -translate-y-1/2 z-50 h-11 w-11 md:h-12 md:w-12 rounded-full glass-strong flex items-center justify-center text-white/85 hover:text-white hover:border-accent/50 transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={() => go(1)}
          aria-label="Next piece"
          className="absolute right-1 md:right-4 top-1/2 -translate-y-1/2 z-50 h-11 w-11 md:h-12 md:w-12 rounded-full glass-strong flex items-center justify-center text-white/85 hover:text-white hover:border-accent/50 transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>

      {/* pagination */}
      <div className="mt-4 flex items-center justify-center gap-2.5">
        {items.map((p, i) => (
          <button
            key={p.id}
            onClick={() => setIndex(i)}
            aria-label={`Go to ${p.name}`}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              i === index ? "w-8 bg-accent" : "w-2 bg-foreground/25 hover:bg-foreground/45"
            )}
          />
        ))}
      </div>
    </div>
  );
}
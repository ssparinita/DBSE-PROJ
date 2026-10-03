import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getVendor, getCategory } from "@/lib/mockData";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

// One piece on the exhibition floor. Position/scale/blur are derived from its
// offset from the active piece; the center card is sharp and dominant, side
// cards recede with depth, rotation and blur.
export default function StageCard({ product, offset, cw, ch, gap, onSelect }) {
  const abs = Math.abs(offset);
  const isCenter = offset === 0;
  const vendor = getVendor(product.vendor);
  const category = getCategory(product.category);
  const lowStock = product.stock < 10;

  const x = offset * gap;
  const scale = isCenter ? 1 : Math.max(0.7 - (abs - 1) * 0.08, 0.5);
  const rotateY = isCenter ? 0 : offset * -15;
  const z = isCenter ? 90 : -160 - (abs - 1) * 170;
  const opacity = isCenter ? 1 : abs === 1 ? 0.6 : abs === 2 ? 0.28 : 0;
  const blur = isCenter ? 0 : abs === 1 ? 4 : 9;
  const interactive = abs <= 1;

  const inner = (
    <div
      className={cn(
        "relative h-full w-full rounded-[30px] overflow-hidden glass-strong",
        isCenter ? "glow-violet" : "shadow-2xl"
      )}
    >
      <Image
        src={product.image}
        alt={product.name}
        fittingType="fill"
        className="absolute inset-0 h-full w-full object-cover"
      />
      {/* scrim keeps white text legible over any artwork */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/45" />
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.12), transparent 42%)" }}
      />

      <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
        <span className="px-3 py-1.5 rounded-full glass text-[10px] font-semibold uppercase tracking-[0.15em] text-white">
          {category?.name}
        </span>
        {product.tags?.includes("featured") && (
          <span className="px-3 py-1.5 rounded-full bg-accent text-[10px] font-bold uppercase tracking-[0.15em] text-white">
            Featured
          </span>
        )}
      </div>

      <div className="absolute inset-x-4 bottom-4">
        <div className="rounded-2xl glass-strong border-white/10 px-5 py-4">
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display font-600 text-lg md:text-xl leading-snug text-white line-clamp-2">
              {product.name}
            </h3>
            <span className="shrink-0 inline-flex items-center gap-1 text-accent">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-semibold text-white">{product.rating}</span>
            </span>
          </div>
          <p className="mt-1 text-xs text-white/65">
            {vendor?.studio} · {vendor?.city}
          </p>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Price</p>
              <p className="font-display font-700 text-2xl text-white">{formatINR(product.price)}</p>
            </div>
            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.2em] text-white/50">Status</p>
              <p className={cn("text-sm font-semibold", lowStock ? "text-amber-300" : "text-emerald-300")}>
                {lowStock ? `Low · ${product.stock} left` : "In stock"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <motion.div
      className="absolute top-1/2 left-1/2"
      style={{
        width: cw,
        height: ch,
        marginLeft: -cw / 2,
        marginTop: -ch / 2,
        zIndex: 40 - abs,
        pointerEvents: interactive ? "auto" : "none",
        transformStyle: "preserve-3d",
      }}
      initial={false}
      animate={{ x, scale, rotateY, z, opacity, filter: `blur(${blur}px)` }}
      transition={{ type: "spring", stiffness: 130, damping: 24, mass: 0.9 }}
      whileHover={isCenter ? { scale: 1.015 } : undefined}
    >
      {isCenter ? (
        <Link to={`/product/${product.id}`} className="block h-full w-full" aria-label={product.name}>
          {inner}
        </Link>
      ) : (
        <button
          type="button"
          onClick={() => onSelect && onSelect(offset)}
          className="block h-full w-full text-left"
          aria-label={`Focus ${product.name}`}
        >
          {inner}
        </button>
      )}
    </motion.div>
  );
}
import React from "react";
import { Link } from "react-router-dom";
import { Star, ShieldCheck } from "lucide-react";
import { getVendor, getCategory, priceFlag } from "@/lib/mockData";
import { formatINR } from "@/lib/format";
import { useApp } from "@/lib/AppContext";
import { cn } from "@/lib/utils";

export default function ProductCard({ product, compact = false }) {
  const { addToCart } = useApp();
  const vendor = getVendor(product.vendor);
  const category = getCategory(product.category);
  const flag = priceFlag(product);

  return (
    <div className="group relative rounded-3xl overflow-hidden glass-strong transition-all duration-500 hover:-translate-y-1 hover:glow-soft">
      <Link to={`/product/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          <span className="px-2.5 py-1 rounded-full glass text-[10px] font-semibold tracking-wider text-white/90 uppercase">
            {category?.name}
          </span>
          {product.tags?.includes("trending") && (
            <span className="px-2.5 py-1 rounded-full bg-accent/80 text-white text-[10px] font-bold tracking-wider uppercase w-fit">
              Trending
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full glass text-white">
          <Star className="w-3 h-3 fill-accent text-accent" />
          <span className="text-xs font-semibold">{product.rating}</span>
        </div>
      </Link>
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="font-display font-600 text-base leading-tight text-foreground line-clamp-1 mb-1 group-hover:text-accent transition-colors">
            {product.name}
          </h3>
        </Link>
        <div className="flex items-center gap-1.5 mb-3 text-xs text-muted-foreground">
          <ShieldCheck className="w-3 h-3 text-accent/70" />
          <span className="truncate">{vendor?.studio}</span>
          <span className="text-accent/70">· {vendor?.trust}</span>
        </div>
        <div className="flex items-end justify-between">
          <div>
            <p className="font-display font-700 text-xl text-foreground">{formatINR(product.price)}</p>
            {product.mrp > product.price && (
              <p className="text-xs text-muted-foreground line-through">{formatINR(product.mrp)}</p>
            )}
          </div>
          <button
            onClick={() => addToCart(product.id)}
            className="px-3.5 py-2 rounded-full bg-accent text-white text-xs font-semibold hover:bg-accent/90 transition-colors active:scale-95"
          >
            Add
          </button>
        </div>
        {flag && <p className="mt-2 text-[11px] text-amber-400/80">{flag}</p>}
      </div>
    </div>
  );
}
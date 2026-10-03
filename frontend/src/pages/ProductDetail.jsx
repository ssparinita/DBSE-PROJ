import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import {
  Star,
  ShieldCheck,
  Truck,
  ArrowLeft,
  Zap,
} from "lucide-react";
import { useApp } from "@/lib/AppContext";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useApp();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  async function loadProduct() {
    try {
      setLoading(true);

      const response = await fetch(`${API}/api/products/${id}`);

      if (!response.ok) {
        throw new Error("Product not found");
      }

      const data = await response.json();

      const normalized = {
        ...data,
        image:
          data.imageUrl ||
          data.image ||
          data.image_link ||
          "",
        name: data.name || "Untitled product",
        price: Number(data.price || 0),
        rating: Number(data.rating || 0),
        reviews: Number(data.reviewCount || data.reviews || 0),
        description:
          data.description ||
          data.desc ||
          "A curated product from the GALERIE marketplace.",
        vendorName:
          typeof data.vendor === "string"
            ? data.vendor
            : data.vendor?.storeName ||
              data.vendor?.name ||
              "Galerie Studio",
        categoryName:
          typeof data.category === "string"
            ? data.category
            : data.category?.name ||
              "Collection",
      };

      setProduct(normalized);
    } catch (error) {
      console.error(error);
      setProduct(null);
    } finally {
      setLoading(false);
    }
  }

  const handleAdd = () => {
    if (!product) return;

    /*
      AppContext currently expects a product ID.
      We pass the real backend product ID.
    */
    addToCart(product.id);

    setAdded(true);

    setTimeout(() => {
      setAdded(false);
    }, 1500);
  };

  const handleBuy = () => {
    if (!product) return;

    addToCart(product.id);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="pt-32 pb-20 px-4 max-w-6xl mx-auto">
        <div className="animate-pulse grid md:grid-cols-2 gap-8">
          <div className="aspect-square rounded-[32px] glass-strong" />
          <div className="space-y-5">
            <div className="h-10 rounded-xl bg-foreground/5" />
            <div className="h-5 w-40 rounded bg-foreground/5" />
            <div className="h-24 rounded-xl bg-foreground/5" />
            <div className="h-12 w-48 rounded-xl bg-foreground/5" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <p className="text-muted-foreground mb-3">
          Product not found.
        </p>

        <Link
          to="/shop"
          className="text-accent text-sm"
        >
          Back to shop
        </Link>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 max-w-6xl mx-auto">

      <Link
        to="/shop"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to shop
      </Link>

      <div className="grid md:grid-cols-2 gap-8">

        {/* IMAGE */}
        <div className="relative rounded-[32px] overflow-hidden glass-strong glow-soft">
          <div className="aspect-square">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 rounded-full glass text-[11px] font-semibold uppercase tracking-wider text-white">
              {product.categoryName}
            </span>
          </div>
        </div>

        {/* INFO */}
        <div className="flex flex-col">

          <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground leading-tight mb-2">
            {product.name}
          </h1>

          <div className="flex items-center gap-4 mb-5">

            <div className="flex items-center gap-1.5">
              <Star className="w-4 h-4 fill-accent text-accent" />

              <span className="font-semibold text-foreground">
                {product.rating.toFixed(1)}
              </span>

              <span className="text-sm text-muted-foreground">
                ({product.reviews} reviews)
              </span>
            </div>

            <span className="text-sm text-emerald-400">
              Available
            </span>

          </div>

          <p className="text-muted-foreground leading-relaxed mb-6">
            {product.description}
          </p>

          <div className="flex items-end gap-3 mb-6">
            <p className="font-display font-700 text-4xl text-foreground">
              {formatINR(product.price)}
            </p>
          </div>

          {/* VENDOR */}
          <div className="flex items-center gap-3 rounded-2xl glass p-3.5 mb-6">

            <div className="w-11 h-11 rounded-full glass flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-accent" />
            </div>

            <div className="flex-1">
              <p className="font-semibold text-foreground text-sm">
                {product.vendorName}
              </p>

              <p className="text-xs text-muted-foreground">
                GALERIE Marketplace Vendor
              </p>
            </div>

            <div className="text-right">
              <div className="flex items-center gap-1 text-accent">
                <ShieldCheck className="w-4 h-4" />
                <span className="font-semibold text-foreground">
                  Verified
                </span>
              </div>

              <p className="text-[10px] text-muted-foreground">
                Trust layer
              </p>
            </div>

          </div>

          {/* ACTIONS */}
          <div className="flex gap-3 mb-6">

            <button
              onClick={handleAdd}
              className={cn(
                "flex-1 px-5 py-3.5 rounded-2xl glass-strong font-semibold text-sm transition-colors hover:border-accent/40",
                added
                  ? "text-emerald-400"
                  : "text-foreground"
              )}
            >
              {added
                ? "✓ Added to cart"
                : "Add to cart"}
            </button>

            <button
              onClick={handleBuy}
              className="flex-1 px-5 py-3.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
            >
              <Zap className="w-4 h-4" />
              Buy now
            </button>

          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Truck className="w-4 h-4 text-accent" />
            Free delivery · 7-day returns · GALERIE buyer protection
          </div>

        </div>
      </div>

      {/* REVIEWS PLACEHOLDER */}
      <section className="mt-14">
        <h2 className="font-display font-700 text-2xl text-foreground mb-5">
          Reviews
        </h2>

        <div className="rounded-2xl glass-strong p-5">
          <p className="text-sm text-muted-foreground">
            Reviews will appear here from the GALERIE review system.
          </p>
        </div>
      </section>

    </div>
  );
}
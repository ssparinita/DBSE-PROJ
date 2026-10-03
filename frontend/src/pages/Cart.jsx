import React from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Trash2,
  Minus,
  Plus,
  ShoppingBag,
  ArrowRight,
  ShieldCheck,
  Loader2,
} from "lucide-react";

import { useApp } from "@/lib/AppContext";
import { formatINR } from "@/lib/format";

export default function Cart() {
  const {
    cartItems,
    cartTotal,
    cartCount,
    loadingCart,
    updateQty,
    removeFromCart,
  } = useApp();

  const navigate = useNavigate();

  // =========================================================
  // LOADING
  // =========================================================

  if (loadingCart) {
    return (
      <div className="pt-32 pb-20 px-4 text-center">
        <Loader2 className="w-7 h-7 animate-spin mx-auto mb-4 text-accent" />

        <h1 className="font-display font-700 text-2xl text-foreground">
          Loading your cart...
        </h1>
      </div>
    );
  }

  // =========================================================
  // EMPTY CART
  // =========================================================

  if (cartItems.length === 0) {
    return (
      <div className="pt-32 pb-20 px-4 text-center max-w-md mx-auto">
        <div className="h-16 w-16 rounded-3xl glass flex items-center justify-center mx-auto mb-5">
          <ShoppingBag className="w-7 h-7 text-muted-foreground" />
        </div>

        <h1 className="font-display font-700 text-2xl text-foreground mb-2">
          Your cart is empty
        </h1>

        <p className="text-sm text-muted-foreground mb-6">
          Curated objects are waiting in the gallery.
        </p>

        <Link
          to="/shop"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background text-sm font-semibold"
        >
          Explore collection
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  // =========================================================
  // GROUP BY VENDOR
  // =========================================================

  const groups = cartItems.reduce((acc, item) => {
    const vendorName =
      item.product?.vendor || "Galerie Studio";

    if (!acc[vendorName]) {
      acc[vendorName] = [];
    }

    acc[vendorName].push(item);

    return acc;
  }, {});

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="pt-28 pb-20 px-4 max-w-5xl mx-auto">

      <div className="flex items-end justify-between mb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-accent mb-2">
            GALERIE
          </p>

          <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground">
            Your cart
          </h1>
        </div>

        <span className="text-sm text-muted-foreground">
          {cartCount} {cartCount === 1 ? "item" : "items"}
        </span>
      </div>

      <div className="grid lg:grid-cols-[1fr_340px] gap-6">

        {/* =================================================
            CART ITEMS
        ================================================= */}

        <div className="space-y-5">

          {Object.entries(groups).map(([vendorName, items]) => {

            const vendorSubtotal = items.reduce(
              (sum, item) =>
                sum +
                Number(item.product.price) *
                  Number(item.quantity),
              0
            );

            return (
              <div
                key={vendorName}
                className="rounded-3xl glass-strong p-5"
              >

                {/* Vendor header */}

                <div className="flex items-center justify-between gap-3 mb-4 pb-3 border-b border-border/50">

                  <div className="flex items-center gap-2 min-w-0">

                    <ShieldCheck className="w-4 h-4 text-accent shrink-0" />

                    <span className="font-semibold text-foreground text-sm truncate">
                      {vendorName}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      · Verified studio
                    </span>

                  </div>

                  <span className="text-sm font-medium text-foreground shrink-0">
                    {formatINR(vendorSubtotal)}
                  </span>

                </div>

                {/* Items */}

                <div className="space-y-5">

                  {items.map((item) => {

                    const product = item.product;

                    const quantity = Number(
                      item.quantity || 1
                    );

                    const price = Number(
                      product.price || 0
                    );

                    const lineTotal =
                      price * quantity;

                    return (
                      <div
                        key={item.id}
                        className="flex items-center gap-4"
                      >

                        {/* Image */}

                        <Link
                          to={`/product/${product.id}`}
                          className="shrink-0"
                        >
                          <img
                            src={
                              product.imageUrl ||
                              "https://placehold.co/160x160?text=GALERIE"
                            }
                            alt={product.name}
                            className="w-20 h-20 rounded-2xl object-cover"
                          />
                        </Link>

                        {/* Details */}

                        <div className="flex-1 min-w-0">

                          <Link
                            to={`/product/${product.id}`}
                            className="font-medium text-foreground text-sm line-clamp-1 hover:text-accent transition-colors"
                          >
                            {product.name}
                          </Link>

                          <p className="text-xs text-muted-foreground mt-0.5">
                            {formatINR(price)} each
                          </p>

                          {/* Quantity controls */}

                          <div className="flex items-center gap-2 mt-2">

                            <div className="flex items-center glass rounded-full">

                              <button
                                onClick={() =>
                                  updateQty(
                                    item.id,
                                    quantity - 1
                                  )
                                }
                                className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <span className="w-7 text-center text-sm font-medium">
                                {quantity}
                              </span>

                              <button
                                onClick={() =>
                                  updateQty(
                                    item.id,
                                    quantity + 1
                                  )
                                }
                                className="h-7 w-7 flex items-center justify-center text-muted-foreground hover:text-foreground"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>

                            </div>

                            <button
                              onClick={() =>
                                removeFromCart(item.id)
                              }
                              className="text-muted-foreground hover:text-destructive transition-colors"
                              title="Remove"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>

                          </div>

                        </div>

                        {/* Line total */}

                        <p className="font-display font-700 text-lg text-foreground shrink-0">
                          {formatINR(lineTotal)}
                        </p>

                      </div>
                    );
                  })}

                </div>
              </div>
            );
          })}

        </div>

        {/* =================================================
            SUMMARY
        ================================================= */}

        <div className="lg:sticky lg:top-28 h-fit rounded-3xl glass-strong p-6 glow-soft">

          <h2 className="font-display font-600 text-lg text-foreground mb-4">
            Order summary
          </h2>

          <div className="space-y-2.5 text-sm mb-4">

            <Row
              label={`Subtotal (${cartCount} items)`}
              value={formatINR(cartTotal)}
            />

            <Row
              label="Delivery"
              value="Free"
            />

            <Row
              label="GALERIE protection"
              value="Included"
            />

          </div>

          <div className="flex items-center justify-between pt-4 border-t border-border/50 mb-5">

            <span className="font-semibold text-foreground">
              Total
            </span>

            <span className="font-display font-700 text-2xl text-foreground">
              {formatINR(cartTotal)}
            </span>

          </div>

          <button
            onClick={() => navigate("/checkout")}
            className="w-full px-5 py-3.5 rounded-2xl bg-accent text-white font-semibold text-sm hover:bg-accent/90 transition-colors flex items-center justify-center gap-2"
          >
            Checkout
            <ArrowRight className="w-4 h-4" />
          </button>

          <p className="text-xs text-muted-foreground text-center mt-3">
            All amounts in ₹ · Multi-vendor order
          </p>

        </div>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">
        {label}
      </span>

      <span className="text-foreground font-medium">
        {value}
      </span>
    </div>
  );
}
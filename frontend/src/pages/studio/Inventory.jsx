import React, { useEffect, useMemo, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

export default function StudioInventory() {
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadInventory = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API}/api/vendor/inventory`, {
        method: "GET",
        credentials: "include",
        headers: {
          Accept: "application/json",
        },
      });

      const text = await res.text();

      if (!res.ok) {
        console.error(
          "Inventory API error:",
          res.status,
          text
        );

        throw new Error(
          `Inventory API returned ${res.status}: ${text}`
        );
      }

      let data;

      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          "Inventory API returned invalid JSON."
        );
      }

      console.log("GALERIE inventory API:", data);

      const rows =
        Array.isArray(data)
          ? data
          : Array.isArray(data.inventory)
          ? data.inventory
          : [];

      setInventory(rows);

    } catch (err) {
      console.error(
        "Failed to load vendor inventory:",
        err
      );

      setInventory([]);
      setError(err.message || "Unable to load inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInventory();
  }, []);

  const critical = inventory.filter((x) => {
    const stock = Number(
      x.quantity ??
      x.stock ??
      0
    );

    const reserved = Number(
      x.reserved ?? 0
    );

    return stock - reserved <= 9;
  }).length;

  const averageStock = useMemo(() => {
    if (!inventory.length) return 0;

    const total = inventory.reduce(
      (sum, x) =>
        sum +
        Number(
          x.quantity ??
          x.stock ??
          0
        ),
      0
    );

    return Math.round(
      total / inventory.length
    );
  }, [inventory]);

  return (
    <div>
      <StudioHeader
        eyebrow="My Studio"
        title="Inventory"
        subtitle="Demand vs stock · risk indicators"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">

        <StatTile
          label="Critical risk"
          value={String(critical)}
          sub="< 10 units"
          color="emerald"
        />

        <StatTile
          label="SKUs tracked"
          value={String(inventory.length)}
        />

        <StatTile
          label="Avg stock"
          value={String(averageStock)}
          sub="units / SKU"
        />

        <StatTile
          label="Restock drafts"
          value="0"
          sub="create when needed"
        />

      </div>

      {/* ERROR */}
      {error && (
        <div className="mb-5 rounded-2xl border border-destructive/30 bg-destructive/10 p-4">

          <div className="flex items-start gap-3">

            <AlertTriangle className="w-5 h-5 text-destructive shrink-0 mt-0.5" />

            <div className="flex-1 min-w-0">

              <p className="text-sm font-semibold text-destructive">
                Inventory API error
              </p>

              <p className="text-xs text-muted-foreground mt-1 break-words">
                {error}
              </p>

            </div>

            <button
              onClick={loadInventory}
              className="px-3 py-2 rounded-full bg-accent text-white text-xs font-semibold flex items-center gap-2"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Retry
            </button>

          </div>

        </div>
      )}

      <div className="rounded-3xl glass-strong overflow-hidden">

        <div className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">

          <span>Product</span>

          <span className="text-right">
            Stock
          </span>

          <span className="text-right">
            Reserved
          </span>

          <span className="text-right">
            Available
          </span>

          <span className="text-right">
            Risk
          </span>

        </div>

        {loading ? (

          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading inventory…
          </div>

        ) : inventory.length === 0 ? (

          <div className="p-8 text-center">

            <p className="text-sm text-muted-foreground">
              {error
                ? "Inventory could not be loaded."
                : "No inventory records found."}
            </p>

            {!error && (
              <button
                onClick={loadInventory}
                className="mt-3 px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold"
              >
                Refresh
              </button>
            )}

          </div>

        ) : (

          inventory.map((item, index) => {

            const stock = Number(
              item.quantity ??
              item.stock ??
              0
            );

            const reserved = Number(
              item.reserved ??
              0
            );

            const available = Math.max(
              0,
              stock - reserved
            );

            const risk =
              available <= 5
                ? "Critical"
                : available <= 15
                ? "Watch"
                : "Stable";

            const product =
              item.product || {};

            return (
              <div
                key={
                  item.id ||
                  product.id ||
                  index
                }
                className="grid grid-cols-[1fr_100px_100px_100px_120px] gap-3 px-5 py-3.5 items-center border-b border-border/30 hover:bg-foreground/5"
              >

                <div className="flex items-center gap-3 min-w-0">

                  <img
                    src={
                      product.imageUrl ||
                      product.image ||
                      "/placeholder.png"
                    }
                    alt=""
                    className="w-9 h-9 rounded-lg object-cover shrink-0"
                    onError={(e) => {
                      e.currentTarget.src =
                        "/placeholder.png";
                    }}
                  />

                  <div className="min-w-0">

                    <p className="text-sm text-foreground truncate">
                      {product.name ||
                        item.name ||
                        "Product"}
                    </p>

                    <p className="text-[11px] text-muted-foreground truncate">

                      {typeof product.category === "object"
                        ? product.category?.name || "Inventory"
                        : product.category || "Inventory"}

                    </p>

                  </div>

                </div>

                <span className="text-right text-sm text-muted-foreground">
                  {stock}
                </span>

                <span className="text-right text-sm text-muted-foreground">
                  {reserved}
                </span>

                <span
                  className={cn(
                    "text-right text-sm font-medium",
                    available <= 5
                      ? "text-destructive"
                      : available <= 15
                      ? "text-amber-400"
                      : "text-foreground"
                  )}
                >
                  {available}
                </span>

                <span className="text-right">

                  <span
                    className={cn(
                      "px-2 py-1 rounded-full text-[11px] font-semibold",

                      risk === "Critical"
                        ? "bg-destructive/15 text-destructive"

                        : risk === "Watch"
                        ? "bg-amber-500/15 text-amber-400"

                        : "bg-emerald-500/15 text-emerald-400"
                    )}
                  >
                    {risk}
                  </span>

                </span>

              </div>
            );
          })

        )}

      </div>

      {critical > 0 && (

        <div className="mt-5 rounded-2xl glass p-4 flex items-center gap-3">

          <AlertTriangle className="w-5 h-5 text-destructive" />

          <p className="text-sm text-muted-foreground flex-1">

            {critical} product
            {critical !== 1 ? "s" : ""}
            {" "}need attention because available stock is low.

          </p>

          <button className="px-4 py-2 rounded-full bg-accent text-white text-xs font-semibold">
            Review stock
          </button>

        </div>

      )}

    </div>
  );
}
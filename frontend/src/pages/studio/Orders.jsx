import React, { useEffect, useMemo, useState } from "react";
import {
  Truck,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { StudioHeader, StatTile } from "@/pages/studio/StudioLayout";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

const STATUS = {
  PENDING: {
    label: "Pending",
    icon: Clock,
    color: "text-amber-400",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-accent",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "text-accent",
  },
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: Clock,
    color: "text-destructive",
  },
};

export default function StudioOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/vendor/orders`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load vendor orders");
        return res.json();
      })
      .then((data) => {
        setOrders(Array.isArray(data) ? data : data.orders || []);
      })
      .catch((err) => {
        console.error(err);
        setOrders([]);
      })
      .finally(() => setLoading(false));
  }, []);

  const stats = useMemo(() => {
    let pending = 0;
    let shipped = 0;
    let delivered = 0;

    orders.forEach((order) => {
      const status = String(order.status || "").toUpperCase();

      if (status === "PENDING" || status === "CONFIRMED") {
        pending++;
      }

      if (status === "SHIPPED") shipped++;
      if (status === "DELIVERED") delivered++;
    });

    return { pending, shipped, delivered };
  }, [orders]);

  return (
    <div>
      <StudioHeader
        eyebrow="My Studio"
        title="Orders"
        subtitle="Item-level fulfillment and order activity"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="To process"
          value={String(stats.pending)}
        />

        <StatTile
          label="In transit"
          value={String(stats.shipped)}
        />

        <StatTile
          label="Delivered"
          value={String(stats.delivered)}
          color="emerald"
        />

        <StatTile
          label="Total orders"
          value={String(orders.length)}
        />
      </div>

      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_100px_100px_110px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Order / Item</span>
          <span className="text-right">Gross</span>
          <span className="text-right">Qty</span>
          <span className="text-right">Status</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading orders…
          </div>
        ) : orders.length === 0 ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No vendor orders yet.
          </div>
        ) : (
          orders.flatMap((order) =>
            (order.items || []).map((item, index) => {
              const status =
                STATUS[String(order.status || "PENDING").toUpperCase()] ||
                STATUS.PENDING;

              const StatusIcon = status.icon;

              const price = Number(
                item.price ||
                item.product?.price ||
                0
              );

              const quantity = Number(
                item.quantity ||
                item.qty ||
                1
              );

              const gross = price * quantity;

              return (
                <div
                  key={`${order.id}-${item.id || index}`}
                  className="grid grid-cols-[1fr_100px_100px_110px] gap-3 px-5 py-3.5 items-center border-b border-border/30"
                >
                  <div className="min-w-0">
                    <p className="text-sm text-foreground truncate">
                      {item.product?.name ||
                        item.productName ||
                        item.name ||
                        "Product"}
                    </p>

                    <p className="text-[11px] text-muted-foreground">
                      GAL-{String(order.id).padStart(5, "0")} ·{" "}
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString()
                        : "Recent"}
                    </p>
                  </div>

                  <span className="text-right text-sm text-foreground">
                    {formatINR(gross)}
                  </span>

                  <span className="text-right text-sm text-muted-foreground">
                    {quantity}
                  </span>

                  <span
                    className={cn(
                      "text-right text-xs font-medium flex items-center justify-end gap-1",
                      status.color
                    )}
                  >
                    <StatusIcon className="w-3.5 h-3.5" />
                    {status.label}
                  </span>
                </div>
              );
            })
          )
        )}
      </div>
    </div>
  );
}
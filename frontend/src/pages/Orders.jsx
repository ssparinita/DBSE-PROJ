import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Truck,
  CheckCircle2,
  Clock,
  XCircle,
} from "lucide-react";
import { formatINR } from "@/lib/format";
import { cn } from "@/lib/utils";

const API = "http://localhost:8081";

const STATUS = {
  DELIVERED: {
    label: "Delivered",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  SHIPPED: {
    label: "Shipped",
    icon: Truck,
    color: "text-accent",
  },
  CONFIRMED: {
    label: "Confirmed",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
  PENDING: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-400",
  },
  PROCESSING: {
    label: "Processing",
    icon: Clock,
    color: "text-amber-400",
  },
  CANCELLED: {
    label: "Cancelled",
    icon: XCircle,
    color: "text-red-400",
  },
};

function getStatus(status) {
  return (
    STATUS[String(status || "").toUpperCase()] || {
      label: status || "Processing",
      icon: Clock,
      color: "text-amber-400",
    }
  );
}

function getOrderDisplayId(id) {
  return `GAL-${String(id).padStart(5, "0")}`;
}

function getOrderDate(order) {
  if (!order.createdAt) return "";

  try {
    return new Date(order.createdAt).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  } catch {
    return order.createdAt;
  }
}

function getItemName(item) {
  return (
    item.productName ||
    item.product?.name ||
    item.name ||
    `Product #${item.productId || ""}`
  );
}

function getItemImage(item) {
  return (
    item.imageUrl ||
    item.product?.imageUrl ||
    item.image ||
    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300"
  );
}

function getVendorName(item) {
  return (
    item.vendorName ||
    item.vendor ||
    item.product?.vendor ||
    item.storeName ||
    "GALERIE Vendor"
  );
}

function getQuantity(item) {
  return Number(
    item.quantity ||
      item.qty ||
      1
  );
}

function getItemPrice(item) {
  return Number(
    item.price ||
      item.unitPrice ||
      item.product?.price ||
      item.lineTotal ||
      0
  );
}

function getLineTotal(item) {
  const quantity = getQuantity(item);

  if (item.lineTotal != null) {
    return Number(item.lineTotal);
  }

  return getItemPrice(item) * quantity;
}

function getProductId(item) {
  return (
    item.productId ||
    item.product?.id ||
    item.id
  );
}

function normalizeOrder(order) {
  const rawItems =
    order.items ||
    order.orderItems ||
    order.products ||
    [];

  const items = Array.isArray(rawItems) ? rawItems : [];

  return {
    ...order,
    items,
    total: Number(
      order.totalAmount ||
        order.total ||
        order.amount ||
        0
    ),
    paymentStatus:
      order.paymentStatus ||
      order.payment?.status ||
      "PENDING",
  };
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API}/api/orders`, {
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Unable to load your orders.");
      }

      const data = await response.json();

      const rawOrders = Array.isArray(data)
        ? data
        : data.orders || [];

      setOrders(rawOrders.map(normalizeOrder));
    } catch (err) {
      console.error("Orders loading failed:", err);
      setError(
        err.message ||
          "Could not load your orders."
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground mb-2">
          Your orders
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Multi-vendor orders with item-level fulfillment
        </p>

        <div className="rounded-3xl glass-strong p-10 text-center">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-50 animate-pulse" />

          <p className="text-muted-foreground">
            Loading your orders...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
        <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground mb-2">
          Your orders
        </h1>

        <p className="text-sm text-muted-foreground mb-8">
          Multi-vendor orders with item-level fulfillment
        </p>

        <div className="rounded-3xl glass-strong p-10 text-center">
          <XCircle className="w-10 h-10 mx-auto mb-3 text-red-400" />

          <p className="text-red-400 mb-4">
            {error}
          </p>

          <button
            onClick={loadOrders}
            className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-semibold"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 px-4 max-w-4xl mx-auto">
      <h1 className="font-display font-700 text-3xl md:text-4xl text-foreground mb-2">
        Your orders
      </h1>

      <p className="text-sm text-muted-foreground mb-8">
        Multi-vendor orders with item-level fulfillment
      </p>

      {orders.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">
          <Package className="w-10 h-10 mx-auto mb-3 opacity-50" />

          <p>No orders yet.</p>

          <Link
            to="/shop"
            className="text-accent text-sm mt-2 inline-block"
          >
            Start exploring
          </Link>
        </div>
      ) : (
        <div className="space-y-5">
          {orders.map((order) => {
            const orderStatus = getStatus(order.status);

            const StatusIcon = orderStatus.icon;

            const vendorCount = new Set(
              order.items.map((item) =>
                getVendorName(item)
              )
            ).size;

            const paymentStatus =
              String(
                order.paymentStatus || "PENDING"
              ).toUpperCase();

            return (
              <div
                key={order.id}
                className="rounded-3xl glass-strong p-5"
              >
                {/* ORDER HEADER */}
                <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-border/50">
                  <div>
                    <p className="font-display font-700 text-lg text-foreground">
                      {getOrderDisplayId(order.id)}
                    </p>

                    <p className="text-xs text-muted-foreground">
                      {getOrderDate(order)}
                    </p>
                  </div>

                  <div className="flex items-center gap-3">
                    <span
                      className={cn(
                        "inline-flex items-center gap-1.5 text-sm font-medium",
                        orderStatus.color
                      )}
                    >
                      <StatusIcon className="w-4 h-4" />

                      {orderStatus.label}
                    </span>

                    <span
                      className={cn(
                        "px-2.5 py-1 rounded-full text-xs font-semibold",
                        paymentStatus === "CONFIRMED" ||
                          paymentStatus === "PAID"
                          ? "bg-emerald-500/15 text-emerald-400"
                          : paymentStatus === "FAILED"
                          ? "bg-red-500/15 text-red-400"
                          : "bg-amber-500/15 text-amber-400"
                      )}
                    >
                      {paymentStatus === "CONFIRMED"
                        ? "paid"
                        : paymentStatus.toLowerCase()}
                    </span>
                  </div>
                </div>

                {/* ITEMS */}
                <div className="space-y-3">
                  {order.items.map((item, index) => {
                    const productId =
                      getProductId(item);

                    const itemStatus =
                      getStatus(
                        item.status ||
                          item.fulfillmentStatus ||
                          order.status
                      );

                    const ItemStatusIcon =
                      itemStatus.icon;

                    return (
                      <div
                        key={
                          item.id ||
                          `${order.id}-${index}`
                        }
                        className="flex items-center gap-4"
                      >
                        {/* IMAGE */}
                        {productId ? (
                          <Link
                            to={`/product/${productId}`}
                            className="shrink-0"
                          >
                            <img
                              src={getItemImage(item)}
                              alt={getItemName(item)}
                              className="w-16 h-16 rounded-xl object-cover"
                            />
                          </Link>
                        ) : (
                          <img
                            src={getItemImage(item)}
                            alt={getItemName(item)}
                            className="w-16 h-16 rounded-xl object-cover"
                          />
                        )}

                        {/* PRODUCT INFO */}
                        <div className="flex-1 min-w-0">
                          {productId ? (
                            <Link
                              to={`/product/${productId}`}
                              className="font-medium text-foreground text-sm line-clamp-1 hover:text-accent transition-colors"
                            >
                              {getItemName(item)}
                            </Link>
                          ) : (
                            <p className="font-medium text-foreground text-sm line-clamp-1">
                              {getItemName(item)}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {getVendorName(item)} · qty{" "}
                            {getQuantity(item)}
                          </p>

                          <div className="flex items-center gap-2 mt-1">
                            <span
                              className={cn(
                                "text-[11px] font-medium flex items-center gap-1",
                                itemStatus.color
                              )}
                            >
                              <ItemStatusIcon className="w-3 h-3" />

                              {itemStatus.label}
                            </span>

                            <span className="text-[11px] text-muted-foreground">
                              · refund: none
                            </span>
                          </div>
                        </div>

                        {/* PRICE */}
                        <div className="text-right shrink-0">
                          <p className="text-sm font-medium text-foreground">
                            {formatINR(
                              getLineTotal(item)
                            )}
                          </p>

                          <p className="text-[11px] text-muted-foreground">
                            ₹
                            {getItemPrice(item).toLocaleString(
                              "en-IN"
                            )}{" "}
                            × {getQuantity(item)}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* FOOTER */}
                <div className="flex items-center justify-between pt-4 mt-2 border-t border-border/50">
                  <span className="text-sm text-muted-foreground">
                    {order.items.length}{" "}
                    {order.items.length === 1
                      ? "item"
                      : "items"}{" "}
                    from {vendorCount}{" "}
                    {vendorCount === 1
                      ? "vendor"
                      : "vendors"}
                  </span>

                  <span className="font-display font-700 text-xl text-foreground">
                    {formatINR(order.total)}
                  </span>
                </div>

                {/* PAYMENT INFO */}
                {order.payment?.transactionId && (
                  <div className="mt-4 pt-3 border-t border-border/30">
                    <p className="text-[11px] text-muted-foreground">
                      Algorand Testnet transaction
                    </p>

                    <p className="text-[11px] text-emerald-400 font-mono truncate mt-1">
                      {order.payment.transactionId}
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
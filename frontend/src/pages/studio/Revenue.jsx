import React, { useEffect, useMemo, useState } from "react";
import {
  StudioHeader,
  StatTile,
} from "@/pages/studio/StudioLayout";
import { TrendChart, MiniBars } from "@/components/StudioChart";
import {
  formatINR,
  formatINRCompact,
} from "@/lib/format";

const API = "http://localhost:8081";

export default function StudioRevenue() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/api/vendor/revenue`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Unable to load revenue");
        return res.json();
      })
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        console.error(err);
        setData(null);
      })
      .finally(() => setLoading(false));
  }, []);

  const revenue = data || {
    total: 0,
    last30: 0,
    commission: 0,
    net: 0,
    trend: [],
    byProduct: [],
  };

  const bars = useMemo(() => {
    return (revenue.byProduct || []).map((item) => ({
      label:
        item.productName ||
        item.product ||
        "Product",
      v: Number(item.revenue || 0),
    }));
  }, [revenue.byProduct]);

  return (
    <div>
      <StudioHeader
        eyebrow="My Studio"
        title="Revenue"
        subtitle="Real transaction revenue from your marketplace orders"
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatTile
          label="Total revenue"
          value={formatINRCompact(Number(revenue.total || 0))}
        />

        <StatTile
          label="Last 30 days"
          value={formatINRCompact(Number(revenue.last30 || 0))}
        />

        <StatTile
          label="Commission"
          value={formatINRCompact(Number(revenue.commission || 0))}
        />

        <StatTile
          label="Net earnings"
          value={formatINRCompact(Number(revenue.net || 0))}
          color="emerald"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-4 mb-6">
        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">
            Revenue trend
          </h3>

          {loading ? (
            <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
              Loading…
            </div>
          ) : revenue.trend?.length ? (
            <TrendChart
              data={revenue.trend}
              height={180}
            />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
              No revenue data yet.
            </div>
          )}
        </div>

        <div className="rounded-3xl glass-strong p-5">
          <h3 className="font-display font-600 text-base text-foreground mb-3">
            Revenue by product
          </h3>

          {bars.length ? (
            <MiniBars data={bars} height={180} />
          ) : (
            <div className="h-[180px] flex items-center justify-center text-sm text-muted-foreground">
              No product revenue yet.
            </div>
          )}
        </div>
      </div>

      <div className="rounded-3xl glass-strong overflow-hidden">
        <div className="grid grid-cols-[1fr_80px_100px_100px_110px] gap-3 px-5 py-3 text-[10px] uppercase tracking-widest text-muted-foreground border-b border-border/50">
          <span>Product</span>
          <span className="text-right">Units</span>
          <span className="text-right">Gross</span>
          <span className="text-right">Commission</span>
          <span className="text-right">Net</span>
        </div>

        {loading ? (
          <div className="p-8 text-center text-sm text-muted-foreground">
            Loading revenue…
          </div>
        ) : revenue.byProduct?.length ? (
          revenue.byProduct.map((item, index) => {
            const gross = Number(item.revenue || 0);
            const commission = Number(
              item.commission ||
              item.commissionAmount ||
              0
            );

            const net = gross - commission;

            return (
              <div
                key={item.productId || item.product || index}
                className="grid grid-cols-[1fr_80px_100px_100px_110px] gap-3 px-5 py-3.5 items-center border-b border-border/30"
              >
                <span className="text-sm text-foreground truncate">
                  {item.productName ||
                    item.product ||
                    "Product"}
                </span>

                <span className="text-right text-sm text-muted-foreground">
                  {Number(item.units || item.quantity || 0)}
                </span>

                <span className="text-right text-sm text-foreground">
                  {formatINR(gross)}
                </span>

                <span className="text-right text-sm text-destructive">
                  −{formatINR(commission)}
                </span>

                <span className="text-right text-sm font-semibold text-emerald-400">
                  {formatINR(net)}
                </span>
              </div>
            );
          })
        ) : (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No revenue records yet.
          </div>
        )}
      </div>
    </div>
  );
}
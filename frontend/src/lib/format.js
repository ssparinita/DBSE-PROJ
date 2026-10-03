// Indian Rupee formatting helpers — all money in ₹ with Indian digit grouping.
const inrFull = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrCompact = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  notation: "compact",
  maximumFractionDigits: 1,
});

export function formatINR(amount) {
  if (amount == null || isNaN(amount)) return "₹0";
  return inrFull.format(Math.round(amount));
}

export function formatINRCompact(amount) {
  if (amount == null || isNaN(amount)) return "₹0";
  return inrCompact.format(amount);
}

export function formatNumber(n) {
  return new Intl.NumberFormat("en-IN").format(n ?? 0);
}

export function formatPercent(n, digits = 1) {
  return `${(n ?? 0).toFixed(digits)}%`;
}
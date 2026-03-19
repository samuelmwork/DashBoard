import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import type { LeadStatus } from "./data";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number | string): string {
  if (typeof value === "string") {
    return value.startsWith("₹") ? value : `₹${value}`;
  }
  if (value >= 100000) return `₹${(value / 100000).toFixed(1)}L`;
  if (value >= 1000) return `₹${(value / 1000).toFixed(0)}K`;
  return `₹${value}`;
}

export function formatFullCurrency(value: number): string {
  return new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(value);
}

export const statusConfig: Record<LeadStatus, { label: string; bg: string; text: string; dot: string }> = {
  New:         { label: "New",         bg: "bg-zinc-800",        text: "text-zinc-300",  dot: "bg-zinc-400" },
  Contacted:   { label: "Contacted",   bg: "bg-blue-950/60",     text: "text-blue-400",  dot: "bg-blue-400" },
  Negotiation: { label: "Negotiation", bg: "bg-orange-950/60",   text: "text-orange-400",dot: "bg-orange-400" },
  Converted:   { label: "Converted",   bg: "bg-green-950/60",    text: "text-green-400", dot: "bg-green-400" },
  Rejected:    { label: "Rejected",    bg: "bg-red-950/60",      text: "text-red-400",   dot: "bg-red-400" },
};

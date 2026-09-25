import { cn } from "@/lib/utils";
import React from "react";

export function SBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    active: "bg-ca-green-bg text-green-400",
    inactive: "bg-ca-dim/30 text-ca-muted",
    open: "bg-blue-950 text-blue-400",
    fulfilled: "bg-ca-green-bg text-green-400",
    "partially fulfilled": "bg-ca-amber-bg text-amber-400",
    expired: "bg-ca-dim/30 text-ca-muted",
    cancelled: "bg-ca-dim/30 text-ca-muted",
    pending: "bg-ca-amber-bg text-amber-400",
    approved: "bg-ca-green-bg text-green-400",
    rejected: "bg-ca-red-bg text-red-400",
    suspended: "bg-ca-amber-bg text-amber-400",
    draft: "bg-ca-dim/30 text-ca-muted",
    "pending review": "bg-ca-amber-bg text-amber-400",
    submitted: "bg-blue-950 text-blue-400",
    removed: "bg-ca-red-bg text-red-400",
    member: "bg-emerald-950 text-emerald-300",
  };
  const classes = map[status.toLowerCase()] ?? "bg-ca-dim/25 text-ca-muted";
  return (
    <span
      className={cn(
        classes,
        "text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider whitespace-nowrap",
      )}
    >
      {status}
    </span>
  );
}

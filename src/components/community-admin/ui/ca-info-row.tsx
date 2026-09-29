import React from "react";

export function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-ca-border/20">
      <span className="text-[12px] text-ca-muted min-w-[140px] shrink-0">{label}</span>
      <span className="text-[12.5px] text-ca-text font-medium text-right flex-1">{value}</span>
    </div>
  );
}

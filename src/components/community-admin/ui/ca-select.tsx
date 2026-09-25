import { cn } from "@/lib/utils";
import React from "react";

export function Sel({ opts, value, onChange, className }: { opts: string[]; value?: string; onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void; className?: string }) {
  return (
    <select value={value} onChange={onChange} className={cn("bg-ca-card border border-ca-border rounded-md px-2.5 py-[7px] text-ca-muted text-[12.5px] outline-none focus:border-ca-accent", className)}>
      {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
    </select>
  );
}

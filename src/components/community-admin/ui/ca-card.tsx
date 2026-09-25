import { cn } from "@/lib/utils";
import React from "react";

export function Card({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  return (
    <div className={cn("bg-ca-card border border-ca-border rounded-xl overflow-hidden", className)} style={style}>
      {children}
    </div>
  );
}

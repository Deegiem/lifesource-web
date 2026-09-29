import { cn } from "@/lib/utils";
import React from "react";

export function Btn({ children, variant = "outline", onClick, size = "md", className }: { children: React.ReactNode; variant?: "primary" | "outline" | "ghost" | "danger" | "teal"; onClick?: React.MouseEventHandler<HTMLButtonElement>; size?: "sm" | "md"; className?: string }) {
  const base = "rounded-md cursor-pointer font-semibold whitespace-nowrap transition-opacity hover:opacity-80 focus:outline-none";
  const sz = size === "sm" ? "text-[11.5px] px-2.5 py-[5px]" : "text-[12.5px] px-3.5 py-2";
  const v: Record<string, string> = {
    primary: "bg-ca-accent text-white border-transparent",
    teal: "bg-ca-accent text-white border-transparent",
    outline: "bg-transparent text-ca-text border border-ca-border",
    ghost: "bg-transparent text-ca-muted border-transparent",
    danger: "bg-ca-red-bg text-red-400 border border-red-400/40",
  };
  return (
    <button onClick={onClick} className={cn(base, sz, v[variant], className)}>
      {children}
    </button>
  );
}

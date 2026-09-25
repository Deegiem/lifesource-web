import { cn } from "@/lib/utils";
import React from "react";
import { useRouter } from "next/navigation";

export function TH({ children, w }: { children?: React.ReactNode; w?: number | string }) {
  return (
    <th className="text-left px-3 py-[9px] text-[10.5px] font-bold text-ca-muted uppercase tracking-wider whitespace-nowrap border-b border-ca-border" style={{ width: w }}>
      {children}
    </th>
  );
}

export function TD({ children, muted }: { children: React.ReactNode; muted?: boolean }) {
  return (
    <td className={cn("px-3 py-2.5 text-[12.5px] border-b border-ca-border/20 align-middle", muted ? "text-ca-muted" : "text-ca-text")}>
      {children}
    </td>
  );
}

export function TableRow({ children, href, className }: { children: React.ReactNode; href?: string; className?: string }) {
  const router = useRouter();
  return (
    <tr className={cn("border-b border-ca-border/20 last:border-0", href && "cursor-pointer hover:bg-ca-border/10", className)} onClick={href ? () => router.push(href) : undefined}>
      {children}
    </tr>
  );
}

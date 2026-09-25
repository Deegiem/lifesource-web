import { cn } from "@/lib/utils"; // Assuming standard cn utility
import React from "react";
import Link from "next/link";

export const COMMUNITY = "Al-Hikmah Community";
export const COMMUNITIES = ["Al-Hikmah Community", "Unilag Health Circle"];
export const HOSPITALS = [
  "Lagos Island General Hospital",
  "LUTH",
  "Garki Hospital",
  "AKTH",
];
export const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

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
        "text-[10px] font-bold px-2 py-[2px] rounded-full uppercase tracking-wider whitespace-nowrap",
      )}
    >
      {status}
    </span>
  );
}

export function TH({
  children,
  w,
}: {
  children?: React.ReactNode;
  w?: number | string;
}) {
  return (
    <th
      className="text-left px-3 py-[9px] text-[10.5px] font-bold text-ca-muted uppercase tracking-wider whitespace-nowrap border-b border-ca-border"
      style={{ width: w }}
    >
      {children}
    </th>
  );
}

export function TD({
  children,
  muted,
}: {
  children: React.ReactNode;
  muted?: boolean;
}) {
  return (
    <td
      className={cn(
        "px-3 py-2.5 text-[12.5px] border-b border-ca-border/20 align-middle",
        muted ? "text-ca-muted" : "text-ca-text",
      )}
    >
      {children}
    </td>
  );
}

export function Btn({
  children,
  variant = "outline",
  onClick,
  size = "md",
  className,
}: {
  children: React.ReactNode;
  variant?: "primary" | "outline" | "ghost" | "danger" | "teal";
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
  size?: "sm" | "md";
  className?: string;
}) {
  const base =
    "rounded-md cursor-pointer font-semibold whitespace-nowrap transition-opacity hover:opacity-80 focus:outline-none";
  const sz =
    size === "sm"
      ? "text-[11.5px] px-2.5 py-[5px]"
      : "text-[12.5px] px-3.5 py-2";

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

export function Card({
  children,
  className,
  style,
}: {
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) {
  return (
    <div
      className={cn(
        "bg-ca-card border border-ca-border rounded-xl overflow-hidden",
        className,
      )}
      style={style}
    >
      {children}
    </div>
  );
}

export function InfoRow({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-start py-2 border-b border-ca-border/20">
      <span className="text-[12px] text-ca-muted min-w-[140px] shrink-0">
        {label}
      </span>
      <span className="text-[12.5px] text-ca-text font-medium text-right flex-1">
        {value}
      </span>
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-bold text-ca-muted uppercase tracking-wider mb-2.5">
      {children}
    </div>
  );
}

export function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 mb-3.5 flex-wrap items-center">{children}</div>
  );
}

export function SearchInput({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <input
      placeholder={placeholder ?? "Search..."}
      value={value}
      onChange={onChange}
      className="bg-ca-card border border-ca-border rounded-md px-3 py-[7px] text-ca-text text-[12.5px] outline-none focus:border-ca-accent w-[200px]"
    />
  );
}

export function Sel({
  opts,
  value,
  onChange,
  className,
}: {
  opts: string[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  return (
    <select
      value={value}
      onChange={onChange}
      className={cn(
        "bg-ca-card border border-ca-border rounded-md px-2.5 py-[7px] text-ca-muted text-[12.5px] outline-none focus:border-ca-accent",
        className,
      )}
    >
      {opts.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

export function Pagination({
  showing,
  total,
}: {
  showing: number;
  total: string;
}) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5 border-t border-ca-border">
      <span className="text-[11.5px] text-ca-muted">
        Showing {showing} of {total}
      </span>
      <div className="flex gap-1.5">
        <Btn size="sm" variant="outline">
          Prev
        </Btn>
        <Btn size="sm" variant="outline">
          Next
        </Btn>
      </div>
    </div>
  );
}

export function Crumb({ path }: { path: [string, string][] }) {
  return (
    <div className="text-[11.5px] text-ca-muted mb-4 flex items-center gap-1.5">
      {path.map(([label, href], i) => (
        <span key={label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ca-dim">/</span>}
          {href ? (
            <Link
              href={href}
              className="text-ca-accent hover:underline cursor-pointer"
            >
              {label}
            </Link>
          ) : (
            <span>{label}</span>
          )}
        </span>
      ))}
    </div>
  );
}

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-10 px-5 text-center text-ca-muted text-[13px]">
      <div className="text-2xl mb-2.5 opacity-40">—</div>
      {message}
    </div>
  );
}

export function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 bg-black/70 flex items-center justify-center z-[999]"
      onClick={onClose}
    >
      <div onClick={(e) => e.stopPropagation()}>{children}</div>
    </div>
  );
}

import { useRouter } from 'next/navigation';

export function TableRow({
  children,
  href,
  className
}: {
  children: React.ReactNode;
  href?: string;
  className?: string;
}) {
  const router = useRouter();
  
  return (
    <tr
      className={cn(
        "border-b border-ca-border/20 last:border-0",
        href && "cursor-pointer hover:bg-ca-border/10",
        className
      )}
      onClick={href ? () => router.push(href) : undefined}
    >
      {children}
    </tr>
  );
}

import React from "react";
import { Button } from "@/components/ui/button";
import { cn } from "cn";

export interface StateScreenProps {
  icon: React.ReactNode;
  iconColor?: "danger" | "warning" | "success" | "muted" | "brand";
  badge: string;
  badgeVariant?: "error" | "warning" | "muted";
  title: string;
  description: React.ReactNode;
  infoText?: string;
  actions?: {
    label: string;
    variant?: "default" | "outline" | "ghost" | "destructive";
    onClick: () => void;
    loading?: boolean;
  }[];
  children?: React.ReactNode;
}

export function StateScreen({
  icon,
  iconColor = "muted",
  badge,
  badgeVariant = "muted",
  title,
  description,
  infoText,
  actions,
  children,
}: StateScreenProps) {
  
  const iconColorClass = {
    danger: "bg-(--color-danger) text-white",
    warning: "bg-(--color-warning) text-white",
    success: "bg-(--color-success) text-white",
    muted: "bg-(--color-text-muted) text-white",
    brand: "bg-(--color-brand-primary) text-white",
  }[iconColor];

  return (
    <main className="min-h-screen bg-(--color-surface-card) w-full flex items-center justify-center p-6 md:p-12">
      <div className="w-full max-w-2xl flex flex-col justify-center min-h-[600px] my-auto">
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-6 py-8">
          {/* Icon - single bold circle */}
          <div
            className={cn("w-20 h-20 rounded-full flex items-center justify-center shadow-sm", iconColorClass)}
          >
            {icon}
          </div>

          <div className="space-y-4 max-w-lg mx-auto">
            <span
              className={cn(
                "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold tracking-wide",
                {
                  "bg-red-100 text-red-800": badgeVariant === "error",
                  "bg-amber-100 text-amber-800": badgeVariant === "warning",
                  "bg-gray-100 text-gray-800": badgeVariant === "muted",
                }
              )}
            >
              {badge}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-(--color-text-primary) leading-tight">
              {title}
            </h1>
            <p className="text-(--color-text-secondary) text-base md:text-lg leading-relaxed">
              {description}
            </p>
          </div>

          <div className="w-full max-w-lg mx-auto">
            {children}
          </div>

          {infoText && (
            <div className="w-full max-w-lg mx-auto p-5 rounded-2xl bg-(--color-surface-subtle) text-sm text-(--color-text-secondary) leading-relaxed text-left border border-(--color-border-subtle)">
              {infoText}
            </div>
          )}
        </div>

        {actions && actions.length > 0 && (
          <div className="w-full max-w-sm mx-auto space-y-3 pt-6">
            {actions.map((action, idx) => (
              <Button
                key={idx}
                variant={action.variant || "default"}
                onClick={action.onClick}
                disabled={action.loading}
                className="w-full rounded-2xl h-14 text-base font-bold"
              >
                {action.loading ? "Loading..." : action.label}
              </Button>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

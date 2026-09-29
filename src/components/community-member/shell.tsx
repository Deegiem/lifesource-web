"use client";

import type { ReactNode } from "react";
import Link from "next/link";

export function CommunityMemberShell({
  children,
  title = "Community membership",
}: {
  children: ReactNode;
  title?: string;
}) {
  return (
    <div className="min-h-screen bg-(--color-surface-page) text-(--color-text-primary)">
      <header className="border-b border-(--color-border-subtle) bg-(--color-surface-card)">
        <div className="mx-auto flex min-h-16 max-w-(--container-md) items-center justify-between px-4 md:px-6">
          <Link
            href="/community/dashboard"
            className="text-base font-extrabold tracking-tight text-(--color-brand-primary)"
          >
            LIFESOURCE
          </Link>
          <span className="text-xs font-medium text-(--color-text-muted)">
            {title}
          </span>
        </div>
      </header>
      <main className="mx-auto w-full max-w-(--container-sm) px-4 py-8 md:px-6 md:py-12">
        {children}
      </main>
    </div>
  );
}

export function StateIcon({
  type,
}: {
  type: "success" | "pending" | "error";
}) {
  const styles = {
    success: "bg-(--color-success-soft) text-(--color-success)",
    pending: "bg-(--color-warning-soft) text-(--color-warning)",
    error: "bg-(--color-danger-soft) text-(--color-danger)",
  };

  const symbols = {
    success: "✓",
    pending: "!",
    error: "×",
  };

  return (
    <div
      className={`mx-auto flex size-16 items-center justify-center rounded-full text-2xl font-extrabold ${styles[type]}`}
      aria-hidden="true"
    >
      {symbols[type]}
    </div>
  );
}

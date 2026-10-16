"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Clock3, Plus, ShieldCheck } from "lucide-react";

import { PageHeader, PageShell } from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";
import { apiService } from "@/services/api.service";

export default function RequesterCooldownPage() {
  const { requester, loadRequesterContext } = useRequestStore();
  const [cooldownUntil, setCooldownUntil] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState<number>(0);

  // Initialize `now` on the client only
  useEffect(() => {
    setNow(Date.now());
    const id = window.setInterval(() => setNow(Date.now()), 60_000);
    return () => window.clearInterval(id);
  }, []);

  useEffect(() => {
    void loadRequesterContext();

    let cancelled = false;
    apiService
      .listMyRequests({ limit: 1, offset: 0 })
      .then((result) => {
        if (cancelled) return;
        const mostRecent = result.requests[0];
        setCooldownUntil(mostRecent?.expires_at ?? null);
        setLoading(false);
      })
      .catch(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [loadRequesterContext]);

  const cooldownEnd = cooldownUntil ? new Date(cooldownUntil).getTime() : 0;
  const inCooldown = now > 0 && cooldownEnd > now;
  const remainingDays =
    inCooldown && now > 0
      ? Math.ceil((cooldownEnd - now) / (1000 * 60 * 60 * 24))
      : 0;

  return (
    <PageShell>
      <PageHeader
        title="Requester cooldown"
        description="After submitting a request, you enter a short cooldown before creating another one."
      />

      <div
        className={`relative overflow-hidden rounded-(--radius-xl) border-2 p-6 ${
          inCooldown
            ? "border-(--color-blood-border)/30 bg-(--color-blood-soft)"
            : "border-(--color-success)/30 bg-(--color-success-soft)"
        }`}
      >
        <div
          className={`pointer-events-none absolute -right-16 -top-16 size-40 rounded-full blur-3xl ${
            inCooldown ? "bg-(--color-blood)/25" : "bg-(--color-success)/20"
          }`}
        />

        <div className="relative flex items-start gap-4">
          <div
            className={`flex size-14 shrink-0 items-center justify-center rounded-2xl ${
              inCooldown
                ? "bg-(--color-blood) text-white"
                : "bg-(--color-success) text-white"
            }`}
          >
            {inCooldown ? (
              <Clock3 className="size-7" />
            ) : (
              <ShieldCheck className="size-7" />
            )}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xl font-extrabold text-(--color-text-primary)">
              {loading
                ? "Checking cooldown…"
                : inCooldown
                  ? `Cooldown active · ${remainingDays} day${
                      remainingDays === 1 ? "" : "s"
                    } left`
                  : "You can create a request"}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
              {loading
                ? "Reading the latest cooldown window from your request history."
                : inCooldown && cooldownUntil
                  ? `Your next request will be eligible on ${new Date(
                      cooldownUntil,
                    ).toLocaleDateString("en-GB", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })}.`
                  : "You're not in cooldown. Create a blood request whenever you need one."}
            </p>
          </div>
        </div>

        <div className="relative mt-5 h-px w-full bg-gradient-to-r from-(--color-blood)/40 via-(--color-border-subtle) to-transparent" />
      </div>

      <div className="mt-5 flex flex-col gap-3 sm:flex-row">
        <Link
          href="/community/requests/new"
          aria-disabled={inCooldown}
          onClick={(e) => {
            if (inCooldown) e.preventDefault();
          }}
          className={`inline-flex min-h-(--control-height-md) flex-1 items-center justify-center gap-2 rounded-(--radius-lg) px-4 text-sm font-semibold transition-colors ${
            inCooldown
              ? "cursor-not-allowed border border-(--color-border-default) bg-white text-(--color-text-muted)"
              : "bg-(--color-brand-primary) text-white hover:bg-(--color-brand-primary-hover)"
          }`}
        >
          <Plus className="size-4" />
          {inCooldown ? "Request not available yet" : "Create a blood request"}
        </Link>
        <Link
          href="/community/dashboard"
          className="inline-flex min-h-(--control-height-md) flex-1 items-center justify-center rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm font-semibold text-(--color-text-primary) transition-colors hover:bg-(--color-surface-subtle)"
        >
          Back to dashboard
        </Link>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-(--color-text-muted)">
        {requester?.membershipStatus === "Active"
          ? "Cooldown is enforced by the API. If you try to create a request before it ends, the backend will explain why it's blocked."
          : "You need an active community membership to create blood requests."}
      </p>
    </PageShell>
  );
}
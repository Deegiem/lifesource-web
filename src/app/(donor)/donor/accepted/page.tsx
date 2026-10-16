"use client";

import { useEffect } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, Droplet } from "lucide-react";

import { PageHeader, PageShell } from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";

export default function DonorAcceptedPage() {
  const { myAcceptances, loadMyAcceptances } = useRequestStore();

  useEffect(() => {
    void loadMyAcceptances();
  }, [loadMyAcceptances]);

  return (
    <PageShell>
      <PageHeader
        title="My Accepted Requests"
        description="Track accepted donations and their confirmation status."
      />

      {myAcceptances.length === 0 ? (
        <div className="relative overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center">
          <div className="pointer-events-none absolute -right-12 -top-12 size-32 rounded-full bg-(--color-blood-soft) blur-2xl" />

          <div className="relative mx-auto flex size-16 items-center justify-center rounded-full bg-(--color-blood-soft)">
            <Droplet className="size-7 text-(--color-blood)" />
          </div>

          <p className="relative mt-5 text-base font-bold text-(--color-text-primary)">
            No accepted requests yet
          </p>
          <p className="relative mx-auto mt-2 max-w-sm text-sm leading-relaxed text-(--color-text-secondary)">
            When you accept a request, its verification code and status will
            appear here so you can track the donation.
          </p>
          <Link
            href="/donor/requests"
            className="relative mt-6 inline-flex min-h-(--control-height-md) items-center justify-center rounded-(--radius-md) bg-(--color-brand-primary) px-5 text-sm font-semibold text-white transition-colors hover:bg-(--color-brand-primary-hover)"
          >
            Browse open requests
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {myAcceptances.map((item) => {
            const confirmed = item.confirmedAt !== null;
            return (
              <Link
                key={item.id}
                href={`/donor/requests/${item.requestId}`}
                className="group relative block overflow-hidden rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 transition-colors hover:border-(--color-blood-border)/40"
              >
                {/* Left accent bar — the red touch */}
                <div
                  className={`absolute left-0 top-0 h-full w-1 ${
                    confirmed ? "bg-(--color-success)" : "bg-(--color-blood)"
                  }`}
                />

                <div className="flex items-start justify-between gap-4 pl-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      {confirmed ? (
                        <CheckCircle2 className="size-4 shrink-0 text-(--color-success)" />
                      ) : (
                        <Clock3 className="size-4 shrink-0 text-(--color-blood)" />
                      )}
                      <p className="truncate font-mono text-sm font-bold text-(--color-text-primary)">
                        {item.referenceCode}
                      </p>
                    </div>

                    <p className="mt-1.5 text-xs text-(--color-text-muted)">
                      {item.bloodType} · {item.hospitalName}
                    </p>

                    <div className="mt-3 inline-flex items-center gap-2 rounded-(--radius-md) border border-(--color-border-subtle) bg-(--color-surface-subtle) px-2.5 py-1.5">
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-(--color-text-muted)">
                        Code
                      </span>
                      <span className="font-mono text-xs font-bold text-(--color-text-primary)">
                        {item.verificationCode}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                      confirmed
                        ? "bg-(--color-success-soft) text-(--color-success)"
                        : "bg-(--color-blood-soft) text-(--color-blood)"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </PageShell>
  );
}
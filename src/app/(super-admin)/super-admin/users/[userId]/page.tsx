"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { useSuperAdminUsersStore } from "@/stores/super-admin-users.store";

const roleLabels = {
  super_admin: "Super Admin",
  community_admin: "Community Admin",
  community_member: "Community Member",
  donor: "Donor",
} as const;

export default function UserDetailsPage({
  params,
}: {
  params: { userId: string };
}) {
  const { selectedUser, isDetailLoading, detailError, loadUser } =
    useSuperAdminUsersStore();

  useEffect(() => {
    void loadUser(params.userId);
  }, [loadUser, params.userId]);

  if (isDetailLoading) {
    return <main className="p-8 text-sm text-(--color-text-secondary)">Loading user...</main>;
  }

  if (detailError || !selectedUser) {
    return (
      <main className="p-8">
        <Link href="/super-admin/users" className="text-sm text-(--color-brand-primary)">
          ← Back to users
        </Link>
        <p className="mt-6 text-sm text-(--color-danger)">
          {detailError ?? "User not found."}
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-full bg-(--color-surface-page) p-4 text-(--color-text-primary) md:p-6 lg:p-8">
      <div className="mx-auto max-w-(--container-xl) space-y-6">
        <Link
          href="/super-admin/users"
          className="inline-flex items-center gap-2 text-sm font-medium text-(--color-text-secondary) hover:text-(--color-brand-primary)"
        >
          <ArrowLeft className="size-4" />
          Back to users
        </Link>

        <section className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-6 shadow-(--shadow-sm)">
          <div className="flex flex-col justify-between gap-5 md:flex-row md:items-start">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
                {selectedUser.id}
              </p>
              <h1 className="mt-2 text-2xl font-bold">{selectedUser.name}</h1>
              <p className="mt-1 text-sm text-(--color-text-secondary)">
                {selectedUser.email}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-(--radius-full) bg-(--color-brand-primary-soft) px-3 py-1.5 text-xs font-semibold text-(--color-brand-primary)">
                {roleLabels[selectedUser.role]}
              </span>
              <span className="rounded-(--radius-full) bg-(--color-surface-subtle) px-3 py-1.5 text-xs font-semibold">
                {selectedUser.status}
              </span>
            </div>
          </div>
        </section>

        <div className="grid gap-6 lg:grid-cols-[1.5fr_1fr]">
          <section className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-6 shadow-(--shadow-sm)">
            <h2 className="text-lg font-bold">Account information</h2>

            <dl className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <dt className="text-xs text-(--color-text-muted)">Email</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.email}</dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Phone</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.phone}</dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Location</dt>
                <dd className="mt-1 text-sm font-medium">
                  {selectedUser.location ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Community</dt>
                <dd className="mt-1 text-sm font-medium">
                  {selectedUser.community ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Joined</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.joinedLabel}</dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Last active</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.lastActiveLabel}</dd>
              </div>
            </dl>
          </section>

          <section className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-6 shadow-(--shadow-sm)">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-(--color-brand-primary)" />
              <h2 className="text-lg font-bold">Donor information</h2>
            </div>

            <dl className="mt-5 space-y-4">
              <div>
                <dt className="text-xs text-(--color-text-muted)">Blood type</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.bloodType ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Genotype</dt>
                <dd className="mt-1 text-sm font-medium">{selectedUser.genotype ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Availability</dt>
                <dd className="mt-1 text-sm font-medium">
                  {selectedUser.availability ?? "—"}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-(--color-text-muted)">Last donation</dt>
                <dd className="mt-1 text-sm font-medium">
                  {selectedUser.lastDonationLabel ?? "—"}
                </dd>
              </div>
            </dl>
          </section>
        </div>

        <section className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-6 shadow-(--shadow-sm)">
          <h2 className="text-lg font-bold">Audit history</h2>
          <div className="mt-5 space-y-4">
            {selectedUser.auditTrail.map((event) => (
              <div
                key={event.id}
                className="border-l-2 border-(--color-border-default) pl-4"
              >
                <p className="text-sm font-semibold">{event.action}</p>
                <p className="mt-1 text-sm text-(--color-text-secondary)">
                  {event.description}
                </p>
                <p className="mt-1 text-xs text-(--color-text-muted)">
                  {event.actor} · {event.timestampLabel}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}

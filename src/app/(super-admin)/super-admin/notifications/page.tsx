"use client";

import { useEffect, useMemo, useState } from "react";
import { Bell, Search } from "lucide-react";

import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminEmptyState } from "@/components/super-admin/ui/admin-empty-state";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";
import { NotificationBadge } from "@/components/super-admin/ui/notification-badge";

import { useSuperAdminNotificationsStore } from "@/stores/super-admin-notifications.store";

export default function SuperAdminNotificationsPage() {
  const {
    notifications,
    isLoading,
    error,
    loadNotifications,
  } = useSuperAdminNotificationsStore();

  const [search, setSearch] = useState("");

  useEffect(() => {
    void loadNotifications();
  }, [loadNotifications]);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();

    return notifications.filter(
      (notification) =>
        !query ||
        [
          notification.id,
          notification.title,
          notification.message,
          notification.audience,
          notification.type,
          notification.status,
        ].some((value) =>
          value.toLowerCase().includes(query)
        )
    );
  }, [notifications, search]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Notifications"
        description="Review platform notification activity."
      />

      <div className="relative">
        <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-admin-muted)" />

        <AdminSearch
          value={search}
          onChange={(event) => setSearch(event.target.value)}
          placeholder="Search notifications"
          className="pl-10"
        />
      </div>

      {isLoading ? (
        <AdminCard>
          <AdminLoadingState />
        </AdminCard>
      ) : error ? (
        <AdminCard>
          <AdminErrorState
            message={error}
            onRetry={() => void loadNotifications()}
          />
        </AdminCard>
      ) : filtered.length === 0 ? (
        <AdminCard>
          <AdminEmptyState
            title="No notifications found"
            description="No notifications match the current search."
          />
        </AdminCard>
      ) : (
        <div className="space-y-3">
          {filtered.map((notification) => (
            <AdminCard key={notification.id} className="p-5">
              <div className="flex gap-4">
                <div className="flex size-10 shrink-0 items-center justify-center rounded-(--radius-md) bg-(--color-admin-accent-soft)">
                  <Bell className="size-5 text-(--color-admin-accent)" />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div>
                      <h2 className="font-semibold text-(--color-admin-text)">
                        {notification.title}
                      </h2>

                      <p className="mt-1 text-xs text-(--color-admin-muted)">
                        {notification.id}
                      </p>
                    </div>

                    <div className="shrink-0">
                      <NotificationBadge status={notification.status} />
                    </div>
                  </div>

                  <p className="mt-3 text-sm leading-relaxed text-(--color-admin-muted)">
                    {notification.message}
                  </p>

                  <p className="mt-2 text-xs text-(--color-admin-muted)">
                    Audience: {notification.audience} ·{" "}
                    {notification.sentLabel ?? notification.status}
                  </p>
                </div>
              </div>
            </AdminCard>
          ))}
        </div>
      )}
    </div>
  );
}
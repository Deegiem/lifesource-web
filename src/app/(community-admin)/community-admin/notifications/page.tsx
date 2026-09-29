"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Shell } from "@/components/community-admin/shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { useCANotificationsStore } from "@/stores/community-admin-notifications.store";
import { cn } from "@/lib/utils";

export default function CANotificationsPage() {
  const router = useRouter();
  const { items, isLoading, loadItems, markAllRead, markRead } =
    useCANotificationsStore();

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const unreadCount = items.filter((n) => !n.read).length;

  const handleNotificationClick = (id: number, dest: string) => {
    markRead(id);
    router.push(`/community-admin/${dest.replace("ca-", "")}`);
  };

  return (
    <Shell
      title="Notifications"
      topRight={
        unreadCount > 0 ? (
          <Btn size="sm" variant="ghost" onClick={markAllRead}>
            Mark all read
          </Btn>
        ) : undefined
      }
    >
      <div className="max-w-xl">
        {unreadCount > 0 && (
          <div className="text-xs text-ca-muted mb-2.5">
            {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
          </div>
        )}
        <Card>
          <div className="flex flex-col">
            {items.map((n) => (
              <div
                key={n.id}
                onClick={() => handleNotificationClick(n.id, n.dest)}
                className={cn(
                  "flex gap-3 py-3 px-4 border-b border-ca-border/10 last:border-0 cursor-pointer transition-colors",
                  n.read
                    ? "bg-transparent hover:bg-ca-border/5"
                    : "bg-blue-950/20 hover:bg-blue-950/30",
                )}
              >
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm shrink-0",
                    n.read
                      ? "bg-ca-side"
                      : "bg-emerald-950 border border-ca-border",
                  )}
                >
                  {n.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start gap-2.5">
                    <div
                      className={cn(
                        "text-sm truncate",
                        n.read
                          ? "font-medium text-ca-muted"
                          : "font-bold text-ca-text",
                      )}
                    >
                      {n.title}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {!n.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-ca-accent inline-block" />
                      )}
                      <span className="text-xs font-medium text-ca-dim whitespace-nowrap">
                        {n.time}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs text-ca-muted mt-1 leading-relaxed">
                    {n.desc}
                  </div>
                </div>
              </div>
            ))}

            {items.length === 0 && !isLoading && (
              <div className="p-8 text-center text-sm text-ca-muted">
                No notifications right now.
              </div>
            )}
          </div>
        </Card>
      </div>
    </Shell>
  );
}

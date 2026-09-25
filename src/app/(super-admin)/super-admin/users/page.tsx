"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Eye, Plus, Search, SlidersHorizontal } from "lucide-react";

import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminButton } from "@/components/super-admin/ui/admin-button";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminFilter } from "@/components/super-admin/ui/admin-filter";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { AdminPagination } from "@/components/super-admin/ui/admin-pagination";
import { AdminSearch } from "@/components/super-admin/ui/admin-search";

import { useSuperAdminUsersStore } from "@/stores/super-admin-users.store";
import type {
  PlatformUserRole,
  PlatformUserStatus,
} from "@/features/super-admin/user-types";

const roleLabels: Record<PlatformUserRole, string> = {
  super_admin: "Super Admin",
  community_admin: "Community Admin",
  community_member: "Community Member",
  donor: "Donor",
};

const statusLabels: Record<PlatformUserStatus, string> = {
  active: "Active",
  inactive: "Inactive",
  suspended: "Suspended",
};

export default function SuperAdminUsersPage() {
  const { users, isLoading, error, loadUsers } =
    useSuperAdminUsersStore();

  const [search, setSearch] = useState("");
  const [role, setRole] =
    useState<PlatformUserRole | "all">("all");
  const [status, setStatus] =
    useState<PlatformUserStatus | "all">("all");

  useEffect(() => {
    void loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.id.toLowerCase().includes(query) ||
        user.name.toLowerCase().includes(query) ||
        user.email.toLowerCase().includes(query);

      const matchesRole =
        role === "all" || user.role === role;

      const matchesStatus =
        status === "all" || user.status === status;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [users, search, role, status]);

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="User Management"
        description="Manage users, roles, and account status across LIFESOURCE."
        action={
          <AdminButton variant="primary">
            <Plus className="size-4" />
            Add User
          </AdminButton>
        }
      />

      <AdminCard className="p-4">
        <div className="flex flex-col gap-3 xl:flex-row">
          <div className="min-w-0 flex-1">
            <div className="relative">
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-(--color-admin-muted)" />

              <AdminSearch
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search by name, email or user ID"
                className="pl-10"
              />
            </div>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <AdminFilter
              value={role}
              onChange={(event) =>
                setRole(
                  event.target.value as
                    | PlatformUserRole
                    | "all"
                )
              }
            >
              <option value="all">All roles</option>

              {Object.entries(roleLabels).map(
                ([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                )
              )}
            </AdminFilter>

            <div className="relative">
              <SlidersHorizontal className="pointer-events-none absolute left-3 top-1/2 z-10 size-4 -translate-y-1/2 text-(--color-admin-muted)" />

              <AdminFilter
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value as
                      | PlatformUserStatus
                      | "all"
                  )
                }
                className="pl-9"
              >
                <option value="all">All statuses</option>

                {Object.entries(statusLabels).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </AdminFilter>
            </div>
          </div>
        </div>
      </AdminCard>

      <AdminCard className="overflow-hidden">
        {isLoading ? (
          <AdminLoadingState />
        ) : error ? (
          <AdminErrorState
            message={error}
            onRetry={() => void loadUsers()}
          />
        ) : filteredUsers.length === 0 ? (
          <div className="p-8 text-center text-sm text-(--color-admin-muted)">
            No users match the current filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left text-sm">
              <thead className="border-b border-(--color-admin-border) bg-(--color-admin-card)">
                <tr className="text-xs font-semibold uppercase tracking-wide text-(--color-admin-muted)">
                  <th className="px-5 py-4">User</th>
                  <th className="px-5 py-4">Role</th>
                  <th className="px-5 py-4">Community</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4">Last active</th>
                  <th className="px-5 py-4 text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredUsers.map((user) => (
                  <tr
                    key={user.id}
                    className="border-b border-(--color-admin-border)/20 last:border-0"
                  >
                    <td className="px-5 py-4">
                      <Link
                        href={`/super-admin/users/${user.id}`}
                        className="font-semibold text-(--color-admin-text) hover:text-(--color-admin-accent)"
                      >
                        {user.name}
                      </Link>

                      <p className="mt-1 text-xs text-(--color-admin-muted)">
                        {user.id} · {user.email}
                      </p>
                    </td>

                    <td className="px-5 py-4 text-(--color-admin-muted)">
                      {roleLabels[user.role]}
                    </td>

                    <td className="px-5 py-4 text-(--color-admin-muted)">
                      {user.community ?? "—"}
                    </td>

                    <td className="px-5 py-4">
                      <AdminBadge status={user.status} />
                    </td>

                    <td className="px-5 py-4 text-(--color-admin-muted)">
                      {user.lastActiveLabel}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <Link
                        href={`/super-admin/users/${user.id}`}
                        aria-label={`View ${user.name}`}
                        className="inline-flex size-9 items-center justify-center rounded-(--radius-md) border border-(--color-admin-border) text-(--color-admin-muted) hover:border-(--color-admin-accent) hover:text-(--color-admin-accent)"
                      >
                        <Eye className="size-4" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!isLoading &&
          !error &&
          filteredUsers.length > 0 && (
            <AdminPagination
              showing={filteredUsers.length}
              total={users.length}
              page={1}
              totalPages={1}
            />
          )}
      </AdminCard>
    </div>
  );
}
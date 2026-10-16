// src/stores/community-admin-notifications.store.ts
import { create } from "zustand";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  CommunityMeResponse,
  MemberResponse,
} from "@/features/api/types";

export interface CANotification {
  /** Stable key so read-state persists per-event */
  key: string;
  title: string;
  desc: string;
  time: string;
  /** Timestamp for sorting + read-state */
  createdAt: string;
  read: boolean;
  href: string;
}

interface State {
  items: CANotification[];
  isLoading: boolean;
  error: string | null;
  loadedOnce: boolean;
  loadItems: () => Promise<void>;
  markAllRead: () => void;
  markRead: (key: string) => void;
}

const READ_KEY = "ca-read-notification-keys";

function getReadKeys(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(READ_KEY);
    return raw ? new Set(JSON.parse(raw) as string[]) : new Set();
  } catch {
    return new Set();
  }
}

function setReadKeys(keys: Set<string>) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(READ_KEY, JSON.stringify([...keys]));
  } catch {
    /* ignore storage errors */
  }
}

// ---- derive notifications from real API data ----

function notificationsFromPendingMembers(
  members: MemberResponse[],
): CANotification[] {
  return members.map((m) => ({
    key: `member-pending:${m.id}`,
    title: "New join request",
    desc: `${m.full_name} requested to join your community.`,
    time: relativeTime(m.created_at),
    createdAt: m.created_at,
    read: false,
    href: `/community-admin/join-requests/${m.id}`,
  }));
}

function notificationsFromRecentMembers(
  members: MemberResponse[],
): CANotification[] {
  const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  return members
    .filter((m) => {
      // Only ACTIVE members count as "joined" notifications
      if (m.status.toLowerCase() !== "active") return false;
      // Need a real join timestamp
      if (!m.joined_at) return false;
      const t = new Date(m.joined_at).getTime();
      return t >= sevenDaysAgo;
    })
    .map((m) => ({
      key: `member-joined:${m.id}`,
      title: "New member joined",
      desc: `${m.full_name} is now an active member.`,
      time: relativeTime(m.joined_at!),
      createdAt: m.joined_at!,
      read: false,
      href: `/community-admin/members/${m.id}`,
    }));
}

function notificationsFromCommunity(
  community: CommunityMeResponse,
): CANotification[] {
  return [
    {
      key: `community-live:${community.id}`,
      title: "Community is live",
      desc: `${community.name} is active on LIFESOURCE.`,
      time: relativeTime(community.created_at),
      createdAt: community.created_at,
      read: false,
      href: "/community-admin/dashboard",
    },
  ];
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

// ---- store ----

export const useCANotificationsStore = create<State>((set, get) => ({
  items: [],
  isLoading: false,
  error: null,
  loadedOnce: false,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const [community, pending, allMembers] = await Promise.all([
        apiService.getMyCommunity(),
        apiService.listMembers({ status: "pending", limit: 50, offset: 0 }),
        apiService.listMembers({ limit: 100, offset: 0 }),
      ]);

      const notifications = [
        ...notificationsFromPendingMembers(pending.members),
        ...notificationsFromRecentMembers(allMembers.members),
        ...notificationsFromCommunity(community),
      ].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );

      // Apply local read-state on top of the derived notifications
      const readKeys = getReadKeys();
      const withReadState = notifications.map((n) =>
        readKeys.has(n.key) ? { ...n, read: true } : n,
      );

      set({
        items: withReadState,
        isLoading: false,
        loadedOnce: true,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to load notifications.",
        ),
      });
    }
  },

  markAllRead: () => {
    const keys = getReadKeys();
    const { items } = get();
    items.forEach((n) => keys.add(n.key));
    setReadKeys(keys);
    set({ items: items.map((n) => ({ ...n, read: true })) });
  },

  markRead: (key) => {
    const keys = getReadKeys();
    keys.add(key);
    setReadKeys(keys);
    set((state) => ({
      items: state.items.map((n) =>
        n.key === key ? { ...n, read: true } : n,
      ),
    }));
  },
}));
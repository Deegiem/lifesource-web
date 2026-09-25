import { create } from "zustand";
import { getPlatformNotifications } from "@/services/super-admin-notifications.service";
import type { PlatformNotification } from "@/features/super-admin/notification-types";

interface State {
  notifications: PlatformNotification[];
  isLoading: boolean;
  error: string | null;
  loadNotifications: () => Promise<void>;
}

export const useSuperAdminNotificationsStore = create<State>((set) => ({
  notifications: [],
  isLoading: false,
  error: null,

  loadNotifications: async () => {
    set({ isLoading: true, error: null });
    try {
      const notifications = await getPlatformNotifications();
      set({ notifications, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Unable to load notifications." });
    }
  },
}));

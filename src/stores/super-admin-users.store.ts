import { create } from "zustand";
import {
  getPlatformUserById,
  getPlatformUsers,
} from "@/services/super-admin-users.service";
import type {
  PlatformUser,
  PlatformUserDetail,
} from "@/features/super-admin/user-types";

interface SuperAdminUsersState {
  users: PlatformUser[];
  total: number;
  selectedUser: PlatformUserDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  loadUsers: () => Promise<void>;
  loadUser: (userId: string) => Promise<void>;
  clearSelectedUser: () => void;
}

export const useSuperAdminUsersStore = create<SuperAdminUsersState>(
  (set) => ({
    users: [],
    total: 0,
    selectedUser: null,
    isLoading: false,
    isDetailLoading: false,
    error: null,
    detailError: null,

    loadUsers: async () => {
      set({ isLoading: true, error: null });

      try {
        const response = await getPlatformUsers();
        set({
          users: response.users,
          total: response.total,
          isLoading: false,
        });
      } catch {
        set({
          isLoading: false,
          error: "Unable to load platform users.",
        });
      }
    },

    loadUser: async (userId) => {
      set({ isDetailLoading: true, detailError: null });

      try {
        const user = await getPlatformUserById(userId);

        if (!user) {
          set({
            selectedUser: null,
            isDetailLoading: false,
            detailError: "User not found.",
          });
          return;
        }

        set({
          selectedUser: user,
          isDetailLoading: false,
        });
      } catch {
        set({
          isDetailLoading: false,
          detailError: "Unable to load user details.",
        });
      }
    },

    clearSelectedUser: () => set({ selectedUser: null }),
  })
);

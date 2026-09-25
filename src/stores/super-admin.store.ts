"use client";

import { create } from "zustand";

import { superAdminService } from "@/services/super-admin.service";
import type { SuperAdminDashboardData } from "@/features/super-admin/types";

interface SuperAdminState {
  dashboard: SuperAdminDashboardData | null;
  isLoading: boolean;
  error: string | null;
  loadDashboard: () => Promise<void>;
  clearError: () => void;
}

export const useSuperAdminStore = create<SuperAdminState>((set) => ({
  dashboard: null,
  isLoading: false,
  error: null,

  loadDashboard: async () => {
    set({ isLoading: true, error: null });

    try {
      const dashboard = await superAdminService.getDashboard();
      set({ dashboard, isLoading: false });
    } catch {
      set({
        isLoading: false,
        error: "Unable to load dashboard data.",
      });
    }
  },

  clearError: () => set({ error: null }),
}));

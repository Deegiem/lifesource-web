import { create } from "zustand";
import {
  getPlatformSettings,
  updatePlatformSettings,
} from "@/services/super-admin-settings.service";
import type { SuperAdminPlatformSettings } from "@/features/super-admin/settings-types";

interface State {
  settings: SuperAdminPlatformSettings | null;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  loadSettings: () => Promise<void>;
  saveSettings: (settings: SuperAdminPlatformSettings) => Promise<void>;
}

export const useSuperAdminSettingsStore = create<State>((set) => ({
  settings: null,
  isLoading: false,
  isSaving: false,
  error: null,

  loadSettings: async () => {
    set({ isLoading: true, error: null });
    try {
      const settings = await getPlatformSettings();
      set({ settings, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Unable to load settings." });
    }
  },

  saveSettings: async (settings) => {
    set({ isSaving: true, error: null });
    try {
      const saved = await updatePlatformSettings(settings);
      set({ settings: saved, isSaving: false });
    } catch (error) {
      set({ isSaving: false, error: error instanceof Error ? error.message : "Unable to save settings." });
    }
  },
}));

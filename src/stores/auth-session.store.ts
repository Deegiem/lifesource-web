import { create } from "zustand";
import { apiService } from "@/services/api.service";
import type { AuthSessionResponse } from "@/features/api/types";

interface AuthSessionState {
  session: AuthSessionResponse | null;
  isLoading: boolean;
  error: string | null;
  loadSession: () => Promise<void>;
}

export const useAuthSessionStore = create<AuthSessionState>((set, get) => ({
  session: null,
  isLoading: false,
  error: null,

  loadSession: async () => {
    if (get().session) return; // already loaded
    set({ isLoading: true, error: null });
    try {
      const session = await apiService.currentSession();
      set({ session, isLoading: false });
    } catch (err) {
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Failed to load session",
      });
    }
  },
}));
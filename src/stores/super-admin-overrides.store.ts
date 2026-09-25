import { create } from "zustand";
import {
  decideOverride,
  getOverrideRequestById,
  getOverrideRequests,
} from "@/services/super-admin-overrides.service";
import type { OverrideRequest, OverrideRequestDetail } from "@/features/super-admin/override-types";

interface State {
  requests: OverrideRequest[];
  selectedRequest: OverrideRequestDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  isDeciding: boolean;
  error: string | null;
  loadRequests: () => Promise<void>;
  loadRequest: (id: string) => Promise<void>;
  decide: (id: string, decision: "approved" | "rejected") => Promise<void>;
}

export const useSuperAdminOverridesStore = create<State>((set) => ({
  requests: [],
  selectedRequest: null,
  isLoading: false,
  isDetailLoading: false,
  isDeciding: false,
  error: null,

  loadRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const requests = await getOverrideRequests();
      set({ requests, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Unable to load override requests." });
    }
  },

  loadRequest: async (id) => {
    set({ isDetailLoading: true, error: null });
    try {
      const request = await getOverrideRequestById(id);
      set({
        selectedRequest: request,
        isDetailLoading: false,
        error: request ? null : "Override request not found.",
      });
    } catch {
      set({ isDetailLoading: false, error: "Unable to load override request." });
    }
  },

  decide: async (id, decision) => {
    set({ isDeciding: true, error: null });
    try {
      await decideOverride(id, decision);
      set((state) => ({
        requests: state.requests.map((request) =>
          request.id === id ? { ...request, status: decision } : request
        ),
        selectedRequest: state.selectedRequest
          ? { ...state.selectedRequest, status: decision }
          : null,
        isDeciding: false,
      }));
    } catch {
      set({ isDeciding: false, error: "Unable to update override request." });
    }
  },
}));

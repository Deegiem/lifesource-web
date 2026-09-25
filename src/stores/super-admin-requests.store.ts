"use client";

import { create } from "zustand";

import { superAdminRequestsService } from "@/services/super-admin-requests.service";
import type {
  PlatformRequest,
  PlatformRequestDetail,
} from "@/features/super-admin/request-types";

interface SuperAdminRequestsState {
  requests: PlatformRequest[];
  selectedRequest: PlatformRequestDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  loadRequests: () => Promise<void>;
  loadRequest: (id: string) => Promise<void>;
  clearErrors: () => void;
}

export const useSuperAdminRequestsStore =
  create<SuperAdminRequestsState>((set) => ({
    requests: [],
    selectedRequest: null,
    isLoading: false,
    isDetailLoading: false,
    error: null,
    detailError: null,

    loadRequests: async () => {
      set({ isLoading: true, error: null });

      try {
        const requests = await superAdminRequestsService.getRequests();
        set({ requests, isLoading: false });
      } catch {
        set({
          isLoading: false,
          error: "Unable to load platform requests.",
        });
      }
    },

    loadRequest: async (id) => {
      set({ isDetailLoading: true, detailError: null });

      try {
        const selectedRequest =
          await superAdminRequestsService.getRequestById(id);

        if (!selectedRequest) {
          set({
            selectedRequest: null,
            isDetailLoading: false,
            detailError: "Request could not be found.",
          });
          return;
        }

        set({
          selectedRequest,
          isDetailLoading: false,
        });
      } catch {
        set({
          isDetailLoading: false,
          detailError: "Unable to load request details.",
        });
      }
    },

    clearErrors: () => set({ error: null, detailError: null }),
  }));

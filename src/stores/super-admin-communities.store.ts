import { create } from "zustand";
import {
  getPlatformCommunities,
  getPlatformCommunityById,
} from "@/services/super-admin-communities.service";
import type {
  PlatformCommunity,
  PlatformCommunityDetail,
} from "@/features/super-admin/community-types";

interface SuperAdminCommunitiesState {
  communities: PlatformCommunity[];
  total: number;
  selectedCommunity: PlatformCommunityDetail | null;
  isLoading: boolean;
  isDetailLoading: boolean;
  error: string | null;
  detailError: string | null;
  loadCommunities: () => Promise<void>;
  loadCommunity: (communityId: string) => Promise<void>;
  clearSelectedCommunity: () => void;
}

export const useSuperAdminCommunitiesStore =
  create<SuperAdminCommunitiesState>((set) => ({
    communities: [],
    total: 0,
    selectedCommunity: null,
    isLoading: false,
    isDetailLoading: false,
    error: null,
    detailError: null,

    loadCommunities: async () => {
      set({ isLoading: true, error: null });

      try {
        const response = await getPlatformCommunities();

        set({
          communities: response.communities,
          total: response.total,
          isLoading: false,
        });
      } catch {
        set({
          isLoading: false,
          error: "Unable to load communities.",
        });
      }
    },

    loadCommunity: async (communityId) => {
      set({ isDetailLoading: true, detailError: null });

      try {
        const community = await getPlatformCommunityById(communityId);

        if (!community) {
          set({
            selectedCommunity: null,
            isDetailLoading: false,
            detailError: "Community not found.",
          });
          return;
        }

        set({
          selectedCommunity: community,
          isDetailLoading: false,
        });
      } catch {
        set({
          isDetailLoading: false,
          detailError: "Unable to load community details.",
        });
      }
    },

    clearSelectedCommunity: () => set({ selectedCommunity: null }),
  }));

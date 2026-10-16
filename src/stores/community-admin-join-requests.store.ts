import { create } from "zustand";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import {
  toJoinRequestRow,
  type JoinRequestRow,
} from "@/features/community-admin/mappers";

interface State {
  items: JoinRequestRow[];
  selectedItem: JoinRequestRow | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadItems: () => Promise<void>;
  loadItem: (id: string) => Promise<void>;
  updateItemStatus: (
    id: string,
    status: "Approved" | "Rejected",
  ) => Promise<void>;
}

export const useCAJoinRequestsStore = create<State>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.listMembers({
        status: "pending",
        limit: 100,
        offset: 0,
      });
      set({
        items: result.members.map(toJoinRequestRow),
        isLoading: false,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to load join requests.",
        ),
      });
    }
  },

  loadItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const member = await apiService.getMember(id);
      set({
        selectedItem: toJoinRequestRow(member),
        isLoading: false,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to load join request.",
        ),
      });
    }
  },

  updateItemStatus: async (id, status) => {
    set({ isSubmitting: true, error: null });
    try {
      if (status === "Approved") {
        await apiService.approveMember(id);
      } else {
        await apiService.rejectMember(id);
      }
      set((state) => ({
        items: state.items.map((item) =>
          item.id === id ? { ...item, status } : item,
        ),
        selectedItem:
          get().selectedItem?.id === id
            ? { ...get().selectedItem!, status }
            : get().selectedItem,
        isSubmitting: false,
      }));
    } catch (requestError) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to update membership.",
        ),
      });
      throw requestError;
    }
  },
}));
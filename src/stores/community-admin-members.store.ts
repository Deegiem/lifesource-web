import { create } from "zustand";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import {
  toMemberRow,
  type MemberRow,
} from "@/features/community-admin/mappers";

interface State {
  items: MemberRow[];
  selectedItem: MemberRow | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadItems: (params?: { status?: string; search?: string }) => Promise<void>;
  loadItem: (id: string) => Promise<void>;
  revokeMember: (id: string) => Promise<void>;
}

export const useCAMembersStore = create<State>((set, get) => ({
  items: [],
  selectedItem: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadItems: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.listMembers({
        limit: 100,
        offset: 0,
        ...params,
      });
      set({
        items: result.members.map(toMemberRow),
        isLoading: false,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(requestError, "Unable to load members."),
      });
    }
  },

  loadItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const member = await apiService.getMember(id);
      set({
        selectedItem: toMemberRow(member),
        isLoading: false,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(requestError, "Unable to load member."),
      });
    }
  },

  revokeMember: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await apiService.revokeMember(id);
      set((state) => ({
        items: state.items.filter((m) => m.id !== id),
        selectedItem:
          get().selectedItem?.id === id ? null : get().selectedItem,
        isSubmitting: false,
      }));
    } catch (requestError) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(requestError, "Unable to revoke member."),
      });
      throw requestError;
    }
  },
}));
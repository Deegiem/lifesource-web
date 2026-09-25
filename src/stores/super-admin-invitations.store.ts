import { create } from "zustand";
import {
  createCommunityAdminInvitation,
  getCommunityAdminInvitations,
} from "@/services/super-admin-invitations.service";
import type {
  CommunityAdminInvitation,
  CreateCommunityAdminInvitationInput,
} from "@/features/super-admin/invitation-types";

interface State {
  invitations: CommunityAdminInvitation[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadInvitations: () => Promise<void>;
  sendInvitation: (input: CreateCommunityAdminInvitationInput) => Promise<void>;
}

export const useSuperAdminInvitationsStore = create<State>((set) => ({
  invitations: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadInvitations: async () => {
    set({ isLoading: true, error: null });
    try {
      const invitations = await getCommunityAdminInvitations();
      set({ invitations, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Unable to load invitations." });
    }
  },

  sendInvitation: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const invitation = await createCommunityAdminInvitation(input);
      set((state) => ({
        invitations: [invitation, ...state.invitations],
        isSubmitting: false,
      }));
    } catch {
      set({ isSubmitting: false, error: "Unable to send invitation." });
      throw new Error("Unable to send invitation.");
    }
  },
}));

import { create } from "zustand";
import {
  createCommunityAdminInvitation,
  getCommunityAdminInvitations,
  revokeCommunityAdminInvitation,
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
  revokeInvitation: (id: string) => Promise<void>;
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
    } catch (error) {
      set({ isLoading: false, error: error instanceof Error ? error.message : "Unable to load invitations." });
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
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : "Unable to send invitation." });
      throw error;
    }
  },

  revokeInvitation: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await revokeCommunityAdminInvitation(id);
      set((state) => ({
        invitations: state.invitations.map((invite) =>
          invite.id === id ? { ...invite, status: "revoked" as const } : invite,
        ),
        isSubmitting: false,
      }));
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : "Unable to revoke invitation." });
      throw error;
    }
  },
}));
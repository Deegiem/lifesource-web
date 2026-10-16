"use client";

import { create } from "zustand";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";

export interface CommunityInvitationView {
  firstName: string;
  lastName: string;
  email: string;
  communityName: string;
  communityType: string;
  invitedBy: string;
  expiresAt: string;
  isExpired: boolean;
  isUsed: boolean;
}

interface CommunityMemberState {
  invitation: CommunityInvitationView | null;
  invitationState: "valid" | "expired" | "used" | "invalid" | "";
  isLoading: boolean;
  error: string | null;

  validateInvitation: (token: string) => Promise<void>;
  submitMembership: (
    name: string,
    token: string,
    password: string,
    phone: string,
  ) => Promise<void>;
  reset: () => void;
}

export const useCommunityMemberStore = create<CommunityMemberState>((set) => ({
  invitation: null,
  invitationState: "",
  isLoading: false,
  error: null,

  validateInvitation: async (token) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.getMemberInvite(token);
      set({
        invitation: {
          firstName: result.first_name,
          lastName: result.last_name,
          email: result.email,
          communityName: result.community_name,
          communityType: result.community_type,
          invitedBy: result.invited_by_name,
          expiresAt: result.expires_at,
          isExpired: result.is_expired,
          isUsed: result.is_used,
        },
        invitationState: result.is_expired
          ? "expired"
          : result.is_used
            ? "used"
            : "valid",
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Unable to validate invitation."),
        invitationState: "invalid",
      });
    }
  },

  submitMembership: async (_name, token, password, phone) => {
    set({ isLoading: true, error: null });
    try {
      await apiService.acceptMemberInvite(token, { password, phone });
      set({ isLoading: false });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Unable to accept invitation."),
      });
      throw error;
    }
  },

  reset: () =>
    set({
      invitation: null,
      invitationState: "",
      isLoading: false,
      error: null,
    }),
}));
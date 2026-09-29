"use client";

import { create } from "zustand";

import { communityMemberService } from "@/services/community-member.service";
import type {
  CommunityInvitation,
  CommunityMembership,
  InvitationState,
} from "@/features/community-member/types";

interface CommunityMemberState {
  invitation: CommunityInvitation | null;
  invitationState: InvitationState | "";
  membership: CommunityMembership | null;
  isLoading: boolean;
  error: string | null;

  validateInvitation: (token: string) => Promise<void>;
  submitMembership: (name: string, token: string) => Promise<void>;
  loadMembership: () => Promise<void>;
  reset: () => void;
}

export const useCommunityMemberStore = create<CommunityMemberState>((set) => ({
  invitation: null,
  invitationState: "",
  membership: null,
  isLoading: false,
  error: null,

  validateInvitation: async (token) => {
    set({ isLoading: true, error: null });

    try {
      const result = await communityMemberService.validateInvitation(token);

      set({
        invitation: result.invitation,
        invitationState: result.state,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: "We could not validate this invitation.",
      });
    }
  },

  submitMembership: async (name, token) => {
    set({ isLoading: true, error: null });

    try {
      const membership = await communityMemberService.submitMembership(name, token);
      set({
        membership,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: "We could not submit your membership request.",
      });
    }
  },

  loadMembership: async () => {
    set({ isLoading: true, error: null });

    try {
      const membership = await communityMemberService.getMembership();
      set({
        membership,
        isLoading: false,
      });
    } catch {
      set({
        isLoading: false,
        error: "We could not load your membership status.",
      });
    }
  },

  reset: () =>
    set({
      invitation: null,
      invitationState: "",
      membership: null,
      isLoading: false,
      error: null,
    }),
}));

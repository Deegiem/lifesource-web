import {
  communityInvitation,
  communityMembership,
} from "@/features/community-member/data";
import type {
  CommunityInvitation,
  CommunityMembership,
  InvitationState,
} from "@/features/community-member/types";

export const communityMemberService = {
  async getInvitation(token: string): Promise<CommunityInvitation | null> {
    if (!token || token !== communityInvitation.token) return null;
    return communityInvitation;
  },

  async validateInvitation(
    token: string,
  ): Promise<{ state: InvitationState; invitation: CommunityInvitation | null }> {
    if (!token || token !== communityInvitation.token) {
      return { state: "invalid", invitation: null };
    }

    const expired = new Date(communityInvitation.expiresAt).getTime() < Date.now();

    return {
      state: expired ? "expired" : "valid",
      invitation: expired ? null : communityInvitation,
    };
  },

  async submitMembership(
    name: string,
    token: string,
  ): Promise<CommunityMembership> {
    return {
      ...communityMembership,
      memberName: name.trim() || communityMembership.memberName,
      communityId: communityInvitation.communityId,
      communityName: communityInvitation.communityName,
      status: "pending",
      submittedAt: new Date().toISOString(),
      rejectionReason: null,
    };
  },

  async getMembership(): Promise<CommunityMembership> {
    return communityMembership;
  },

  async getMembershipStatus(): Promise<CommunityMembership> {
    return communityMembership;
  },
};

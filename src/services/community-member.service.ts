import { apiService } from "@/services/api.service";
import type {
  CommunityInvitation,
  CommunityMembership,
  InvitationState,
} from "@/features/community-member/types";

const toMembership = (
  profile: Awaited<ReturnType<typeof apiService.getMyProfile>>,
): CommunityMembership => ({
  id: profile.community?.community_id ?? profile.user.id,
  communityId: profile.community?.community_id ?? "",
  communityName: profile.community?.community_name ?? "",
  memberId: profile.user.id,
  memberName: profile.user.full_name,
  status:
    profile.community?.member_status.toLowerCase() === "active"
      ? "approved"
      : profile.community?.member_status.toLowerCase() === "rejected"
      ? "rejected"
      : "pending",
  submittedAt: profile.community?.joined_at ?? profile.user.created_at,
  reviewedAt: null,
  rejectionReason: null,
});

export const communityMemberService = {
  async getInvitation(token: string): Promise<CommunityInvitation | null> {
    const detail = await apiService.getMemberInvite(token);
    return {
      token,
      communityId: "",
      communityName: detail.community_name,
      invitedBy: detail.invited_by_name,
      expiresAt: detail.expires_at,
      email: detail.email,
      firstName: detail.first_name,
      lastName: detail.last_name,
      communityType: detail.community_type,
      isExpired: detail.is_expired,
      isUsed: detail.is_used,
    };
  },

  async validateInvitation(
    token: string,
  ): Promise<{ state: InvitationState; invitation: CommunityInvitation | null }> {
    const invitation = await this.getInvitation(token);
      if (!invitation) return { state: "invalid", invitation: null };
      if (invitation.isUsed) return { state: "used", invitation };
    if (invitation.isExpired || new Date(invitation.expiresAt).getTime() < Date.now()) return { state: "expired", invitation: null };
    return { state: "valid", invitation };
  },

  async submitMembership(
    _name: string,
    token: string,
    password: string,
    phone: string,
  ): Promise<CommunityMembership> {
    const [accepted, invitation] = await Promise.all([
      apiService.acceptMemberInvite(token, { password, phone }),
      this.getInvitation(token),
    ]);
    return {
      id: accepted.community_id,
      communityId: accepted.community_id,
      communityName: invitation?.communityName ?? "",
      memberId: accepted.user_id,
      memberName: invitation ? `${invitation.firstName} ${invitation.lastName}` : _name,
      status: "approved",
      submittedAt: new Date().toISOString(),
      reviewedAt: new Date().toISOString(),
      rejectionReason: null,
    };
  },

  async getMembership(): Promise<CommunityMembership> {
    return toMembership(await apiService.getMyProfile());
  },

  async getMembershipStatus(): Promise<CommunityMembership> {
    return this.getMembership();
  },
};

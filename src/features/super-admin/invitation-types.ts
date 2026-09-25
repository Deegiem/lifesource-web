export interface CommunityAdminInvitation {
  id: string;
  communityId: string;
  communityName: string;
  inviteeName: string;
  email: string;
  status: "pending" | "accepted" | "expired";
  sentLabel: string;
  expiresLabel: string;
}

export interface CreateCommunityAdminInvitationInput {
  communityId: string;
  name: string;
  email: string;
}

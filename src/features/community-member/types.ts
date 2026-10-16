export type MembershipStatus =
  | "pending"
  | "approved"
  | "rejected";

export type InvitationState = "valid" | "invalid" | "expired" | "used";

export interface CommunityInvitation {
  token: string;
  communityId: string;
  communityName: string;
  invitedBy: string;
  expiresAt: string;
  email: string;
  firstName: string;
  lastName: string;
  communityType: string;
  isExpired: boolean;
  isUsed: boolean;
}

export interface CommunityMembership {
  id: string;
  communityId: string;
  communityName: string;
  memberId: string;
  memberName: string;
  status: MembershipStatus;
  submittedAt: string;
  reviewedAt: string | null;
  rejectionReason: string | null;
}

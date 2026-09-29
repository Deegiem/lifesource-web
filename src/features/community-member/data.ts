import type {
  CommunityInvitation,
  CommunityMembership,
} from "./types";

export const communityInvitation: CommunityInvitation = {
  token: "INV-ALHIKMAH-2026",
  communityId: "COM-001",
  communityName: "Al-Hikmah Community",
  invitedBy: "Community Admin",
  expiresAt: "2026-12-31T23:59:59.000Z",
};

export const communityMembership: CommunityMembership = {
  id: "MEM-0007",
  communityId: "COM-001",
  communityName: "Al-Hikmah Community",
  memberId: "USR-0012",
  memberName: "Amina Yusuf",
  status: "pending",
  submittedAt: "2026-09-25T10:00:00.000Z",
  reviewedAt: null,
  rejectionReason: null,
};

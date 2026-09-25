import type { CommunityAdminInvitation } from "./invitation-types";

export const communityAdminInvitations: CommunityAdminInvitation[] = [
  {
    id: "INV-0001",
    communityId: "COM-0001",
    communityName: "LifeSource Community",
    inviteeName: "Maryam Adewale",
    email: "maryam.adewale@example.com",
    status: "accepted",
    sentLabel: "01 Aug 2026",
    expiresLabel: "08 Aug 2026",
  },
  {
    id: "INV-0002",
    communityId: "COM-0002",
    communityName: "Hope Community",
    inviteeName: "Abdulrahman Yusuf",
    email: "abdulrahman.yusuf@example.com",
    status: "pending",
    sentLabel: "17 Sep 2026",
    expiresLabel: "24 Sep 2026",
  },
];

import type {
  PlatformCommunity,
  PlatformCommunityDetail,
} from "./community-types";

export const platformCommunities: PlatformCommunity[] = [
  {
    id: "COM-0001",
    name: "LifeSource Community",
    type: "General Community",
    location: "Ibadan, Oyo State",
    adminName: "Maryam Adewale",
    memberCount: 128,
    requestCount: 14,
    status: "active",
    createdLabel: "01 Aug 2026",
  },
  {
    id: "COM-0002",
    name: "Hope Community",
    type: "General Community",
    location: "Lagos, Lagos State",
    adminName: "Abdulrahman Yusuf",
    memberCount: 86,
    requestCount: 9,
    status: "active",
    createdLabel: "12 Aug 2026",
  },
  {
    id: "COM-0003",
    name: "Unity Community",
    type: "General Community",
    location: "Abeokuta, Ogun State",
    adminName: "Zainab Ibrahim",
    memberCount: 52,
    requestCount: 4,
    status: "inactive",
    createdLabel: "20 Aug 2026",
  },
];

export const platformCommunityDetails: Record<string, PlatformCommunityDetail> = {
  "COM-0001": {
    ...platformCommunities[0],
    description: "A LIFESOURCE community for coordinating local blood donation support.",
    adminEmail: "maryam.adewale@example.com",
    adminPhone: "+234 803 456 7890",
    members: [
      {
        id: "USR-0003",
        name: "Maryam Adewale",
        role: "community_admin",
        status: "active",
        joinedLabel: "01 Aug 2026",
      },
      {
        id: "USR-0002",
        name: "Ibrahim Yusuf",
        role: "community_member",
        status: "active",
        joinedLabel: "10 Sep 2026",
      },
    ],
    auditTrail: [
      {
        id: "CA-001",
        action: "Community created",
        description: "Community was created on the platform.",
        actor: "Super Admin",
        timestampLabel: "01 Aug 2026, 10:00 AM",
      },
      {
        id: "CA-002",
        action: "Community Admin assigned",
        description: "Maryam Adewale was assigned as Community Admin.",
        actor: "Super Admin",
        timestampLabel: "01 Aug 2026, 10:08 AM",
      },
    ],
  },
};

export function getPlatformCommunityDetail(
  id: string
): PlatformCommunityDetail | null {
  return platformCommunityDetails[id] ?? null;
}

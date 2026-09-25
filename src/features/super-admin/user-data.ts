import type { PlatformUser, PlatformUserDetail } from "./user-types";

export const platformUsers: PlatformUser[] = [
  {
    id: "USR-0001",
    name: "Aisha Bello",
    email: "aisha.bello@example.com",
    phone: "+234 801 234 5678",
    role: "donor",
    status: "active",
    community: "LifeSource Community",
    bloodType: "O+",
    joinedLabel: "12 Sep 2026",
    lastActiveLabel: "Today, 8:42 AM",
  },
  {
    id: "USR-0002",
    name: "Ibrahim Yusuf",
    email: "ibrahim.yusuf@example.com",
    phone: "+234 802 345 6789",
    role: "community_member",
    status: "active",
    community: "LifeSource Community",
    bloodType: null,
    joinedLabel: "10 Sep 2026",
    lastActiveLabel: "Today, 7:15 AM",
  },
  {
    id: "USR-0003",
    name: "Maryam Adewale",
    email: "maryam.adewale@example.com",
    phone: "+234 803 456 7890",
    role: "community_admin",
    status: "active",
    community: "LifeSource Community",
    bloodType: null,
    joinedLabel: "03 Sep 2026",
    lastActiveLabel: "Yesterday, 5:31 PM",
  },
  {
    id: "USR-0004",
    name: "Oluwatobi Ajayi",
    email: "oluwatobi.ajayi@example.com",
    phone: "+234 804 567 8901",
    role: "donor",
    status: "inactive",
    community: null,
    bloodType: "A+",
    joinedLabel: "28 Aug 2026",
    lastActiveLabel: "22 Aug 2026",
  },
  {
    id: "USR-0005",
    name: "Fatimah Sule",
    email: "fatimah.sule@example.com",
    phone: "+234 805 678 9012",
    role: "community_member",
    status: "suspended",
    community: "Hope Community",
    bloodType: null,
    joinedLabel: "20 Aug 2026",
    lastActiveLabel: "18 Aug 2026",
  },
];

export const platformUserDetails: Record<string, PlatformUserDetail> = {
  "USR-0001": {
    ...platformUsers[0],
    location: "Ibadan, Oyo State",
    genotype: "AA",
    availability: "available",
    lastDonationLabel: "Never donated",
    accountCreatedLabel: "12 Sep 2026, 9:14 AM",
    notes: null,
    auditTrail: [
      {
        id: "UA-001",
        action: "Account created",
        description: "Donor account was created.",
        actor: "System",
        timestampLabel: "12 Sep 2026, 9:14 AM",
      },
      {
        id: "UA-002",
        action: "Profile completed",
        description: "Donor onboarding was completed.",
        actor: "Aisha Bello",
        timestampLabel: "12 Sep 2026, 9:21 AM",
      },
    ],
  },
};

export function getPlatformUserDetail(id: string): PlatformUserDetail | null {
  return platformUserDetails[id] ?? null;
}

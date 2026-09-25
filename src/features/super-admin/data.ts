import type { SuperAdminDashboardData } from "./types";

export const dashboardFixture: SuperAdminDashboardData = {
  stats: {
    totalDonations: 2847,
    activeRequests: 34,
    cooldownPool: 512,
    communities: 28,
    activeCommunities: 26,
  },
  communities: [
    {
      id: "com-001",
      name: "Lagos Central Community",
      members: 342,
      requestsLast30Days: 28,
      lastActiveLabel: "2 hrs ago",
      status: "active",
    },
    {
      id: "com-002",
      name: "Unilag Community",
      members: 218,
      requestsLast30Days: 14,
      lastActiveLabel: "5 hrs ago",
      status: "active",
    },
    {
      id: "com-003",
      name: "Abuja Med Cluster",
      members: 156,
      requestsLast30Days: 9,
      lastActiveLabel: "1 day ago",
      status: "active",
    },
    {
      id: "com-004",
      name: "Kano Health Hub",
      members: 89,
      requestsLast30Days: 3,
      lastActiveLabel: "3 days ago",
      status: "inactive",
    },
    {
      id: "com-005",
      name: "Rivers Red Cross",
      members: 201,
      requestsLast30Days: 19,
      lastActiveLabel: "1 hr ago",
      status: "active",
    },
  ],
  recentActivity: [
    {
      id: "audit-001",
      action: "Override approved",
      entity: "ORV-0006",
      timestampLabel: "12 min ago",
    },
    {
      id: "audit-002",
      action: "Community Admin invitation created",
      entity: "Community Admin",
      timestampLabel: "1 hr ago",
    },
    {
      id: "audit-003",
      action: "Hospital record added",
      entity: "Lagos Island General Hospital",
      timestampLabel: "3 hrs ago",
    },
    {
      id: "audit-004",
      action: "User account suspended",
      entity: "User account",
      timestampLabel: "6 hrs ago",
    },
  ],
};

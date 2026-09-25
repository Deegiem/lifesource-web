export type AdminStatus =
  | "active"
  | "inactive"
  | "open"
  | "fulfilled"
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "banned"
  | "escalated"
  | "sent"
  | "confirmed"
  | "failed";

export type AdminUserRole =
  | "super_admin"
  | "community_admin"
  | "community_member"
  | "donor";

export interface SuperAdminUser {
  id: string;
  fullName: string;
  email: string;
  role: AdminUserRole;
  status: "active" | "inactive" | "suspended" | "banned";
  createdAt: string;
}

export interface PlatformStats {
  totalDonations: number;
  activeRequests: number;
  cooldownPool: number;
  communities: number;
  activeCommunities: number;
}

export interface CommunitySummary {
  id: string;
  name: string;
  members: number;
  requestsLast30Days: number;
  lastActiveLabel: string;
  status: "active" | "inactive";
}

export interface AuditActivity {
  id: string;
  action: string;
  entity: string;
  timestampLabel: string;
}

export interface SuperAdminDashboardData {
  stats: PlatformStats;
  communities: CommunitySummary[];
  recentActivity: AuditActivity[];
}

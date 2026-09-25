export type PlatformCommunityStatus = "active" | "inactive";

export interface PlatformCommunity {
  id: string;
  name: string;
  type: string;
  location: string;
  adminName: string;
  memberCount: number;
  requestCount: number;
  status: PlatformCommunityStatus;
  createdLabel: string;
}

export interface CommunityMemberSummary {
  id: string;
  name: string;
  role: "community_admin" | "community_member";
  status: "active" | "inactive" | "suspended";
  joinedLabel: string;
}

export interface PlatformCommunityDetail extends PlatformCommunity {
  description: string | null;
  adminEmail: string | null;
  adminPhone: string | null;
  members: CommunityMemberSummary[];
  auditTrail: CommunityAuditEvent[];
}

export interface CommunityAuditEvent {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestampLabel: string;
}

export interface PlatformCommunitiesResponse {
  communities: PlatformCommunity[];
  total: number;
}

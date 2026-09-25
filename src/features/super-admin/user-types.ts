export type PlatformUserRole =
  | "super_admin"
  | "community_admin"
  | "community_member"
  | "donor";

export type PlatformUserStatus = "active" | "inactive" | "suspended";

export interface PlatformUser {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PlatformUserRole;
  status: PlatformUserStatus;
  community: string | null;
  bloodType: string | null;
  joinedLabel: string;
  lastActiveLabel: string;
}

export interface PlatformUserDetail extends PlatformUser {
  location: string | null;
  genotype: string | null;
  availability: "available" | "not_available" | null;
  lastDonationLabel: string | null;
  accountCreatedLabel: string;
  notes: string | null;
  auditTrail: UserAuditEvent[];
}

export interface UserAuditEvent {
  id: string;
  action: string;
  description: string;
  actor: string;
  timestampLabel: string;
}

export interface PlatformUsersResponse {
  users: PlatformUser[];
  total: number;
}

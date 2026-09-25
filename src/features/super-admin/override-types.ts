export type OverrideStatus = "pending" | "approved" | "rejected";

export interface OverrideRequest {
  id: string;
  type: "donor_cooldown" | "request_exception" | "other";
  requester: string;
  community: string;
  reason: string;
  status: OverrideStatus;
  submittedLabel: string;
}

export interface OverrideRequestDetail extends OverrideRequest {
  entityId: string;
  description: string;
  submittedByRole: string;
  auditTrail: {
    id: string;
    action: string;
    actor: string;
    timestampLabel: string;
  }[];
}

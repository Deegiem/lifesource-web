export type PlatformRequestStatus = "open" | "fulfilled" | "escalated";

export interface PlatformRequest {
  id: string;
  bloodType: string;
  donorsNeeded: number;
  confirmedDonors: number;
  hospital: string;
  community: string;
  requester: string;
  status: PlatformRequestStatus;
  dateLabel: string;
}

export interface RequestDonorSlot {
  slot: number;
  status: "confirmed" | "pending";
  timeLabel: string;
}

export interface RequestAuditEvent {
  id: string;
  action: string;
  actor: string;
  timeLabel: string;
}

export interface PlatformRequestDetail extends PlatformRequest {
  urgency: "high" | "normal";
  createdLabel: string;
  notes: string;
  requesterPhone: string;
  requesterRole: string;
  communityLocation: string;
  communityType: string;
  donorSlots: RequestDonorSlot[];
  auditTrail: RequestAuditEvent[];
}

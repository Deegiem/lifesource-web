import type { OverrideRequest, OverrideRequestDetail } from "./override-types";

export const overrideRequests: OverrideRequest[] = [
  {
    id: "OVR-0001",
    type: "donor_cooldown",
    requester: "Ibrahim Yusuf",
    community: "LifeSource Community",
    reason: "Early reactivation requested with Community Admin vouch.",
    status: "pending",
    submittedLabel: "17 Sep 2026",
  },
  {
    id: "OVR-0002",
    type: "request_exception",
    requester: "Maryam Adewale",
    community: "Hope Community",
    reason: "Blood request exceeds the normal direct donor count limit.",
    status: "approved",
    submittedLabel: "15 Sep 2026",
  },
];

export const overrideRequestDetails: Record<string, OverrideRequestDetail> = {
  "OVR-0001": {
    ...overrideRequests[0],
    entityId: "USR-0002",
    description:
      "The member requested early reactivation before the normal requester cooldown elapsed.",
    submittedByRole: "Community Admin",
    auditTrail: [
      {
        id: "OR-001",
        action: "Override submitted",
        actor: "Maryam Adewale",
        timestampLabel: "17 Sep 2026, 3:12 PM",
      },
    ],
  },
};

export function getOverrideRequest(id: string) {
  return overrideRequestDetails[id] ?? null;
}

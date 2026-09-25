import type { PlatformAuditLog } from "./audit-types";

export const platformAuditLogs: PlatformAuditLog[] = [
  {
    id: "AUD-0001",
    actor: "Super Admin",
    actorRole: "Super Admin",
    action: "Community Admin assigned",
    entityType: "Community",
    entityId: "COM-0001",
    description: "A Community Admin was assigned to LifeSource Community.",
    timestampLabel: "01 Aug 2026, 10:08 AM",
  },
  {
    id: "AUD-0002",
    actor: "Super Admin",
    actorRole: "Super Admin",
    action: "Override approved",
    entityType: "Override Request",
    entityId: "OVR-0002",
    description: "A request exception was approved.",
    timestampLabel: "15 Sep 2026, 4:40 PM",
  },
  {
    id: "AUD-0003",
    actor: "Maryam Adewale",
    actorRole: "Community Admin",
    action: "Blood request created",
    entityType: "Request",
    entityId: "REQ-0041",
    description: "A community blood request was submitted.",
    timestampLabel: "17 Sep 2026, 8:30 AM",
  },
];

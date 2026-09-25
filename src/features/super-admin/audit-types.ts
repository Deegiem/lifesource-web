export interface PlatformAuditLog {
  id: string;
  actor: string;
  actorRole: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  timestampLabel: string;
}

import type { PlatformAuditLog } from '@/features/super-admin/audit-types';

export async function getPlatformAuditLogs(): Promise<PlatformAuditLog[]> {
  throw new Error('The supplied API does not include a platform audit-log endpoint.');
}

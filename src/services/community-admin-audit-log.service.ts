import { CAAuditLog } from '@/features/community-admin/audit-log-types';
import { MOCK_AUDIT_LOGS } from '@/features/community-admin/audit-log-data';
export const getCAAuditLogs = async (): Promise<CAAuditLog[]> => new Promise(res => setTimeout(() => res(MOCK_AUDIT_LOGS), 500));
export const getCAAuditLogById = async (id: string): Promise<CAAuditLog | null> => new Promise(res => setTimeout(() => res(MOCK_AUDIT_LOGS.find(i => i.id === id) || null), 500));

import type { CAAuditLog } from '@/features/community-admin/audit-log-types';

export const getCAAuditLogs = async (): Promise<CAAuditLog[]> => {
	throw new Error('The supplied API does not include an audit-log endpoint.');
};
export const getCAAuditLogById = async (_id: string): Promise<CAAuditLog | null> => {
	throw new Error('The supplied API does not include an audit-log detail endpoint.');
};

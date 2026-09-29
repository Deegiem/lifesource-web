import { create } from 'zustand';
import { getCAAuditLogs, getCAAuditLogById } from '@/services/community-admin-audit-log.service';
import { CAAuditLog } from '@/features/community-admin/audit-log-types';

interface CAAuditLogState {
  items: CAAuditLog[]; isLoading: boolean; error: string | null;
  loadItems: () => Promise<void>;
}
export const useCAAuditLogStore = create<CAAuditLogState>((set) => ({
  items: [], isLoading: false, error: null,
  loadItems: async () => {
    set({ isLoading: true, error: null });
    try { const items = await getCAAuditLogs(); set({ items, isLoading: false }); }
    catch { set({ error: 'Failed', isLoading: false }); }
  }
}));

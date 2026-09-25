import { create } from "zustand";
import { getPlatformAuditLogs } from "@/services/super-admin-audit.service";
import type { PlatformAuditLog } from "@/features/super-admin/audit-types";

interface State {
  logs: PlatformAuditLog[];
  isLoading: boolean;
  error: string | null;
  loadLogs: () => Promise<void>;
}

export const useSuperAdminAuditStore = create<State>((set) => ({
  logs: [],
  isLoading: false,
  error: null,

  loadLogs: async () => {
    set({ isLoading: true, error: null });
    try {
      const logs = await getPlatformAuditLogs();
      set({ logs, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Unable to load audit logs." });
    }
  },
}));

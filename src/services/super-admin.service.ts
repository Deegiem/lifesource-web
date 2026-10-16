import type { SuperAdminDashboardData } from "@/features/super-admin/types";
export const superAdminService = {
  async getDashboard(): Promise<SuperAdminDashboardData> {
    throw new Error("The supplied LIFESOURCE API does not include a super-admin dashboard endpoint.");
  },
};

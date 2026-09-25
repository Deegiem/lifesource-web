import type { SuperAdminDashboardData } from "@/features/super-admin/types";
import { dashboardFixture } from "@/features/super-admin/data";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const superAdminService = {
  async getDashboard(): Promise<SuperAdminDashboardData> {
    /*
     * Backend endpoint is intentionally not hardcoded yet.
     *
     * When the backend endpoint is supplied, replace the fixture return
     * with the project's shared Axios/API client call.
     */
    if (!API_BASE_URL) {
      return dashboardFixture;
    }

    // Endpoint pending from backend.
    // Example shape only; do not activate until the backend contract exists.
    return dashboardFixture;
  },
};

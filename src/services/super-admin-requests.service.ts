import {
  platformRequestDetailFixtures,
  platformRequestFixtures,
} from "@/features/super-admin/request-data";
import type {
  PlatformRequest,
  PlatformRequestDetail,
} from "@/features/super-admin/request-types";

export const superAdminRequestsService = {
  async getRequests(): Promise<PlatformRequest[]> {
    /*
     * Endpoint pending from backend.
     * Keep the page/store contract unchanged when the endpoint is supplied.
     */
    return platformRequestFixtures;
  },

  async getRequestById(id: string): Promise<PlatformRequestDetail | null> {
    /*
     * Endpoint pending from backend.
     * This fixture lookup represents the future service response shape.
     */
    return platformRequestDetailFixtures[id] ?? null;
  },
};

import type { PlatformRequest, PlatformRequestDetail } from "@/features/super-admin/request-types";

export const superAdminRequestsService = {
  async getRequests(): Promise<PlatformRequest[]> { throw new Error('The supplied API does not include a request-list endpoint.'); },
  async getRequestById(_id: string): Promise<PlatformRequestDetail | null> { throw new Error('The supplied API does not include a request-detail endpoint.'); },
};

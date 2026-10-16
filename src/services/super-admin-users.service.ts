import type { PlatformUserDetail, PlatformUsersResponse } from "@/features/super-admin/user-types";

export async function getPlatformUsers(): Promise<PlatformUsersResponse> {
  throw new Error('The supplied API does not include a platform user-list endpoint.');
}

export async function getPlatformUserById(_userId: string): Promise<PlatformUserDetail | null> {
  throw new Error('The supplied API does not include a platform user-detail endpoint.');
}

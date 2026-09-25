import {
  getPlatformUserDetail,
  platformUsers,
} from "@/features/super-admin/user-data";
import type {
  PlatformUserDetail,
  PlatformUsersResponse,
} from "@/features/super-admin/user-types";

// Replace these fixture reads with API calls when the backend endpoint is ready.
export async function getPlatformUsers(): Promise<PlatformUsersResponse> {
  return {
    users: platformUsers,
    total: platformUsers.length,
  };
}

export async function getPlatformUserById(
  userId: string
): Promise<PlatformUserDetail | null> {
  return getPlatformUserDetail(userId);
}

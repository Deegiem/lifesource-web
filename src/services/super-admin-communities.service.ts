import {
  getPlatformCommunityDetail,
  platformCommunities,
} from "@/features/super-admin/community-data";
import type {
  PlatformCommunitiesResponse,
  PlatformCommunityDetail,
} from "@/features/super-admin/community-types";

// Replace fixture reads with API calls when the backend endpoint is ready.
export async function getPlatformCommunities(): Promise<PlatformCommunitiesResponse> {
  return {
    communities: platformCommunities,
    total: platformCommunities.length,
  };
}

export async function getPlatformCommunityById(
  communityId: string
): Promise<PlatformCommunityDetail | null> {
  return getPlatformCommunityDetail(communityId);
}

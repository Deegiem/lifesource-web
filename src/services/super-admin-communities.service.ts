import type { PlatformCommunitiesResponse, PlatformCommunityDetail } from '@/features/super-admin/community-types';

export async function getPlatformCommunities(): Promise<PlatformCommunitiesResponse> {
  throw new Error('The supplied API does not include a platform community-list endpoint.');
}

export async function getPlatformCommunityById(_communityId: string): Promise<PlatformCommunityDetail | null> {
  throw new Error('The supplied API does not include a platform community-detail endpoint.');
}

import type { InviteCreateRequest, InviteResponse } from '@/features/api/types';
import type { CommunityAdminInvitation, CreateCommunityAdminInvitationInput } from '@/features/super-admin/invitation-types';
import { apiService } from '@/services/api.service';

const mapStatus = (raw: string): CommunityAdminInvitation['status'] => {
  const s = raw.toLowerCase();
  if (s === 'accepted') return 'accepted';
  if (s === 'declined') return 'declined';
  if (s === 'revoked') return 'revoked';
  if (s === 'expired') return 'expired';
  return 'pending';
};

const mapInvitation = (invite: InviteResponse): CommunityAdminInvitation => ({
  id: invite.id,
  communityId: invite.community_name,
  communityName: invite.community_name,
  inviteeName: `${invite.first_name} ${invite.last_name}`,
  email: invite.email,
  status: mapStatus(invite.status),
  sentLabel: new Date(invite.created_at).toLocaleDateString(),
  expiresLabel: new Date(invite.expires_at).toLocaleDateString(),
});

export async function getCommunityAdminInvitations(): Promise<CommunityAdminInvitation[]> {
  return (await apiService.listAdminInvites({ limit: 500, offset: 0 })).map(mapInvitation);
}

export async function createCommunityAdminInvitation(input: CreateCommunityAdminInvitationInput): Promise<CommunityAdminInvitation> {
  const [first_name, ...lastNameParts] = input.name.trim().split(/\s+/);
  const payload: InviteCreateRequest = {
    first_name,
    last_name: lastNameParts.join(' '),
    email: input.email.trim(),
    community_name: input.communityId,
  };
  return mapInvitation(await apiService.createAdminInvite(payload));
}

export async function revokeCommunityAdminInvitation(id: string): Promise<void> {
  await apiService.revokeAdminInvite(id);
}
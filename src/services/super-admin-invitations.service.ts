import { communityAdminInvitations } from "@/features/super-admin/invitation-data";
import type {
  CommunityAdminInvitation,
  CreateCommunityAdminInvitationInput,
} from "@/features/super-admin/invitation-types";

export async function getCommunityAdminInvitations(): Promise<
  CommunityAdminInvitation[]
> {
  return communityAdminInvitations;
}

export async function createCommunityAdminInvitation(
  input: CreateCommunityAdminInvitationInput
): Promise<CommunityAdminInvitation> {
  // Replace with POST /communities/admin-invitations when the backend is ready.
  return {
    id: `INV-${String(communityAdminInvitations.length + 1).padStart(4, "0")}`,
    communityId: input.communityId,
    communityName: input.communityId,
    inviteeName: input.name,
    email: input.email,
    status: "pending",
    sentLabel: "Just now",
    expiresLabel: "Configurable",
  };
}

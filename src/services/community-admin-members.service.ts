import type { CAMembers } from "@/features/community-admin/members-types";
import { apiService } from "@/services/api.service";

const toCAMember = (member: import("@/features/api/types").MemberResponse): CAMembers => ({
  id: member.id,
  name: member.full_name,
  contact: member.email,
  status: member.status.toLowerCase().replace(/^./, (letter) => letter.toUpperCase()),
  joined: member.joined_at ? new Date(member.joined_at).toLocaleDateString() : "Pending",
  activity: "Not available from API",
});

export const getCAMembers = async (search?: string): Promise<CAMembers[]> => {
  const result = await apiService.listMembers({ limit: 500, offset: 0, search });
  return result.members.map(toCAMember);
};

export const getCAMembersById = async (
  id: string,
): Promise<CAMembers | null> => {
  const member = await apiService.getMember(id);
  return toCAMember(member);
};

export const revokeCAMember = (id: string) => apiService.revokeMember(id);

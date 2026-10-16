import type { CAJoinRequests } from "@/features/community-admin/join-requests-types";
import { apiService } from "@/services/api.service";

export const getCAJoinRequests = async (): Promise<CAJoinRequests[]> => {
  const result = await apiService.listMembers({ status: "pending", limit: 500, offset: 0 });
  return result.members.map((member) => ({
    id: member.id,
    name: member.full_name,
    contact: member.email,
    date: new Date(member.created_at).toLocaleDateString(),
    method: member.method,
    status: member.status.toLowerCase().replace(/^./, (letter) => letter.toUpperCase()),
  }));
};

export const getCAJoinRequestsById = async (
  id: string,
): Promise<CAJoinRequests | null> => {
  const member = await apiService.getMember(id);
  return {
    id: member.id,
    name: member.full_name,
    contact: member.email,
    date: new Date(member.created_at).toLocaleDateString(),
    method: member.method,
    status: member.status.toLowerCase().replace(/^./, (letter) => letter.toUpperCase()),
  };
};

export const approveCAJoinRequest = (id: string) => apiService.approveMember(id);
export const rejectCAJoinRequest = (id: string, reason?: string) => apiService.rejectMember(id, { reason });

import { CAMembers } from "@/features/community-admin/members-types";
import { MOCK_MEMBERS } from "@/features/community-admin/members-data";

export const getCAMembers = async (): Promise<CAMembers[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_MEMBERS), 500));
};

export const getCAMembersById = async (
  id: string,
): Promise<CAMembers | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = MOCK_MEMBERS.find((i) => i.id === id);
      resolve(item || null);
    }, 500);
  });
};

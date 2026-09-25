import { CAJoinRequests } from "@/features/community-admin/join-requests-types";
import { MOCK_JOIN_REQUESTS } from "@/features/community-admin/join-requests-data";

export const getCAJoinRequests = async (): Promise<CAJoinRequests[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_JOIN_REQUESTS), 500),
  );
};

export const getCAJoinRequestsById = async (
  id: string,
): Promise<CAJoinRequests | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = MOCK_JOIN_REQUESTS.find((i) => i.id === id);
      resolve(item || null);
    }, 500);
  });
};


import { CARequests } from '@/features/community-admin/requests-types';
import { MOCK_REQUESTS } from '@/features/community-admin/requests-data';

export const getCARequests = async (): Promise<CARequests[]> => {
  return new Promise((resolve) => setTimeout(() => resolve(MOCK_REQUESTS), 500));
};

export const getCARequestsById = async (id: string): Promise<CARequests | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = MOCK_REQUESTS.find(i => i.id === id);
      resolve(item || null);
    }, 500);
  });
};

import type { CARequests } from '@/features/community-admin/requests-types';

export const getCARequests = async (): Promise<CARequests[]> => {
	throw new Error('The supplied API does not include a request-list endpoint.');
};

export const getCARequestsById = async (_id: string): Promise<CARequests | null> => {
	throw new Error('The supplied API does not include a request-detail endpoint.');
};

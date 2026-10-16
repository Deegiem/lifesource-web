import type { CAEscalations } from '@/features/community-admin/escalations-types';

export const getCAEscalations = async (): Promise<CAEscalations[]> => {
	throw new Error('The supplied API does not include an escalation endpoint.');
};
export const getCAEscalationsById = async (_id: string): Promise<CAEscalations | null> => {
	throw new Error('The supplied API does not include an escalation detail endpoint.');
};

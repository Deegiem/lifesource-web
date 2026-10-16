import type { CANotification } from '@/features/community-admin/notifications-types';

export const getCANotifications = async (): Promise<CANotification[]> => {
	throw new Error('The supplied API does not include a notifications endpoint.');
};

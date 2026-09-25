import { CANotification } from '@/features/community-admin/notifications-types';
import { MOCK_NOTIFICATIONS } from '@/features/community-admin/notifications-data';
export const getCANotifications = async (): Promise<CANotification[]> => new Promise(res => setTimeout(() => res(MOCK_NOTIFICATIONS), 500));

import type { PlatformNotification } from '@/features/super-admin/notification-types';

export async function getPlatformNotifications(): Promise<PlatformNotification[]> {
  throw new Error('The supplied API does not include a platform notifications endpoint.');
}

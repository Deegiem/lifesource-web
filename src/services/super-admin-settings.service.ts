import type { SuperAdminPlatformSettings } from '@/features/super-admin/settings-types';

export async function getPlatformSettings(): Promise<SuperAdminPlatformSettings> {
  throw new Error('The supplied LIFESOURCE API does not include platform settings endpoints.');
}

export async function updatePlatformSettings(_settings: SuperAdminPlatformSettings): Promise<SuperAdminPlatformSettings> {
  throw new Error('The supplied LIFESOURCE API does not include platform settings endpoints.');
}

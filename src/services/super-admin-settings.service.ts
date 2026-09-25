import { platformSettings } from "@/features/super-admin/settings-data";
import type { SuperAdminPlatformSettings } from "@/features/super-admin/settings-types";

export async function getPlatformSettings(): Promise<SuperAdminPlatformSettings> {
  return platformSettings;
}

export async function updatePlatformSettings(
  settings: SuperAdminPlatformSettings
): Promise<SuperAdminPlatformSettings> {
  // Replace with PATCH /settings when the backend is ready.
  return settings;
}

import type { SuperAdminPlatformSettings } from "./settings-types";

export const platformSettings: SuperAdminPlatformSettings = {
  donorCooldownDays: 90,
  requesterCooldownHours: 72,
  earlyRequesterCooldownHours: 24,
  acceptanceExpiryHours: 24,
  maxDirectDonorsPerRequest: 10,
};

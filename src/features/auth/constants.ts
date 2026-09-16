export const AUTH_ROUTES = {
  ENTRY: "/auth-entry",
  LOGIN: "/login",
  SIGNUP: "/signup",
  VERIFY: "/verify",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  DONOR_WELCOME: "/donor-welcome",
  NEED_BLOOD_INFO: "/need-blood-info",
  DONOR_PROFILE: "/donor-profile",
  SUPER_ADMIN_LOGIN: "/super-admin/login",
  SUPER_ADMIN_VERIFICATION: "/super-admin/verification",
  SUPER_ADMIN_SUCCESS: "/super-admin/success",
  SUSPENDED_ACCOUNT: "/suspended-account",
  BANNED_ACCOUNT: "/banned-account",
  INVALID_INVITATION: "/invalid-invitation",
  EXPIRED_INVITATION: "/expired-invitation",
  USED_INVITATION: "/used-invitation",
  SESSION_EXPIRED: "/session-expired",
  NETWORK_ERROR: "/network-error",
  AUTH_ERROR: "/auth-error",
} as const;

export const AUTH_COPY = {
  BRAND: "LIFESOURCE",

  ENTRY_TITLE: "What would you like to do?",
  ENTRY_DESCRIPTION:
    "Access your account or create an account to get started.",

  LOGIN: "Log in",
  SIGNUP: "Create an account",
} as const;
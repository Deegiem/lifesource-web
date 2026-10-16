export interface LoginCredentials {
  email: string;
  password: string;
}
export type UserRole =
  | "donor"
  | "community_member"
  | "community_admin"
  | "super_admin";

export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignupResponse {
  status: "verification_email_sent";
  message: string;
  masked_email: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface AuthenticatedResponse {
  status: "authenticated";
}

export interface LoginResponse {
  status: "authenticated" | "otp_required";
  challenge_id: string | null;
  expires_in: number | null;
  masked_email: string | null;
}

export interface OtpVerifyRequest {
  challenge_id: string;
  code: string;
}

export interface OtpChallengeResponse {
  status: "otp_required";
  challenge_id: string;
  expires_in: number;
  resend_after: number;
  masked_email: string;
}

export interface UserResponse {
  id: string;
  user_code: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  status: "pending" | "active" | "suspended" | "banned" | "disabled";
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
}

export interface AuthUser {
  id: string;
  userCode: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  status: UserResponse["status"];
  emailVerifiedAt: string | null;
  lastLoginAt: string | null;
  createdAt: string;
}

export interface CreateAccountData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

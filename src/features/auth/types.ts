export interface LoginCredentials {
  email: string;
  password: string;
}

export interface CreateAccountData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  role: "super_admin" | "community_admin" | "member" | "donor";
  isActive: boolean;
}

export interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
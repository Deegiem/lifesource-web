// ============================================================
// ENUMS AND SHARED TYPES
// ============================================================

export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type Genotype = "AA" | "AS" | "AC" | "SS" | "SC";

export type Urgency = "low" | "medium" | "high" | "critical";

export type NextStep =
  | "complete_profile"
  | "dashboard"
  | (string & {});

export type CommunityType =
  | "hospital"
  | "university"
  | "workplace"
  | "ngo"
  | "religious"
  | "government"
  | "cooperative"
  | "other";

export type UserStatus =
  | "pending"
  | "active"
  | "suspended"
  | "banned"
  | "disabled";

// ============================================================
// AUTHENTICATION
// ============================================================

// Signup
export interface SignupRequest {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  password: string;
}

export interface SignupResponse {
  status: string;
  message: string;
  masked_email: string;
}

// Email verification
export interface VerifyEmailRequest {
  token: string;
}

export interface AuthenticatedResponse {
  status: "authenticated";
}

// Login
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  status: "authenticated" | "otp_required";
  challenge_id: string | null;
  expires_in: number | null;
  masked_email: string | null;
}

// OTP verification
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

// Current session
export interface UserResponse {
  id: string;
  user_code: string;
  email: string;
  first_name: string;
  last_name: string;
  status: UserStatus;
  email_verified_at: string | null;
  last_login_at: string | null;
  created_at: string;
  roles: string[];
  primary_role: string;
  is_super_admin: boolean;
  is_community_admin: boolean;
  is_donor: boolean;
  is_member: boolean;
  next_step: string;
}

export interface AuthSessionResponse extends UserResponse {  id: string;
  roles: string[];
  primary_role: string;
  is_super_admin: boolean;
  is_community_admin: boolean;
  is_donor: boolean;
  is_member: boolean;
  next_step: NextStep;
}


export interface SessionResponse {
  id: string;
  auth_level: string;
  device_name: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
  last_seen_at: string;
  expires_at: string;
  idle_expires_at: string | null;
}

// Password management
export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
}

// ============================================================
// LOCATIONS
// ============================================================

export interface StateResponse {
  id: string;
  code: string;
  name: string;
}

export interface LgaResponse {
  id: string;
  name: string;
}

// HOSPITALS

export interface HospitalResponse {
  id: string;
  name: string;
  phone: string;
  address: string;
  state_id: string;
  lga_id: string;
  state_name: string;
  lga_name: string;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean;
  created_at: string;
}

export interface HospitalCreate {
  name: string;
  phone: string;
  address: string;
  state_id: string;
  lga_id: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface HospitalUpdate {
  name?: string | null;
  phone?: string | null;
  address?: string | null;
  state_id?: string | null;
  lga_id?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  is_active?: boolean | null;
}

export interface HospitalSummary {
  id: string;
  name: string;
  address: string;
  state_name: string;
  lga_name: string;
  phone: string;
}

// ============================================================
// COMMUNITIES
// ============================================================

export interface CommunityResponse {
  id: string;
  name: string;
  type: string;
  state_id: string;
  lga_id: string;
  state_name: string;
  lga_name: string;
  status: string;
  created_at: string;
}

export interface CommunityMeResponse {
  id: string;
  name: string;
  type: string;
  state_id: string;
  lga_id: string;
  state_name: string;
  lga_name: string;
  status: string;
  member_count: number;
  pending_count: number;
  created_at: string;
}

// Community membership information
export interface MyCommunityAdminInfo {
  id: string;
  full_name: string;
  email: string;
  phone: string | null;
}

export interface MyCommunityInfo {
  community_id: string;
  community_name: string;
  community_type: string;
  state_name: string;
  lga_name: string;
  community_status: string;
  member_status: string;
  joined_at: string | null;
  community_admin: MyCommunityAdminInfo | null;
}

// ============================================================
// COMMUNITY INVITATIONS
// ============================================================

export interface InviteCreateRequest {
  first_name: string;
  last_name: string;
  email: string;
  community_name: string;
}

export interface InviteResponse {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  community_name: string;
  status: string;
  expires_at: string;
  created_at: string;
}

export interface InviteDetailsResponse {
  first_name: string;
  last_name: string;
  email: string;
  community_name: string;
  invited_by_name: string;
  expires_at: string;
  is_expired: boolean;
  is_used: boolean;
}

export interface AcceptInviteRequest {
  password: string;
  phone?: string | null;
  community_type: CommunityType;
  state_id: string;
  lga_id: string;
}

export interface AcceptInviteResponse {
  status: string;
  user_id: string;
  community: CommunityResponse;
}

// ============================================================
// COMMUNITY MEMBERS
// ============================================================

export interface InviteMemberRequest {
  full_name: string;
  email: string;
}

export interface MemberResponse {
  id: string;
  community_id: string;
  user_id: string | null;
  full_name: string;
  email: string;
  phone: string | null;
  method: string;
  status: string;
  rejection_reason: string | null;
  joined_at: string | null;
  created_at: string;
}

export interface MemberListResponse {
  members: MemberResponse[];
  total: number;
  limit: number;
  offset: number;
}

export interface RejectMemberRequest {
  reason?: string | null;
}

export interface JoinLinkResponse {
  code: string;
  url: string;
  is_active: boolean;
  expires_at: string | null;
  created_at: string;
}

export interface JoinLinkPublicPreview {
  community_name: string;
  community_type: string;
  state_name: string;
  lga_name: string;
  is_open: boolean;
}

export interface JoinApplicationRequest {
  full_name: string;
  email: string;
  password: string;
  phone: string;
}

export interface JoinApplicationResponse {
  status: "pending";
  message: string;
}

export interface MemberInviteDetailsResponse {
  first_name: string;
  last_name: string;
  email: string;
  community_name: string;
  community_type: string;
  invited_by_name: string;
  expires_at: string;
  is_expired: boolean;
  is_used: boolean;
}

export interface MemberInviteAcceptRequest {
  password: string;
  phone: string;
}

export interface MemberInviteAcceptResponse {
  status: string;
  user_id: string;
  community_id: string;
}

// ============================================================
// USER PROFILE
// ============================================================

export interface MyUserInfo {
  id: string;
  first_name: string;
  last_name: string;
  full_name: string;
  email: string;
  phone: string | null;
  status: string;
  email_verified_at: string | null;
  created_at: string;
}

export interface MyProfileResponse {
  user: MyUserInfo;
  community: MyCommunityInfo | null;
}

// ============================================================
// DONOR PROFILE
// ============================================================

export interface CompleteDonorProfileRequest {
  blood_type: BloodType;
  genotype: Genotype;
  state_id: string;
  lga_id: string;
  latitude?: number | null;
  longitude?: number | null;
}

export interface DonorProfileResponse {
  profile_id: string;
  blood_type: string;
  is_genotype_eligible: boolean;
  state_id: string;
  lga_id: string;
  state_name: string;
  lga_name: string;
  latitude: number | null;
  longitude: number | null;
  availability: boolean;
  last_donation_date: string | null;
  is_eligible: boolean;
  eligible_at: string | null;
  created_at: string;
}

// ============================================================
// BLOOD REQUESTS
// ============================================================

export interface CreateRequestPayload {
  blood_type_needed: BloodType;
  donors_needed: number;
  hospital_id: string;
  urgency?: Urgency;
  notes?: string | null;
}

export interface RequestResponse {
  id: string;
  reference_code: string;
  blood_type_needed: string;
  donors_needed: number;
  urgency: string;
  notes: string | null;
  status: string;
  accepted_count: number;
  confirmed_count: number;
  requester_cooldown_until: string;
  expires_at: string;
  created_at: string;
  hospital: HospitalSummary;
}


// ============================================================
// COMMUNITY REQUESTS (community admin view)
// ============================================================

export interface CommunityRequestRequester {
  id: string;
  full_name: string;
  phone: string;
  email?: string;
}

export interface CommunityRequestHospital {
  id: string;
  name: string;
  address?: string;
  state_name?: string;
  lga_name?: string;
  phone?: string;
}

export interface CommunityRequestListItem {
  id: string;
  reference_code: string;
  requester: CommunityRequestRequester;
  blood_type_needed: string;
  donors_needed: number;
  accepted_count: number;
  confirmed_count: number;
  donors_left: number;
  urgency: string;
  status: string;
  hospital: CommunityRequestHospital | string;
  created_at: string;
  expires_at: string;
}

export interface CommunityRequestAcceptanceActivity {
  status: string;
  accepted_at: string;
  confirmed_at: string;
}

export interface CommunityRequestDetail {
  id: string;
  reference_code: string;
  requester: CommunityRequestRequester;
  blood_type_needed: string;
  donors_needed: number;
  accepted_count: number;
  confirmed_count: number;
  donors_left: number;
  urgency: string;
  status: string;
  notes: string;
  hospital: CommunityRequestHospital | string;
  acceptance_activity: CommunityRequestAcceptanceActivity[];
  created_at: string;
  expires_at: string;
  closed_at: string | null;
}

export interface CommunityRequestsSummary {
  total_requests: number;
  open: number;
  partial: number;
  fulfilled: number;
  expired: number;
  cancelled: number;
}

export interface CommunityRequestsListResponse {
  community: Record<string, unknown>;
  summary: CommunityRequestsSummary;
  requests: CommunityRequestListItem[];
  total: number;
  limit: number;
  offset: number;
}

// ---------------------------------------------------------------------------
// My requests (community member view)
// ---------------------------------------------------------------------------

export interface MyRequestHospital {
  id: string;
  name: string;
  address: string;
  state_name: string;
  lga_name: string;
  phone: string;
}

export interface MyRequestSummary {
  id: string;
  reference_code: string;
  blood_type_needed: string;
  donors_needed: number;
  accepted_count: number;
  confirmed_count: number;
  donors_left: number;
  urgency: string;
  status: string;
  notes: string;
  expires_at: string;
  created_at: string;
  closed_at: string | null;
  hospital: MyRequestHospital;
}

export interface MyRequestsListResponse {
  requests: MyRequestSummary[];
  total: number;
  limit: number;
  offset: number;
}

export interface MyRequestAcceptance {
  id: string;
  status: string;
  accepted_at: string;
  confirmed_at: string | null;
}

export interface MyRequestDetail extends MyRequestSummary {
  acceptances: MyRequestAcceptance[];
}

export interface ConfirmDonationResponse {
  status: string;
  confirmed_count: number;
  donors_needed: number;
  request_status: string;
  message: string;
}

export interface DonorFeedHospital {
  id: string;
  name: string;
  address: string;
  state_name: string;
  lga_name: string;
  phone: string;
}

export interface DonorFeedRequest {
  id: string;
  reference_code: string;
  blood_type_needed: string;
  donors_needed: number;
  accepted_count: number;
  confirmed_count: number;
  donors_left: number;
  urgency: string;
  status: string;
  match_tier: number;
  note: string;
  is_eligible: boolean;
  expires_at: string;
  created_at: string;
  hospital: DonorFeedHospital;
}

export interface DonorFeedResponse {
  requests: DonorFeedRequest[];
  total: number;
}

export interface AcceptRequestResponse {
  acceptance_id: string;
  verification_code: string;
  status: string;
  expires_at: string;
  request: {
    id: string;
    reference_code: string;
    blood_type_needed: string;
    urgency: string;
  };
  hospital: {
    id: string;
    name: string;
    address: string;
    lga_name: string;
    state_name: string;
    phone: string;
  };
  message: string;
}

export interface MyAcceptance {
  id: string;
  request_id: string;
  reference_code: string;
  blood_type_needed: string;
  urgency: string;
  status: string;
  verification_code: string;
  accepted_at: string;
  expires_at: string;
  confirmed_at: string | null;
  hospital: Record<string, unknown>;
}

export interface MyAcceptancesResponse {
  acceptances: MyAcceptance[];
  total: number;
}
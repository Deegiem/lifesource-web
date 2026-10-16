import { apiClient } from "@/lib/axios";
import type {
  AcceptInviteRequest, AcceptInviteResponse, AuthenticatedResponse, ChangePasswordRequest,
  CommunityMeResponse, CompleteDonorProfileRequest, DonorProfileResponse, HospitalCreate,
  HospitalResponse, HospitalUpdate, InviteCreateRequest, InviteDetailsResponse,
  InviteMemberRequest, InviteResponse, JoinApplicationRequest, JoinApplicationResponse,
  JoinLinkPublicPreview, JoinLinkResponse, LgaResponse, LoginRequest, LoginResponse,
  MemberInviteAcceptRequest, MemberInviteAcceptResponse, MemberInviteDetailsResponse,
  MemberListResponse, MemberResponse, MyProfileResponse, OtpChallengeResponse,
  OtpVerifyRequest, RejectMemberRequest, RequestResponse, SessionResponse, SignupRequest,
  SignupResponse, StateResponse, UserResponse, VerifyEmailRequest, CreateRequestPayload, AuthSessionResponse,
  CommunityRequestDetail,
  CommunityRequestsListResponse,
  ConfirmDonationResponse,
  MyRequestDetail,
  MyRequestsListResponse,
  DonorFeedResponse,
  AcceptRequestResponse,
  MyAcceptancesResponse,
} from "@/features/api/types";

const API = "/api/v1";

export const apiService = {
  signup: async (data: SignupRequest) => (await apiClient.post<SignupResponse>(`${API}/auth/signup`, data)).data,
  verifyEmail: async (data: VerifyEmailRequest) => (await apiClient.post<AuthenticatedResponse>(`${API}/auth/verify-email`, data)).data,
  login: async (data: LoginRequest) => (await apiClient.post<LoginResponse>(`${API}/auth/login`, data)).data,
  verifyOtp: async (data: OtpVerifyRequest) => (await apiClient.post<AuthenticatedResponse>(`${API}/auth/otp/verify`, data)).data,
  resendOtp: async (challenge_id: string) => (await apiClient.post<OtpChallengeResponse>(`${API}/auth/otp/resend`, { challenge_id })).data,
  logout: async () => { await apiClient.post(`${API}/auth/logout`); },
  logoutAll: async () => { await apiClient.post(`${API}/auth/logout-all`); },
  changePassword: async (data: ChangePasswordRequest) => { await apiClient.post(`${API}/auth/change-password`, data); },
  currentSession: async () =>
    (
      await apiClient.get<AuthSessionResponse>(
        `${API}/auth/session`,
      )
    ).data,
  listSessions: async () => (await apiClient.get<SessionResponse[]>(`${API}/auth/sessions`)).data,
  deleteSession: async (sessionId: string) => { await apiClient.delete(`${API}/auth/sessions/${encodeURIComponent(sessionId)}`); },
  listStates: async () => (await apiClient.get<StateResponse[]>(`${API}/locations/states`)).data,
  listLgas: async (stateId: string) => (await apiClient.get<LgaResponse[]>(`${API}/locations/states/${encodeURIComponent(stateId)}/lgas`)).data,
  listPublicHospitals: async (params?: { state_id?: string; lga_id?: string; limit?: number }) => (await apiClient.get<HospitalResponse[]>(`${API}/hospitals`, { params })).data,
  listAdminHospitals: async (params?: { state_id?: string; lga_id?: string; is_active?: boolean; limit?: number; offset?: number }) => (await apiClient.get<HospitalResponse[]>(`${API}/admin/hospitals`, { params })).data,
  createHospital: async (data: HospitalCreate) => (await apiClient.post<HospitalResponse>(`${API}/admin/hospitals`, data)).data,
  updateHospital: async (id: string, data: HospitalUpdate) => (await apiClient.patch<HospitalResponse>(`${API}/admin/hospitals/${encodeURIComponent(id)}`, data)).data,
  deactivateHospital: async (id: string) => { await apiClient.delete(`${API}/admin/hospitals/${encodeURIComponent(id)}`); },
  createAdminInvite: async (data: InviteCreateRequest) => (await apiClient.post<InviteResponse>(`${API}/admin/invites`, data)).data,
  listAdminInvites: async (params?: { limit?: number; offset?: number }) => (await apiClient.get<InviteResponse[]>(`${API}/admin/invites`, { params })).data,
  revokeAdminInvite: async (id: string) => { await apiClient.delete(`${API}/admin/invites/${encodeURIComponent(id)}`); },
  getAdminInvite: async (token: string) => (await apiClient.get<InviteDetailsResponse>(`${API}/invites/${encodeURIComponent(token)}`)).data,
  acceptAdminInvite: async (token: string, data: AcceptInviteRequest) => (await apiClient.post<AcceptInviteResponse>(`${API}/invites/${encodeURIComponent(token)}/accept`, data)).data,
  declineAdminInvite: async (token: string) => { await apiClient.post(`${API}/invites/${encodeURIComponent(token)}/decline`); },
  getMyCommunity: async () => (await apiClient.get<CommunityMeResponse>(`${API}/community/me`)).data,
  inviteMember: async (data: InviteMemberRequest) => (await apiClient.post<MemberResponse>(`${API}/community/members/invite`, data)).data,
  listMembers: async (params?: { status?: string; method?: string; search?: string; limit?: number; offset?: number }) => (await apiClient.get<MemberListResponse>(`${API}/community/members`, { params })).data,
  getMember: async (id: string) => (await apiClient.get<MemberResponse>(`${API}/community/members/${encodeURIComponent(id)}`)).data,
  revokeMember: async (id: string) => { await apiClient.delete(`${API}/community/members/${encodeURIComponent(id)}`); },
  approveMember: async (id: string) => (await apiClient.post<MemberResponse>(`${API}/community/members/${encodeURIComponent(id)}/approve`)).data,
  rejectMember: async (id: string, data?: RejectMemberRequest) => (await apiClient.post<MemberResponse>(`${API}/community/members/${encodeURIComponent(id)}/reject`, data ?? {})).data,
  generateJoinLink: async () => (await apiClient.post<JoinLinkResponse>(`${API}/community/join-link`)).data,
  getJoinLink: async () => (await apiClient.get<JoinLinkResponse>(`${API}/community/join-link`)).data,
  revokeJoinLink: async () => { await apiClient.delete(`${API}/community/join-link`); },
  previewJoinLink: async (code: string) => (await apiClient.get<JoinLinkPublicPreview>(`${API}/join/${encodeURIComponent(code)}`)).data,
  applyJoinLink: async (code: string, data: JoinApplicationRequest) => (await apiClient.post<JoinApplicationResponse>(`${API}/join/${encodeURIComponent(code)}`, data)).data,
  getMemberInvite: async (token: string) => (await apiClient.get<MemberInviteDetailsResponse>(`${API}/member-invites/${encodeURIComponent(token)}`)).data,
  acceptMemberInvite: async (token: string, data: MemberInviteAcceptRequest) => (await apiClient.post<MemberInviteAcceptResponse>(`${API}/member-invites/${encodeURIComponent(token)}/accept`, data)).data,
  createDonorProfile: async (data: CompleteDonorProfileRequest) => (await apiClient.post<DonorProfileResponse>(`${API}/donors/profile`, data)).data,
  getMyProfile: async () => (await apiClient.get<MyProfileResponse>(`${API}/me/profile`)).data,
  createRequest: async (data: CreateRequestPayload) => (await apiClient.post<RequestResponse>(`${API}/requests`, data)).data,
  health: async () => (await apiClient.get<Record<string, string>>("/health")).data,
  listCommunityRequests: async (params?: {
    status?: string;
    urgency?: string;
    blood_type?: string;
    search?: string;
    limit?: number;
    offset?: number;
  }) =>
    (
      await apiClient.get<CommunityRequestsListResponse>(
        `${API}/community/requests`,
        { params },
      )
    ).data,

  getCommunityRequest: async (requestId: string) =>
    (
      await apiClient.get<CommunityRequestDetail>(
        `${API}/community/requests/${encodeURIComponent(requestId)}`,
      )
    ).data,
  listMyRequests: async (params?: { status?: string; limit?: number; offset?: number }) =>
    (await apiClient.get<MyRequestsListResponse>(`${API}/requests/me`, { params })).data,

  getMyRequest: async (requestId: string) =>
    (await apiClient.get<MyRequestDetail>(`${API}/requests/${encodeURIComponent(requestId)}`)).data,

  confirmDonation: async (requestId: string, code: string) =>
    (await apiClient.post<ConfirmDonationResponse>(
      `${API}/requests/${encodeURIComponent(requestId)}/confirm`,
      { code },
    )).data,

  // Donor
  getMyDonorProfile: async () =>
    (await apiClient.get<DonorProfileResponse>(`${API}/donors/me`)).data,

  updateDonorProfile: async (data: {
    availability?: boolean;
    state_id?: string;
    lga_id?: string;
    latitude?: number;
    longitude?: number;
  }) =>
    (await apiClient.patch<DonorProfileResponse>(`${API}/donors/me`, data)).data,

  listDonorFeed: async () =>
    (await apiClient.get<DonorFeedResponse>(`${API}/donors/requests`)).data,

  acceptDonorRequest: async (requestId: string) =>
    (await apiClient.post<AcceptRequestResponse>(
      `${API}/donors/${encodeURIComponent(requestId)}/accept`,
    )).data,

  listMyAcceptances: async () =>
    (await apiClient.get<MyAcceptancesResponse>(`${API}/donors/acceptances`)).data,

  cancelAcceptance: async (acceptanceId: string) =>
    (await apiClient.post<{ status: string; message: string }>(
      `${API}/donors/acceptances/${encodeURIComponent(acceptanceId)}/cancel`,
    )).data,
};

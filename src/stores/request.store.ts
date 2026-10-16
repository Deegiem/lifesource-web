"use client";

import { create } from "zustand";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  AcceptRequestResponse,
  MyAcceptance,
  MyRequestDetail,
  MyRequestSummary,
} from "@/features/api/types";

// ---------------------------------------------------------------------------
// Domain types used by the UI
// ---------------------------------------------------------------------------

export type BloodType =
  | "A+"
  | "A-"
  | "B+"
  | "B-"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type RequestUrgency = "Critical" | "High" | "Medium" | "Low";

export type RequestStatus =
  | "Open"
  | "Partially fulfilled"
  | "Fulfilled"
  | "Expired"
  | "Cancelled";

export interface Hospital {
  id: string;
  name: string;
  lga: string;
  state: string;
  address: string;
  phone: string;
}

export interface BloodRequest {
  id: string;
  referenceCode: string;
  bloodType: string;
  donorsNeeded: number;
  confirmedDonors: number;
  acceptedCount: number;
  donorsLeft: number;
  urgency: string;
  status: RequestStatus;
  notes: string;
  expiresAt: string;
  createdAt: string;
  closedAt: string | null;
  hospital: {
    id: string;
    name: string;
    address: string;
    lga: string;
    state: string;
    phone: string;
  };
  // Legacy fields — required by features/request/types.ts, filled with empty strings
  requesterId: string;
  requesterName: string;
  communityName: string;
}

export interface CreateBloodRequestInput {
  bloodType: string;
  donorsNeeded: number;
  hospitalId: string;
  urgency: string;
  notes: string;
}

export interface RequesterState {
  membershipStatus: "Active" | "Pending" | "Rejected" | "None";
  cooldownUntil: string | null;
}

export interface DonorState {
  profileId: string;
  donorName: string;
  bloodType: string;
  availability: boolean;
  stateName: string;
  lgaName: string;
  isEligible: boolean;
  eligibleAt: string | null;
  lastDonationDate: string | null;
  cooldownUntil: string | null;
}

export interface DonorAcceptance {
  id: string;
  requestId: string;
  referenceCode: string;
  bloodType: string;
  urgency: string;
  status: string;
  verificationCode: string;
  acceptedAt: string;
  expiresAt: string;
  confirmedAt: string | null;
  hospitalName: string;
}

// ---------------------------------------------------------------------------
// Mappers
// ---------------------------------------------------------------------------

function normalizeStatus(raw: string): RequestStatus {
  const s = raw.toLowerCase();
  if (s === "open") return "Open";
  if (s === "partial" || s === "partially_fulfilled") return "Partially fulfilled";
  if (s === "fulfilled") return "Fulfilled";
  if (s === "expired") return "Expired";
  if (s === "cancelled") return "Cancelled";
  return "Open";
}

function normalizeUrgency(raw: string): RequestUrgency {
  const s = raw.toLowerCase();
  if (s === "critical") return "Critical";
  if (s === "high") return "High";
  if (s === "low") return "Low";
  return "Medium";
}

function toBloodRequest(item: MyRequestSummary | MyRequestDetail): BloodRequest {
  return {
    id: item.id,
    referenceCode: item.reference_code,
    bloodType: item.blood_type_needed,
    donorsNeeded: item.donors_needed,
    confirmedDonors: item.confirmed_count,
    acceptedCount: item.accepted_count,
    donorsLeft: item.donors_left,
    urgency: normalizeUrgency(item.urgency),
    status: normalizeStatus(item.status),
    notes: item.notes ?? "",
    expiresAt: item.expires_at,
    createdAt: item.created_at,
    closedAt: item.closed_at,
    hospital: {
      id: item.hospital?.id ?? "",
      name: item.hospital?.name ?? "Unknown hospital",
      address: item.hospital?.address ?? "",
      lga: item.hospital?.lga_name ?? "",
      state: item.hospital?.state_name ?? "",
      phone: item.hospital?.phone ?? "",
    },
    // Legacy fields — empty strings so the type matches features/request/types.ts
    requesterId: "",
    requesterName: "",
    communityName: "",
  };
}

function toDonorAcceptance(item: MyAcceptance): DonorAcceptance {
  const hospital = item.hospital as { name?: string } | undefined;
  return {
    id: item.id,
    requestId: item.request_id,
    referenceCode: item.reference_code,
    bloodType: item.blood_type_needed,
    urgency: normalizeUrgency(item.urgency),
    status: item.status,
    verificationCode: item.verification_code,
    acceptedAt: item.accepted_at,
    expiresAt: item.expires_at,
    confirmedAt: item.confirmed_at,
    hospitalName: hospital?.name ?? "Unknown hospital",
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface RequestStore {
  // Requester-side: "my blood requests" (community member creates requests)
  requests: BloodRequest[];

  // Donor-side: "open requests" (donor browses the feed)
  openRequests: BloodRequest[];

  selectedRequest: BloodRequest | null;
  hospitals: Hospital[];
  requester: RequesterState | null;

  donor: DonorState | null;
  myAcceptances: DonorAcceptance[];

  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;

  loadRequesterContext: () => Promise<void>;
  loadHospitals: () => Promise<void>;
  loadRequests: () => Promise<void>;
  loadMyRequests: () => Promise<void>;
  loadRequest: (requestId: string) => Promise<void>;
  createRequest: (input: CreateBloodRequestInput) => Promise<BloodRequest>;
  confirmDonation: (requestId: string, code: string) => Promise<void>;

  loadDonorProfile: () => Promise<void>;
  updateDonorAvailability: (available: boolean) => Promise<void>;
  loadOpenRequests: () => Promise<void>;
  loadMyAcceptances: () => Promise<void>;
  acceptRequest: (requestId: string) => Promise<AcceptRequestResponse>;
  cancelAcceptance: (acceptanceId: string) => Promise<void>;

  clearError: () => void;
}

export const useRequestStore = create<RequestStore>((set, get) => ({
  requests: [],
  openRequests: [],
  selectedRequest: null,
  hospitals: [],
  requester: null,
  donor: null,
  myAcceptances: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  // -------------------------------------------------------------------------
  // Requester actions
  // -------------------------------------------------------------------------

  loadRequesterContext: async () => {
    try {
      const profile = await apiService.getMyProfile();
      const rawStatus = profile.community?.member_status?.toLowerCase() ?? "";

      const membershipStatus: RequesterState["membershipStatus"] =
        rawStatus === "approved" || rawStatus === "active"
          ? "Active"
          : rawStatus === "pending"
            ? "Pending"
            : rawStatus === "rejected"
              ? "Rejected"
              : "None";

      let cooldownUntil: string | null = null;
      try {
        const myRequests = await apiService.listMyRequests({ limit: 1, offset: 0 });
        const mostRecent = myRequests.requests[0];
        if (mostRecent) {
          cooldownUntil = mostRecent.expires_at;
        }
      } catch {
        // Non-fatal — user may not have any requests
      }

      set({
        requester: {
          membershipStatus,
          cooldownUntil,
        },
      });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Unable to load account context."),
      });
    }
  },

  loadHospitals: async () => {
    try {
      const result = await apiService.listPublicHospitals({ limit: 200 });
      set({
        hospitals: result.map((h) => ({
          id: h.id,
          name: h.name,
          lga: h.lga_name,
          state: h.state_name,
          address: h.address,
          phone: h.phone,
        })),
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error, "Unable to load hospitals.") });
    }
  },

  loadRequests: async () => {
    await get().loadMyRequests();
  },

  loadMyRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.listMyRequests({ limit: 50, offset: 0 });
      set({
        requests: result.requests.map(toBloodRequest),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Unable to load your requests."),
      });
    }
  },

  loadRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const detail = await apiService.getMyRequest(requestId);
      const mapped = toBloodRequest(detail);
      set((state) => ({
        selectedRequest: mapped,
        requests: state.requests.some((r) => r.id === requestId)
          ? state.requests.map((r) => (r.id === requestId ? mapped : r))
          : [mapped, ...state.requests],
        isLoading: false,
      }));
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Unable to load the request."),
      });
    }
  },

  createRequest: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const created = await apiService.createRequest({
        blood_type_needed: input.bloodType as
          | "A+"
          | "A-"
          | "B+"
          | "B-"
          | "AB+"
          | "AB-"
          | "O+"
          | "O-",
        donors_needed: input.donorsNeeded,
        hospital_id: input.hospitalId,
        urgency: input.urgency.toLowerCase() as "low" | "medium" | "high" | "critical",
        notes: input.notes,
      });

      const mapped = toBloodRequest(created as unknown as MyRequestSummary);
      set((state) => ({
        requests: [mapped, ...state.requests],
        isSubmitting: false,
      }));

      void get().loadRequesterContext();

      return mapped;
    } catch (error) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(error, "Unable to create the request."),
      });
      throw error;
    }
  },

  confirmDonation: async (requestId, code) => {
    set({ isSubmitting: true, error: null });
    try {
      await apiService.confirmDonation(requestId, code);
      await get().loadRequest(requestId);
      set({ isSubmitting: false });
    } catch (error) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(error, "Unable to confirm the donation."),
      });
      throw error;
    }
  },

  // -------------------------------------------------------------------------
  // Donor actions
  // -------------------------------------------------------------------------

  loadDonorProfile: async () => {
    try {
      const [profile, userProfile] = await Promise.all([
        apiService.getMyDonorProfile(),
        apiService.getMyProfile().catch(() => null),
      ]);
      set({
        donor: {
          profileId: profile.profile_id,
          donorName: userProfile?.user.full_name ?? "Donor",
          bloodType: profile.blood_type,
          availability: profile.availability,
          stateName: profile.state_name,
          lgaName: profile.lga_name,
          isEligible: profile.is_eligible,
          eligibleAt: profile.eligible_at,
          lastDonationDate: profile.last_donation_date,
          cooldownUntil: profile.eligible_at,
        },
      });
    } catch (error) {
      set({ error: getApiErrorMessage(error, "Unable to load donor profile.") });
    }
  },

  updateDonorAvailability: async (available) => {
    try {
      const profile = await apiService.updateDonorProfile({
        availability: available,
      });
      const current = get().donor;
      set({
        donor: {
          profileId: profile.profile_id,
          donorName: current?.donorName ?? "Donor",
          bloodType: profile.blood_type,
          availability: profile.availability,
          stateName: profile.state_name,
          lgaName: profile.lga_name,
          isEligible: profile.is_eligible,
          eligibleAt: profile.eligible_at,
          lastDonationDate: profile.last_donation_date,
          cooldownUntil: profile.eligible_at,
        },
      });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Unable to update availability."),
      });
      throw error;
    }
  },

  loadOpenRequests: async () => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.listDonorFeed();
      set({
        // IMPORTANT: writes to openRequests, NOT requests
        openRequests: result.requests.map((r) =>
          toBloodRequest({
            id: r.id,
            reference_code: r.reference_code,
            blood_type_needed: r.blood_type_needed,
            donors_needed: r.donors_needed,
            accepted_count: r.accepted_count,
            confirmed_count: r.confirmed_count,
            donors_left: r.donors_left,
            urgency: r.urgency,
            status: r.status,
            notes: r.note,
            expires_at: r.expires_at,
            created_at: r.created_at,
            closed_at: null,
            hospital: {
              id: r.hospital.id,
              name: r.hospital.name,
              address: r.hospital.address,
              lga_name: r.hospital.lga_name,
              state_name: r.hospital.state_name,
              phone: r.hospital.phone,
            },
          }),
        ),
        isLoading: false,
      });
    } catch (error) {
      set({
        isLoading: false,
        error: getApiErrorMessage(error, "Unable to load open requests."),
      });
    }
  },

  loadMyAcceptances: async () => {
    try {
      const [acceptances, donorProfile, userProfile] = await Promise.all([
        apiService.listMyAcceptances(),
        apiService.getMyDonorProfile().catch(() => null),
        apiService.getMyProfile().catch(() => null),
      ]);

      set({
        myAcceptances: acceptances.acceptances.map(toDonorAcceptance),
        donor: donorProfile
          ? {
              profileId: donorProfile.profile_id,
              donorName: userProfile?.user.full_name ?? "Donor",
              bloodType: donorProfile.blood_type,
              availability: donorProfile.availability,
              stateName: donorProfile.state_name,
              lgaName: donorProfile.lga_name,
              isEligible: donorProfile.is_eligible,
              eligibleAt: donorProfile.eligible_at,
              lastDonationDate: donorProfile.last_donation_date,
              cooldownUntil: donorProfile.eligible_at,
            }
          : null,
      });
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Unable to load acceptances."),
      });
    }
  },

  acceptRequest: async (requestId) => {
    set({ isSubmitting: true, error: null });
    try {
      const result = await apiService.acceptDonorRequest(requestId);
      await get().loadMyAcceptances();
      set({ isSubmitting: false });
      return result;
    } catch (error) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(error, "Unable to accept the request."),
      });
      throw error;
    }
  },

  cancelAcceptance: async (acceptanceId) => {
    try {
      await apiService.cancelAcceptance(acceptanceId);
      set((state) => ({
        myAcceptances: state.myAcceptances.filter((a) => a.id !== acceptanceId),
      }));
    } catch (error) {
      set({
        error: getApiErrorMessage(error, "Unable to cancel acceptance."),
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));
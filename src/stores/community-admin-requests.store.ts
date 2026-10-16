import { create } from "zustand";

import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  CommunityRequestListItem,
  CommunityRequestDetail,
  CreateRequestPayload,
  RequestResponse,
} from "@/features/api/types";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface RequestRow {
  id: string;
  referenceCode: string;
  requesterName: string;
  blood: string;
  needed: number;
  conf: number;
  hospital: string;
  urgency: string;
  status: "Open" | "Partially fulfilled" | "Fulfilled" | "Expired" | "Cancelled";
  date: string;
  raw: CommunityRequestListItem;
}

export interface CommunityRequestsSummary {
  total_requests: number;
  open: number;
  partial: number;
  fulfilled: number;
  expired: number;
  cancelled: number;
}

// ---------------------------------------------------------------------------
// Mapping
// ---------------------------------------------------------------------------

function mapStatus(raw: string): RequestRow["status"] {
  const s = raw.toLowerCase();
  if (s === "open") return "Open";
  if (s === "partial" || s === "partially_fulfilled") return "Partially fulfilled";
  if (s === "fulfilled") return "Fulfilled";
  if (s === "expired") return "Expired";
  if (s === "cancelled") return "Cancelled";
  return "Open";
}

function toRequestRow(req: CommunityRequestListItem): RequestRow {
  return {
    id: req.id,
    referenceCode: req.reference_code,
    requesterName: req.requester.full_name,
    blood: req.blood_type_needed,
    needed: req.donors_needed,
    conf: req.confirmed_count,
    hospital: typeof req.hospital === "string" ? req.hospital : "—",
    urgency: req.urgency,
    status: mapStatus(req.status),
    date: new Date(req.created_at).toLocaleDateString(),
    raw: req,
  };
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

interface State {
  items: RequestRow[];
  selectedItem: CommunityRequestDetail | null;
  summary: CommunityRequestsSummary | null;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadItems: (params?: {
    status?: string;
    urgency?: string;
    blood_type?: string;
    search?: string;
  }) => Promise<void>;
  loadItem: (id: string) => Promise<void>;
  createRequest: (payload: CreateRequestPayload) => Promise<RequestResponse>;
}

export const useCARequestsStore = create<State>((set) => ({
  items: [],
  selectedItem: null,
  summary: null,
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadItems: async (params) => {
    set({ isLoading: true, error: null });
    try {
      const result = await apiService.listCommunityRequests({
        limit: 100,
        offset: 0,
        ...params,
      });
      set({
        items: result.requests.map(toRequestRow),
        summary: result.summary,
        isLoading: false,
      });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to load community requests.",
        ),
      });
    }
  },

  loadItem: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const detail = await apiService.getCommunityRequest(id);
      set({ selectedItem: detail, isLoading: false });
    } catch (requestError) {
      set({
        isLoading: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to load the request.",
        ),
      });
    }
  },

  createRequest: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const created = await apiService.createRequest(payload);
      set({ isSubmitting: false });
      return created;
    } catch (requestError) {
      set({
        isSubmitting: false,
        error: getApiErrorMessage(
          requestError,
          "Unable to create the blood request.",
        ),
      });
      throw requestError;
    }
  },
}));
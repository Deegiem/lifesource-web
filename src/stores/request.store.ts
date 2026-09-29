'use client';

import { create } from 'zustand';
import { requestService } from '@/services/request.service';
import type {
  BloodRequest,
  CreateBloodRequestInput,
  DonorAcceptance,
  DonorState,
  Hospital,
  RequesterState,
} from '@/features/request/types';

interface RequestStore {
  requests: BloodRequest[];
  hospitals: Hospital[];
  requester: RequesterState | null;
  donor: DonorState | null;
  myAcceptances: DonorAcceptance[];
  isLoading: boolean;
  error: string | null;
  loadRequesterContext: () => Promise<void>;
  loadHospitals: () => Promise<void>;
  loadRequests: () => Promise<void>;
  loadMyRequests: () => Promise<void>;
  loadOpenRequests: () => Promise<void>;
  loadMyAcceptances: () => Promise<void>;
  loadAcceptance: (requestId: string) => Promise<DonorAcceptance | null>;
  createRequest: (input: CreateBloodRequestInput) => Promise<BloodRequest>;
  acceptRequest: (requestId: string) => Promise<DonorAcceptance>;
  confirmDonation: (requestId: string, code: string) => Promise<BloodRequest>;
  expireRequest: (requestId: string) => Promise<BloodRequest>;
  clearError: () => void;
}

const errorMessage = (error: unknown, fallback: string) => error instanceof Error ? error.message : fallback;

export const useRequestStore = create<RequestStore>((set) => ({
  requests: [], hospitals: [], requester: null, donor: null, myAcceptances: [], isLoading: false, error: null,

  loadRequesterContext: async () => {
    set({ isLoading: true, error: null });
    try {
      const [requester, donor] = await Promise.all([requestService.getRequester(), requestService.getDonor()]);
      set({ requester, donor });
    } catch (error) { set({ error: errorMessage(error, 'Unable to load account.') }); }
    finally { set({ isLoading: false }); }
  },

  loadHospitals: async () => {
    try { set({ hospitals: await requestService.getHospitals() }); }
    catch (error) { set({ error: errorMessage(error, 'Unable to load hospitals.') }); }
  },

  loadRequests: async () => {
    set({ isLoading: true, error: null });
    try { set({ requests: await requestService.listRequests() }); }
    catch (error) { set({ error: errorMessage(error, 'Unable to load requests.') }); }
    finally { set({ isLoading: false }); }
  },

  loadMyRequests: async () => {
    set({ isLoading: true, error: null });
    try { set({ requests: await requestService.listMyRequests() }); }
    catch (error) { set({ error: errorMessage(error, 'Unable to load requests.') }); }
    finally { set({ isLoading: false }); }
  },

  loadOpenRequests: async () => {
    set({ isLoading: true, error: null });
    try { set({ requests: await requestService.listOpenRequests() }); }
    catch (error) { set({ error: errorMessage(error, 'Unable to load open requests.') }); }
    finally { set({ isLoading: false }); }
  },

  loadMyAcceptances: async () => {
    try {
      const [myAcceptances, donor] = await Promise.all([
        requestService.listMyAcceptances(),
        requestService.getDonor(),
      ]);
      set({ myAcceptances, donor });
    } catch (error) { set({ error: errorMessage(error, 'Unable to load accepted requests.') }); }
  },

  loadAcceptance: async (requestId) => {
    try { return await requestService.getAcceptance(requestId); }
    catch (error) { set({ error: errorMessage(error, 'Unable to load acceptance.') }); return null; }
  },

  createRequest: async (input) => {
    set({ isLoading: true, error: null });
    try {
      const request = await requestService.createRequest(input);
      const requester = await requestService.getRequester();
      set((state) => ({ requests: [request, ...state.requests], requester }));
      return request;
    } catch (error) {
      const message = errorMessage(error, 'Unable to create request.');
      set({ error: message }); throw error;
    } finally { set({ isLoading: false }); }
  },

  acceptRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const acceptance = await requestService.acceptRequest(requestId);
      set((state) => ({ myAcceptances: [acceptance, ...state.myAcceptances.filter((item) => item.id !== acceptance.id)] }));
      return acceptance;
    } catch (error) {
      const message = errorMessage(error, 'Unable to accept request.');
      set({ error: message }); throw error;
    } finally { set({ isLoading: false }); }
  },

  confirmDonation: async (requestId, code) => {
    set({ isLoading: true, error: null });
    try {
      const result = await requestService.confirmDonation(requestId, code);
      const [requester, donor] = await Promise.all([requestService.getRequester(), requestService.getDonor()]);
      set((state) => ({
        requests: state.requests.map((item) => item.id === requestId ? result.request : item),
        myAcceptances: state.myAcceptances.map((item) => item.id === result.acceptance.id ? result.acceptance : item),
        requester,
        donor,
      }));
      return result.request;
    } catch (error) {
      const message = errorMessage(error, 'Unable to confirm donation.');
      set({ error: message }); throw error;
    } finally { set({ isLoading: false }); }
  },

  expireRequest: async (requestId) => {
    set({ isLoading: true, error: null });
    try {
      const request = await requestService.expireRequest(requestId);
      const requester = await requestService.getRequester();
      set((state) => ({ requests: state.requests.map((item) => item.id === requestId ? request : item), requester }));
      return request;
    } catch (error) {
      const message = errorMessage(error, 'Unable to expire request.');
      set({ error: message }); throw error;
    } finally { set({ isLoading: false }); }
  },

  clearError: () => set({ error: null }),
}));

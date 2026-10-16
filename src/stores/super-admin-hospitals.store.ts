import { create } from "zustand";
import {
  createPlatformHospital,
  deactivatePlatformHospital,
  getPlatformHospitals,
  updatePlatformHospital,
} from "@/services/super-admin-hospitals.service";
import type { HospitalUpdate } from "@/features/api/types";
import type {
  HospitalInput,
  PlatformHospital,
} from "@/features/super-admin/hospital-types";

interface State {
  hospitals: PlatformHospital[];
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
  loadHospitals: () => Promise<void>;
  createHospital: (input: HospitalInput) => Promise<void>;
  updateHospital: (id: string, input: HospitalUpdate) => Promise<void>;
  deactivateHospital: (id: string) => Promise<void>;
}

export const useSuperAdminHospitalsStore = create<State>((set) => ({
  hospitals: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  loadHospitals: async () => {
    set({ isLoading: true, error: null });
    try {
      const hospitals = await getPlatformHospitals();
      set({ hospitals, isLoading: false });
    } catch {
      set({ isLoading: false, error: "Unable to load hospitals." });
    }
  },

  createHospital: async (input) => {
    set({ isSubmitting: true, error: null });
    try {
      const hospital = await createPlatformHospital(input);
      set((state) => ({
        hospitals: [hospital, ...state.hospitals],
        isSubmitting: false,
      }));
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : "Unable to create hospital." });
      throw error;
    }
  },
  updateHospital: async (id, input) => {
    set({ isSubmitting: true, error: null });
    try {
      const hospital = await updatePlatformHospital(id, input);
      set((state) => ({ hospitals: state.hospitals.map((item) => item.id === id ? hospital : item), isSubmitting: false }));
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : "Unable to update hospital." });
      throw error;
    }
  },
  deactivateHospital: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      await deactivatePlatformHospital(id);
      set((state) => ({ hospitals: state.hospitals.map((item) => item.id === id ? { ...item, status: "inactive" } : item), isSubmitting: false }));
    } catch (error) {
      set({ isSubmitting: false, error: error instanceof Error ? error.message : "Unable to deactivate hospital." });
      throw error;
    }
  },
}));

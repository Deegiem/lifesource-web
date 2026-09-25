import { create } from "zustand";
import {
  createPlatformHospital,
  getPlatformHospitals,
} from "@/services/super-admin-hospitals.service";
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
    } catch {
      set({ isSubmitting: false, error: "Unable to create hospital." });
      throw new Error("Unable to create hospital.");
    }
  },
}));

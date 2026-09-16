import { create } from "zustand";

export type DonorAvailability = "available" | "not_available" | "";

export interface DonorOnboardingState {
  fullName: string;
  genotype: string;
  bloodType: string;

  locationMethod: "gps" | "manual" | "";
  latitude: number | null;
  longitude: number | null;

  state: string;
  lga: string;

  availability: DonorAvailability;

  setProfile: (data: {
    fullName: string;
    genotype: string;
  }) => void;

  setBloodType: (bloodType: string) => void;

  setGpsLocation: (latitude: number, longitude: number) => void;

  setManualLocation: (state: string, lga: string) => void;

  setAvailability: (availability: DonorAvailability) => void;

  reset: () => void;
}

const initialState = {
  fullName: "",
  genotype: "",
  bloodType: "",

  locationMethod: "" as const,
  latitude: null,
  longitude: null,

  state: "",
  lga: "",

  availability: "" as DonorAvailability,
};

export const useDonorOnboardingStore = create<DonorOnboardingState>(
  (set) => ({
    ...initialState,

    setProfile: ({ fullName, genotype }) =>
      set({
        fullName,
        genotype,
      }),

    setBloodType: (bloodType) =>
      set({
        bloodType,
      }),

    setGpsLocation: (latitude, longitude) =>
      set({
        locationMethod: "gps",
        latitude,
        longitude,
      }),

    setManualLocation: (state, lga) =>
      set({
        locationMethod: "manual",
        latitude: null,
        longitude: null,
        state,
        lga,
      }),

    setAvailability: (availability) =>
      set({
        availability,
      }),

    reset: () =>
      set({
        ...initialState,
      }),
  }),
);
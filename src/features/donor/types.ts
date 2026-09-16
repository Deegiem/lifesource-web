export type DonorAvailability =
  | "available"
  | "not_available"
  | "";

export type DonorLocationMethod =
  | "gps"
  | "manual"
  | "";

export interface DonorOnboardingData {
  fullName: string;
  genotype: string;
  bloodType: string;

  locationMethod: DonorLocationMethod;
  latitude: number | null;
  longitude: number | null;

  state: string;
  lga: string;

  availability: DonorAvailability;
}
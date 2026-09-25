export interface PlatformHospital {
  id: string;
  name: string;
  address: string;
  state: string;
  lga: string;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "inactive";
  createdLabel: string;
}

export interface HospitalInput {
  name: string;
  address: string;
  state: string;
  lga: string;
  latitude: number | null;
  longitude: number | null;
}

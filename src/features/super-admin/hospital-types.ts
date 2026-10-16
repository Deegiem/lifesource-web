export interface PlatformHospital {
  id: string;
  name: string;
  phone: string;
  address: string;
  stateId: string;
  lgaId: string;
  state: string;
  lga: string;
  latitude: number | null;
  longitude: number | null;
  status: "active" | "inactive";
  createdLabel: string;
}

export interface HospitalInput {
  name: string;
  phone: string;
  address: string;
  state_id: string;
  lga_id: string;
  latitude: number | null;
  longitude: number | null;
}

import { platformHospitals } from "@/features/super-admin/hospital-data";
import type {
  HospitalInput,
  PlatformHospital,
} from "@/features/super-admin/hospital-types";

export async function getPlatformHospitals(): Promise<PlatformHospital[]> {
  return platformHospitals;
}

export async function createPlatformHospital(
  input: HospitalInput
): Promise<PlatformHospital> {
  // Replace with POST /hospitals when the backend is ready.
  return {
    id: `HSP-${String(platformHospitals.length + 1).padStart(4, "0")}`,
    ...input,
    status: "active",
    createdLabel: "Just now",
  };
}

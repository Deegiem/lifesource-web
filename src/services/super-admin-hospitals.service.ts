import type {
  HospitalInput,
  PlatformHospital,
} from "@/features/super-admin/hospital-types";
import { apiService } from "@/services/api.service";
import type { HospitalResponse } from "@/features/api/types";
import type { HospitalUpdate } from "@/features/api/types";

const toPlatformHospital = (hospital: HospitalResponse): PlatformHospital => ({
  id: hospital.id,
  name: hospital.name,
  phone: hospital.phone,
  address: hospital.address,
  stateId: hospital.state_id,
  lgaId: hospital.lga_id,
  state: hospital.state_name,
  lga: hospital.lga_name,
  latitude: hospital.latitude,
  longitude: hospital.longitude,
  status: hospital.is_active ? "active" : "inactive",
  createdLabel: new Date(hospital.created_at).toLocaleDateString(),
});

export async function getPlatformHospitals(): Promise<PlatformHospital[]> {
  const hospitals = await apiService.listAdminHospitals({ limit: 500, offset: 0 });
  return hospitals.map(toPlatformHospital);
}

export async function createPlatformHospital(
  input: HospitalInput
): Promise<PlatformHospital> {
  return toPlatformHospital(await apiService.createHospital(input));
}

export async function updatePlatformHospital(id: string, input: HospitalUpdate): Promise<PlatformHospital> {
  return toPlatformHospital(await apiService.updateHospital(id, input));
}

export async function deactivatePlatformHospital(id: string): Promise<void> {
  await apiService.deactivateHospital(id);
}

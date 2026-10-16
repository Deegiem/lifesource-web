import { apiService } from '@/services/api.service';
import type { RequestResponse, HospitalResponse } from '@/features/api/types';
import type {
  BloodRequest,
  CreateBloodRequestInput,
  DonorAcceptance,
  DonorState,
  Hospital,
  RequesterState,
} from '@/features/request/types';

const toHospital = (hospital: HospitalResponse): Hospital => ({
  id: hospital.id,
  name: hospital.name,
  address: hospital.address,
  state: hospital.state_name,
  lga: hospital.lga_name,
  latitude: hospital.latitude,
  longitude: hospital.longitude,
});

const toRequest = (request: RequestResponse): BloodRequest => ({
  id: request.reference_code || request.id,
  requesterId: '',
  requesterName: 'Requester',
  communityName: '',
  bloodType: request.blood_type_needed as BloodRequest['bloodType'],
  donorsNeeded: request.donors_needed,
  confirmedDonors: request.confirmed_count,
  hospital: {
    id: request.hospital.id,
    name: request.hospital.name,
    address: request.hospital.address,
    state: request.hospital.state_name,
    lga: request.hospital.lga_name,
    latitude: null,
    longitude: null,
  },
  urgency: request.urgency.toLowerCase() as BloodRequest['urgency'],
  notes: request.notes ?? '',
  status: request.status.toLowerCase() === 'fulfilled' ? 'Fulfilled' : request.status.toLowerCase() === 'expired' ? 'Expired' : 'Open',
  createdAt: request.created_at,
});

export const requestService = {
  async getHospitals(): Promise<Hospital[]> {
    const items = await apiService.listPublicHospitals({ limit: 500 });
    return items.map(toHospital);
  },
  async getRequester(): Promise<RequesterState> {
    const profile = await apiService.getMyProfile();
    return { membershipStatus: profile.community?.member_status.toLowerCase() === 'active' ? 'Active' : 'Pending', cooldownUntil: null };
  },
  async getDonor(): Promise<DonorState> {
    const [profile, user] = await Promise.all([apiService.getMyDonorProfile(), apiService.currentSession()]);
    return {
      donorId: profile.profile_id,
      donorName: `${user.first_name} ${user.last_name}`,
      bloodType: profile.blood_type as DonorState['bloodType'],
      availability: profile.availability ? 'available' : 'not_available',
      cooldownUntil: profile.eligible_at,
      isEligible: profile.is_eligible,
    };
  },
  async listRequests(): Promise<BloodRequest[]> { throw new Error('The supplied API does not include a request-list endpoint.'); },
  async getRequest(requestId: string): Promise<BloodRequest | null> { void requestId; throw new Error('The supplied API does not include a request-detail endpoint.'); },
  async listMyRequests(): Promise<BloodRequest[]> { throw new Error('The supplied API does not include a my-requests endpoint.'); },
  async listOpenRequests(): Promise<BloodRequest[]> { throw new Error('The supplied API does not include an open-requests endpoint.'); },
  async listMyAcceptances(): Promise<DonorAcceptance[]> { throw new Error('The supplied API does not include donor-acceptance endpoints.'); },
  async getAcceptance(requestId: string): Promise<DonorAcceptance | null> { void requestId; throw new Error('The supplied API does not include donor-acceptance endpoints.'); },
  async createRequest(input: CreateBloodRequestInput): Promise<BloodRequest> {
    const created = await apiService.createRequest({
      blood_type_needed: input.bloodType,
      donors_needed: input.donorsNeeded,
      hospital_id: input.hospitalId,
      urgency: input.urgency.toLowerCase() as 'low' | 'medium' | 'high' | 'critical',
      notes: input.notes.trim() || null,
    });
    return toRequest(created);
  },
  async acceptRequest(requestId: string): Promise<DonorAcceptance> {
    void requestId;
    throw new Error('Accepting a donation is not available in the supplied API contract.');
  },
  async confirmDonation(requestId: string, code: string): Promise<{ request: BloodRequest; acceptance: DonorAcceptance }> {
    void requestId;
    void code;
    throw new Error('Donation confirmation is not available in the supplied API contract.');
  },
  async expireRequest(requestId: string): Promise<BloodRequest> {
    void requestId;
    throw new Error('Request expiration is not available in the supplied API contract.');
  },
};

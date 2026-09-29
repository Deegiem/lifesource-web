export const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const;
export type BloodType = (typeof BLOOD_TYPES)[number];
export type RequestUrgency = 'Critical' | 'High' | 'Medium';
export type RequestStatus = 'Open' | 'Fulfilled' | 'Expired';
export type AcceptanceStatus = 'Pending Confirmation' | 'Confirmed' | 'Expired';

export interface Hospital {
  id: string;
  name: string;
  address: string;
  state: string;
  lga: string;
  latitude: number | null;
  longitude: number | null;
}

export interface BloodRequest {
  id: string;
  requesterId: string;
  requesterName: string;
  communityName: string;
  bloodType: BloodType;
  donorsNeeded: number;
  confirmedDonors: number;
  hospital: Hospital;
  urgency: RequestUrgency;
  notes: string;
  status: RequestStatus;
  createdAt: string;
}

export interface DonorAcceptance {
  id: string;
  requestId: string;
  donorId: string;
  donorName: string;
  status: AcceptanceStatus;
  verificationCode: string;
  createdAt: string;
  confirmedAt: string | null;
}

export interface CreateBloodRequestInput {
  bloodType: BloodType;
  donorsNeeded: number;
  hospitalId: string;
  urgency: RequestUrgency;
  notes: string;
}

export interface RequesterState {
  membershipStatus: 'Active' | 'Pending' | 'Rejected' | 'Removed';
  cooldownUntil: string | null;
}

export interface DonorState {
  donorId: string;
  donorName: string;
  bloodType: BloodType;
  availability: 'available' | 'not_available';
  cooldownUntil: string | null;
}

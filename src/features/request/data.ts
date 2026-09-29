import type { BloodRequest, DonorAcceptance, DonorState, Hospital, RequesterState } from './types';

export const MOCK_HOSPITALS: Hospital[] = [
  { id: 'HOSP-001', name: 'Lagos Island General Hospital', address: 'Broad Street, Lagos Island', state: 'Lagos', lga: 'Lagos Island', latitude: 6.4541, longitude: 3.3947 },
  { id: 'HOSP-002', name: 'Lagos University Teaching Hospital (LUTH)', address: 'Idi-Araba', state: 'Lagos', lga: 'Mushin', latitude: 6.5197, longitude: 3.3511 },
  { id: 'HOSP-003', name: 'University College Hospital (UCH), Ibadan', address: 'Queen Elizabeth Road', state: 'Oyo', lga: 'Ibadan North', latitude: 7.3972, longitude: 3.8966 },
  { id: 'HOSP-004', name: 'National Hospital Abuja', address: 'Central Area', state: 'FCT', lga: 'Abuja Municipal', latitude: 9.0348, longitude: 7.4891 },
  { id: 'HOSP-005', name: 'Garki Hospital, Abuja', address: 'Garki', state: 'FCT', lga: 'Abuja Municipal', latitude: 9.0201, longitude: 7.4860 },
];
export const MOCK_REQUESTER: RequesterState = {
  membershipStatus: 'Active',
  cooldownUntil: null,
};

export const MOCK_DONOR: DonorState = {
  donorId: 'donor-001',
  donorName: 'Chidi Okafor',
  bloodType: 'O+',
  availability: 'available',
  cooldownUntil: null,
};

export const INITIAL_REQUESTS: BloodRequest[] = [
  {
    id: 'REQ-0041', requesterId: 'member-001', requesterName: 'Amaka Okafor', communityName: 'Al-Hikmah Community',
    bloodType: 'O+', donorsNeeded: 4, confirmedDonors: 3, hospital: MOCK_HOSPITALS[0], urgency: 'High',
    notes: 'Pre-op transfusion support.', status: 'Open', createdAt: '2026-09-25T10:00:00.000Z',
  },
  {
    id: 'REQ-0039', requesterId: 'member-002', requesterName: 'Ibrahim Yusuf', communityName: 'Al-Hikmah Community',
    bloodType: 'A+', donorsNeeded: 2, confirmedDonors: 1, hospital: MOCK_HOSPITALS[1], urgency: 'Medium',
    notes: '', status: 'Open', createdAt: '2026-09-24T14:30:00.000Z',
  },
  {
    id: 'REQ-0037', requesterId: 'member-003', requesterName: 'Tunde Adeyemi', communityName: 'Unity Community',
    bloodType: 'B-', donorsNeeded: 3, confirmedDonors: 0, hospital: MOCK_HOSPITALS[3], urgency: 'High',
    notes: '', status: 'Open', createdAt: '2026-09-23T09:00:00.000Z',
  },
];

export const INITIAL_ACCEPTANCES: DonorAcceptance[] = [
  {
    id: 'ACC-0038', requestId: 'REQ-0041', donorId: 'donor-001', donorName: 'Chidi Okafor',
    status: 'Pending Confirmation', verificationCode: '0041-7X2K', createdAt: '2026-09-25T11:00:00.000Z', confirmedAt: null,
  },
];

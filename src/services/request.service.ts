import {
  INITIAL_ACCEPTANCES,
  INITIAL_REQUESTS,
  MOCK_DONOR,
  MOCK_HOSPITALS,
  MOCK_REQUESTER,
} from '@/features/request/data';
import {
  DONOR_COOLDOWN_HOURS,
  FULFILLED_REQUESTER_COOLDOWN_HOURS,
  MAX_DIRECT_DONORS,
  REQUESTER_COOLDOWN_HOURS,
} from '@/features/request/constants';
import type {
  BloodRequest,
  CreateBloodRequestInput,
  DonorAcceptance,
  DonorState,
  Hospital,
  RequesterState,
} from '@/features/request/types';

let requests = structuredClone(INITIAL_REQUESTS);
let acceptances = structuredClone(INITIAL_ACCEPTANCES);
let requester = structuredClone(MOCK_REQUESTER);
let donor = structuredClone(MOCK_DONOR);
let requestSequence = 42;
let acceptanceSequence = 39;

const clone = <T>(value: T): T => structuredClone(value);
const cooldownActive = (until: string | null) => Boolean(until && new Date(until).getTime() > Date.now());
const futureDate = (hours: number) => new Date(Date.now() + hours * 60 * 60 * 1000).toISOString();

const createVerificationCode = () => {
  const alphabet = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let index = 0; index < 6; index += 1) {
    code += alphabet[Math.floor(Math.random() * alphabet.length)];
  }
  return code;
};

export const requestService = {
  async getHospitals(): Promise<Hospital[]> {
    return clone(MOCK_HOSPITALS);
  },

  async getRequester(): Promise<RequesterState> {
    if (requester.cooldownUntil && !cooldownActive(requester.cooldownUntil)) requester.cooldownUntil = null;
    return clone(requester);
  },

  async getDonor(): Promise<DonorState> {
    if (donor.cooldownUntil && !cooldownActive(donor.cooldownUntil)) donor.cooldownUntil = null;
    return clone(donor);
  },

  async listRequests(): Promise<BloodRequest[]> {
    return clone(requests);
  },

  async getRequest(requestId: string): Promise<BloodRequest | null> {
    return clone(requests.find((request) => request.id === requestId) ?? null);
  },

  async listMyRequests(): Promise<BloodRequest[]> {
    return clone(requests.filter((request) => request.requesterId === 'member-001'));
  },

  async listOpenRequests(): Promise<BloodRequest[]> {
    return clone(requests.filter((request) => request.status === 'Open' && request.confirmedDonors < request.donorsNeeded));
  },

  async listMyAcceptances(): Promise<DonorAcceptance[]> {
    return clone(acceptances.filter((item) => item.donorId === donor.donorId));
  },

  async getAcceptance(requestId: string): Promise<DonorAcceptance | null> {
    return clone(acceptances.find((item) => item.requestId === requestId && item.donorId === donor.donorId) ?? null);
  },

  async createRequest(input: CreateBloodRequestInput): Promise<BloodRequest> {
    if (requester.membershipStatus !== 'Active') throw new Error('Your community membership is not active.');
    if (cooldownActive(requester.cooldownUntil)) throw new Error('You are currently in requester cooldown.');
    if (input.donorsNeeded < 1 || input.donorsNeeded > MAX_DIRECT_DONORS) {
      throw new Error(`Direct requests support 1-${MAX_DIRECT_DONORS} donors.`);
    }

    const hospital = MOCK_HOSPITALS.find((item) => item.id === input.hospitalId);
    if (!hospital) throw new Error('Selected hospital was not found.');

    const request: BloodRequest = {
      id: `REQ-${String(requestSequence++).padStart(4, '0')}`,
      requesterId: 'member-001',
      requesterName: 'Amaka Okafor',
      communityName: 'Al-Hikmah Community',
      bloodType: input.bloodType,
      donorsNeeded: input.donorsNeeded,
      confirmedDonors: 0,
      hospital,
      urgency: input.urgency,
      notes: input.notes.trim(),
      status: 'Open',
      createdAt: new Date().toISOString(),
    };

    requests = [request, ...requests];
    requester.cooldownUntil = futureDate(REQUESTER_COOLDOWN_HOURS);
    return clone(request);
  },

  async acceptRequest(requestId: string): Promise<DonorAcceptance> {
    if (donor.availability !== 'available') throw new Error('Your donor availability is currently turned off.');
    if (cooldownActive(donor.cooldownUntil)) throw new Error('You are currently in donor cooldown.');

    const request = requests.find((item) => item.id === requestId);
    if (!request || request.status !== 'Open') throw new Error('This request is no longer open.');
    if (request.confirmedDonors >= request.donorsNeeded) throw new Error('This request is already fulfilled.');

    const existing = acceptances.find(
      (item) => item.requestId === requestId && item.donorId === donor.donorId && item.status === 'Pending Confirmation',
    );
    if (existing) return clone(existing);

    const acceptance: DonorAcceptance = {
      id: `ACC-${String(acceptanceSequence++).padStart(4, '0')}`,
      requestId,
      donorId: donor.donorId,
      donorName: donor.donorName,
      status: 'Pending Confirmation',
      verificationCode: createVerificationCode(),
      createdAt: new Date().toISOString(),
      confirmedAt: null,
    };

    acceptances = [acceptance, ...acceptances];
    return clone(acceptance);
  },

  async confirmDonation(requestId: string, code: string): Promise<{ request: BloodRequest; acceptance: DonorAcceptance }> {
    const acceptance = acceptances.find(
      (item) => item.requestId === requestId && item.verificationCode.toUpperCase() === code.trim().toUpperCase(),
    );
    if (!acceptance) throw new Error('Invalid verification code. Please check the code and try again.');
    if (acceptance.status === 'Confirmed') throw new Error('This verification code has already been used.');

    const request = requests.find((item) => item.id === requestId);
    if (!request) throw new Error('Request not found.');
    if (request.status !== 'Open') throw new Error('This request is no longer open.');
    if (request.confirmedDonors >= request.donorsNeeded) throw new Error('This request has already reached its donor target.');

    acceptance.status = 'Confirmed';
    acceptance.confirmedAt = new Date().toISOString();
    request.confirmedDonors += 1;

    if (request.confirmedDonors >= request.donorsNeeded) {
      request.status = 'Fulfilled';
      requester.cooldownUntil = futureDate(FULFILLED_REQUESTER_COOLDOWN_HOURS);
    }

    donor.cooldownUntil = futureDate(DONOR_COOLDOWN_HOURS);

    return { request: clone(request), acceptance: clone(acceptance) };
  },

  async expireRequest(requestId: string): Promise<BloodRequest> {
    const request = requests.find((item) => item.id === requestId);
    if (!request) throw new Error('Request not found.');
    if (request.status !== 'Open') throw new Error('Only open requests can be expired.');

    request.status = 'Expired';
    requester.cooldownUntil = futureDate(REQUESTER_COOLDOWN_HOURS);
    return clone(request);
  },
};

'use client';
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { BackLink, BloodTypeGrid, Button, Field, PageHeader, PageShell, SelectField } from '@/components/community-member/ui';
import { MAX_DIRECT_DONORS } from '@/features/request/constants';
import type { BloodType, RequestUrgency } from '@/features/request/types';
import { useRequestStore } from '@/stores/request.store';

export default function NewBloodRequestPage() {
  const router = useRouter();
  const { hospitals, requester, loadHospitals, loadRequesterContext } = useRequestStore();
  const [bloodType, setBloodType] = useState<BloodType | ''>('');
  const [donors, setDonors] = useState('');
  const [hospitalId, setHospitalId] = useState('');
  const [urgency, setUrgency] = useState<RequestUrgency | ''>('');
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  useEffect(() => { void loadHospitals(); void loadRequesterContext(); }, [loadHospitals, loadRequesterContext]);
  const donorCount = Number.parseInt(donors, 10) || 0;
  const needsEscalation = donorCount > MAX_DIRECT_DONORS;
  const canCreate = requester?.membershipStatus === 'Active' && (!requester.cooldownUntil || new Date(requester.cooldownUntil).getTime() <= Date.now());
  const hospitalOptions = useMemo(() => hospitals.map((hospital) => ({ value: hospital.id, label: hospital.name })), [hospitals]);
  const next = () => {
    const nextErrors: Record<string, string> = {};
    if (!bloodType) nextErrors.bloodType = 'Please select a blood type.';
    if (!donors || donorCount < 1) nextErrors.donors = 'Enter at least 1 donor.';
    if (donorCount > MAX_DIRECT_DONORS) nextErrors.donors = `Requests above ${MAX_DIRECT_DONORS} donors require an escalation.`;
    if (!hospitalId) nextErrors.hospital = 'Please select a hospital.';
    if (!urgency) nextErrors.urgency = 'Please select urgency.';
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    const params = new URLSearchParams({ bloodType, donors, hospitalId, urgency, notes });
    router.push(`/community/requests/review?${params.toString()}`);
  };
  return <PageShell><BackLink href="/community/dashboard" /><PageHeader title="New blood request" description="Provide the details needed to match eligible donors." />
    {!canCreate ? <div className="mb-6 rounded-(--radius-lg) border border-(--color-warning-soft) bg-(--color-warning-soft) p-4 text-sm text-(--color-warning)">Your account must have active community membership and no requester cooldown before a request can be created.</div> : null}
    <div className="space-y-6 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 md:p-6">
      <div><label className="mb-2 block text-sm font-semibold">Blood type needed</label><BloodTypeGrid value={bloodType} onChange={(value) => { setBloodType(value); setErrors((e) => ({ ...e, bloodType: '' })); }} />{errors.bloodType ? <p className="mt-2 text-xs text-(--color-danger)">{errors.bloodType}</p> : null}</div>
      <Field label="Number of donors needed" value={donors} onChange={(value) => { setDonors(value.replace(/\D/g, '')); setErrors((e) => ({ ...e, donors: '' })); }} placeholder="e.g. 3" type="number" error={errors.donors} />
      {needsEscalation ? <div className="rounded-(--radius-lg) border border-(--color-warning-soft) bg-(--color-warning-soft) p-4 text-sm text-(--color-warning)"><p className="font-bold">More than {MAX_DIRECT_DONORS} donors required</p><p className="mt-1 text-xs leading-relaxed">Normal requests are capped at {MAX_DIRECT_DONORS}. This must go through the Community Admin escalation flow.</p></div> : null}
      <SelectField label="Hospital" value={hospitalId} onChange={setHospitalId} options={hospitalOptions} placeholder="Select a hospital" error={errors.hospital} />
      <div><label className="mb-2 block text-sm font-semibold">Urgency</label><div className="grid grid-cols-3 gap-2">{(['Critical', 'High', 'Medium'] as RequestUrgency[]).map((item) => <button key={item} type="button" onClick={() => { setUrgency(item); setErrors((e) => ({ ...e, urgency: '' })); }} className={`min-h-(--control-height-md) rounded-(--radius-lg) border text-sm font-semibold ${urgency === item ? 'border-(--color-brand-primary) bg-(--color-brand-primary) text-white' : 'border-(--color-border-default) bg-white text-(--color-text-secondary)'}`}>{item}</button>)}</div>{errors.urgency ? <p className="mt-2 text-xs text-(--color-danger)">{errors.urgency}</p> : null}</div>
      <div><label className="mb-2 block text-sm font-semibold">Notes <span className="font-normal text-(--color-text-muted)">(optional)</span></label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={4} placeholder="Any relevant context for donors or the hospital..." className="w-full resize-none rounded-(--radius-lg) border border-(--color-border-default) px-4 py-3 text-sm outline-none placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)" /></div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end"><Button variant="outline" onClick={() => router.back()}>Cancel</Button><Button onClick={next} disabled={!canCreate || needsEscalation}>Review request</Button></div>
    </div>
  </PageShell>;
}

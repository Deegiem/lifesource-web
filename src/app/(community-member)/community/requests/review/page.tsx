'use client';

import { Suspense, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { BackLink, Button, PageHeader, PageShell, UrgencyBadge } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';
import type { BloodType, RequestUrgency } from '@/features/request/types';

function ReviewRequestContent() {
  const router = useRouter();
  const params = useSearchParams();
  const bloodType = params.get('bloodType') as BloodType | null;
  const donors = params.get('donors') ?? '';
  const hospitalId = params.get('hospitalId') ?? '';
  const urgency = params.get('urgency') as RequestUrgency | null;
  const notes = params.get('notes') ?? '';
  const { hospitals, createRequest, isLoading } = useRequestStore();
  const [error, setError] = useState('');
  const hospital = useMemo(() => hospitals.find((item) => item.id === hospitalId), [hospitals, hospitalId]);

  const submit = async () => {
    if (!bloodType || !donors || !hospitalId || !urgency || !hospital) {
      setError('This request draft is incomplete. Please return to the form.');
      return;
    }

    setError('');
    try {
      const request = await createRequest({
        bloodType,
        donorsNeeded: Number(donors),
        hospitalId,
        urgency,
        notes,
      });
      router.replace(`/community/requests/submitted?requestId=${encodeURIComponent(request.id)}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit request.');
    }
  };

  if (!bloodType || !donors || !hospitalId || !urgency || !hospital) {
    return (
      <PageShell>
        <BackLink href="/community/requests/new" />
        <div className="rounded-(--radius-xl) border border-(--color-danger-soft) bg-(--color-danger-soft) p-5 text-sm text-(--color-danger)">
          This request draft is incomplete. Please return to the form and enter all required details.
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <BackLink href="/community/requests/new" />
      <PageHeader title="Review request" description="Confirm the details before submitting." />
      <div className="space-y-5 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 md:p-6">
        <div className="flex items-center gap-4 rounded-(--radius-xl) bg-(--color-surface-subtle) p-4">
          <div className="flex size-14 items-center justify-center rounded-(--radius-lg) bg-(--color-blood-soft) text-lg font-extrabold text-(--color-blood)">
            {bloodType}
          </div>
          <div>
            <p className="text-lg font-extrabold">{bloodType} blood needed</p>
            <p className="text-sm text-(--color-text-secondary)">
              {donors} donor{Number(donors) === 1 ? '' : 's'} required
            </p>
          </div>
        </div>

        <div className="divide-y divide-(--color-border-subtle) rounded-(--radius-xl) border border-(--color-border-default)">
          {[
            ['Blood type', bloodType],
            ['Donors needed', donors],
            ['Hospital', hospital.name],
            ['Location', `${hospital.lga}, ${hospital.state}`],
          ].map(([label, value]) => (
            <div key={label} className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="text-sm text-(--color-text-muted)">{label}</span>
              <span className="text-right text-sm font-semibold">{value}</span>
            </div>
          ))}

          <div className="flex items-center justify-between gap-4 px-4 py-3">
            <span className="text-sm text-(--color-text-muted)">Urgency</span>
            <UrgencyBadge urgency={urgency} />
          </div>

          {notes ? (
            <div className="flex items-start justify-between gap-4 px-4 py-3">
              <span className="text-sm text-(--color-text-muted)">Notes</span>
              <span className="max-w-md text-right text-sm font-semibold">{notes}</span>
            </div>
          ) : null}
        </div>

        <div className="rounded-(--radius-lg) bg-(--color-info-soft) p-4 text-sm leading-relaxed text-(--color-info)">
          Once submitted, the request is created and becomes available to eligible donors according to the LIFESOURCE workflow.
        </div>

        {error ? (
          <div className="rounded-(--radius-lg) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)">
            {error}
          </div>
        ) : null}

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button variant="outline" onClick={() => router.back()}>Edit</Button>
          <Button onClick={submit} disabled={isLoading}>
            {isLoading ? 'Submitting...' : 'Submit request'}
          </Button>
        </div>
      </div>
    </PageShell>
  );
}

function ReviewRequestFallback() {
  return (
    <PageShell>
      <BackLink href="/community/requests/new" />
      <div className="space-y-5">
        <div className="h-24 w-full animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" />
        <div className="h-48 w-full animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" />
      </div>
    </PageShell>
  );
}

export default function ReviewRequestPage() {
  return (
    <Suspense fallback={<ReviewRequestFallback />}>
      <ReviewRequestContent />
    </Suspense>
  );
}
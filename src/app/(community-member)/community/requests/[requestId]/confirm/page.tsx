'use client';

import { FormEvent, useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, CheckCircle2, Droplets, MapPin } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Button, PageShell } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';

export default function ConfirmDonationPage() {
  const params = useParams<{ requestId: string }>();
  const router = useRouter();
  const requestId = params.requestId;
  const { requests, loadRequests, confirmDonation, isLoading } = useRequestStore();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');

  const request = requests.find((item) => item.id === requestId);

  useEffect(() => {
    if (!request) void loadRequests();
  }, [loadRequests, request]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setError('Enter the verification code provided by the donor.');
      return;
    }

    if (normalizedCode.length < 6) {
      setError('Enter the complete verification code.');
      return;
    }

    setError('');

    try {
      await confirmDonation(requestId, normalizedCode);
      router.replace(`/community/requests/${requestId}/confirm/success`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to confirm this donation.');
    }
  };

  if (!request) {
    return (
      <PageShell>
        <Link
          href="/community/requests"
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
        >
          <ArrowLeft className="size-4" />
          Back to my requests
        </Link>
        <div className="mt-8 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-8 text-center">
          <h1 className="text-xl font-bold">Request not found</h1>
          <p className="mt-2 text-sm text-(--color-text-secondary)">
            We could not load this request. Return to your requests and try again.
          </p>
        </div>
      </PageShell>
    );
  }

  if (request.status !== 'Open' || request.confirmedDonors >= request.donorsNeeded) {
    return (
      <PageShell>
        <Link
          href={`/community/requests/${request.id}`}
          className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
        >
          <ArrowLeft className="size-4" />
          Request details
        </Link>
        <div className="mx-auto mt-8 max-w-xl rounded-(--radius-xl) border border-(--color-border-default) bg-white p-6 text-center">
          <CheckCircle2 className="mx-auto size-10 text-(--color-success)" />
          <h1 className="mt-4 text-xl font-extrabold">Confirmation unavailable</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            This request is no longer accepting donation confirmations.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push(`/community/requests/${request.id}`)}>
              View request
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <Link
        href={`/community/requests/${request.id}`}
        className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"
      >
        <ArrowLeft className="size-4" />
        Request details
      </Link>

      <div className="mx-auto max-w-xl">
        <div className="mb-6">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            {request.id}
          </p>
          <h1 className="mt-1 text-2xl font-extrabold">Confirm donation</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            Enter the private verification code shown by the donor to confirm that the donation has taken place.
          </p>
        </div>

        <div className="mb-5 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 shadow-(--shadow-sm)">
          <div className="flex items-center gap-4">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-(--radius-lg) bg-(--color-blood-soft)">
              <Droplets className="size-6 text-(--color-blood)" />
            </div>
            <div className="min-w-0">
              <p className="font-extrabold">{request.bloodType} blood</p>
              <p className="mt-1 flex items-center gap-1 text-sm text-(--color-text-secondary)">
                <MapPin className="size-3.5" />
                {request.hospital.name}
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <Info label="Donors confirmed" value={`${request.confirmedDonors}/${request.donorsNeeded}`} />
            <Info label="Request status" value={request.status} />
          </div>
        </div>

        <form
          onSubmit={submit}
          className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 shadow-(--shadow-sm) md:p-6"
        >
          <label htmlFor="verification-code" className="text-sm font-semibold text-(--color-text-primary)">
            Donor verification code
          </label>
          <input
            id="verification-code"
            name="verificationCode"
            value={code}
            onChange={(event) => setCode(event.target.value.toUpperCase())}
            placeholder="Enter verification code"
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            maxLength={12}
            className="mt-2 h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-border-default) px-4 text-center font-mono text-lg font-bold tracking-[0.18em] text-(--color-text-primary) outline-none placeholder:font-sans placeholder:text-sm placeholder:font-normal placeholder:tracking-normal placeholder:text-(--color-text-muted) focus:border-(--color-brand-primary) focus:ring-2 focus:ring-(--color-brand-primary-soft)"
          />

          <div className="mt-4 rounded-(--radius-lg) bg-(--color-info-soft) p-4 text-sm leading-relaxed text-(--color-info)">
            Only enter the code presented by the donor. A successful confirmation updates the donor count and records the donation.
          </div>

          {error ? (
            <div className="mt-4 rounded-(--radius-lg) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)">
              {error}
            </div>
          ) : null}

          <div className="mt-5 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Confirming...' : 'Confirm donation'}
            </Button>
          </div>
        </form>
      </div>
    </PageShell>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-(--radius-lg) bg-(--color-surface-subtle) p-4">
      <p className="text-xs text-(--color-text-muted)">{label}</p>
      <p className="mt-1 text-sm font-bold">{value}</p>
    </div>
  );
}

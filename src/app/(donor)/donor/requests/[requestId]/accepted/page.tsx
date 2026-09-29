'use client';

import { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button, PageShell, SuccessState } from '@/components/community-member/ui';

function AcceptanceSuccessContent() {
  const params = useSearchParams();
  const router = useRouter();
  const code = params.get('code') ?? '';

  return (
    <PageShell>
      <SuccessState
        title="Request accepted"
        description="Thank you for stepping up. Take this verification code with you and present it to the requester or their representative when you arrive."
      >
        <div className="rounded-(--radius-xl) border-2 border-(--color-brand-primary) bg-white p-6">
          <p className="text-xs font-bold uppercase tracking-wide text-(--color-text-secondary)">
            Your verification code
          </p>
          <p className="mt-3 break-all font-mono text-3xl font-extrabold tracking-wider">
            {code || 'Unavailable'}
          </p>
          <p className="mt-3 text-xs leading-relaxed text-(--color-text-muted)">
            Keep this code private. It is only for confirming this donation.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={() => router.push('/donor/accepted')}>
            View my accepted requests
          </Button>
          <Button variant="outline" onClick={() => router.push('/donor/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </SuccessState>
    </PageShell>
  );
}

function AcceptanceSuccessFallback() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md pt-16 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse rounded bg-(--color-surface-subtle)" />
        <div className="mt-4 h-32 w-full animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" />
      </div>
    </PageShell>
  );
}

export default function AcceptanceSuccessPage() {
  return (
    <Suspense fallback={<AcceptanceSuccessFallback />}>
      <AcceptanceSuccessContent />
    </Suspense>
  );
}
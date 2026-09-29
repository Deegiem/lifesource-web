'use client';

import { Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button, PageShell, SuccessState } from '@/components/community-member/ui';

function RequestSubmittedContent() {
  const router = useRouter();
  const params = useSearchParams();
  const requestId = params.get('requestId') ?? '';

  if (!requestId) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md pt-16 text-center">
          <h1 className="text-2xl font-extrabold">Request reference unavailable</h1>
          <p className="mt-2 text-sm text-(--color-text-secondary)">
            Return to your requests and open the request from there.
          </p>
          <div className="mt-6">
            <Button onClick={() => router.push('/community/requests')}>
              View my requests
            </Button>
          </div>
        </div>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <SuccessState
        title="Request submitted"
        description="Your request is live. Eligible donors can now discover and accept it."
      >
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 text-left">
          <p className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">
            Request reference
          </p>
          <p className="mt-2 font-mono text-lg font-bold">{requestId}</p>
          <p className="mt-3 text-sm text-(--color-text-secondary)">
            You can track donor confirmations from your request details.
          </p>
        </div>
        <div className="mt-4 flex flex-col gap-3">
          <Button onClick={() => router.push(`/community/requests/${requestId}`)}>
            View request
          </Button>
          <Button variant="outline" onClick={() => router.push('/community/dashboard')}>
            Back to dashboard
          </Button>
        </div>
      </SuccessState>
    </PageShell>
  );
}

function RequestSubmittedFallback() {
  return (
    <PageShell>
      <div className="mx-auto max-w-md pt-16 text-center">
        <div className="h-8 w-48 mx-auto animate-pulse rounded bg-(--color-surface-subtle)" />
        <div className="mt-4 h-32 w-full animate-pulse rounded-(--radius-xl) bg-(--color-surface-subtle)" />
      </div>
    </PageShell>
  );
}

export default function RequestSubmittedPage() {
  return (
    <Suspense fallback={<RequestSubmittedFallback />}>
      <RequestSubmittedContent />
    </Suspense>
  );
}
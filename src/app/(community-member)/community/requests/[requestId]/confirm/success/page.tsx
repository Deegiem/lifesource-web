'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { useParams } from 'next/navigation';
import { Button, PageShell, SuccessState } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';

export default function DonationConfirmationSuccessPage() {
  const params = useParams<{ requestId: string }>();
  const requestId = params.requestId;
  const { requests, loadRequests } = useRequestStore();
  const request = requests.find((item) => item.id === requestId);

  useEffect(() => {
    if (!request) void loadRequests();
  }, [loadRequests, request]);

  if (!request) {
    return (
      <PageShell>
        <div className="mx-auto max-w-md pt-16 text-center">
          <h1 className="text-2xl font-extrabold">Confirmation recorded</h1>
          <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
            The donation was processed, but the latest request details are still loading.
          </p>
          <div className="mt-6">
            <Link href="/community/requests">
              <Button>View my requests</Button>
            </Link>
          </div>
        </div>
      </PageShell>
    );
  }

  const fulfilled = request.status === 'Fulfilled';

  return (
    <PageShell>
      <SuccessState
        title="Donation confirmed"
        description={
          fulfilled
            ? 'The final required donor has been confirmed and this blood request is now fulfilled.'
            : 'The donor has been successfully confirmed for this blood request.'
        }
      >
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 text-left shadow-(--shadow-sm)">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="size-6 shrink-0 text-(--color-success)" />
            <div>
              <p className="font-bold">{request.id}</p>
              <p className="mt-1 text-xs text-(--color-text-muted)">
                {request.confirmedDonors}/{request.donorsNeeded} donors confirmed
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-(--radius-lg) bg-(--color-success-soft) p-4 text-sm leading-relaxed text-(--color-success)">
            {fulfilled
              ? 'All required donors have now been confirmed.'
              : 'You can continue tracking the remaining donor confirmations from the request details page.'}
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <Link href={`/community/requests/${request.id}`}>
            <Button>View request</Button>
          </Link>
          <Link href="/community/requests">
            <Button variant="outline">View my requests</Button>
          </Link>
        </div>
      </SuccessState>
    </PageShell>
  );
}

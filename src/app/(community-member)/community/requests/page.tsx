'use client';

import { useEffect, useMemo, useState } from 'react';
import { PageHeader, PageShell, RequestCard } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';
import type { RequestStatus } from '@/features/request/types';

const FILTERS: Array<'All' | RequestStatus> = ['All', 'Open', 'Fulfilled', 'Expired'];

export default function MyRequestsPage() {
  const { requests, isLoading, error, loadMyRequests } = useRequestStore();
  const [filter, setFilter] = useState<'All' | RequestStatus>('All');

  useEffect(() => { void loadMyRequests(); }, [loadMyRequests]);

  const filtered = useMemo(
    () => filter === 'All' ? requests : requests.filter((request) => request.status === filter),
    [filter, requests],
  );

  return (
    <PageShell>
      <PageHeader title="My Blood Requests" description="Track the requests you have created and their donor progress." />

      <div className="mb-5 flex gap-2 overflow-x-auto pb-1">
        {FILTERS.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setFilter(item)}
            className={`shrink-0 rounded-(--radius-full) border px-3 py-2 text-xs font-semibold transition-colors ${filter === item ? 'border-(--color-brand-primary) bg-(--color-brand-primary) text-white' : 'border-(--color-border-default) bg-white text-(--color-text-secondary)'}`}
          >
            {item}
          </button>
        ))}
      </div>

      {error ? <div className="mb-5 rounded-(--radius-lg) border border-(--color-danger) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)">{error}</div> : null}

      {isLoading && requests.length === 0 ? (
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center text-sm text-(--color-text-muted)">Loading requests...</div>
      ) : filtered.length === 0 ? (
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center text-sm text-(--color-text-muted)">No requests in this category.</div>
      ) : (
        <div className="grid gap-3 md:grid-cols-2">
          {filtered.map((request) => <RequestCard key={request.id} request={request} href={`/community/requests/${request.id}`} />)}
        </div>
      )}
    </PageShell>
  );
}

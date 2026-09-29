'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Clock3 } from 'lucide-react';
import { PageShell, Button } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';
import { useEffect } from 'react';

export default function RequestExpiredPage() {
  const params = useParams<{ requestId: string }>();
  const { requests, loadRequests } = useRequestStore();
  const request = requests.find((item) => item.id === params.requestId);
  useEffect(() => { if (!request) void loadRequests(); }, [loadRequests, request]);

  if (!request) return <PageShell><p className="text-sm text-(--color-text-muted)">Loading request...</p></PageShell>;

  return <PageShell><div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center"><div className="flex size-16 items-center justify-center rounded-full bg-(--color-warning-soft) text-(--color-warning)"><Clock3 className="size-8" /></div><h1 className="mt-5 text-2xl font-extrabold">Request expired</h1><p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">{request.id} closed before the required number of donors were confirmed.</p><div className="mt-6 w-full rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 text-left"><Row label="Blood type" value={request.bloodType} /><Row label="Hospital" value={request.hospital.name} /><Row label="Confirmed" value={`${request.confirmedDonors}/${request.donorsNeeded}`} /><Row label="Status" value="Expired" /></div><div className="mt-6 flex flex-col gap-3 sm:flex-row"><Link href="/community/requests"><Button>View my requests</Button></Link><Link href="/community/dashboard"><Button variant="outline">Back to dashboard</Button></Link></div></div></PageShell>;
}
function Row({ label, value }: { label: string; value: string }) { return <div className="flex justify-between gap-4 border-b border-(--color-border-subtle) py-3 last:border-0"><span className="text-sm text-(--color-text-muted)">{label}</span><span className="text-right text-sm font-semibold">{value}</span></div>; }

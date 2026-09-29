'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { CheckCircle2 } from 'lucide-react';
import { PageShell, SuccessState, Button } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';
import { useEffect } from 'react';

export default function RequestFulfilledPage() {
  const params = useParams<{ requestId: string }>();
  const { requests, loadRequests } = useRequestStore();
  const request = requests.find((item) => item.id === params.requestId);
  useEffect(() => { if (!request) void loadRequests(); }, [loadRequests, request]);

  if (!request) return <PageShell><p className="text-sm text-(--color-text-muted)">Loading request...</p></PageShell>;

  return <PageShell><SuccessState title="Request fulfilled" description={`All ${request.donorsNeeded} required donors have been confirmed for ${request.id}. The request is now closed.`}><div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 text-left"><div className="flex items-center gap-3"><CheckCircle2 className="size-6 text-(--color-success)" /><div><p className="font-bold">{request.bloodType} blood · {request.hospital.name}</p><p className="mt-1 text-xs text-(--color-text-muted)">{request.confirmedDonors}/{request.donorsNeeded} donors confirmed</p></div></div><div className="mt-4 rounded-(--radius-lg) bg-(--color-success-soft) p-3 text-xs leading-relaxed text-(--color-success)">Thank you to everyone who responded to this request.</div></div><div className="mt-4 flex flex-col gap-3 sm:flex-row sm:justify-center"><Link href="/community/requests"><Button>View my requests</Button></Link><Link href="/community/dashboard"><Button variant="outline">Back to dashboard</Button></Link></div></SuccessState></PageShell>;
}

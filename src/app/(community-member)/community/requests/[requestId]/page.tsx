'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Droplets, MapPin } from 'lucide-react';
import { PageShell, Button, UrgencyBadge } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';

export default function RequestDetailsPage() {
  const params = useParams<{ requestId: string }>();
  const requestId = params.requestId;
  const { requests, loadRequests, isLoading } = useRequestStore();
  const request = useMemo(() => requests.find((item) => item.id === requestId), [requests, requestId]);

  useEffect(() => { void loadRequests(); }, [loadRequests]);

  if (isLoading && !request) return <PageShell><p className="text-sm text-(--color-text-muted)">Loading request...</p></PageShell>;
  if (!request) return <PageShell><Link href="/community/requests" className="inline-flex items-center gap-2 text-sm font-semibold text-(--color-brand-primary)"><ArrowLeft className="size-4" />Back to my requests</Link><div className="mt-8 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-8 text-center"><h1 className="text-xl font-bold">Request not found</h1><p className="mt-2 text-sm text-(--color-text-secondary)">This request may no longer be available.</p></div></PageShell>;

  const progress = Math.min(request.confirmedDonors / request.donorsNeeded, 1);
  const canConfirm = request.status === 'Open' && request.confirmedDonors < request.donorsNeeded;

  return <PageShell><Link href="/community/requests" className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-(--color-text-secondary) hover:text-(--color-brand-primary)"><ArrowLeft className="size-4" />My requests</Link><div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 shadow-(--shadow-sm) md:p-6"><div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div className="flex items-start gap-4"><div className="flex size-14 shrink-0 items-center justify-center rounded-(--radius-lg) bg-(--color-blood-soft)"><Droplets className="size-6 text-(--color-blood)" /></div><div><p className="font-mono text-xs text-(--color-text-muted)">{request.id}</p><h1 className="mt-1 text-xl font-extrabold">{request.bloodType} blood needed</h1><p className="mt-1 flex items-center gap-1 text-sm text-(--color-text-secondary)"><MapPin className="size-3.5" />{request.hospital.name}</p></div></div><UrgencyBadge urgency={request.urgency} /></div><div className="mt-6 grid gap-3 sm:grid-cols-3"><Info label="Status" value={request.status} /><Info label="Donors needed" value={String(request.donorsNeeded)} /><Info label="Confirmed" value={`${request.confirmedDonors}/${request.donorsNeeded}`} /></div><div className="mt-6"><div className="mb-2 flex justify-between text-xs text-(--color-text-muted)"><span>Donor progress</span><span>{Math.round(progress * 100)}%</span></div><div className="h-2 overflow-hidden rounded-full bg-(--color-border-subtle)"><div className="h-full rounded-full bg-(--color-brand-primary) transition-all" style={{ width: `${progress * 100}%` }} /></div></div><div className="mt-6 divide-y divide-(--color-border-subtle) rounded-(--radius-lg) border border-(--color-border-subtle)"><InfoRow label="Hospital" value={request.hospital.name} /><InfoRow label="Location" value={`${request.hospital.lga}, ${request.hospital.state}`} /><InfoRow label="Urgency" value={request.urgency} />{request.notes ? <InfoRow label="Notes" value={request.notes} /> : null}</div>{canConfirm ? <div className="mt-6 flex flex-col gap-3 rounded-(--radius-lg) border border-(--color-info-soft) bg-(--color-info-soft) p-4 sm:flex-row sm:items-center sm:justify-between"><div><p className="text-sm font-bold text-(--color-info)">Donor confirmation</p><p className="mt-1 text-xs leading-relaxed text-(--color-info)">When a donor arrives, enter the private verification code they present.</p></div><Link href={`/community/requests/${request.id}/confirm`}><Button variant="primary">Enter verification code</Button></Link></div> : null}{request.status === 'Fulfilled' ? <div className="mt-6"><Link href={`/community/requests/${request.id}/fulfilled`}><Button variant="primary">View fulfilled request</Button></Link></div> : null}{request.status === 'Expired' ? <div className="mt-6"><Link href={`/community/requests/${request.id}/expired`}><Button variant="outline">View expired request</Button></Link></div> : null}</div></PageShell>;
}

function Info({ label, value }: { label: string; value: string }) { return <div className="rounded-(--radius-lg) bg-(--color-surface-subtle) p-4"><p className="text-xs text-(--color-text-muted)">{label}</p><p className="mt-1 text-sm font-bold">{value}</p></div>; }
function InfoRow({ label, value }: { label: string; value: string }) { return <div className="flex items-start justify-between gap-4 px-4 py-3"><span className="text-sm text-(--color-text-muted)">{label}</span><span className="max-w-[65%] text-right text-sm font-semibold">{value}</span></div>; }

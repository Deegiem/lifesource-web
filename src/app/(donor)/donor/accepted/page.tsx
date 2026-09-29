'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, PageShell } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';


export default function DonorAcceptedPage() { const { myAcceptances, loadMyAcceptances } = useRequestStore(); useEffect(() => { void loadMyAcceptances(); }, [loadMyAcceptances]); return <PageShell><PageHeader title="My Accepted Requests" description="Track accepted donations and their confirmation status." /><div className="space-y-3">{myAcceptances.length === 0 ? <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-10 text-center text-sm text-(--color-text-muted)">No accepted requests yet.</div> : myAcceptances.map((item) => <Link key={item.id} href={`/donor/requests/${item.requestId}`} className="block rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5"><div className="flex items-center justify-between gap-3"><div><p className="font-semibold">{item.requestId}</p><p className="mt-1 text-xs text-(--color-text-muted)">Verification code: {item.verificationCode}</p></div><span className="rounded-full bg-(--color-warning-soft) px-2.5 py-1 text-[10px] font-bold text-(--color-warning)">{item.status}</span></div></Link>)}</div></PageShell>; }

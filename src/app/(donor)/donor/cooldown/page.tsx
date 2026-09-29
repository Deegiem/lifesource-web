'use client';
import { useEffect } from 'react';
import Link from 'next/link';
import { PageHeader, PageShell } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';

export default function DonorCooldownPage() { const { donor, loadRequesterContext } = useRequestStore(); useEffect(() => { void loadRequesterContext(); }, [loadRequesterContext]); const inCooldown = !!donor?.cooldownUntil && new Date(donor.cooldownUntil).getTime() > Date.now(); return <PageShell><PageHeader title="Cooldown Status" description="Eligibility is derived by the platform from confirmed donation history and the configured cooldown period." /><div className={`rounded-(--radius-xl) border p-5 ${inCooldown ? 'border-(--color-warning-soft) bg-(--color-warning-soft)' : 'border-(--color-success-soft) bg-(--color-success-soft)'}`}><p className="text-lg font-extrabold">{inCooldown ? 'Currently in cooldown' : 'Eligible to donate'}</p><p className="mt-1 text-sm">{inCooldown ? `Eligible again after ${new Date(donor!.cooldownUntil!).toLocaleDateString()}.` : 'You may accept open blood requests.'}</p></div><Link href="/donor/requests" className="mt-5 inline-flex min-h-(--control-height-md) items-center rounded-(--radius-lg) border border-(--color-border-default) bg-white px-4 text-sm font-semibold">Browse open requests</Link></PageShell>; }

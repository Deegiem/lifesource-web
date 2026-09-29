'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { AlertTriangle, Clock3, ShieldOff } from 'lucide-react';
import { PageShell, Button } from '@/components/community-member/ui';

const STATES = {
  cooldown: {
    icon: Clock3,
    title: 'Request cooldown active',
    description:
      'You cannot create a new blood request while a requester cooldown is active.',
    action: '/community/cooldown',
    label: 'View cooldown status',
  },
  inactive: {
    icon: ShieldOff,
    title: 'Membership not active',
    description: 'Only active community members can create blood requests.',
    action: '/community/membership',
    label: 'Check membership status',
  },
  system: {
    icon: AlertTriangle,
    title: 'Access restricted',
    description:
      'Your account currently has a restriction that prevents creating new blood requests. Contact your Community Admin for more information.',
    action: '/community/dashboard',
    label: 'Back to dashboard',
  },
} as const;

function RequesterRestrictedContent() {
  const params = useSearchParams();
  const reason = (params.get('reason') ?? 'cooldown') as keyof typeof STATES;
  const state = STATES[reason] ?? STATES.cooldown;
  const Icon = state.icon;

  return (
    <PageShell>
      <div className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center text-center">
        <div className="flex size-20 items-center justify-center rounded-full bg-(--color-surface-subtle) text-(--color-text-secondary)">
          <Icon className="size-9" />
        </div>
        <h1 className="mt-6 text-2xl font-extrabold">{state.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
          {state.description}
        </p>
        <div className="mt-6 flex flex-col gap-3 sm:flex-row">
          <Link href={state.action}>
            <Button>{state.label}</Button>
          </Link>
          <Link href="/community/dashboard">
            <Button variant="outline">Back to dashboard</Button>
          </Link>
        </div>
      </div>
    </PageShell>
  );
}

function RequesterRestrictedFallback() {
  return (
    <PageShell>
      <div className="mx-auto flex min-h-[65vh] max-w-md flex-col items-center justify-center text-center">
        <div className="size-20 animate-pulse rounded-full bg-(--color-surface-subtle)" />
        <div className="mt-6 h-8 w-56 animate-pulse rounded bg-(--color-surface-subtle)" />
        <div className="mt-3 h-4 w-72 animate-pulse rounded bg-(--color-surface-subtle)" />
      </div>
    </PageShell>
  );
}

export default function RequesterRestrictedPage() {
  return (
    <Suspense fallback={<RequesterRestrictedFallback />}>
      <RequesterRestrictedContent />
    </Suspense>
  );
}
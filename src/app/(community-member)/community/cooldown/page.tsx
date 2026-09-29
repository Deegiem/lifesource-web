'use client';

import { useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Clock3 } from 'lucide-react';
import { PageShell, Button } from '@/components/community-member/ui';
import { useRequestStore } from '@/stores/request.store';

export default function RequesterCooldownPage() {
  const { requester, loadRequesterContext } = useRequestStore();
  useEffect(() => { void loadRequesterContext(); }, [loadRequesterContext]);
  const remaining = useMemo(() => {
    if (!requester?.cooldownUntil) return null;
    const ms = new Date(requester.cooldownUntil).getTime() - Date.now();
    return ms > 0 ? Math.ceil(ms / 86400000) : 0;
  }, [requester?.cooldownUntil]);

  const active = Boolean(remaining && remaining > 0);

  return <PageShell><div className="mx-auto max-w-md"><Link href="/community/dashboard" className="text-sm font-semibold text-(--color-brand-primary)">← Back to dashboard</Link><div className="mt-10 text-center"><div className="mx-auto flex size-16 items-center justify-center rounded-full bg-(--color-warning-soft) text-(--color-warning)"><Clock3 className="size-8" /></div><h1 className="mt-5 text-2xl font-extrabold">{active ? 'Requester cooldown active' : 'You can create a request'}</h1><p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">{active ? 'A cooldown is currently preventing you from creating another blood request.' : 'Your requester cooldown has ended.'}</p></div>{active ? <div className="mt-6 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5"><div className="flex justify-between text-sm"><span className="text-(--color-text-muted)">Approximate days remaining</span><strong>{remaining}</strong></div><div className="mt-4 rounded-(--radius-lg) bg-(--color-info-soft) p-4 text-xs leading-relaxed text-(--color-info)">Early reactivation is not self-service. For a genuine repeat emergency, contact your Community Admin; the request requires Community Admin vouching and Super Admin approval.</div></div> : null}<div className="mt-6 flex justify-center"><Link href="/community/dashboard"><Button>{active ? 'Back to dashboard' : 'Create a blood request'}</Button></Link></div></div></PageShell>;
}

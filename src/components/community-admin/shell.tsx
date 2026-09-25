"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { COMMUNITY, COMMUNITIES } from './ui';
import { Bell } from 'lucide-react';

import { Sidebar } from './sidebar';
export function Shell({
  children,
  title,
  topRight,
  community = COMMUNITY
}: {
  children: React.ReactNode;
  title: string;
  topRight?: React.ReactNode;
  community?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [activeCommunity, setActiveCommunity] = useState(community);

  return (
    <div className="flex h-screen w-full bg-ca-bg text-ca-text overflow-hidden" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      <Sidebar activeCommunity={activeCommunity} pathname={pathname} />

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Topbar */}
        <header className="h-12 bg-ca-side border-b border-ca-border flex items-center px-5 gap-3 shrink-0">
          <span className="font-bold text-[13.5px] text-ca-text flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{title}</span>
          {/* Community selector */}
          <select
            value={activeCommunity}
            onChange={(e) => setActiveCommunity(e.target.value)}
            className="bg-ca-card border border-ca-border rounded-md px-2.5 py-1 text-ca-muted text-[11.5px] outline-none shrink-0"
          >
            {COMMUNITIES.map((c) => <option key={c}>{c}</option>)}
          </select>

          {topRight && <div className="flex gap-2 items-center shrink-0">{topRight}</div>}

          <button
            onClick={() => router.push('/community-admin/notifications')}
            className="bg-transparent border-none cursor-pointer text-ca-muted p-1 relative shrink-0"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-ca-accent border-[1.5px] border-ca-side" />
          </button>
        </header>
        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 text-[13px]">
          {children}
        </main>
      </div>
    </div>
  );
}

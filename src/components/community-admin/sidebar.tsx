import React from 'react';
import Link from 'next/link';

export const NAV_GROUPS = [
  {
    label: 'Overview',
    items: [{ id: '/community-admin/dashboard', label: 'Dashboard' }],
  },
  {
    label: 'Community',
    items: [
      { id: '/community-admin/members',      label: 'Members' },
      { id: '/community-admin/join-requests', label: 'Join Requests', badge: 4 },
    ],
  },
  {
    label: 'Requests',
    items: [
      { id: '/community-admin/requests',    label: 'Community Requests' },
      { id: '/community-admin/escalations', label: 'Escalations', badge: 1 },
    ],
  },
  {
    label: 'Administration',
    items: [
      { id: '/community-admin/audit-log',     label: 'Audit Log' },
      { id: '/community-admin/notifications', label: 'Notifications', badge: 3 },
    ],
  },
];

export function Sidebar({ activeCommunity, pathname }: { activeCommunity: string, pathname: string }) {
  return (
    <aside className="w-[172px] bg-ca-side border-r border-ca-border shrink-0 flex flex-col h-full overflow-hidden">
      {/* Brand */}
      <div className="p-4 pb-3 border-b border-ca-border shrink-0">
        <div className="font-extrabold text-[15px] text-ca-red">LifeLink</div>
        <div className="text-[9.5px] text-ca-accent mt-0.5 font-bold uppercase tracking-widest">Community Admin</div>
      </div>
      {/* Community tag */}
      <div className="px-3.5 py-[9px] border-b border-ca-border shrink-0">
        <div className="text-[10px] text-ca-muted font-semibold mb-1 uppercase tracking-wider">Managing</div>
        <div className="text-[11.5px] font-bold text-ca-text leading-snug">{activeCommunity}</div>
      </div>
      {/* Nav groups */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-2">
        {NAV_GROUPS.map((group) => (
          <div key={group.label} className="mb-1.5">
            <div className="text-[9.5px] font-bold text-ca-dim uppercase tracking-widest px-2.5 pt-1.5 pb-1">{group.label}</div>
            {group.items.map((n) => {
              // If we are at /community-admin/members/invite, we want /community-admin/members to still be active
              const on = pathname === n.id || pathname.startsWith(n.id + '/');
              return (
                <Link key={n.id} href={n.id} className="block">
                  <div 
                    className={`flex items-center justify-between w-full px-2.5 py-2 rounded-md mb-[1px] cursor-pointer text-left text-[12.5px] font-inherit ${on ? 'bg-ca-active text-ca-text font-semibold' : 'bg-transparent text-ca-muted font-medium'}`}
                  >
                    {n.label}
                    {'badge' in n && n.badge && (
                      <span className={`text-[9px] font-bold px-[5px] py-[1px] rounded-full ${on ? 'bg-ca-accent text-white' : 'bg-ca-dim text-ca-muted'}`}>{n.badge}</span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        ))}
      </nav>
      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-ca-border shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-ca-active flex items-center justify-center text-[9.5px] font-extrabold text-ca-accent shrink-0">CA</div>
          <div className="min-w-0">
            <div className="text-[11.5px] font-semibold text-ca-text truncate">Emeka Adeyemi</div>
            <div className="text-[10px] text-ca-muted truncate">Community Admin</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

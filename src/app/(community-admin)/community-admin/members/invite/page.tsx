"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shell } from '@/components/community-admin/shell';
import { Card, SectionLabel, Btn, COMMUNITY } from '@/components/community-admin/ui';

export default function InviteMemberPage() {
  const router = useRouter();
  const [method, setMethod] = useState<'link' | 'phone' | 'manual'>('link');
  const [state, setState] = useState<'idle' | 'sent' | 'exists' | 'error'>('idle');
  const [copied, setCopied] = useState(false);
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');

  const handleInvite = () => {
    if (phone.includes('0000000')) {
      setState('error');
    } else if (phone.includes('0010001')) {
      setState('exists');
    } else {
      setState('sent');
    }
  };

  const inviteLink = "meme";

  const copyLink = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <Shell
      title="Invite Member"
      topRight={<Btn size="sm" variant="outline" onClick={() => router.push('/community-admin/members')}>Cancel</Btn>}
    >
      <div className="max-w-[520px]">
        {/* Method selector */}
        <div className="flex gap-0 bg-ca-card border border-ca-border rounded-lg p-1 mb-[18px] w-fit">
          {(['link', 'phone', 'manual'] as const).map((m) => (
            <button
              key={m}
              onClick={() => { setMethod(m); setState('idle'); }}
              className={`px-4 py-[7px] rounded-md border-none cursor-pointer text-[12.5px] transition-colors focus:outline-none ${method === m ? 'font-bold bg-ca-accent text-white' : 'font-medium bg-transparent text-ca-muted'}`}
            >
              {m === 'link' ? 'Invite Link' : m === 'phone' ? 'Phone Number' : 'Manual Add'}
            </button>
          ))}
        </div>

        {/* Success banner */}
        {state === 'sent' && (
          <div className="bg-ca-green-bg border border-green-400/30 rounded-lg py-3 px-4 mb-4 flex gap-2.5 items-center">
            <span className="text-green-400 text-[16px]">✓</span>
            <div>
              <div className="font-bold text-green-400 text-[13px] leading-tight">
                {method === 'manual' ? 'Member added' : 'Invitation sent'}
              </div>
              <div className="text-[11.5px] text-ca-muted mt-0.5">
                {method === 'manual' 
                  ? `${name || phone || 'The user'} has been added to ${COMMUNITY}.`
                  : `The invite has been sent to ${name || phone || 'the provided number'}.`}
              </div>
            </div>
          </div>
        )}
        {state === 'exists' && (
          <div className="bg-ca-amber-bg border border-amber-400/30 rounded-lg py-2.5 px-3.5 mb-4">
            <div className="font-bold text-amber-400 mb-0.5 leading-tight">Already a member</div>
            <div className="text-[12px] text-ca-muted">This contact is already part of {COMMUNITY}.</div>
          </div>
        )}
        {state === 'error' && (
          <div className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-4">
            <div className="font-bold text-red-400 mb-0.5 leading-tight">Invitation failed</div>
            <div className="text-[12px] text-ca-muted">Check the details and try again.</div>
          </div>
        )}

        <Card className="p-[22px]">
          {method === 'link' && (
            <div>
              <SectionLabel>Community Invite Link</SectionLabel>
              <p className="text-[12.5px] text-ca-muted mb-3.5 leading-relaxed">
                Share this link. Anyone who opens it can request to join {COMMUNITY}.
              </p>
              <div className="flex gap-2 items-center bg-ca-side border border-ca-border rounded-md px-3 py-[9px] mb-3.5">
                <code className="text-[11.5px] text-ca-accent flex-1 overflow-hidden text-ellipsis whitespace-nowrap">{inviteLink}</code>
              </div>
              <div className="flex gap-2">
                <Btn variant="primary" onClick={copyLink}>{copied ? 'Copied!' : 'Copy Link'}</Btn>
                <Btn variant="outline" onClick={() => router.push('/community-admin/members')}>Done</Btn>
              </div>
            </div>
          )}

          {method === 'phone' && (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">Phone Number</label>
                <input
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">Member Name (optional)</label>
                <input
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <Btn variant="primary" onClick={handleInvite}>Send Invitation</Btn>
                <Btn variant="outline" onClick={() => router.push('/community-admin/members')}>Cancel</Btn>
              </div>
            </div>
          )}

          {method === 'manual' && (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">Full Name</label>
                <input
                  placeholder="Member full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">Phone Number</label>
                <input
                  placeholder="+234 800 000 0000"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <Btn variant="primary" onClick={handleInvite}>Add Member</Btn>
                <Btn variant="outline" onClick={() => router.push('/community-admin/members')}>Cancel</Btn>
              </div>
            </div>
          )}
        </Card>
      </div>
    </Shell>
  );
}

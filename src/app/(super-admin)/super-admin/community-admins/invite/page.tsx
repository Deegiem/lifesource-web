"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { ArrowLeft, Send } from "lucide-react";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminFilter } from "@/components/super-admin/ui/admin-filter";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminCommunitiesStore } from "@/stores/super-admin-communities.store";
import { useSuperAdminInvitationsStore } from "@/stores/super-admin-invitations.store";

export default function InviteCommunityAdminPage() {
  const { communities, loadCommunities } = useSuperAdminCommunitiesStore();
  const { sendInvitation, isSubmitting, error } = useSuperAdminInvitationsStore();
  const [communityId, setCommunityId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { void loadCommunities(); }, [loadCommunities]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitted(false);
    if (!communityId || !name.trim() || !email.trim()) return;
    try {
      await sendInvitation({ communityId, name: name.trim(), email: email.trim() });
      setSubmitted(true);
      setName("");
      setEmail("");
    } catch {
      setSubmitted(false);
    }
  }

  return (
          <div className="mx-auto max-w-(--container-md) space-y-6">
        <Link href="/super-admin/communities" className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)">
          <ArrowLeft className="size-4" />Back to communities
        </Link>

        <AdminPageHeader
          title="Invite Community Admin"
          description="Send an invitation to assign an administrator to a community."
        />

        <AdminCard className="p-6">
          {submitted && <p className="mb-5 rounded-(--radius-md) bg-(--color-admin-success-soft) p-3 text-sm text-[#4ade80]">Invitation sent successfully.</p>}
          {error && <div className="mb-5"><AdminErrorState message={error} /></div>}

          <form onSubmit={handleSubmit} className="space-y-5">
            <label className="block space-y-2">
              <span className="text-sm font-semibold">Community</span>
              <AdminFilter value={communityId} onChange={(event) => setCommunityId(event.target.value)} required className="w-full">
                <option value="">Select a community</option>
                {communities.map((community) => <option key={community.id} value={community.id}>{community.name}</option>)}
              </AdminFilter>
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Full name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} required placeholder="Enter full name" className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none placeholder:text-(--color-admin-muted) focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)" />
            </label>

            <label className="block space-y-2">
              <span className="text-sm font-semibold">Email address</span>
              <input type="email" value={email} onChange={(event) => setEmail(event.target.value)} required placeholder="name@example.com" className="h-(--control-height-lg) w-full rounded-(--radius-lg) border border-(--color-admin-border) bg-(--color-admin-card) px-4 text-sm text-(--color-admin-text) outline-none placeholder:text-(--color-admin-muted) focus:border-(--color-admin-accent) focus:ring-2 focus:ring-(--color-admin-accent-soft)" />
            </label>

            <button type="submit" disabled={isSubmitting} className="inline-flex h-(--control-height-lg) w-full items-center justify-center gap-2 rounded-(--radius-lg) bg-(--color-admin-accent) px-4 text-sm font-semibold text-(--color-text-inverse) disabled:opacity-60">
              <Send className="size-4" />{isSubmitting ? "Sending..." : "Send Invitation"}
            </button>
          </form>
        </AdminCard>
      </div>
  );
}

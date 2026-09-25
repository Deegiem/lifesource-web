"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminBreadcrumbs } from "@/components/super-admin/ui/admin-breadcrumbs";
import { AdminButton } from "@/components/super-admin/ui/admin-button";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminInfoRow } from "@/components/super-admin/ui/admin-info-row";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminOverridesStore } from "@/stores/super-admin-overrides.store";

export default function OverrideReviewPage() {
  const params = useParams<{ overrideId: string }>();
  const { selectedRequest, isDetailLoading, isDeciding, error, loadRequest, decide } = useSuperAdminOverridesStore();
  useEffect(() => { void loadRequest(params.overrideId); }, [loadRequest, params.overrideId]);

  return (
    // Override Review   
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Overrides", href: "/super-admin/overrides" }, { label: params.overrideId }]} />
      {isDetailLoading ? <AdminCard><AdminLoadingState /></AdminCard> : !selectedRequest ? <AdminCard><AdminErrorState message={error ?? "Override request not found."} onRetry={() => void loadRequest(params.overrideId)} /></AdminCard> : <>
        <Link href="/super-admin/overrides" className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"><ArrowLeft className="size-4" />Back to override requests</Link>
        <AdminPageHeader title="Override Review" description={selectedRequest.id} action={<AdminBadge status={selectedRequest.status} />} />
        <AdminCard className="p-6">
          <p className="text-sm leading-relaxed text-(--color-admin-muted)">{selectedRequest.description}</p>
          <div className="mt-5"><AdminInfoRow label="Type" value={selectedRequest.type.replaceAll("_", " ")} /><AdminInfoRow label="Requester" value={selectedRequest.requester} /><AdminInfoRow label="Community" value={selectedRequest.community} /><AdminInfoRow label="Submitted by" value={selectedRequest.submittedByRole} /><AdminInfoRow label="Submitted" value={selectedRequest.submittedLabel} /></div>
          {selectedRequest.status === "pending" && <div className="mt-6 flex flex-wrap gap-3"><AdminButton variant="primary" disabled={isDeciding} onClick={() => void decide(selectedRequest.id, "approved")}>Approve</AdminButton><AdminButton variant="danger" disabled={isDeciding} onClick={() => void decide(selectedRequest.id, "rejected")}>Reject</AdminButton></div>}
        </AdminCard>
        <AdminCard className="p-6"><h2 className="text-lg font-bold">Audit trail</h2><div className="mt-5 space-y-4">{selectedRequest.auditTrail.map((event) => <div key={event.id} className="border-l-2 border-(--color-admin-border) pl-4"><p className="text-sm font-semibold">{event.action}</p><p className="mt-1 text-xs text-(--color-admin-muted)">{event.actor} · {event.timestampLabel}</p></div>)}</div></AdminCard>
      </>}
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import {
  BackLink,
  Button,
  PageHeader,
  PageShell,
} from "@/components/community-member/ui";
import { useRequestStore } from "@/stores/request.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { BloodRequest } from "@/stores/request.store";

export default function AcceptRequestPage() {
  const { requestId } = useParams<{ requestId: string }>();
  const router = useRouter();

  const [request, setRequest] = useState<BloodRequest | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState("");

  const { acceptRequest, donor, error, clearError } = useRequestStore();

  useEffect(() => {
    let cancelled = false;
    setLoadError("");

    apiService
      .getMyRequest(requestId)
      .then((detail) => {
        if (cancelled) return;
        setRequest({
          id: detail.id,
          referenceCode: detail.reference_code,
          bloodType: detail.blood_type_needed,
          donorsNeeded: detail.donors_needed,
          confirmedDonors: detail.confirmed_count,
          acceptedCount: detail.accepted_count,
          donorsLeft: detail.donors_left,
          urgency: detail.urgency,
          status:
            detail.status.toLowerCase() === "open"
              ? "Open"
              : detail.status.toLowerCase() === "fulfilled"
                ? "Fulfilled"
                : detail.status.toLowerCase() === "expired"
                  ? "Expired"
                  : detail.status.toLowerCase() === "cancelled"
                    ? "Cancelled"
                    : "Partially fulfilled",
          notes: detail.notes ?? "",
          expiresAt: detail.expires_at,
          createdAt: detail.created_at,
          closedAt: detail.closed_at,
          hospital: {
            id: detail.hospital?.id ?? "",
            name: detail.hospital?.name ?? "Unknown hospital",
            address: detail.hospital?.address ?? "",
            lga: detail.hospital?.lga_name ?? "",
            state: detail.hospital?.state_name ?? "",
            phone: detail.hospital?.phone ?? "",
          },
          requesterId: "",
          requesterName: "",
          communityName: "",
        });
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoadError(
            getApiErrorMessage(err, "Unable to load the request details."),
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  const accept = async () => {
    clearError();
    setLoading(true);
    try {
      const acceptance = await acceptRequest(requestId);
      router.push(
        `/donor/requests/${requestId}/accepted?code=${encodeURIComponent(acceptance.verification_code)}`,
      );
    } catch {
      /* error already set by store */
    } finally {
      setLoading(false);
    }
  };

  if (loadError) {
    return (
      <PageShell>
        <BackLink href={`/donor/requests/${requestId}`} />
        <div className="rounded-(--radius-xl) border border-(--color-danger-soft) bg-(--color-danger-soft) p-6 text-center text-sm text-(--color-danger)">
          {loadError}
        </div>
      </PageShell>
    );
  }

  if (!request) {
    return (
      <PageShell>
        <BackLink href={`/donor/requests/${requestId}`} />
        <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-white p-8 text-center text-sm text-(--color-text-muted)">
          Loading request…
        </div>
      </PageShell>
    );
  }

  const inCooldown = donor ? !donor.isEligible : false;

  return (
    <PageShell>
      <BackLink href={`/donor/requests/${requestId}`} />
      <PageHeader
        title="Confirm acceptance"
        description="Review the request before committing to donate."
      />

      <div className="mx-auto max-w-xl space-y-5 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5 md:p-6">
        <div className="rounded-(--radius-xl) bg-(--color-surface-subtle) p-4">
          <p className="text-lg font-extrabold">{request.bloodType} blood</p>
          <p className="mt-1 text-sm font-semibold">{request.hospital.name}</p>
          <p className="mt-1 text-xs text-(--color-text-muted)">
            {request.referenceCode} · {request.confirmedDonors}/
            {request.donorsNeeded} confirmed
          </p>
        </div>

        <div className="rounded-(--radius-lg) bg-(--color-info-soft) p-4 text-sm leading-relaxed text-(--color-info)">
          Accepting this request generates a private verification code. Bring
          it to the hospital when you donate. The requester will confirm your
          donation using this code.
        </div>

        {error ? (
          <div className="rounded-(--radius-lg) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)">
            {error}
          </div>
        ) : null}

        <Button
          onClick={accept}
          disabled={loading || inCooldown}
        >
          {inCooldown
            ? "Unavailable during cooldown"
            : loading
              ? "Accepting…"
              : "Confirm acceptance"}
        </Button>
      </div>
    </PageShell>
  );
}
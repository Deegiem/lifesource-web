"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAdminPageHeader } from "@/components/admin/layout/admin-shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { SectionLabel } from "@/components/community-admin/ui/ca-section-label";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Modal } from "@/components/community-admin/ui/ca-modal";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  CommunityMeResponse,
  JoinLinkResponse,
} from "@/features/api/types";

export default function InviteMemberPage() {
  const router = useRouter();
  const [method, setMethod] = useState<"link" | "email">("link");
  const [state, setState] = useState<"idle" | "sent" | "error">("idle");
  const [copied, setCopied] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [joinLink, setJoinLink] = useState<JoinLinkResponse | null>(null);
  const [community, setCommunity] = useState<CommunityMeResponse | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [revokeModal, setRevokeModal] = useState(false);
  const [revoking, setRevoking] = useState(false);

  useAdminPageHeader({
    title: "Invite Member",
    topRight: (
      <Btn
        size="sm"
        variant="outline"
        onClick={() => router.push("/community-admin/members")}
      >
        Cancel
      </Btn>
    ),
  });

  React.useEffect(() => {
    void apiService.getMyCommunity().then(setCommunity).catch(() => {});
    void apiService
      .getJoinLink()
      .then(setJoinLink)
      .catch(async () => {
        try {
          setJoinLink(await apiService.generateJoinLink());
        } catch (requestError) {
          setError(
            getApiErrorMessage(
              requestError,
              "Unable to load or create the community join link.",
            ),
          );
        }
      });
  }, []);

  const handleInvite = async () => {
    if (!name.trim() || !email.trim() || busy) return;
    setBusy(true);
    setState("idle");
    setError("");
    try {
      await apiService.inviteMember({
        full_name: name.trim(),
        email: email.trim(),
      });
      setState("sent");
    } catch (requestError) {
      setState("error");
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to send the member invitation.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleCopy = () => {
    if (!joinLink?.url) return;
    void navigator.clipboard
      .writeText(joinLink.url)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      })
      .catch(() =>
        setError("Unable to copy the link. Copy it manually instead."),
      );
  };

  const handleGenerate = async () => {
    setBusy(true);
    setError("");
    try {
      const link = await apiService.generateJoinLink();
      setJoinLink(link);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to generate a new join link.",
        ),
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRevoke = async () => {
    setRevoking(true);
    setError("");
    try {
      await apiService.revokeJoinLink();
      setJoinLink(null);
      setRevokeModal(false);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to revoke the join link.",
        ),
      );
    } finally {
      setRevoking(false);
    }
  };

  return (
    <>
      <div className="max-w-[520px]">
        {/* Method selector */}
        <div className="flex gap-0 bg-ca-card border border-ca-border rounded-lg p-1 mb-[18px] w-fit">
          {(["link", "email"] as const).map((m) => (
            <button
              key={m}
              onClick={() => {
                setMethod(m);
                setState("idle");
              }}
              className={`px-4 py-[7px] rounded-md border-none cursor-pointer text-[12.5px] transition-colors focus:outline-none ${
                method === m
                  ? "font-bold bg-ca-accent text-white"
                  : "font-medium bg-transparent text-ca-muted"
              }`}
            >
              {m === "link" ? "Join Link" : "Email Invite"}
            </button>
          ))}
        </div>

        {/* Success banner for email invites */}
        {state === "sent" && (
          <div className="bg-ca-green-bg border border-green-400/30 rounded-lg py-3 px-4 mb-4 flex gap-2.5 items-center">
            <span className="text-green-400 text-[16px]">✓</span>
            <div>
              <div className="font-bold text-green-400 text-[13px] leading-tight">
                Invitation sent
              </div>
              <div className="text-[11.5px] text-ca-muted mt-0.5">
                The invite has been sent to {email}.
              </div>
            </div>
          </div>
        )}

        {state === "error" && (
          <div
            role="alert"
            className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-4"
          >
            <div className="font-bold text-red-400 mb-0.5 leading-tight">
              Invitation failed
            </div>
            <div className="text-[12px] text-ca-muted">{error}</div>
          </div>
        )}

        {error && state !== "error" ? (
          <div
            role="alert"
            className="bg-ca-red-bg border border-red-400/30 rounded-lg py-2.5 px-3.5 mb-4 text-[12px] text-ca-muted"
          >
            {error}
          </div>
        ) : null}

        <Card className="p-[22px]">
          {method === "link" && (
            <div>
              <SectionLabel>Community Invite Link</SectionLabel>
              <p className="text-[12.5px] text-ca-muted mb-3.5 leading-relaxed">
                Share this link. Anyone who opens it can request to join{" "}
                {community?.name ?? "your community"}.
              </p>

              {joinLink?.url ? (
                <>
                  <div className="flex gap-2 items-center bg-ca-side border border-ca-border rounded-md px-3 py-[9px] mb-3.5">
                    <code className="text-[11.5px] text-ca-accent flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                      {joinLink.url}
                    </code>
                  </div>

                  {joinLink.is_active ? (
                    <div className="flex flex-wrap gap-2">
                      <Btn variant="primary" onClick={handleCopy}>
                        {copied ? "Copied!" : "Copy Link"}
                      </Btn>
                      <Btn
                        variant="outline"
                        onClick={() => router.push("/community-admin/members")}
                      >
                        Done
                      </Btn>
                      <Btn
                        variant="danger"
                        onClick={() => setRevokeModal(true)}
                        disabled={revoking}
                      >
                        Revoke Link
                      </Btn>
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      <Btn
                        variant="primary"
                        onClick={() => void handleGenerate()}
                        disabled={busy}
                      >
                        {busy ? "Generating…" : "Generate New Link"}
                      </Btn>
                      <Btn
                        variant="outline"
                        onClick={() => router.push("/community-admin/members")}
                      >
                        Done
                      </Btn>
                    </div>
                  )}

                  <p className="mt-3 text-[11px] text-ca-muted">
                    Status:{" "}
                    <span
                      className={
                        joinLink.is_active
                          ? "font-semibold text-green-400"
                          : "font-semibold text-red-400"
                      }
                    >
                      {joinLink.is_active ? "Active" : "Revoked"}
                    </span>
                    {joinLink.expires_at ? (
                      <>
                        {" "}
                        · Expires{" "}
                        {new Date(joinLink.expires_at).toLocaleDateString()}
                      </>
                    ) : (
                      <> · No expiry</>
                    )}
                  </p>
                </>
              ) : (
                <div className="flex flex-wrap gap-2">
                  <Btn
                    variant="primary"
                    onClick={() => void handleGenerate()}
                    disabled={busy}
                  >
                    {busy ? "Generating…" : "Generate Join Link"}
                  </Btn>
                  <Btn
                    variant="outline"
                    onClick={() => router.push("/community-admin/members")}
                  >
                    Cancel
                  </Btn>
                </div>
              )}
            </div>
          )}

          {method === "email" && (
            <div className="flex flex-col gap-3.5">
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">
                  Full name
                </label>
                <input
                  placeholder="Member full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div>
                <label className="block text-[11.5px] font-semibold text-ca-muted mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  placeholder="member@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-ca-side border border-ca-border rounded-md px-3 py-[9px] text-ca-text text-[13px] outline-none focus:border-ca-accent transition-colors"
                />
              </div>
              <div className="flex gap-2 mt-1">
                <Btn
                  variant="primary"
                  onClick={() => void handleInvite()}
                  disabled={
                    busy ||
                    name.trim().length < 2 ||
                    !email.includes("@")
                  }
                >
                  {busy ? "Sending…" : "Send Invitation"}
                </Btn>
                <Btn
                  variant="outline"
                  onClick={() => router.push("/community-admin/members")}
                >
                  Cancel
                </Btn>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Revoke confirmation modal */}
      {revokeModal && (
        <Modal onClose={() => setRevokeModal(false)}>
          <Card className="w-full max-w-[400px] p-6">
            <div className="font-bold text-[15px] text-ca-text mb-2">
              Revoke Join Link?
            </div>
            <p className="text-[12.5px] text-ca-muted leading-relaxed mb-4">
              Anyone with the current link will no longer be able to request
              to join{" "}
              <strong className="text-ca-text">
                {community?.name ?? "your community"}
              </strong>
              . You can generate a new link afterwards.
            </p>
            <div className="flex gap-2 justify-end">
              <Btn
                variant="outline"
                onClick={() => setRevokeModal(false)}
                disabled={revoking}
              >
                Cancel
              </Btn>
              <Btn
                variant="danger"
                onClick={() => void handleRevoke()}
                disabled={revoking}
              >
                {revoking ? "Revoking…" : "Revoke Link"}
              </Btn>
            </div>
          </Card>
        </Modal>
      )}
    </>
  );
}
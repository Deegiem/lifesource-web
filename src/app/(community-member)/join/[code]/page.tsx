"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import type { JoinLinkPublicPreview } from "@/features/api/types";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import { CommunityMemberShell } from "@/components/community-member/shell";

export default function JoinByLinkPage() {
  const { code } = useParams<{ code: string }>();
  const [preview, setPreview] = useState<JoinLinkPublicPreview | null>(null);
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    phone: "",
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    void apiService
      .previewJoinLink(code)
      .then(setPreview)
      .catch((requestError: unknown) => {
        setError(
          getApiErrorMessage(
            requestError,
            "This join link is unavailable.",
          ),
        );
      })
      .finally(() => setLoading(false));
  }, [code]);

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!preview?.is_open || submitting) return;
    setSubmitting(true);
    setError("");
    try {
      await apiService.applyJoinLink(code, form);
      setSubmitted(true);
    } catch (requestError) {
      setError(
        getApiErrorMessage(
          requestError,
          "Unable to submit your application.",
        ),
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ---------- Post-apply screen ----------
  if (submitted) {
    return (
      <CommunityMemberShell title="Application submitted">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="mx-auto flex size-20 items-center justify-center rounded-full bg-(--color-success-soft)">
            <span className="text-3xl text-(--color-success)">✓</span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold text-(--color-text-primary)">
              Application submitted
            </h1>
            <p className="mt-2 text-sm leading-relaxed text-(--color-text-secondary)">
              Your request to join{" "}
              <span className="font-semibold text-(--color-text-primary)">
                {preview?.community_name ?? "the community"}
              </span>{" "}
              is awaiting review by the Community Admin.
            </p>
          </div>

          <div className="rounded-(--radius-xl) border border-(--color-border-default) bg-(--color-surface-card) p-5 text-left">
            <p className="text-xs uppercase tracking-wide text-(--color-text-muted)">
              What happens next
            </p>
            <ol className="mt-3 space-y-2 text-sm text-(--color-text-secondary)">
              <li>
                <span className="font-semibold text-(--color-text-primary)">
                  1.
                </span>{" "}
                An admin reviews your application.
              </li>
              <li>
                <span className="font-semibold text-(--color-text-primary)">
                  2.
                </span>{" "}
                Once approved, log in with the email and password you just set.
              </li>
              <li>
                <span className="font-semibold text-(--color-text-primary)">
                  3.
                </span>{" "}
                You&apos;ll have access to your community dashboard.
              </li>
            </ol>
          </div>

          <Link
            href="/login"
            className="inline-flex min-h-(--control-height-lg) w-full items-center justify-center rounded-(--radius-lg) bg-(--color-brand-primary) px-5 text-sm font-semibold text-white"
          >
            Go to login
          </Link>

          <p className="text-xs text-(--color-text-muted)">
            You can return to this page any time with the same link.
          </p>
        </div>
      </CommunityMemberShell>
    );
  }

  // ---------- Apply form ----------
  return (
    <CommunityMemberShell title="Join a community">
      <section className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-(--color-brand-primary)">
            Community application
          </p>
          <h1 className="mt-2 text-2xl font-extrabold">
            {loading
              ? "Checking join link…"
              : preview?.community_name ?? "Join community"}
          </h1>
          {preview ? (
            <p className="mt-2 text-sm text-(--color-text-secondary)">
              {preview.community_type} · {preview.lga_name}, {preview.state_name}
            </p>
          ) : null}
        </div>

        {error ? (
          <div
            role="alert"
            className="rounded-xl bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)"
          >
            {error}
          </div>
        ) : null}

        {preview?.is_open ? (
          <form
            onSubmit={submit}
            className="space-y-4 rounded-(--radius-xl) border border-(--color-border-default) bg-white p-5"
          >
            <label className="block text-sm font-semibold">
              Full name
              <input
                required
                minLength={2}
                maxLength={200}
                value={form.full_name}
                onChange={(event) =>
                  setForm({ ...form, full_name: event.target.value })
                }
                className="mt-2 h-12 w-full rounded-lg border px-3 font-normal"
              />
            </label>
            <label className="block text-sm font-semibold">
              Email
              <input
                required
                type="email"
                value={form.email}
                onChange={(event) =>
                  setForm({ ...form, email: event.target.value })
                }
                className="mt-2 h-12 w-full rounded-lg border px-3 font-normal"
              />
            </label>
            <label className="block text-sm font-semibold">
              Phone
              <input
                required
                minLength={7}
                maxLength={32}
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm({ ...form, phone: event.target.value })
                }
                className="mt-2 h-12 w-full rounded-lg border px-3 font-normal"
              />
            </label>
            <label className="block text-sm font-semibold">
              Password
              <input
                required
                minLength={8}
                maxLength={128}
                type="password"
                value={form.password}
                onChange={(event) =>
                  setForm({ ...form, password: event.target.value })
                }
                className="mt-2 h-12 w-full rounded-lg border px-3 font-normal"
              />
            </label>
            <button
              disabled={submitting}
              className="h-12 w-full rounded-lg bg-(--color-brand-primary) font-semibold text-white disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Apply to join"}
            </button>
          </form>
        ) : null}

        {preview && !preview.is_open ? (
          <p className="rounded-xl border border-(--color-border-default) p-4 text-sm text-(--color-text-secondary)">
            This community is not currently accepting applications.
          </p>
        ) : null}
      </section>
    </CommunityMemberShell>
  );
}
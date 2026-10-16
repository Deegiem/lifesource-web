"use client";

import { useCallback, useEffect, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type { SessionResponse, UserResponse } from "@/features/api/types";

function formatDate(value: string | null) {
  if (!value) return "Not available";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? value : date.toLocaleString();
}

export default function AccountSecurityPage() {
  const router = useRouter();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [sessions, setSessions] = useState<SessionResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [deletingSessionId, setDeletingSessionId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [passwords, setPasswords] = useState({ current_password: "", new_password: "", confirm_password: "" });

  const loadAccountSecurity = useCallback(async () => {
    setError("");
    try {
      const [currentUser, activeSessions] = await Promise.all([
        apiService.currentSession(),
        apiService.listSessions(),
      ]);
      setUser(currentUser);
      setSessions(activeSessions);
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to load your account sessions."));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // Fetches the authenticated user and sessions when the security page opens.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void loadAccountSecurity();
  }, [loadAccountSecurity]);

  const changePassword = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (busy) return;
    if (passwords.new_password !== passwords.confirm_password) {
      setError("The new password and confirmation do not match.");
      return;
    }
    if (passwords.new_password.length < 12) {
      setError("Your new password must be at least 12 characters.");
      return;
    }
    setBusy(true);
    setError("");
    setNotice("");
    try {
      await apiService.changePassword({
        current_password: passwords.current_password,
        new_password: passwords.new_password,
      });
      setPasswords({ current_password: "", new_password: "", confirm_password: "" });
      setNotice("Password changed successfully.");
      await loadAccountSecurity();
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to change your password."));
    } finally {
      setBusy(false);
    }
  };

  const deleteSession = async (session: SessionResponse) => {
    if (!window.confirm(`End this session${session.device_name ? ` on ${session.device_name}` : ""}?`)) return;
    setDeletingSessionId(session.id);
    setError("");
    setNotice("");
    try {
      await apiService.deleteSession(session.id);
      setSessions((current) => current.filter((item) => item.id !== session.id));
      setNotice("Session ended.");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to end this session."));
    } finally {
      setDeletingSessionId(null);
    }
  };

  const logout = async (allDevices: boolean) => {
    const message = allDevices
      ? "Sign out of all devices? Other active sessions will be ended too."
      : "Sign out of this device?";
    if (!window.confirm(message) || busy) return;
    setBusy(true);
    setError("");
    try {
      if (allDevices) await apiService.logoutAll();
      else await apiService.logout();
      window.sessionStorage.removeItem("lifesource.auth.challenge");
      window.sessionStorage.removeItem("lifesource.auth.maskedEmail");
      router.replace("/login");
    } catch (requestError) {
      setError(getApiErrorMessage(requestError, "Unable to sign out."));
      setBusy(false);
    }
  };

  return (
    <main className="min-h-screen bg-(--color-surface-page) px-4 py-8 text-(--color-text-primary) sm:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        <button type="button" onClick={() => router.back()} className="text-sm font-semibold text-(--color-brand-primary) hover:underline">← Back</button>
        <header>
          <p className="text-xs font-bold uppercase tracking-widest text-(--color-brand-primary)">Account</p>
          <h1 className="mt-2 text-3xl font-extrabold">Security &amp; sessions</h1>
          <p className="mt-2 text-sm text-(--color-text-secondary)">Manage your password and the devices currently signed in to your account.</p>
        </header>

        {error ? <div role="alert" className="rounded-xl border border-(--color-danger) bg-(--color-danger-soft) p-4 text-sm text-(--color-danger)">{error}</div> : null}
        {notice ? <div role="status" className="rounded-xl border border-(--color-success) bg-(--color-success-soft) p-4 text-sm text-(--color-success)">{notice}</div> : null}

        <section className="rounded-2xl border border-(--color-border-default) bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold">Signed-in account</h2>
          {loading ? <p className="mt-4 text-sm text-(--color-text-secondary)">Loading account…</p> : user ? (
            <dl className="mt-4 grid gap-4 sm:grid-cols-2">
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Name</dt><dd className="mt-1 text-sm font-semibold">{user.first_name} {user.last_name}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Email</dt><dd className="mt-1 text-sm font-semibold">{user.email}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Account status</dt><dd className="mt-1 text-sm font-semibold capitalize">{user.status}</dd></div>
              <div><dt className="text-xs font-semibold uppercase tracking-wide text-(--color-text-muted)">Last login</dt><dd className="mt-1 text-sm font-semibold">{formatDate(user.last_login_at)}</dd></div>
            </dl>
          ) : !loading && !error ? <p className="mt-4 text-sm text-(--color-text-secondary)">Account details are unavailable.</p> : null}
        </section>

        <section className="rounded-2xl border border-(--color-border-default) bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold">Change password</h2>
          <p className="mt-1 text-sm text-(--color-text-secondary)">Choose a new password with at least 12 characters.</p>
          <form onSubmit={changePassword} className="mt-5 grid gap-4 sm:grid-cols-2">
            <label className="space-y-2 text-sm font-semibold sm:col-span-2">Current password
              <input type="password" autoComplete="current-password" minLength={8} maxLength={128} required value={passwords.current_password} onChange={(event) => setPasswords({ ...passwords, current_password: event.target.value })} className="h-12 w-full rounded-lg border border-(--color-border-default) px-3 font-normal outline-none focus:border-(--color-brand-primary)" />
            </label>
            <label className="space-y-2 text-sm font-semibold">New password
              <input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwords.new_password} onChange={(event) => setPasswords({ ...passwords, new_password: event.target.value })} className="h-12 w-full rounded-lg border border-(--color-border-default) px-3 font-normal outline-none focus:border-(--color-brand-primary)" />
            </label>
            <label className="space-y-2 text-sm font-semibold">Confirm new password
              <input type="password" autoComplete="new-password" minLength={12} maxLength={128} required value={passwords.confirm_password} onChange={(event) => setPasswords({ ...passwords, confirm_password: event.target.value })} className="h-12 w-full rounded-lg border border-(--color-border-default) px-3 font-normal outline-none focus:border-(--color-brand-primary)" />
            </label>
            <button type="submit" disabled={busy} className="h-11 w-fit rounded-lg bg-(--color-brand-primary) px-5 text-sm font-semibold text-white disabled:opacity-50">{busy ? "Saving…" : "Change password"}</button>
          </form>
        </section>

        <section className="rounded-2xl border border-(--color-border-default) bg-white p-5 shadow-sm sm:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div><h2 className="text-lg font-bold">Active sessions</h2><p className="mt-1 text-sm text-(--color-text-secondary)">Review devices signed in to your account and end sessions you do not recognize.</p></div>
            <button type="button" onClick={() => void loadAccountSecurity()} disabled={loading} className="rounded-lg border border-(--color-border-default) px-4 py-2 text-sm font-semibold disabled:opacity-50">Refresh</button>
          </div>
          {loading ? <p className="mt-5 text-sm text-(--color-text-secondary)">Loading sessions…</p> : sessions.length ? (
            <ul className="mt-5 divide-y divide-(--color-border-subtle)">
              {sessions.map((session) => <li key={session.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="truncate text-sm font-bold">{session.device_name || "Device name unavailable"}</p>
                  <p className="mt-1 text-xs text-(--color-text-secondary)">Auth level: {session.auth_level} · Last seen: {formatDate(session.last_seen_at)}</p>
                  <p className="mt-1 text-xs text-(--color-text-muted)">Created: {formatDate(session.created_at)} · Expires: {formatDate(session.expires_at)}</p>
                  {session.ip_address ? <p className="mt-1 text-xs text-(--color-text-muted)">IP: {session.ip_address}</p> : null}
                </div>
                <button type="button" onClick={() => void deleteSession(session)} disabled={deletingSessionId === session.id} className="h-9 shrink-0 rounded-lg border border-(--color-danger) px-3 text-xs font-semibold text-(--color-danger) disabled:opacity-50">{deletingSessionId === session.id ? "Ending…" : "End session"}</button>
              </li>)}
            </ul>
          ) : <p className="mt-5 text-sm text-(--color-text-secondary)">{error ? "Sessions could not be loaded." : "No active sessions were returned."}</p>}
        </section>

        <section className="rounded-2xl border border-(--color-danger)/30 bg-white p-5 shadow-sm sm:p-6">
          <h2 className="text-lg font-bold">Sign out</h2>
          <p className="mt-1 text-sm text-(--color-text-secondary)">Sign out here, or end all active sessions on every device.</p>
          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={() => void logout(false)} disabled={busy} className="h-10 rounded-lg border border-(--color-border-default) px-4 text-sm font-semibold disabled:opacity-50">Sign out this device</button>
            <button type="button" onClick={() => void logout(true)} disabled={busy} className="h-10 rounded-lg bg-(--color-danger) px-4 text-sm font-semibold text-white disabled:opacity-50">Sign out all devices</button>
          </div>
        </section>
      </div>
    </main>
  );
}

import type {
  JoinLinkResponse,
  MemberResponse,
} from "@/features/api/types";

// ---------------------------------------------------------------------------
// Member rows
// ---------------------------------------------------------------------------

export interface MemberRow {
  id: string;
  name: string;
  contact: string;
  status: "Active" | "Pending" | "Rejected" | "Suspended";
  joined: string;
  activity: string;
  rawStatus: string;
}

function normalizeMemberStatus(
  raw: string,
): MemberRow["status"] {
  const s = raw.toLowerCase();
  if (s === "active") return "Active";
  if (s === "pending") return "Pending";
  if (s === "rejected") return "Rejected";
  if (s === "suspended") return "Suspended";
  return "Pending";
}

export function toMemberRow(member: MemberResponse): MemberRow {
  return {
    id: member.id,
    name: member.full_name,
    contact: member.email,
    status: normalizeMemberStatus(member.status),
    joined: member.joined_at
      ? new Date(member.joined_at).toLocaleDateString()
      : "—",
    activity: "—",
    rawStatus: member.status,
  };
}

// ---------------------------------------------------------------------------
// Join request rows
// ---------------------------------------------------------------------------

export interface JoinRequestRow {
  id: string;
  name: string;
  contact: string;
  date: string;
  method: string;
  status: "Pending" | "Approved" | "Rejected";
}

export function toJoinRequestRow(member: MemberResponse): JoinRequestRow {
  const s = member.status.toLowerCase();
  return {
    id: member.id,
    name: member.full_name,
    contact: member.email,
    date: new Date(member.created_at).toLocaleDateString(),
    method: member.method === "invite_email" ? "Email invite" : "Join link",
    status: s === "active" ? "Approved" : s === "rejected" ? "Rejected" : "Pending",
  };
}

// ---------------------------------------------------------------------------
// Join link row
// ---------------------------------------------------------------------------

export type JoinLinkRow = JoinLinkResponse;
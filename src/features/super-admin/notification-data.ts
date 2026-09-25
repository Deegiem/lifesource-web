import type { PlatformNotification } from "./notification-types";

export const platformNotifications: PlatformNotification[] = [
  {
    id: "NOT-0001",
    title: "Blood request update",
    message: "A donor has accepted request REQ-0041.",
    audience: "Requester",
    type: "request",
    status: "sent",
    sentLabel: "Today, 8:41 AM",
  },
  {
    id: "NOT-0002",
    title: "Override decision",
    message: "Your override request has been approved.",
    audience: "Community Admin",
    type: "override",
    status: "sent",
    sentLabel: "15 Sep 2026, 4:41 PM",
  },
];

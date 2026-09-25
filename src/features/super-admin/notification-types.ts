export interface PlatformNotification {
  id: string;
  title: string;
  message: string;
  audience: string;
  type: "system" | "request" | "override" | "account";
  status: "sent" | "scheduled" | "draft";
  sentLabel: string | null;
}

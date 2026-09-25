import type { ReactNode } from "react";

import { AdminShell } from "@/components/super-admin/layout/admin-shell";

export default function SuperAdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
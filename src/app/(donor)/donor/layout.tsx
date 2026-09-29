import type { ReactNode } from "react";

import { RoleDashboardShell } from "@/components/navigation/role-navigation";

export default function DonorLayout({ children }: { children: ReactNode }) {
  return <RoleDashboardShell role="donor">{children}</RoleDashboardShell>;
}

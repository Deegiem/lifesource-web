import type { ReactNode } from "react";
import { AuthLayout } from "@/components/auth/AuthLayout";

interface AuthRouteLayoutProps {
  children: ReactNode;
}

export default function AuthRouteLayout({
  children,
}: AuthRouteLayoutProps) {
  return <AuthLayout>{children}</AuthLayout>;
}
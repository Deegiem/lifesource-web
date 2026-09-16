import type { ReactNode } from "react";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-(--color-surface-page)">
      <div className="mx-auto flex min-h-screen w-full flex-col">
        <div className="flex min-h-screen flex-1 items-center justify-center">
          {/*
            Width rules defined ONCE here:
            - Mobile: max-w-md (narrow, form-friendly)
            - Desktop (md+): max-w-[92vw] (fills the viewport)
          */}
          <div className="w-full max-w-md px-4 py-8 sm:px-6 md:max-w-[92vw] md:px-8 md:py-10 lg:px-12 lg:py-12">
            {children}
          </div>
        </div>
      </div>
    </main>
  );
}
import React from "react";

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-[10.5px] font-bold text-ca-muted uppercase tracking-wider mb-2.5">
      {children}
    </div>
  );
}

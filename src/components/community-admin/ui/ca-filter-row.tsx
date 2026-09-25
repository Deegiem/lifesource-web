import React from "react";

export function FilterRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-2 mb-3.5 flex-wrap items-center">{children}</div>
  );
}

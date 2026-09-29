import React from "react";

export function EmptyState({ message }: { message: string }) {
  return (
    <div className="py-10 px-5 text-center text-ca-muted text-[13px]">
      <div className="text-2xl mb-2.5 opacity-40">—</div>
      {message}
    </div>
  );
}

import React from "react";
import Link from "next/link";

export function Crumb({ path }: { path: [string, string][] }) {
  return (
    <div className="text-[11.5px] text-ca-muted mb-4 flex items-center gap-1.5">
      {path.map(([label, href], i) => (
        <span key={label} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ca-dim">/</span>}
          {href ? (
            <Link href={href} className="text-ca-accent hover:underline cursor-pointer">{label}</Link>
          ) : (<span>{label}</span>)}
        </span>
      ))}
    </div>
  );
}

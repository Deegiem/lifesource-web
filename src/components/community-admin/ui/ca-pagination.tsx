import React from "react";
import { Btn } from "./ca-button";

export function Pagination({ showing, total }: { showing: number; total: string }) {
  return (
    <div className="flex justify-between items-center px-4 py-2.5 border-t border-ca-border">
      <span className="text-[11.5px] text-ca-muted">Showing {showing} of {total}</span>
      <div className="flex gap-1.5">
        <Btn size="sm" variant="outline">Prev</Btn>
        <Btn size="sm" variant="outline">Next</Btn>
      </div>
    </div>
  );
}

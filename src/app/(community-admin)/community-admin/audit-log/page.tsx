"use client";

import React, { useState, useEffect } from "react";
import { Shell } from "@/components/community-admin/shell";
import { Card } from "@/components/community-admin/ui/ca-card";
import { FilterRow } from "@/components/community-admin/ui/ca-filter-row";
import { SearchInput } from "@/components/community-admin/ui/ca-search-input";
import { Sel } from "@/components/community-admin/ui/ca-select";
import { TH, TD } from "@/components/community-admin/ui/ca-table";
import { Btn } from "@/components/community-admin/ui/ca-button";
import { Pagination } from "@/components/community-admin/ui/ca-pagination";
import { COMMUNITY } from "@/components/community-admin/ui/ca-constants";
import { AdminInfoRow } from "@/components/super-admin/ui/admin-info-row";
import { useCAAuditLogStore } from "@/stores/community-admin-audit-log.store";
import { CAAuditLog } from "@/features/community-admin/audit-log-types";

export default function CAAuditLogPage() {
  const { items: logs,loadItems } = useCAAuditLogStore();
  const [drawer, setDrawer] = useState<CAAuditLog | null>(null);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  return (
    <Shell title={`Audit Log (${COMMUNITY})`}>
      <FilterRow>
        <SearchInput placeholder="Search actor..." />
        <Sel opts={["All Action Types", "Member Management", "Join Requests", "Requests", "Escalations", "System"]} />
        <Sel opts={["All Entity Types", "Member", "Request", "Escalation", "System"]} />
        <Sel opts={["All Dates", "Today", "Last 7 days", "Last 30 days"]} />
      </FilterRow>
      <Card>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-ca-side border-b border-ca-border">
              <TH>Actor</TH>
              <TH>Action</TH>
              <TH>Affected Entity</TH>
              <TH>Timestamp</TH>
              <TH>Result</TH>
              <TH w={60}></TH>
            </tr>
          </thead>
          <tbody>
            {logs.map((l) => (
              <tr 
                key={l.id} 
                className="cursor-pointer hover:bg-ca-border/10 border-b border-ca-border/20 last:border-0"
                onClick={() => setDrawer(l)}
              >
                <TD><span className="font-semibold">{l.actor}</span></TD>
                <TD>{l.action}</TD>
                <TD muted>{l.entity}</TD>
                <TD muted>{l.time}</TD>
                <TD><span className="text-xs font-medium text-green-400">{l.result}</span></TD>
                <TD><Btn size="sm" variant="ghost">Details</Btn></TD>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination showing={logs.length} total="342 entries" />
      </Card>

      {/* Detail drawer */}
      {drawer && (
        <div 
          className="fixed inset-0 bg-black/60 z-50 flex justify-end" 
          onClick={() => setDrawer(null)}
        >
          <div 
            className="w-72 bg-ca-card border-l border-ca-border h-full overflow-y-auto p-5" 
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-sm text-ca-text">Audit Event</span>
              <button 
                onClick={() => setDrawer(null)} 
                className="text-ca-muted hover:text-ca-text text-xl leading-none"
              >
                &times;
              </button>
            </div>
            
            <div className="space-y-3">
              <AdminInfoRow label="Actor" value={drawer.actor} />
              <AdminInfoRow label="Action" value={drawer.action} />
              <AdminInfoRow label="Entity" value={drawer.entity} />
              <AdminInfoRow label="Timestamp" value={drawer.time} />
              <AdminInfoRow label="Result" value={drawer.result} />
              <AdminInfoRow label="Community" value={COMMUNITY} />
            </div>

            <div className="mt-4 px-3 py-2.5 bg-ca-side rounded-lg">
              <div className="text-xs font-bold text-ca-dim mb-1.5 uppercase tracking-wider">Scope</div>
              <div className="text-xs text-ca-muted leading-relaxed">
                Community-scoped. Audit records are append-only and cannot be edited or deleted.
              </div>
            </div>
          </div>
        </div>
      )}
    </Shell>
  );
}

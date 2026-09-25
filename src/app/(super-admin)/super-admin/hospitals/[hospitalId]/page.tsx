"use client";

import Link from "next/link";
import { useEffect } from "react";
import { ArrowLeft, MapPin } from "lucide-react";
import { useParams } from "next/navigation";
import { AdminBadge } from "@/components/super-admin/ui/admin-badge";
import { AdminBreadcrumbs } from "@/components/super-admin/ui/admin-breadcrumbs";
import { AdminCard } from "@/components/super-admin/ui/admin-card";
import { AdminErrorState } from "@/components/super-admin/ui/admin-error-state";
import { AdminInfoRow } from "@/components/super-admin/ui/admin-info-row";
import { AdminLoadingState } from "@/components/super-admin/ui/admin-loading-state";
import { AdminPageHeader } from "@/components/super-admin/ui/admin-page-header";
import { useSuperAdminHospitalsStore } from "@/stores/super-admin-hospitals.store";

export default function HospitalDetailsPage() {
  const params = useParams<{ hospitalId: string }>();
  const { hospitals, isLoading, error, loadHospitals } = useSuperAdminHospitalsStore();

  useEffect(() => { if (!hospitals.length) void loadHospitals(); }, [hospitals.length, loadHospitals]);
  const hospital = hospitals.find((item) => item.id === params.hospitalId);

  return (
    // Hospital Details   
    <div className="space-y-6">
      <AdminBreadcrumbs items={[{ label: "Hospitals", href: "/super-admin/hospitals" }, { label: params.hospitalId }]} />
      {isLoading ? <AdminCard><AdminLoadingState /></AdminCard> : error ? <AdminCard><AdminErrorState message={error} onRetry={() => void loadHospitals()} /></AdminCard> : !hospital ? <AdminCard><AdminErrorState message="Hospital not found." /></AdminCard> : <>
        <Link href="/super-admin/hospitals" className="inline-flex items-center gap-2 text-sm text-(--color-admin-muted) hover:text-(--color-admin-text)"><ArrowLeft className="size-4" />Back to hospitals</Link>
        <AdminPageHeader title={hospital.name} description={`${hospital.id} · ${hospital.address}, ${hospital.lga}, ${hospital.state}`} action={<AdminBadge status={hospital.status} />} />
        <div className="grid gap-6 sm:grid-cols-2">
          <AdminCard className="p-6"><h2 className="text-lg font-bold">Hospital information</h2><div className="mt-5"><AdminInfoRow label="Address" value={hospital.address} /><AdminInfoRow label="LGA" value={hospital.lga} /><AdminInfoRow label="State" value={hospital.state} /><AdminInfoRow label="Created" value={hospital.createdLabel} /></div></AdminCard>
          <AdminCard className="p-6"><div className="flex items-center gap-2"><MapPin className="size-5 text-(--color-admin-accent)" /><h2 className="text-lg font-bold">Location</h2></div><p className="mt-4 text-sm text-(--color-admin-muted)">{hospital.latitude !== null && hospital.longitude !== null ? `${hospital.latitude}, ${hospital.longitude}` : "Coordinates not provided"}</p></AdminCard>
        </div>
      </>}
    </div>
  );
}

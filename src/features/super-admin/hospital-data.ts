import type { PlatformHospital } from "./hospital-types";

export const platformHospitals: PlatformHospital[] = [
  {
    id: "HSP-0001",
    name: "University College Hospital",
    address: "Queen Elizabeth Road",
    state: "Oyo",
    lga: "Ibadan North",
    latitude: 7.3775,
    longitude: 3.947,
    status: "active",
    createdLabel: "01 Aug 2026",
  },
  {
    id: "HSP-0002",
    name: "Lagos Island General Hospital",
    address: "Broad Street",
    state: "Lagos",
    lga: "Lagos Island",
    latitude: 6.4541,
    longitude: 3.3947,
    status: "active",
    createdLabel: "04 Aug 2026",
  },
  {
    id: "HSP-0003",
    name: "Adeoyo State Hospital",
    address: "Ring Road",
    state: "Oyo",
    lga: "Ibadan South West",
    latitude: 7.3592,
    longitude: 3.8906,
    status: "inactive",
    createdLabel: "09 Aug 2026",
  },
];

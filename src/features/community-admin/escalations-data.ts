import { CAEscalations } from "./escalations-types";
export const MOCK_ESCALATIONS: CAEscalations[] = [
  {
    id: "1",
    ref: "ESC-0003",
    related: "REQ-0038",
    type: "More than 10 donors",
    reason: "Mass emergency — 14 donors needed urgently",
    date: "Dec 10",
    status: "Pending Review",
  },
  {
    id: "2",
    ref: "ESC-0002",
    related: "Amaka Okafor",
    type: "Early cooldown reactivation",
    reason: "Recurring sickle-cell crisis, cooldown not elapsed",
    date: "Nov 28",
    status: "Approved",
  },
  {
    id: "3",
    ref: "ESC-0001",
    related: "REQ-0025",
    type: "More than 10 donors",
    reason: "Multi-patient hospital ward needs 11 donors",
    date: "Nov 5",
    status: "Rejected",
  },
];

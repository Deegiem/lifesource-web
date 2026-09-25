"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ScreenHeader,
  Input,
  SelectField,
  TrustNote,
} from "@/components/community-admin-auth/ui";
import { Button } from "@/components/ui/button";

const COMMUNITY_TYPES = [
  { value: "hospital", label: "Hospital / Medical Centre" },
  { value: "university", label: "University / Polytechnic" },
  { value: "workplace", label: "Workplace / Company" },
  { value: "ngo", label: "NGO / Non-profit" },
  { value: "religious", label: "Religious Organisation" },
  { value: "government", label: "Government Agency" },
  { value: "cooperative", label: "Cooperative / Association" },
  { value: "other", label: "Other" },
];

const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT — Abuja",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const LGAS: Record<string, string[]> = {
  Lagos: [
    "Agege",
    "Alimosho",
    "Amuwo-Odofin",
    "Apapa",
    "Epe",
    "Eti-Osa",
    "Ibeju-Lekki",
    "Ifako-Ijaiye",
    "Ikeja",
    "Ikorodu",
    "Kosofe",
    "Lagos Island",
    "Lagos Mainland",
    "Mushin",
    "Ojo",
    "Oshodi-Isolo",
    "Shomolu",
    "Surulere",
  ],
  "FCT — Abuja": [
    "Abaji",
    "Bwari",
    "Gwagwalada",
    "Kuje",
    "Kwali",
    "Municipal Area Council",
  ],
  Rivers: [
    "Bonny",
    "Degema",
    "Eleme",
    "Etche",
    "Ikwerre",
    "Obio-Akpor",
    "Okrika",
    "Port Harcourt",
  ],
  Kano: [
    "Dala",
    "Fagge",
    "Gwale",
    "Kano Municipal",
    "Kumbotso",
    "Nassarawa",
    "Ungogo",
  ],
};

export default function CommunityProfileSetup() {
  const router = useRouter();
  const [communityName, setCommunityName] = useState("Ikeja General Hospital");
  const [communityType, setCommunityType] = useState("hospital");
  const [state, setState] = useState("Lagos");
  const [lga, setLga] = useState("Ikeja");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const lgaOptions = state
    ? (LGAS[state] || ["Central LGA", "East LGA", "West LGA"]).map((l) => ({
        value: l,
        label: l,
      }))
    : [];

  const handleContinue = () => {
    const e: Record<string, string> = {};
    if (!communityName.trim()) e.name = "Enter your community name.";
    if (!communityType) e.type = "Select a community type.";
    if (!state) e.state = "Select your state.";
    if (!lga) e.lga = "Select your LGA.";

    if (Object.keys(e).length) {
      setErrors(e);
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push("/community-admin/success");
    }, 1000);
  };

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#FAFBFF]">
      <div className="px-6 pt-8 pb-4 max-w-lg mx-auto w-full">
        <ScreenHeader
          onBack={() => router.push("/community-admin/verify")}
          step={3}
          totalSteps={4}
        />

        <div className="pt-4 space-y-5">
          <div>
            <h1 className="text-2xl font-extrabold text-[#0D1B2A]">
              Set up your community
            </h1>
            <p className="text-sm text-[#4B617A] mt-1">
              This information helps members and donors find your community.
            </p>
          </div>

          <Input
            label="Community name"
            value={communityName}
            onChange={(e) => setCommunityName(e.target.value)}
            placeholder="e.g. Lagos Island General Hospital"
            error={errors.name}
          />

          <SelectField
            label="Community type"
            value={communityType}
            onChange={setCommunityType}
            options={COMMUNITY_TYPES}
            placeholder="Select type"
            error={errors.type}
          />

          <SelectField
            label="State"
            value={state}
            onChange={(v) => {
              setState(v);
              setLga("");
            }}
            options={NIGERIAN_STATES.map((s) => ({ value: s, label: s }))}
            placeholder="Select state"
            error={errors.state}
          />

          <SelectField
            label="Local Government Area"
            value={lga}
            onChange={setLga}
            options={lgaOptions}
            placeholder={state ? "Select LGA" : "Select a state first"}
            error={errors.lga}
          />

          {Object.keys(errors).length > 0 && (
            <p className="text-xs text-[#C62828] font-medium">
              Please fill in all required fields.
            </p>
          )}
        </div>
      </div>

      <div className="px-6 pb-6 pt-3 space-y-3 -0 max-w-lg mx-auto w-full">
        <Button
          onClick={handleContinue}
          disabled={loading}
          className="w-full bg-[#4F46E5] hover:bg-[#4338CA] h-12 text-[15px] font-semibold"
        >
          {loading ? "Creating..." : "Create community"}
        </Button>
        <TrustNote text="Community details can be updated from your admin dashboard." />
      </div>
    </div>
  );
}

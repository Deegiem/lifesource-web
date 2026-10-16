
"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { OnboardingLayout } from "@/components/donor-onboarding/onboarding-layout";
import { SelectField } from "@/components/donor-onboarding/select-field";
import { TrustNote } from "@/components/donor-onboarding/trust-note";
import { useDonorOnboardingStore } from "@/stores/donor-onboarding.store";
import { apiService } from "@/services/api.service";
import { getApiErrorMessage } from "@/lib/axios";
import type {
  LgaResponse,
  StateResponse,
} from "@/features/api/types";

export default function ManualLocationPage() {
  const router = useRouter();

  const {
    stateId: savedStateId,
    lgaId: savedLgaId,
    setManualLocation,
  } = useDonorOnboardingStore();

  const [states, setStates] = useState<StateResponse[]>([]);
  const [lgas, setLgas] = useState<LgaResponse[]>([]);

  const [state, setState] = useState(savedStateId);
  const [lga, setLga] = useState(savedLgaId);

  const [loadingStates, setLoadingStates] = useState(true);
  const [loadingLgas, setLoadingLgas] = useState(false);

  const [statesError, setStatesError] = useState("");
  const [lgasError, setLgasError] = useState("");

  const [statesRetry, setStatesRetry] = useState(0);
  const [lgasRetry, setLgasRetry] = useState(0);

  // Load states when the page opens, or when the user retries.
  useEffect(() => {
    let cancelled = false;

    const loadStates = async () => {
      setLoadingStates(true);
      setStatesError("");

      try {
        const result = await apiService.listStates();

        if (!cancelled) {
          setStates(result);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setStatesError(
            getApiErrorMessage(
              requestError,
              "Unable to load states.",
            ),
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingStates(false);
        }
      }
    };

    void loadStates();

    return () => {
      cancelled = true;
    };
  }, [statesRetry]);

  // Load LGAs for the currently selected state.
  // Ignore results from requests belonging to an older selection.
  useEffect(() => {
    let cancelled = false;

    const loadLgas = async () => {
      if (!state) {
        setLgas([]);
        setLoadingLgas(false);
        setLgasError("");
        return;
      }

      setLgas([]);
      setLoadingLgas(true);
      setLgasError("");

      try {
        const result = await apiService.listLgas(state);

        if (!cancelled) {
          setLgas(result);
        }
      } catch (requestError: unknown) {
        if (!cancelled) {
          setLgas([]);
          setLgasError(
            getApiErrorMessage(
              requestError,
              "Unable to load local government areas.",
            ),
          );
        }
      } finally {
        if (!cancelled) {
          setLoadingLgas(false);
        }
      }
    };

    void loadLgas();

    return () => {
      cancelled = true;
    };
  }, [state, lgasRetry]);

  const stateOptions = useMemo(
    () =>
      states.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    [states],
  );

  const lgaOptions = useMemo(
    () =>
      lgas.map(({ id, name }) => ({
        value: id,
        label: name,
      })),
    [lgas],
  );

  const selectedState = states.find(
    (item) => item.id === state,
  );

  const selectedLga = lgas.find(
    (item) => item.id === lga,
  );

  const canContinue =
    !loadingStates &&
    !loadingLgas &&
    !statesError &&
    !lgasError &&
    Boolean(selectedState && selectedLga);

  const handleStateChange = (value: string) => {
    setState(value);

    // An LGA belongs to a specific state, so reset it
    // whenever the selected state changes.
    setLga("");
    setLgas([]);
    setLgasError("");
  };

  const handleContinue = () => {
    // Validate against the actual API results, not just
    // whether the dropdowns contain non-empty strings.
    if (!canContinue || !selectedState || !selectedLga) {
      return;
    }

    setManualLocation(
      selectedState.name,
      selectedLga.name,
      selectedState.id,
      selectedLga.id,
    );

    router.push("/donor-availability");
  };

  return (
    <OnboardingLayout step={3}>
      <div className="space-y-8">
        <section className="space-y-2">
          <h1 className="text-2xl font-extrabold leading-tight text-(--color-text-primary)">
            Where are you located?
          </h1>

          <p className="text-base leading-normal text-(--color-text-secondary)">
            We use your area to match you with nearby blood requests.
          </p>
        </section>

        <section className="space-y-5">
          <SelectField
            label="State"
            value={state}
            onChange={handleStateChange}
            options={stateOptions}
            placeholder={
              loadingStates
                ? "Loading states..."
                : "Select your state"
            }
            disabled={loadingStates}
            required
          />

          {statesError && (
            <div className="space-y-2">
              <p
                role="alert"
                className="text-sm text-(--color-danger)"
              >
                {statesError}
              </p>

              <button
                type="button"
                onClick={() => setStatesRetry((count) => count + 1)}
                disabled={loadingStates}
                className="text-sm font-semibold text-(--color-brand-primary) underline disabled:opacity-50"
              >
                Retry loading states
              </button>
            </div>
          )}

          <SelectField
            label="Local Government Area (LGA)"
            value={lga}
            onChange={setLga}
            options={lgaOptions}
            placeholder={
              !state
                ? "Select a state first"
                : loadingLgas
                  ? "Loading LGAs..."
                  : "Select your LGA"
            }
            disabled={
              !state ||
              loadingStates ||
              loadingLgas ||
              Boolean(statesError) ||
              Boolean(lgasError) ||
              lgaOptions.length === 0
            }
            required
          />

          {state && loadingLgas && (
            <p
              role="status"
              className="text-sm text-(--color-text-secondary)"
            >
              Loading local government areas...
            </p>
          )}

          {lgasError && (
            <div className="space-y-2">
              <p
                role="alert"
                className="text-sm text-(--color-danger)"
              >
                {lgasError}
              </p>

              <button
                type="button"
                onClick={() => setLgasRetry((count) => count + 1)}
                disabled={loadingLgas}
                className="text-sm font-semibold text-(--color-brand-primary) underline disabled:opacity-50"
              >
                Retry loading LGAs
              </button>
            </div>
          )}

          {state && !loadingLgas && !lgasError && lgas.length === 0 && (
            <p className="text-sm text-(--color-text-secondary)">
              No LGAs were returned for this state.
            </p>
          )}
        </section>

        <TrustNote>
          Only your state and LGA are used — never your street address.
        </TrustNote>

        <button
          type="button"
          onClick={handleContinue}
          disabled={!canContinue}
          className="h-(--control-height-lg) w-full rounded-(--radius-lg) bg-(--color-brand-primary) text-sm font-bold text-(--color-text-inverse) transition-colors hover:bg-(--color-brand-primary-hover) disabled:cursor-not-allowed disabled:opacity-50"
        >
          Continue
        </button>
      </div>
    </OnboardingLayout>
  );
}
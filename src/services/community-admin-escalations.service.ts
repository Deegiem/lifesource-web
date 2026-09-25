import { CAEscalations } from "@/features/community-admin/escalations-types";
import { MOCK_ESCALATIONS } from "@/features/community-admin/escalations-data";

export const getCAEscalations = async (): Promise<CAEscalations[]> => {
  return new Promise((resolve) =>
    setTimeout(() => resolve(MOCK_ESCALATIONS), 500),
  );
};

export const getCAEscalationsById = async (
  id: string,
): Promise<CAEscalations | null> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const item = MOCK_ESCALATIONS.find((i) => i.id === id);
      resolve(item || null);
    }, 500);
  });
};

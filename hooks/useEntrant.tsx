import { create } from "zustand";

export type EntrantType = {
  name: string;
  image: string;
  branch: string;
  rollNo: string;
  year: string;
};

type UseEntrantType = {
  entrant: EntrantType | null;
  isSuccess: boolean | null;
  type: string | null;
  setValues: (
    entrant: EntrantType | null,
    isSuccess: boolean | null,
    type: string | null
  ) => void;
};

export const useEntrant = create<UseEntrantType>((set) => ({
  entrant: null,
  isSuccess: null,
  type: null,
  setValues: (entrant, isSuccess, type) => {
    set({ entrant, isSuccess, type });
  },
}));

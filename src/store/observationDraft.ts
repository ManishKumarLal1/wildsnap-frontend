import { create } from "zustand";

interface ObservationDraftState {
  imageUri: string | null;
  setImageUri: (uri: string) => void;
  clearImage: () => void;
}

export const useObservationDraftStore =
  create<ObservationDraftState>((set) => ({
    imageUri: null,

    setImageUri: (uri) =>
      set({
        imageUri: uri,
      }),

    clearImage: () =>
      set({
        imageUri: null,
      }),
  }));
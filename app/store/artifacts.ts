import { createPersistStore } from "../utils/store";
import { StoreKey } from "../constant";

export type ViewMode = "html" | "svg" | "react";

export interface ArtifactsState {
  isOpen: boolean;
  codeContent: string;
  viewMode: ViewMode;
}

const DEFAULT_STATE: ArtifactsState = {
  isOpen: false,
  codeContent: "",
  viewMode: "html",
};

export const useArtifactsStore = createPersistStore(
  DEFAULT_STATE,
  (set) => ({
    open: (codeContent: string, viewMode: ViewMode) =>
      set({ isOpen: true, codeContent, viewMode }),
    close: () => set({ isOpen: false }),
    setCodeContent: (codeContent: string) => set({ codeContent }),
    setViewMode: (viewMode: ViewMode) => set({ viewMode }),
  }),
  {
    name: StoreKey.Artifacts,
  },
);

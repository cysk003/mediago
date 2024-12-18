import { DownloadType } from "@/types";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist, createJSONStorage } from "zustand/middleware";
import localforage from "localforage";

type State = {
  // Last download type
  lastIsBatch: boolean;
  lastDownloadTypes: DownloadType;

  // Video type selected last time (only m3u8 can be cached)
  lastVideoType: string;
  lastVideoName: string;
  lastVideoNumber: number;
};

type Actions = {
  setLastDownloadTypes: (type: DownloadType) => void;
  setLastVideo: (data: {
    type?: string;
    name?: string;
    number?: number;
  }) => void;
  setLastIsBatch: (isBatch: boolean) => void;
};

export type ConfigStore = State & Actions;

export const useConfigStore = create<State & Actions>()(
  persist(
    immer((set) => ({
      lastIsBatch: false,
      lastDownloadTypes: DownloadType.m3u8,
      lastVideoType: "",
      lastVideoName: "",
      lastVideoNumber: 1,
      setLastDownloadTypes: (type) => {
        set((state) => {
          state.lastDownloadTypes = type;
        });
      },
      setLastVideo: ({ type, name, number }) => {
        set((state) => {
          if (type) state.lastVideoType = type;
          if (name) state.lastVideoName = name;
          if (number) state.lastVideoNumber = number;
        });
      },
      setLastIsBatch: (isBatch) => {
        set((state) => {
          state.lastIsBatch = isBatch;
        });
      },
    })),
    {
      name: "config-storage",
      storage: createJSONStorage(() => localforage),
    },
  ),
);

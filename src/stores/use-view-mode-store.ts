import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ViewMode = 'grades' | 'exam-schedule' | 'letter';

interface ViewModeState {
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

export const useViewModeStore = create<ViewModeState>()(
  persist(
    (set) => ({
      viewMode: 'grades',
      setViewMode: (mode) => set({ viewMode: mode }),
    }),
    {
      name: 'view-mode-storage',
    }
  )
);

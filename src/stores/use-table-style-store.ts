import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TableStyleState {
  paddingY: number;
  fontSize: number;
  pagePaddingTop: number;
  pagePaddingX: number;
  setPaddingY: (value: number) => void;
  setFontSize: (value: number) => void;
  setPagePaddingTop: (value: number) => void;
  setPagePaddingX: (value: number) => void;
  resetStyles: () => void;
}

const defaultStyles = {
  paddingY: 8,
  fontSize: 14,
  pagePaddingTop: 0,
  pagePaddingX: 40,
};

export const useTableStyleStore = create<TableStyleState>()(
  persist(
    (set) => ({
      ...defaultStyles,
      setPaddingY: (value) => set({ paddingY: value }),
      setFontSize: (value) => set({ fontSize: value }),
      setPagePaddingTop: (value) => set({ pagePaddingTop: value }),
      setPagePaddingX: (value) => set({ pagePaddingX: value }),
      resetStyles: () => set(defaultStyles),
    }),
    {
      name: 'table-style-storage',
    }
  )
);
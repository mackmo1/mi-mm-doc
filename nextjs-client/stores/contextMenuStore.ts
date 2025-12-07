/**
 * Context Menu Store
 * Zustand store for managing context menu state
 */

'use client';

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Branch, BranchLevel } from '@/types/branch';

interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  branch: Branch | null;
  level: BranchLevel | null;
}

interface ContextMenuActions {
  openMenu: (x: number, y: number, branch: Branch, level: BranchLevel) => void;
  closeMenu: () => void;
}

const initialState: ContextMenuState = {
  isOpen: false,
  x: 0,
  y: 0,
  branch: null,
  level: null,
};

export const useContextMenuStore = create<ContextMenuState & ContextMenuActions>()(
  devtools(
    (set) => ({
      ...initialState,

      openMenu: (x, y, branch, level) =>
        set({ isOpen: true, x, y, branch, level }, false, 'openMenu'),

      closeMenu: () => set(initialState, false, 'closeMenu'),
    }),
    {
      name: 'context-menu-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Selector hooks
 */
export const useContextMenuIsOpen = () => useContextMenuStore((state) => state.isOpen);
export const useContextMenuPosition = () =>
  useContextMenuStore((state) => ({ x: state.x, y: state.y }));
export const useContextMenuBranch = () => useContextMenuStore((state) => state.branch);
export const useContextMenuLevel = () => useContextMenuStore((state) => state.level);

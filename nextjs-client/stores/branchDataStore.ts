/**
 * Branch Data Store
 * Zustand store for managing branch data with UI state (isShow, isAdd)
 * This handles the local UI state that's not persisted to the server
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Branch, BranchLevel } from '@/types/branch';

/**
 * Extended branch with local UI state
 */
interface BranchUIState {
  isShow: boolean;
  isAdd: boolean;
}

/**
 * Branch data state interface
 */
interface BranchDataState {
  // Branch data with UI state
  branches1: (Branch & BranchUIState)[];
  branches2: (Branch & BranchUIState)[];
  branches3: (Branch & BranchUIState)[];
  branches4: (Branch & BranchUIState)[];
  branches5: (Branch & BranchUIState)[];
}

/**
 * Branch data actions interface
 */
interface BranchDataActions {
  // Set branches from API response
  setBranches: (level: BranchLevel, branches: Branch[]) => void;

  // Toggle visibility (expand/collapse children)
  toggleShow: (level: BranchLevel, id: number) => void;

  // Set isAdd flag for context menu
  setIsAdd: (level: BranchLevel, id: number) => void;

  // Reset all isAdd flags for a level
  resetAllIsAdd: (level: BranchLevel) => void;

  // Reset all isAdd flags for all levels
  resetAllIsAddForAllLevels: () => void;

  // Update a single branch
  updateBranch: (level: BranchLevel, branch: Branch) => void;

  // Add a new branch
  addBranch: (level: BranchLevel, branch: Branch) => void;

  // Remove a branch
  removeBranch: (level: BranchLevel, id: number) => void;
}

/**
 * Initial state
 */
const initialState: BranchDataState = {
  branches1: [],
  branches2: [],
  branches3: [],
  branches4: [],
  branches5: [],
};

/**
 * Helper to get the state key for a branch level
 */
const getBranchKey = (level: BranchLevel): keyof BranchDataState => {
  return `branches${level}` as keyof BranchDataState;
};

/**
 * Branch data store
 * Manages branch data with local UI state
 */
export const useBranchDataStore = create<BranchDataState & BranchDataActions>()(
  devtools(
    (set) => ({
      ...initialState,

      /**
       * Set branches from API response
       */
      setBranches: (level, branches) =>
        set(
          () => ({
            [getBranchKey(level)]: branches.map((branch) => ({
              ...branch,
              isShow: branch.isShow ?? false,
              isAdd: false,
            })),
          }),
          false,
          `setBranches${level}`
        ),

      /**
       * Toggle visibility for a branch
       */
      toggleShow: (level, id) =>
        set(
          (state) => ({
            [getBranchKey(level)]: state[getBranchKey(level)].map((branch) =>
              branch.id === id ? { ...branch, isShow: !branch.isShow } : branch
            ),
          }),
          false,
          `toggleShow${level}`
        ),

      /**
       * Set isAdd flag for showing context menu
       */
      setIsAdd: (level, id) =>
        set(
          (state) => ({
            [getBranchKey(level)]: state[getBranchKey(level)].map((branch) =>
              branch.id === id ? { ...branch, isAdd: true } : branch
            ),
          }),
          false,
          `setIsAdd${level}`
        ),

      /**
       * Reset all isAdd flags for a level
       */
      resetAllIsAdd: (level) =>
        set(
          (state) => ({
            [getBranchKey(level)]: state[getBranchKey(level)].map((branch) => ({
              ...branch,
              isAdd: false,
            })),
          }),
          false,
          `resetAllIsAdd${level}`
        ),

      /**
       * Reset all isAdd flags for all levels
       */
      resetAllIsAddForAllLevels: () =>
        set(
          (state) => ({
            branches1: state.branches1.map((b) => ({ ...b, isAdd: false })),
            branches2: state.branches2.map((b) => ({ ...b, isAdd: false })),
            branches3: state.branches3.map((b) => ({ ...b, isAdd: false })),
            branches4: state.branches4.map((b) => ({ ...b, isAdd: false })),
            branches5: state.branches5.map((b) => ({ ...b, isAdd: false })),
          }),
          false,
          'resetAllIsAddForAllLevels'
        ),

      /**
       * Update a single branch
       */
      updateBranch: (level, branch) =>
        set(
          (state) => ({
            [getBranchKey(level)]: state[getBranchKey(level)].map((b) =>
              b.id === branch.id ? { ...b, ...branch } : b
            ),
          }),
          false,
          `updateBranch${level}`
        ),

      /**
       * Add a new branch
       */
      addBranch: (level, branch) =>
        set(
          (state) => ({
            [getBranchKey(level)]: [
              ...state[getBranchKey(level)],
              { ...branch, isShow: false, isAdd: false },
            ],
          }),
          false,
          `addBranch${level}`
        ),

      /**
       * Remove a branch
       */
      removeBranch: (level, id) =>
        set(
          (state) => ({
            [getBranchKey(level)]: state[getBranchKey(level)].filter((b) => b.id !== id),
          }),
          false,
          `removeBranch${level}`
        ),
    }),
    {
      name: 'branch-data-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Selector hooks for specific branch levels
 */
export const useBranches1 = () => useBranchDataStore((state) => state.branches1);
export const useBranches2 = () => useBranchDataStore((state) => state.branches2);
export const useBranches3 = () => useBranchDataStore((state) => state.branches3);
export const useBranches4 = () => useBranchDataStore((state) => state.branches4);
export const useBranches5 = () => useBranchDataStore((state) => state.branches5);

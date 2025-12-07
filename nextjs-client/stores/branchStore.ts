/**
 * Branch Store
 * Zustand store for managing UI state related to branches
 * Migrated from Vuex store/index.js
 */

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import type { Branch, BranchType } from '@/types/branch';

/**
 * Menu visibility state for each branch level
 */
interface MenuState {
  b1: boolean;
  b2: boolean;
  b3: boolean;
  b4: boolean;
  b5: boolean;
}

/**
 * Branch store state interface
 */
interface BranchState {
  // Editor state
  isEditor: boolean;
  branchType: BranchType | null;
  isUpdate: boolean;
  oldBranch: Branch | null;
  selectedParentId: number | null;

  // Menu visibility
  menuState: MenuState;

  // Editor content (for controlled editor)
  editorContent: string;

  // Mobile sidebar state
  isSidebarOpen: boolean;
}

/**
 * Branch store actions interface
 */
interface BranchActions {
  // Editor actions
  openEditor: () => void;
  closeEditor: () => void;
  setEditorContent: (content: string) => void;
  resetEditorContent: () => void;

  // Branch type actions
  setType: (type: BranchType, parentBranch: Branch | null) => void;
  resetToAdd: () => void;

  // Update mode actions
  setUpdateMode: (branch: Branch, type: BranchType) => void;

  // Menu actions
  showMenu: (level: 1 | 2 | 3 | 4 | 5) => void;
  hideAllMenus: () => void;

  // Mobile sidebar actions
  toggleSidebar: () => void;
  openSidebar: () => void;
  closeSidebar: () => void;

  // Reset store
  reset: () => void;
}

/**
 * Default editor content (matches Vue.js version)
 */
const DEFAULT_EDITOR_CONTENT = '<h1 class="branch-name" id="branch-name"></h1>';

/**
 * Initial state
 */
const initialState: BranchState = {
  isEditor: false,
  branchType: null,
  isUpdate: false,
  oldBranch: null,
  selectedParentId: null,
  menuState: {
    b1: false,
    b2: false,
    b3: false,
    b4: false,
    b5: false,
  },
  editorContent: DEFAULT_EDITOR_CONTENT,
  isSidebarOpen: false,
};

/**
 * Branch store using Zustand
 * Handles all UI state for the branch management system
 */
export const useBranchStore = create<BranchState & BranchActions>()(
  devtools(
    (set) => ({
      ...initialState,

      /**
       * Open the editor panel
       */
      openEditor: () =>
        set(
          {
            isEditor: true,
            branchType: 'branch1',
          },
          false,
          'openEditor'
        ),

      /**
       * Close the editor panel and reset state
       */
      closeEditor: () =>
        set(
          {
            isEditor: false,
            branchType: null,
            isUpdate: false,
            oldBranch: null,
            selectedParentId: null,
            editorContent: DEFAULT_EDITOR_CONTENT,
          },
          false,
          'closeEditor'
        ),

      /**
       * Set editor content
       */
      setEditorContent: (content: string) =>
        set({ editorContent: content }, false, 'setEditorContent'),

      /**
       * Reset editor content to default
       */
      resetEditorContent: () =>
        set({ editorContent: DEFAULT_EDITOR_CONTENT }, false, 'resetEditorContent'),

      /**
       * Set branch type for adding a new child branch
       */
      setType: (type: BranchType, parentBranch: Branch | null) =>
        set(
          {
            branchType: type,
            oldBranch: parentBranch,
            isUpdate: false,
            selectedParentId: parentBranch?.id ?? null,
            editorContent: DEFAULT_EDITOR_CONTENT,
          },
          false,
          'setType'
        ),

      /**
       * Reset to add new main branch (branch1)
       */
      resetToAdd: () =>
        set(
          {
            oldBranch: null,
            branchType: 'branch1',
            isUpdate: false,
            selectedParentId: null,
            editorContent: DEFAULT_EDITOR_CONTENT,
          },
          false,
          'resetToAdd'
        ),

      /**
       * Set update mode with existing branch data
       */
      setUpdateMode: (branch: Branch, type: BranchType) =>
        set(
          {
            oldBranch: branch,
            isUpdate: true,
            branchType: type,
            editorContent: branch.content,
          },
          false,
          'setUpdateMode'
        ),

      /**
       * Show context menu for specific branch level
       */
      showMenu: (level: 1 | 2 | 3 | 4 | 5) =>
        set(
          {
            menuState: {
              b1: level === 1,
              b2: level === 2,
              b3: level === 3,
              b4: level === 4,
              b5: level === 5,
            },
          },
          false,
          `showMenu${level}`
        ),

      /**
       * Hide all context menus
       */
      hideAllMenus: () =>
        set(
          {
            menuState: {
              b1: false,
              b2: false,
              b3: false,
              b4: false,
              b5: false,
            },
          },
          false,
          'hideAllMenus'
        ),

      /**
       * Toggle mobile sidebar
       */
      toggleSidebar: () =>
        set((state) => ({ isSidebarOpen: !state.isSidebarOpen }), false, 'toggleSidebar'),

      /**
       * Open mobile sidebar
       */
      openSidebar: () => set({ isSidebarOpen: true }, false, 'openSidebar'),

      /**
       * Close mobile sidebar
       */
      closeSidebar: () => set({ isSidebarOpen: false }, false, 'closeSidebar'),

      /**
       * Reset entire store to initial state
       */
      reset: () => set(initialState, false, 'reset'),
    }),
    {
      name: 'branch-store',
      enabled: process.env.NODE_ENV === 'development',
    }
  )
);

/**
 * Selector hooks for specific state slices
 * Use these for better performance (prevents unnecessary re-renders)
 */
export const useIsEditor = () => useBranchStore((state) => state.isEditor);
export const useBranchType = () => useBranchStore((state) => state.branchType);
export const useIsUpdate = () => useBranchStore((state) => state.isUpdate);
export const useOldBranch = () => useBranchStore((state) => state.oldBranch);
export const useMenuState = () => useBranchStore((state) => state.menuState);
export const useEditorContent = () => useBranchStore((state) => state.editorContent);
export const useIsSidebarOpen = () => useBranchStore((state) => state.isSidebarOpen);

/**
 * Branch Type Definitions
 * Based on PostgreSQL schema for branches1-5 tables
 */

/**
 * Base branch interface matching the database schema
 * All branch tables (branches1-5) share the same structure
 */
export interface Branch {
  id: number;
  branch_id: number | null; // Parent branch ID (null for root branches)
  title: string;
  content: string; // HTML content from rich text editor
  isShow: boolean; // Whether child branches are expanded/visible
  isAdd: boolean; // UI state: whether context menu is shown
  created_at: string; // ISO date string
  updated_at: string; // ISO date string
}

/**
 * Branch type identifiers for the 5 hierarchy levels
 */
export type BranchType = 'branch1' | 'branch2' | 'branch3' | 'branch4' | 'branch5';

/**
 * Branch level numbers (1-5)
 */
export type BranchLevel = 1 | 2 | 3 | 4 | 5;

/**
 * Payload for creating a new branch
 */
export interface CreateBranchPayload {
  branch_id: number | null;
  title: string;
  content: string;
  isShow?: boolean;
  isAdd?: boolean;
}

/**
 * Payload for updating an existing branch
 */
export interface UpdateBranchPayload {
  id: number;
  branch_id?: number | null;
  title?: string;
  content?: string;
  isShow?: boolean;
  isAdd?: boolean;
}

/**
 * API response types
 */
export interface ApiBranchResponse {
  data: Branch;
  message?: string;
}

export interface ApiBranchesResponse {
  data: Branch[];
  message?: string;
}

export interface ApiErrorResponse {
  error: string;
  message: string;
  statusCode?: number;
}

/**
 * Branch with computed UI properties
 * Extended interface for client-side usage
 */
export interface BranchWithUI extends Branch {
  level: BranchLevel;
  children?: BranchWithUI[];
  isSelected?: boolean;
  isEditing?: boolean;
}

/**
 * Context menu action types
 */
export type ContextMenuAction = 'add' | 'edit' | 'delete';

/**
 * Context menu state
 */
export interface ContextMenuState {
  isOpen: boolean;
  x: number;
  y: number;
  branchId: number | null;
  branchLevel: BranchLevel | null;
}

/**
 * Editor state for the rich text editor
 */
export interface EditorState {
  content: string;
  isUpdate: boolean;
  branchType: BranchType | null;
  oldBranch: Branch | null;
  selectedParentId: number | null;
}

/**
 * Helper type guard to check if a value is a valid BranchType
 */
export function isBranchType(value: string): value is BranchType {
  return ['branch1', 'branch2', 'branch3', 'branch4', 'branch5'].includes(value);
}

/**
 * Helper to get the next branch type in hierarchy
 */
export function getNextBranchType(current: BranchType): BranchType | null {
  const map: Record<BranchType, BranchType | null> = {
    branch1: 'branch2',
    branch2: 'branch3',
    branch3: 'branch4',
    branch4: 'branch5',
    branch5: null, // No next level after branch5
  };
  return map[current];
}

/**
 * Helper to get branch level number from type
 */
export function getBranchLevel(type: BranchType): BranchLevel {
  const map: Record<BranchType, BranchLevel> = {
    branch1: 1,
    branch2: 2,
    branch3: 3,
    branch4: 4,
    branch5: 5,
  };
  return map[type];
}

/**
 * ContextMenu Component
 * Right-click context menu using React Portal
 * On mobile, displays as a bottom action sheet
 */

'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { useDeleteBranch } from '@/lib/hooks/useBranches';
import { useBranchStore } from '@/stores/branchStore';
import { useContextMenuStore } from '@/stores/contextMenuStore';
import type { BranchLevel, BranchType } from '@/types/branch';

import styles from './ContextMenu.module.scss';

export function ContextMenu() {
  const menuRef = useRef<HTMLUListElement>(null);
  const [mounted, setMounted] = useState(false);
  const { isOpen, x, y, branch, level } = useContextMenuStore();
  const closeMenu = useContextMenuStore((state) => state.closeMenu);
  const setType = useBranchStore((state) => state.setType);
  const openEditor = useBranchStore((state) => state.openEditor);
  const closeSidebar = useBranchStore((state) => state.closeSidebar);

  // Delete mutation hooks for each level
  const deleteBranch1 = useDeleteBranch(1);
  const deleteBranch2 = useDeleteBranch(2);
  const deleteBranch3 = useDeleteBranch(3);
  const deleteBranch4 = useDeleteBranch(4);
  const deleteBranch5 = useDeleteBranch(5);

  // Map level to delete mutation - memoized to prevent dependency changes
  const deleteMutations = useMemo<Record<BranchLevel, ReturnType<typeof useDeleteBranch>>>(
    () => ({
      1: deleteBranch1,
      2: deleteBranch2,
      3: deleteBranch3,
      4: deleteBranch4,
      5: deleteBranch5,
    }),
    [deleteBranch1, deleteBranch2, deleteBranch3, deleteBranch4, deleteBranch5]
  );

  // Ensure component is mounted before using portal
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close menu on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, closeMenu]);

  // Close menu on Escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, closeMenu]);

  // Handle "Add new Branch" click
  const handleAdd = useCallback(() => {
    if (!branch || !level || level === 5) {
      return;
    }

    const nextLevel = (level + 1) as BranchLevel;
    const nextType = `branch${nextLevel}` as BranchType;

    setType(nextType, branch);
    openEditor();
    closeSidebar();
    closeMenu();
  }, [branch, level, setType, openEditor, closeSidebar, closeMenu]);

  // Handle "Delete Branch" click
  const handleDelete = useCallback(() => {
    if (!branch || !level) {
      return;
    }

    const confirmDelete = window.confirm('Are you sure you want to delete this branch?');

    if (confirmDelete) {
      const deleteMutation = deleteMutations[level];
      deleteMutation.mutate(branch.id);
    }

    closeMenu();
  }, [branch, level, deleteMutations, closeMenu]);

  // Handle cancel (mobile)
  const handleCancel = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  // Don't render if not mounted or not open
  if (!mounted || !isOpen || !branch || !level) {
    return null;
  }

  // Calculate position (keep menu within viewport) - desktop only
  const menuStyle: React.CSSProperties = {
    '--menu-x': `${Math.min(x, window.innerWidth - 200)}px`,
    '--menu-y': `${Math.min(y, window.innerHeight - 150)}px`,
  } as React.CSSProperties;

  // Render portal to document.body
  return createPortal(
    <ul ref={menuRef} className={styles.menu} style={menuStyle}>
      {level < 5 && (
        <li onClick={handleAdd} className={styles.menuItem}>
          <i className="fa fa-plus" aria-hidden="true" />
          <span>Add new Branch</span>
        </li>
      )}
      <li onClick={handleDelete} className={styles.menuItem}>
        <i className="fa fa-trash" aria-hidden="true" />
        <span>Delete Branch</span>
      </li>
      <li onClick={handleCancel} className={styles.cancelItem}>
        Cancel
      </li>
    </ul>,
    document.body
  );
}

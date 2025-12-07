/**
 * BranchItem Component
 * Renders a single branch with expand/collapse and context menu support
 * Includes touch event handling for mobile devices
 */

'use client';

import { useCallback, useRef } from 'react';

import { useBranchDataStore } from '@/stores/branchDataStore';
import { useBranchStore } from '@/stores/branchStore';
import { useContextMenuStore } from '@/stores/contextMenuStore';
import type { Branch, BranchLevel, BranchType } from '@/types/branch';

import styles from './BranchItem.module.scss';

interface BranchItemProps {
  branch: Branch & { isShow: boolean; isAdd: boolean };
  level: BranchLevel;
  children?: React.ReactNode;
}

export function BranchItem({ branch, level, children }: BranchItemProps) {
  const longPressTimeout = useRef<NodeJS.Timeout | null>(null);
  const toggleShow = useBranchDataStore((state) => state.toggleShow);
  const setUpdateMode = useBranchStore((state) => state.setUpdateMode);
  const openEditor = useBranchStore((state) => state.openEditor);
  const closeSidebar = useBranchStore((state) => state.closeSidebar);
  const openMenu = useContextMenuStore((state) => state.openMenu);

  // Handle expand/collapse toggle
  const handleToggle = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      toggleShow(level, branch.id);
    },
    [level, branch.id, toggleShow]
  );

  // Handle click to edit branch
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation();
      const branchType = `branch${level}` as BranchType;
      setUpdateMode(branch, branchType);
      openEditor();
      // Close sidebar on mobile after selection
      closeSidebar();
    },
    [branch, level, setUpdateMode, openEditor, closeSidebar]
  );

  // Handle right-click for context menu
  const handleContextMenu = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      openMenu(e.clientX, e.clientY, branch, level);
    },
    [branch, level, openMenu]
  );

  // Handle long-press start (touch devices)
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      if (!touch) {
        return;
      }
      longPressTimeout.current = setTimeout(() => {
        openMenu(touch.clientX, touch.clientY, branch, level);
      }, 500); // 500ms long-press threshold
    },
    [branch, level, openMenu]
  );

  // Cancel long-press on touch end
  const handleTouchEnd = useCallback(() => {
    if (longPressTimeout.current) {
      clearTimeout(longPressTimeout.current);
      longPressTimeout.current = null;
    }
  }, []);

  // Cancel long-press on touch move
  const handleTouchMove = handleTouchEnd;

  // Determine if this branch has children to show
  const hasChildren = level < 5 && children;

  return (
    <li className={styles.item}>
      <div className={styles.itemContent}>
        {hasChildren && (
          <i
            className={`fa ${branch.isShow ? 'fa-sort-desc' : 'fa-caret-right'} ${styles.icon}`}
            onClick={handleToggle}
            aria-hidden="true"
          />
        )}
        {!hasChildren && level < 5 && <span className={styles.iconPlaceholder} />}
        <h3
          className={styles.title}
          onClick={handleClick}
          onContextMenu={handleContextMenu}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {branch.title}
        </h3>
      </div>

      {/* Render children when expanded */}
      {branch.isShow && children && <ul className={styles.children}>{children}</ul>}
    </li>
  );
}

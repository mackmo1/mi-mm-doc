/**
 * LeftSidebar Component
 * Main navigation panel with branch tree
 * Includes mobile-responsive hamburger menu behavior
 */

'use client';

import clsx from 'clsx';
import { useCallback, useEffect } from 'react';

import { useBranchStore, useIsSidebarOpen } from '@/stores';
import { useContextMenuStore } from '@/stores/contextMenuStore';

import { BranchTree } from './BranchTree';
import styles from './LeftSidebar.module.scss';

export function LeftSidebar() {
  const closeEditor = useBranchStore((state) => state.closeEditor);
  const resetToAdd = useBranchStore((state) => state.resetToAdd);
  const openEditor = useBranchStore((state) => state.openEditor);
  const closeSidebar = useBranchStore((state) => state.closeSidebar);
  const closeMenu = useContextMenuStore((state) => state.closeMenu);
  const isSidebarOpen = useIsSidebarOpen();

  // Handle adding a new main branch (level 1)
  const handleAddMainBranch = useCallback(() => {
    resetToAdd();
    openEditor();
    closeSidebar(); // Close sidebar on mobile after action
  }, [resetToAdd, openEditor, closeSidebar]);

  // Close context menu when clicking anywhere in sidebar
  const handleSidebarClick = useCallback(() => {
    closeMenu();
  }, [closeMenu]);

  // Handle closing the editor
  const handleCloseEditor = useCallback(() => {
    closeEditor();
    closeSidebar();
  }, [closeEditor, closeSidebar]);

  // Handle mobile close button
  const handleMobileClose = useCallback(() => {
    closeSidebar();
  }, [closeSidebar]);

  // Close sidebar on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isSidebarOpen) {
        closeSidebar();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isSidebarOpen, closeSidebar]);

  // Prevent body scroll when sidebar is open on mobile
  useEffect(() => {
    if (isSidebarOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isSidebarOpen]);

  return (
    <>
      {/* Mobile overlay backdrop */}
      {isSidebarOpen && (
        <div className={styles.overlay} onClick={handleMobileClose} aria-hidden="true" />
      )}

      {/* Sidebar */}
      <aside
        className={clsx(styles.left, isSidebarOpen && styles.open)}
        onClick={handleSidebarClick}
      >
        {/* Mobile close button */}
        <button
          className={styles.mobileCloseBtn}
          onClick={handleMobileClose}
          aria-label="Close sidebar"
        >
          <i className="fa fa-times" aria-hidden="true" />
        </button>

        {/* Add New Main Branch button */}
        <h3 className={styles.mainlistTitle} onClick={handleAddMainBranch}>
          Add New Main Branch
          <i className="fa fa-plus-circle" aria-hidden="true" title="Add New Branch" />
        </h3>

        <hr className={styles.divider} />

        {/* Branch Tree */}
        <BranchTree />

        {/* Close Editor button */}
        <button className={styles.close} title="Close The Editor" onClick={handleCloseEditor}>
          Close The Editor
        </button>
      </aside>
    </>
  );
}

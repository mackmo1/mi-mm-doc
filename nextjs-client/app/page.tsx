/**
 * Home Page
 * Main entry point - shows welcome screen or editor based on state
 */

'use client';

import { ContextMenu } from '@/components/ContextMenu';
import { LeftSidebar } from '@/components/LeftSidebar';
import { useBranchStore, useIsEditor, useOldBranch } from '@/stores';

import styles from './page.module.scss';

/**
 * Header component with hamburger menu for mobile
 */
function Header() {
  const isEditor = useIsEditor();
  const toggleSidebar = useBranchStore((state) => state.toggleSidebar);

  return (
    <header className={styles.header}>
      {/* Hamburger button - only visible when editor is open (mobile only via CSS) */}
      {isEditor && (
        <button className={styles.hamburger} onClick={toggleSidebar} aria-label="Toggle sidebar">
          <i className="fa fa-bars" aria-hidden="true" />
        </button>
      )}
      <h1 className={styles.headerTitle}>Welcome to kh best documentation side :)</h1>
    </header>
  );
}

/**
 * Welcome screen component (shown when editor is closed)
 */
function WelcomeScreen() {
  const openEditor = useBranchStore((state) => state.openEditor);

  return (
    <div className={styles.branchInfo}>
      <div className={styles.caption}>
        <p>
          Either there is no branches or you didn&apos;t choosing a branch to view so add new branch
          or edit any available branch <span>by right click on the branch.</span>
        </p>
        <button onClick={openEditor} className={styles.openButton}>
          Open The Editor
        </button>
      </div>
    </div>
  );
}

/**
 * Editor placeholder content (will be replaced with Tiptap in Phase 4)
 */
function EditorPlaceholder() {
  const oldBranch = useOldBranch();

  return (
    <div className={styles.editorPlaceholder}>
      {oldBranch ? (
        <>
          <h2>{oldBranch.title}</h2>
          <div
            className={styles.branchContent}
            dangerouslySetInnerHTML={{ __html: oldBranch.content }}
          />
        </>
      ) : (
        <>
          <h2>Tiptap Editor</h2>
          <p>Select a branch to edit or create a new one.</p>
          <p className={styles.hint}>Rich text editor will be implemented in Phase 4</p>
        </>
      )}
    </div>
  );
}

/**
 * Editor layout with sidebar and content area
 */
function EditorLayout() {
  return (
    <div className={styles.template}>
      {/* Left Sidebar with Branch Tree */}
      <LeftSidebar />

      {/* Editor Area */}
      <main className={styles.editor}>
        <EditorPlaceholder />
      </main>

      {/* Context Menu Portal */}
      <ContextMenu />
    </div>
  );
}

/**
 * Home page component
 */
export default function HomePage() {
  const isEditor = useIsEditor();

  return (
    <div className={styles.app}>
      <Header />
      {isEditor ? <EditorLayout /> : <WelcomeScreen />}
    </div>
  );
}

/**
 * Home Page
 * Main entry point - shows welcome screen or editor based on state
 */

'use client';

import { useBranchStore, useIsEditor } from '@/stores';

import styles from './page.module.scss';

/**
 * Header component
 */
function Header() {
  return (
    <header className={styles.header}>
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
 * Editor placeholder (will be replaced with actual components in Phase 3-4)
 */
function EditorLayout() {
  const closeEditor = useBranchStore((state) => state.closeEditor);

  return (
    <div className={styles.template}>
      {/* Left Sidebar - Placeholder */}
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>
          Add New Main Branch
          <i className="fa fa-plus-circle" aria-hidden="true" title="Add New Branch" />
        </h3>
        <p className={styles.placeholder}>Branch tree will be implemented in Phase 3</p>
        <button onClick={closeEditor} className={styles.closeButton}>
          Close The Editor
        </button>
      </aside>

      {/* Editor Area - Placeholder */}
      <main className={styles.editor}>
        <div className={styles.editorPlaceholder}>
          <h2>Tiptap Editor</h2>
          <p>Rich text editor will be implemented in Phase 4</p>
        </div>
      </main>
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

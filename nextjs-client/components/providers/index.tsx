/**
 * Combined Providers Component
 * Wraps all providers in a single component for cleaner layout
 */

'use client';

import { QueryProvider } from './QueryProvider';

interface ProvidersProps {
  children: React.ReactNode;
}

/**
 * Providers component
 * Combines all context providers into a single wrapper
 * Add new providers here as needed (e.g., ThemeProvider, AuthProvider)
 */
export function Providers({ children }: ProvidersProps) {
  return (
    <QueryProvider>
      {/* Add other providers here as needed */}
      {children}
    </QueryProvider>
  );
}

export default Providers;

/**
 * React Query Provider
 * Provides TanStack Query context to the application
 */

'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

import { createQueryClient } from '@/lib/queryClient';

interface QueryProviderProps {
  children: React.ReactNode;
}

/**
 * QueryProvider component
 * Wraps the application with React Query context
 *
 * Note: We create the QueryClient inside a useState to ensure
 * it's only created once per component instance and survives
 * hot module replacement during development.
 */
export function QueryProvider({ children }: QueryProviderProps) {
  // Create QueryClient instance that persists across renders
  const [queryClient] = useState(() => createQueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* DevTools only visible in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-right" />
      )}
    </QueryClientProvider>
  );
}

export default QueryProvider;

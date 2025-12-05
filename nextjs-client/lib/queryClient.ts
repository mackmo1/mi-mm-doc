/**
 * React Query Client Configuration
 * Centralized configuration for TanStack Query
 */

import { QueryClient } from '@tanstack/react-query';

/**
 * Create a new QueryClient with default options
 * This configuration is optimized for the documentation app
 */
export function createQueryClient(): QueryClient {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // Data is considered fresh for 5 minutes
        staleTime: 5 * 60 * 1000,
        // Cache data for 30 minutes
        gcTime: 30 * 60 * 1000,
        // Retry failed requests 3 times
        retry: 3,
        // Exponential backoff for retries
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
        // Refetch on window focus (useful for real-time updates)
        refetchOnWindowFocus: true,
        // Don't refetch on mount if data is fresh
        refetchOnMount: true,
        // Don't refetch on reconnect (to prevent data loss during editing)
        refetchOnReconnect: true,
      },
      mutations: {
        // Retry mutations once on failure
        retry: 1,
        // Retry delay for mutations
        retryDelay: 1000,
      },
    },
  });
}

/**
 * Query keys factory for type-safe query keys
 * Using a factory pattern ensures consistent keys across the app
 */
export const queryKeys = {
  // All branches queries
  branches: {
    all: ['branches'] as const,
    level: (level: 1 | 2 | 3 | 4 | 5) => ['branches', level] as const,
    detail: (level: 1 | 2 | 3 | 4 | 5, id: number) => ['branches', level, id] as const,
  },

  // Health check
  health: ['health'] as const,
} as const;

/**
 * Type helper to get query key type
 */
export type QueryKeys = typeof queryKeys;

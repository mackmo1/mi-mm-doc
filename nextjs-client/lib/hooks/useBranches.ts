/**
 * Branch Query Hooks
 * Custom hooks for fetching and mutating branch data using React Query
 */

'use client';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { branchApi } from '@/lib/api';
import { queryKeys } from '@/lib/queryClient';
import { useBranchDataStore } from '@/stores/branchDataStore';
import type { BranchLevel, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch';

/**
 * Hook to fetch all branches for a specific level
 */
export function useBranches(level: BranchLevel) {
  const setBranches = useBranchDataStore((state) => state.setBranches);

  return useQuery({
    queryKey: queryKeys.branches.level(level),
    queryFn: async () => {
      const data = await branchApi.getAll(level);
      // Sync with Zustand store for UI state management
      setBranches(level, data);
      return data;
    },
  });
}

/**
 * Hook to fetch a single branch by ID
 */
export function useBranch(level: BranchLevel, id: number) {
  return useQuery({
    queryKey: queryKeys.branches.detail(level, id),
    queryFn: () => branchApi.getById(level, id),
    enabled: id > 0,
  });
}

/**
 * Hook to create a new branch
 */
export function useCreateBranch(level: BranchLevel) {
  const queryClient = useQueryClient();
  const addBranch = useBranchDataStore((state) => state.addBranch);

  return useMutation({
    mutationFn: (data: CreateBranchPayload) => branchApi.create(level, data),
    onSuccess: (newBranch) => {
      // Update Zustand store
      addBranch(level, newBranch);

      // Invalidate queries to refetch fresh data
      void queryClient.invalidateQueries({
        queryKey: queryKeys.branches.level(level),
      });
    },
    onError: (error) => {
      console.error(`Failed to create branch${level}:`, error);
    },
  });
}

/**
 * Hook to update an existing branch
 */
export function useUpdateBranch(level: BranchLevel) {
  const queryClient = useQueryClient();
  const updateBranch = useBranchDataStore((state) => state.updateBranch);

  return useMutation({
    mutationFn: (data: UpdateBranchPayload) => branchApi.update(level, data),
    onSuccess: (updatedBranch) => {
      // Update Zustand store
      updateBranch(level, updatedBranch);

      // Invalidate queries
      void queryClient.invalidateQueries({
        queryKey: queryKeys.branches.level(level),
      });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.branches.detail(level, updatedBranch.id),
      });
    },
    onError: (error) => {
      console.error(`Failed to update branch${level}:`, error);
    },
  });
}

/**
 * Hook to delete a branch
 */
export function useDeleteBranch(level: BranchLevel) {
  const queryClient = useQueryClient();
  const removeBranch = useBranchDataStore((state) => state.removeBranch);

  return useMutation({
    mutationFn: (id: number) => branchApi.delete(level, id),
    onSuccess: (_data, id) => {
      // Update Zustand store
      removeBranch(level, id);

      // Invalidate queries
      void queryClient.invalidateQueries({
        queryKey: queryKeys.branches.level(level),
      });
    },
    onError: (error) => {
      console.error(`Failed to delete branch${level}:`, error);
    },
  });
}

/**
 * Combined hook for all branch operations
 */
export function useBranchOperations(level: BranchLevel) {
  const query = useBranches(level);
  const createMutation = useCreateBranch(level);
  const updateMutation = useUpdateBranch(level);
  const deleteMutation = useDeleteBranch(level);

  return {
    // Query state
    branches: query.data ?? [],
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,

    // Mutations
    createBranch: createMutation.mutate,
    updateBranch: updateMutation.mutate,
    deleteBranch: deleteMutation.mutate,

    // Mutation states
    isCreating: createMutation.isPending,
    isUpdating: updateMutation.isPending,
    isDeleting: deleteMutation.isPending,
  };
}

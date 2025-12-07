/**
 * Zod Validation Schemas for BFF Layer
 * Provides runtime validation for API request bodies
 */

import { z } from 'zod';

/**
 * Schema for creating a new branch
 * Matches the Express backend expectations
 */
export const createBranchSchema = z.object({
  branch_id: z.number().int().positive().nullable().optional(),
  title: z.string().min(1, 'Title is required').max(500, 'Title is too long'),
  content: z.string().min(1, 'Content is required'),
  isShow: z.boolean().optional().default(false),
  isAdd: z.boolean().optional().default(false),
});

/**
 * Schema for updating an existing branch
 * All fields are optional except we need at least one field to update
 */
export const updateBranchSchema = z
  .object({
    branch_id: z.number().int().positive().nullable().optional(),
    title: z.string().min(1, 'Title cannot be empty').max(500, 'Title is too long').optional(),
    content: z.string().optional(),
    isShow: z.boolean().optional(),
    isAdd: z.boolean().optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: 'At least one field must be provided for update',
  });

/**
 * Type inference from schemas
 */
export type CreateBranchInput = z.infer<typeof createBranchSchema>;
export type UpdateBranchInput = z.infer<typeof updateBranchSchema>;

/**
 * Zod issue type for error details
 */
export type ZodIssue = z.ZodIssue;

/**
 * Validation result type
 */
export interface ValidationResult<T> {
  success: boolean;
  data?: T;
  error?: string;
  details?: ZodIssue[];
}

/**
 * Validate data against a schema
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return {
      success: true,
      data: result.data,
    };
  }

  // Format error message
  const issues = result.error.issues;
  const errorMessages = issues
    .map((issue) => `${issue.path.join('.')}: ${issue.message}`)
    .join('; ');

  return {
    success: false,
    error: errorMessages || 'Validation failed',
    details: issues,
  };
}

/**
 * ID parameter schema for route validation
 */
export const idParamSchema = z.object({
  id: z.string().regex(/^\d+$/, 'ID must be a positive integer'),
});

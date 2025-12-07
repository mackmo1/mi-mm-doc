/**
 * API Route: /api/branches5
 * Handles GET (list all) and POST (create) operations for branch level 5
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  createBranchSchema,
  createErrorResponse,
  parseBody,
  proxyToBackend,
  validate,
} from '@/lib/bff';
import type { Branch } from '@/types/branch';

/**
 * GET /api/branches5
 * Fetch all branches at level 5
 */
export async function GET(): Promise<NextResponse<Branch[]>> {
  return proxyToBackend<Branch[]>({
    endpoint: '/branches5',
    method: 'GET',
  });
}

/**
 * POST /api/branches5
 * Create a new branch at level 5
 */
export async function POST(request: NextRequest): Promise<NextResponse<Branch>> {
  const body = await parseBody<unknown>(request);
  if (!body) {
    return createErrorResponse(
      'Invalid JSON body',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  const validation = validate(createBranchSchema, body);
  if (!validation.success) {
    return createErrorResponse(
      validation.error || 'Validation failed',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  return proxyToBackend<Branch>({
    endpoint: '/branches5',
    method: 'POST',
    body: validation.data,
  });
}

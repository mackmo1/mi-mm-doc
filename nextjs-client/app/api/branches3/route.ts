/**
 * API Route: /api/branches3
 * Handles GET (list all) and POST (create) operations for branch level 3
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
 * GET /api/branches3
 * Fetch all branches at level 3
 */
export async function GET(): Promise<NextResponse<Branch[]>> {
  return proxyToBackend<Branch[]>({
    endpoint: '/branches3',
    method: 'GET',
  });
}

/**
 * POST /api/branches3
 * Create a new branch at level 3
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
    endpoint: '/branches3',
    method: 'POST',
    body: validation.data,
  });
}

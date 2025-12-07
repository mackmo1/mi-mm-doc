/**
 * API Route: /api/branches4
 * Handles GET (list all) and POST (create) operations for branch level 4
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
 * GET /api/branches4
 * Fetch all branches at level 4
 */
export async function GET(): Promise<NextResponse<Branch[]>> {
  return proxyToBackend<Branch[]>({
    endpoint: '/branches4',
    method: 'GET',
  });
}

/**
 * POST /api/branches4
 * Create a new branch at level 4
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
    endpoint: '/branches4',
    method: 'POST',
    body: validation.data,
  });
}

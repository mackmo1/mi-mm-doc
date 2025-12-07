/**
 * API Route: /api/branches1
 * Handles GET (list all) and POST (create) operations for branch level 1
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
 * GET /api/branches1
 * Fetch all branches at level 1
 */
export async function GET(): Promise<NextResponse<Branch[]>> {
  return proxyToBackend<Branch[]>({
    endpoint: '/branches1',
    method: 'GET',
  });
}

/**
 * POST /api/branches1
 * Create a new branch at level 1
 */
export async function POST(request: NextRequest): Promise<NextResponse<Branch>> {
  // Parse request body
  const body = await parseBody<unknown>(request);
  if (!body) {
    return createErrorResponse(
      'Invalid JSON body',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  // Validate request body
  const validation = validate(createBranchSchema, body);
  if (!validation.success) {
    return createErrorResponse(
      validation.error || 'Validation failed',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  // Proxy to backend
  return proxyToBackend<Branch>({
    endpoint: '/branches1',
    method: 'POST',
    body: validation.data,
  });
}

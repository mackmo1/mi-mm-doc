/**
 * API Route: /api/branches2/[id]
 * Handles GET (single), PATCH (update), and DELETE operations for branch level 2
 */

import { NextRequest, NextResponse } from 'next/server';

import {
  createErrorResponse,
  extractId,
  parseBody,
  proxyToBackend,
  updateBranchSchema,
  validate,
} from '@/lib/bff';
import type { Branch } from '@/types/branch';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Branch>> {
  const { id: idStr } = await params;
  const id = extractId({ id: idStr });
  if (id === null) {
    return createErrorResponse(
      'Invalid branch ID',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  return proxyToBackend<Branch>({
    endpoint: `/branches2/${id}`,
    method: 'GET',
  });
}

export async function PATCH(
  request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<Branch>> {
  const { id: idStr } = await params;
  const id = extractId({ id: idStr });
  if (id === null) {
    return createErrorResponse(
      'Invalid branch ID',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  const body = await parseBody<unknown>(request);
  if (!body) {
    return createErrorResponse(
      'Invalid JSON body',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  const validation = validate(updateBranchSchema, body);
  if (!validation.success) {
    return createErrorResponse(
      validation.error || 'Validation failed',
      400,
      'VALIDATION_ERROR'
    ) as NextResponse<Branch>;
  }

  return proxyToBackend<Branch>({
    endpoint: `/branches2/${id}`,
    method: 'PATCH',
    body: validation.data,
  });
}

export async function DELETE(
  _request: NextRequest,
  { params }: RouteParams
): Promise<NextResponse<null>> {
  const { id: idStr } = await params;
  const id = extractId({ id: idStr });
  if (id === null) {
    return createErrorResponse('Invalid branch ID', 400, 'VALIDATION_ERROR') as NextResponse<null>;
  }

  return proxyToBackend<null>({
    endpoint: `/branches2/${id}`,
    method: 'DELETE',
  });
}

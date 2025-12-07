/**
 * API Route: /api/health
 * Health check endpoint to verify BFF and backend connectivity
 */

import { NextResponse } from 'next/server';

import { proxyToBackend } from '@/lib/bff';
import type { HealthCheckResponse } from '@/types/api';

/**
 * BFF health status
 */
interface BffHealthResponse {
  status: 'OK' | 'DEGRADED' | 'ERROR';
  timestamp: string;
  bff: {
    status: 'OK';
    version: string;
  };
  backend?: HealthCheckResponse;
  error?: string;
}

/**
 * GET /api/health
 * Returns health status of BFF and backend
 */
export async function GET(): Promise<NextResponse<BffHealthResponse>> {
  const timestamp = new Date().toISOString();

  try {
    // Try to reach the backend health endpoint
    const backendResponse = await proxyToBackend<HealthCheckResponse>({
      endpoint: '/health',
      method: 'GET',
    });

    // Get the response data
    const backendData = (await backendResponse.json()) as HealthCheckResponse;

    // Check if backend is healthy
    if (backendResponse.status === 200) {
      return NextResponse.json({
        status: 'OK',
        timestamp,
        bff: {
          status: 'OK',
          version: '1.0.0',
        },
        backend: backendData,
      });
    }

    // Backend responded but with error
    return NextResponse.json({
      status: 'DEGRADED',
      timestamp,
      bff: {
        status: 'OK',
        version: '1.0.0',
      },
      error: 'Backend health check failed',
    });
  } catch (error) {
    // Backend unreachable
    console.error('Health check failed:', error);

    return NextResponse.json(
      {
        status: 'ERROR',
        timestamp,
        bff: {
          status: 'OK',
          version: '1.0.0',
        },
        error: 'Backend unreachable',
      },
      { status: 503 }
    );
  }
}

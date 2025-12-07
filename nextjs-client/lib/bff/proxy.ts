/**
 * BFF Proxy Utility
 * Handles proxying requests from Next.js API routes to the Express backend
 */

import { NextRequest, NextResponse } from 'next/server';

/**
 * Backend URL from environment variables (server-side only)
 */
const BACKEND_URL = process.env.BACKEND_URL || 'http://localhost:5000';

/**
 * Error response from backend
 */
interface BackendErrorResponse {
  error?: string;
  message?: string;
}

/**
 * Proxy options
 */
interface ProxyOptions {
  /** The backend endpoint path (e.g., '/branches1') */
  endpoint: string;
  /** HTTP method to use */
  method: 'GET' | 'POST' | 'PATCH' | 'PUT' | 'DELETE';
  /** Request body (for POST, PATCH, PUT) */
  body?: unknown;
  /** Query parameters to forward */
  searchParams?: URLSearchParams;
  /** Additional headers to include */
  headers?: Record<string, string>;
}

/**
 * Create a standardized error response
 */
export function createErrorResponse(
  message: string,
  statusCode: number,
  error?: string
): NextResponse {
  return NextResponse.json(
    {
      error: error || 'Request failed',
      message,
      statusCode,
    },
    { status: statusCode }
  );
}

/**
 * Proxy a request to the Express backend
 * This is the core function for the BFF layer
 */
export async function proxyToBackend<T>(options: ProxyOptions): Promise<NextResponse<T>> {
  const { endpoint, method, body, searchParams, headers = {} } = options;

  // Build full URL with query params
  let url = `${BACKEND_URL}${endpoint}`;
  if (searchParams && searchParams.toString()) {
    url += `?${searchParams.toString()}`;
  }

  // Prepare fetch options
  const fetchOptions: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...headers,
    },
    // Don't cache BFF requests
    cache: 'no-store',
  };

  // Add body for non-GET requests
  if (body && method !== 'GET') {
    fetchOptions.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(url, fetchOptions);
    const contentType = response.headers.get('content-type');

    // Handle non-JSON responses
    if (!contentType?.includes('application/json')) {
      if (!response.ok) {
        return createErrorResponse(
          `Backend returned non-JSON response: ${response.statusText}`,
          response.status,
          'BACKEND_ERROR'
        ) as NextResponse<T>;
      }
      // Empty successful response (e.g., DELETE)
      return new NextResponse<T>(null, { status: response.status });
    }

    // Parse JSON response
    const data: unknown = await response.json();

    // Forward error responses
    if (!response.ok) {
      const errorData = data as BackendErrorResponse;
      return createErrorResponse(
        errorData.message || errorData.error || 'Backend request failed',
        response.status,
        errorData.error || 'BACKEND_ERROR'
      ) as NextResponse<T>;
    }

    // Return successful response
    return NextResponse.json(data as T, { status: response.status });
  } catch (error) {
    // Network or parsing error
    console.error(`BFF Proxy Error [${method} ${endpoint}]:`, error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to connect to backend';

    return createErrorResponse(errorMessage, 503, 'BACKEND_UNAVAILABLE') as NextResponse<T>;
  }
}

/**
 * Helper to extract and validate ID from route params
 */
export function extractId(params: { id: string }): number | null {
  const id = parseInt(params.id, 10);
  return isNaN(id) ? null : id;
}

/**
 * Parse request body with error handling
 */
export async function parseBody<T>(request: NextRequest): Promise<T | null> {
  try {
    const body = (await request.json()) as T;
    return body;
  } catch {
    return null;
  }
}

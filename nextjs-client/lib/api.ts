/**
 * API Client
 * Centralized API client for making requests to the BFF layer
 */

import type { ApiError, ApiErrorCode } from '@/types/api';
import type { Branch, BranchLevel, CreateBranchPayload, UpdateBranchPayload } from '@/types/branch';

/**
 * Base API URL from environment
 */
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

/**
 * Custom error class for API errors
 */
export class ApiRequestError extends Error {
  public readonly code: ApiErrorCode;
  public readonly statusCode: number;
  public readonly details?: Record<string, unknown>;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'ApiRequestError';
    this.code = error.code;
    this.statusCode = error.statusCode;
    this.details = error.details;
  }
}

/**
 * Error response shape from API
 */
interface ErrorResponse {
  message?: string;
  error?: string;
}

/**
 * Generic fetch wrapper with error handling
 */
async function fetchApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const defaultHeaders: HeadersInit = {
    'Content-Type': 'application/json',
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      let errorMessage = 'An error occurred';
      let errorCode: ApiErrorCode = 'UNKNOWN_ERROR';

      try {
        const errorData: ErrorResponse = (await response.json()) as ErrorResponse;
        errorMessage = errorData.message ?? errorData.error ?? errorMessage;
      } catch {
        // If JSON parsing fails, use status text
        errorMessage = response.statusText;
      }

      // Map HTTP status to error code
      switch (response.status) {
        case 400:
          errorCode = 'VALIDATION_ERROR';
          break;
        case 401:
          errorCode = 'UNAUTHORIZED';
          break;
        case 403:
          errorCode = 'FORBIDDEN';
          break;
        case 404:
          errorCode = 'NOT_FOUND';
          break;
        case 500:
          errorCode = 'SERVER_ERROR';
          break;
        default:
          errorCode = 'UNKNOWN_ERROR';
      }

      throw new ApiRequestError({
        code: errorCode,
        message: errorMessage,
        statusCode: response.status,
      });
    }

    // Handle empty responses
    const text = await response.text();
    if (!text) {
      return {} as T;
    }

    return JSON.parse(text) as T;
  } catch (error) {
    if (error instanceof ApiRequestError) {
      throw error;
    }

    // Network or parsing error
    throw new ApiRequestError({
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Network error',
      statusCode: 0,
    });
  }
}

/**
 * Branch API endpoints
 * Points to the BFF layer which proxies to the Express backend
 */
const getBranchEndpoint = (level: BranchLevel) => `/branches${level}`;

/**
 * Branch API methods
 */
export const branchApi = {
  /**
   * Get all branches for a specific level
   */
  getAll: async (level: BranchLevel): Promise<Branch[]> => {
    return fetchApi<Branch[]>(getBranchEndpoint(level));
  },

  /**
   * Get a single branch by ID
   */
  getById: async (level: BranchLevel, id: number): Promise<Branch> => {
    return fetchApi<Branch>(`${getBranchEndpoint(level)}/${id}`);
  },

  /**
   * Create a new branch
   */
  create: async (level: BranchLevel, data: CreateBranchPayload): Promise<Branch> => {
    return fetchApi<Branch>(getBranchEndpoint(level), {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  /**
   * Update an existing branch
   */
  update: async (level: BranchLevel, data: UpdateBranchPayload): Promise<Branch> => {
    return fetchApi<Branch>(`${getBranchEndpoint(level)}/${data.id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  },

  /**
   * Delete a branch
   */
  delete: async (level: BranchLevel, id: number): Promise<void> => {
    return fetchApi<void>(`${getBranchEndpoint(level)}/${id}`, {
      method: 'DELETE',
    });
  },
};

export default branchApi;

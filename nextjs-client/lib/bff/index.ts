/**
 * BFF Layer Exports
 */

// Proxy utilities
export { createErrorResponse, extractId, parseBody, proxyToBackend } from './proxy';

// Validation schemas and utilities
export { createBranchSchema, idParamSchema, updateBranchSchema, validate } from './validation';
export type { CreateBranchInput, UpdateBranchInput, ValidationResult } from './validation';

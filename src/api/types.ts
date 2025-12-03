/**
 * Standard API response for successful requests
 */
export interface ApiSuccessResponse<T = any> {
    success: true;
    data?: T;
}

/**
 * Standard API response for failed requests
 */
export interface ApiErrorResponse {
    success: false;
    error: string;
    fieldErrors?: Record<string, string[]>;
}

/**
 * Combined API result type
 */
export type ApiResult<T = any> = ApiSuccessResponse<T> | ApiErrorResponse;

/**
 * Backend error structure from API
 */
export interface BackendErrorResponse {
    error: boolean;
    status?: number;
    message?: string;
    detail?: string;
    errors?: Record<string, any>;
}

/**
 * Parsed field errors
 */
export type FieldErrors = Record<string, string[]>;

import { BackendErrorResponse, FieldErrors } from './types';

/**
 * Parse API errors from backend response into field-level errors
 *
 * Supports various error formats:
 * - { errors: { user_errors: { email: ["error"] } } }
 * - { errors: { lead_errors: { title: ["error"] } } }
 * - { errors: { non_field_errors: ["error"] } }
 * - Array format: [{ field: ["error"] }]
 * - Object format: { field: ["error"] }
 */
export const parseApiErrors = (response: BackendErrorResponse): FieldErrors => {
    const fieldErrors: FieldErrors = {};

    if (!response?.errors || typeof response.errors !== 'object') {
        return fieldErrors;
    }

    const processErrors = (obj: any, prefix = '') => {
        Object.keys(obj).forEach((key) => {
            const value = obj[key];

            // Якщо масив строк - це field error
            if (Array.isArray(value) && value.every((v) => typeof v === 'string')) {
                fieldErrors[prefix + key] = value;
            }
            // Якщо об'єкт - рекурсивно обробити
            else if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
                processErrors(value, prefix);
            }
        });
    };

    processErrors(response.errors);
    return fieldErrors;
};

/**
 * Format error message from field errors or use default message
 */
export const formatErrorMessage = (fieldErrors: FieldErrors, defaultMessage: string): string => {
    const errorCount = Object.keys(fieldErrors).length;

    if (errorCount === 0) {
        return defaultMessage;
    }

    const firstField = Object.keys(fieldErrors)[0];
    const firstError = fieldErrors[firstField][0];

    if (errorCount === 1) {
        return firstError;
    }

    return `${firstError} (and ${errorCount - 1} more error${errorCount - 1 > 1 ? 's' : ''})`;
};

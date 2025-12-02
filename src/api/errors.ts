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

    Object.keys(response.errors).forEach((errorKey) => {
        const errors = response.errors![errorKey];

        if (!errors) return;

        if (Array.isArray(errors)) {
            errors.forEach((errorObj: any) => {
                if (typeof errorObj === 'object' && errorObj !== null) {
                    Object.keys(errorObj).forEach((fieldName) => {
                        if (Array.isArray(errorObj[fieldName])) {
                            fieldErrors[fieldName] = errorObj[fieldName];
                        }
                    });
                }
            });
        } else if (typeof errors === 'object' && errors !== null) {
            Object.keys(errors).forEach((fieldName) => {
                if (Array.isArray(errors[fieldName])) {
                    fieldErrors[fieldName] = errors[fieldName];
                }
            });
        }
    });

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

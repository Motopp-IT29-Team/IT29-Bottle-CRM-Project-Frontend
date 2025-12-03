export type FormErrors = Record<string, string[] | undefined>;

interface ApiErrorResponse {
    error?: boolean;
    profile_errors?: any[] | any;
    user_errors?: any[] | any;
    address_errors?: any[] | any;
    lead_errors?: any[] | any;
    [key: string]: any;
}

/**
 * Parse API error response into FormErrors format
 * Handles:
 * - Array format: [{field: ["error"]}]
 * - Object format: {field: ["error"]}
 * - Nested format: {profile_errors: {field: ["error"]}}
 */
export const parseApiErrors = (response: ApiErrorResponse): FormErrors => {
    const fieldErrors: FormErrors = {};
    const errorsContainer = response?.errors;

    if (!errorsContainer || typeof errorsContainer !== 'object') {
        return fieldErrors;
    }

    const errorKeys = [
        'profile_errors',
        'user_errors',
        'address_errors',
        'lead_errors',
        'contact_errors',
        'non_field_errors',
    ];

    errorKeys.forEach((key) => {
        const errors = errorsContainer[key];

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
 * Extract all error messages from FormErrors
 */
export const getErrorMessages = (errors: FormErrors): string[] => {
    const messages: string[] = [];

    Object.values(errors).forEach((errorArray) => {
        if (Array.isArray(errorArray)) {
            messages.push(...errorArray);
        }
    });

    return messages;
};

/**
 * Format error messages as single string
 */
export const formatErrorMessage = (errors: FormErrors, defaultMessage: string = 'Validation failed'): string => {
    const messages = getErrorMessages(errors);
    return messages.length > 0 ? messages.join('. ') : defaultMessage;
};

/**
 * Legacy format - for backward compatibility
 * @deprecated Use parseApiErrors instead
 */
export const formatBackendErrors = (errors: any): { errorMessage: string; fieldErrors: FormErrors } => {
    const fieldErrors = parseApiErrors(errors);
    const errorMessage = formatErrorMessage(fieldErrors, 'Failed to process request. Please check the form.');

    return { errorMessage, fieldErrors };
};

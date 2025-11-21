export const formatBackendErrors = (errors: any): { errorMessage: string; fieldErrors: Record<string, string[]> } => {
    const fieldErrors: Record<string, string[]> = {};
    const errorMessages: string[] = [];

    if (errors && typeof errors === 'object') {
        Object.keys(errors).forEach((errorType) => {
            const errorGroup = errors[errorType];

            if (typeof errorGroup === 'object' && errorGroup !== null) {
                Object.keys(errorGroup).forEach((fieldName) => {
                    const fieldError = errorGroup[fieldName];

                    if (Array.isArray(fieldError)) {
                        fieldErrors[fieldName] = fieldError;
                        errorMessages.push(...fieldError);
                    }
                });
            }
        });
    }

    const errorMessage =
        errorMessages.length > 0 ? errorMessages.join('. ') : 'Failed to create user. Please check the form.';

    return { errorMessage, fieldErrors };
};

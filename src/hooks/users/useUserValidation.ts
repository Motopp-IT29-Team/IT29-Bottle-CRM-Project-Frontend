import { useState } from 'react';
import { UserFormData } from './useUserFormData';

export const useUserValidation = () => {
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const validateForm = (data: UserFormData) => {
        const errors: { [key: string]: string } = {};

        // First Name validation
        if (!data.first_name.trim()) {
            errors.first_name = 'First name is required';
        }

        // Last Name validation
        if (!data.last_name.trim()) {
            errors.last_name = 'Last name is required';
        }

        // Email validation
        if (!data.email.trim()) {
            errors.email = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
            errors.email = 'Invalid email format';
        }

        setValidationErrors(errors);
        return errors;
    };

    return { validationErrors, validateForm, setValidationErrors };
};

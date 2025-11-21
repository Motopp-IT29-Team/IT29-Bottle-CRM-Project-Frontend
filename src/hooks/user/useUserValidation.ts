import { useState } from 'react';
import { UserFormData } from './useUserFormData';

export const useUserValidation = () => {
    const [validationErrors, setValidationErrors] = useState<{
        [key: string]: string;
    }>({});

    const validateForm = (data: UserFormData) => {
        const errors: { [key: string]: string } = {};

        if (!data.email.trim()) errors.email = 'Email is required';
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) errors.email = 'Invalid email format';

        // if (!password.trim()) errors.password = 'Password is required';
        // else if (password.trim().length < 8)
        //   errors.password = 'Password must be at least 8 characters';

        // if (!data.phone.trim()) errors.phone = 'Phone number is required';
        // else if (!/^\+\d+$/.test(data.phone.trim()))
        //   errors.phone = 'Phone number must start with + and contain digits';

        // ['address_line', 'street', 'city', 'state', 'pincode', 'country'].forEach((field) => {
        //   if (!(data as any)[field]?.trim())
        //     errors[field] = `${field.replace('_', ' ')} is required`;
        // });

        setValidationErrors(errors);
        return errors;
    };

    return { validationErrors, validateForm, setValidationErrors };
};

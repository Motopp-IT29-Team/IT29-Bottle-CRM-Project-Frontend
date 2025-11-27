import { useState } from 'react';
import { LeadFormData } from './useLeadFormData';

export interface ValidationErrors {
    account_name?: string;
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    source?: string;
    status?: string;
    [key: string]: string | undefined;
}

export function useLeadValidation() {
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePhone = (phone: string): boolean => {
        // Phone must start with + and have at least 10 digits
        const phoneRegex = /^\+[\d\s\-\(\)]+$/;
        return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
    };

    const validateForm = (formData: LeadFormData): ValidationErrors => {
        const errors: ValidationErrors = {};

        // Required: Company Name
        if (!formData.account_name || formData.account_name.trim() === '') {
            errors.account_name = 'Company name is required';
        }

        // Required: First Name
        if (!formData.first_name || formData.first_name.trim() === '') {
            errors.first_name = 'First name is required';
        }

        // Required: Job Title
        if (!formData.title || formData.title.trim() === '') {
            errors.title = 'Job Title is required';
        }

        // Required: Last Name
        if (!formData.last_name || formData.last_name.trim() === '') {
            errors.last_name = 'Last name is required';
        }

        // Required: Email
        if (!formData.email || formData.email.trim() === '') {
            errors.email = 'Email is required';
        } else if (!validateEmail(formData.email)) {
            errors.email = 'Please enter a valid email address';
        }

        // Required: Phone
        if (!formData.phone || formData.phone.trim() === '') {
            errors.phone = 'Phone number is required';
        } else if (!validatePhone(formData.phone)) {
            errors.phone = 'Phone must start with + and have at least 10 digits (e.g., +1234567890)';
        }

        // Required: Source
        if (!formData.source || formData.source.trim() === '') {
            errors.source = 'Lead source is required';
        }

        // Required: Status
        if (!formData.status || formData.status.trim() === '') {
            errors.status = 'Status is required';
        }

        // Optional: Website URL validation
        if (formData.website && formData.website.trim() !== '') {
            const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
            if (!urlRegex.test(formData.website)) {
                errors.website = 'Please enter a valid website URL';
            }
        }

        // Optional: Opportunity Amount validation (must be positive)
        if (formData.opportunity_amount && Number(formData.opportunity_amount) < 0) {
            errors.opportunity_amount = 'Amount must be a positive number';
        }

        // Optional: Probability validation (0-100)
        if (formData.probability < 0 || formData.probability > 100) {
            errors.probability = 'Probability must be between 0 and 100';
        }

        setValidationErrors(errors);
        return errors;
    };

    const validateField = (name: string, value: any): string | undefined => {
        let error: string | undefined;

        switch (name) {
            case 'account_name':
                if (!value || value.trim() === '') {
                    error = 'Company name is required';
                }
                break;
            case 'first_name':
                if (!value || value.trim() === '') {
                    error = 'First name is required';
                }
                break;
            case 'last_name':
                if (!value || value.trim() === '') {
                    error = 'Last name is required';
                }
                break;
            case 'email':
                if (!value || value.trim() === '') {
                    error = 'Email is required';
                } else if (!validateEmail(value)) {
                    error = 'Please enter a valid email address';
                }
                break;
            case 'phone':
                if (!value || value.trim() === '') {
                    error = 'Phone number is required';
                } else if (!validatePhone(value)) {
                    error = 'Phone must start with + and have at least 10 digits (e.g., +1234567890)';
                }
                break;
            case 'source':
                if (!value || value.trim() === '') {
                    error = 'Lead source is required';
                }
                break;
            case 'status':
                if (!value || value.trim() === '') {
                    error = 'Status is required';
                }
                break;
            case 'website':
                if (value && value.trim() !== '') {
                    const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
                    if (!urlRegex.test(value)) {
                        error = 'Please enter a valid website URL';
                    }
                }
                break;
            case 'opportunity_amount':
                if (value && Number(value) < 0) {
                    error = 'Amount must be a positive number';
                }
                break;
            case 'probability':
                if (value < 0 || value > 100) {
                    error = 'Probability must be between 0 and 100';
                }
                break;
        }

        setValidationErrors((prev) => ({
            ...prev,
            [name]: error,
        }));

        return error;
    };

    const clearErrors = () => {
        setValidationErrors({});
    };

    const clearFieldError = (fieldName: string) => {
        setValidationErrors((prev) => {
            const newErrors = { ...prev };
            delete newErrors[fieldName];
            return newErrors;
        });
    };

    return {
        validationErrors,
        validateForm,
        validateField,
        clearErrors,
        clearFieldError,
        setValidationErrors,
    };
}

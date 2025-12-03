import { LeadFormData } from '../services/leads.service';

const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePhone = (phone: string): boolean => {
    const phoneRegex = /^\+[\d\s\-\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateLeadForm = (formData: LeadFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.account_name || formData.account_name.trim() === '') {
        errors.account_name = 'Company name is required';
    }

    if (!formData.first_name || formData.first_name.trim() === '') {
        errors.first_name = 'First name is required';
    }

    if (!formData.title || formData.title.trim() === '') {
        errors.title = 'Job Title is required';
    }

    if (!formData.last_name || formData.last_name.trim() === '') {
        errors.last_name = 'Last name is required';
    }

    if (!formData.email || formData.email.trim() === '') {
        errors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
        errors.email = 'Please enter a valid email address';
    }

    if (!formData.phone || formData.phone.trim() === '') {
        errors.phone = 'Phone number is required';
    } else if (!validatePhone(formData.phone)) {
        errors.phone = 'Phone must start with + and have at least 10 digits (e.g., +1234567890)';
    }

    if (!formData.source || formData.source.trim() === '') {
        errors.source = 'Lead source is required';
    }

    if (!formData.status || formData.status.trim() === '') {
        errors.status = 'Status is required';
    }

    if (formData.website && formData.website.trim() !== '') {
        const urlRegex = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/;
        if (!urlRegex.test(formData.website)) {
            errors.website = 'Please enter a valid website URL';
        }
    }

    if (formData.opportunity_amount && Number(formData.opportunity_amount) < 0) {
        errors.opportunity_amount = 'Amount must be a positive number';
    }

    if (formData.probability < 0 || formData.probability > 100) {
        errors.probability = 'Probability must be between 0 and 100';
    }

    return errors;
};

export const validateLeadField = (name: string, value: any): string | undefined => {
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
        case 'title':
            if (!value || value.trim() === '') {
                error = 'Job Title is required';
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

    return error;
};

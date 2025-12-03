import { ContactFormData } from '../services/contacts.service';

const validateEmail = (email: string): boolean => {
    return /^\S+@\S+\.\S+$/.test(email);
};

const validatePhoneNumber = (phone: string): boolean => {
    return /^\+[\d\s\-\(\)]+$/.test(phone) && phone.replace(/\D/g, '').length >= 10;
};

export const validateContactForm = (formData: ContactFormData): Record<string, string> => {
    const errors: Record<string, string> = {};

    if (!formData.first_name || formData.first_name.trim() === '') {
        errors.first_name = 'First name is required';
    }

    if (!formData.last_name || formData.last_name.trim() === '') {
        errors.last_name = 'Last name is required';
    }

    if (!formData.organization || formData.organization.trim() === '') {
        errors.organization = 'Organization is required';
    }

    if (!formData.primary_email || formData.primary_email.trim() === '') {
        errors.primary_email = 'Primary email is required';
    } else if (!validateEmail(formData.primary_email)) {
        errors.primary_email = 'Please enter a valid email address';
    }

    if (formData.secondary_email && !validateEmail(formData.secondary_email)) {
        errors.secondary_email = 'Please enter a valid email address';
    }

    if (!formData.mobile_number || formData.mobile_number.trim() === '') {
        errors.mobile_number = 'Mobile number is required';
    } else if (!validatePhoneNumber(formData.mobile_number)) {
        errors.mobile_number = 'Please enter a valid phone number';
    }

    if (formData.secondary_number && !validatePhoneNumber(formData.secondary_number)) {
        errors.secondary_number = 'Please enter a valid phone number';
    }

    if (!formData.department || formData.department.trim() === '') {
        errors.department = 'Department is required';
    }

    if (!formData.language || formData.language.trim() === '') {
        errors.language = 'Language is required';
    }

    return errors;
};

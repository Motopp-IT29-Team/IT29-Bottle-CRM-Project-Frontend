import { CompanyFormData } from '../services/companies.service';

export interface CompanyValidationErrors {
    name?: string;
}

export const validateCompanyForm = (data: CompanyFormData): CompanyValidationErrors => {
    const errors: CompanyValidationErrors = {};

    // Name validation
    if (!data.name?.trim()) {
        errors.name = 'Company name is required';
    } else if (data.name.length > 64) {
        errors.name = 'Company name must be less than 64 characters';
    }

    return errors;
};

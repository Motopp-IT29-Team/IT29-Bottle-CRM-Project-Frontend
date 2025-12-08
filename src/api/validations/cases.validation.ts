import { CaseFormData } from '../services/cases.service';

export interface CaseValidationErrors {
    name?: string;
    account?: string;
    status?: string;
    priority?: string;
    case_type?: string;
    closed_on?: string;
    description?: string;
}

export const validateCaseForm = (data: CaseFormData): CaseValidationErrors => {
    const errors: CaseValidationErrors = {};

    if (!data.name?.trim()) {
        errors.name = 'Case name is required';
    } else if (data.name.length > 64) {
        errors.name = 'Case name must be less than 64 characters';
    }

    if (!data.account) {
        errors.account = 'Account is required';
    }

    if (!data.status) {
        errors.status = 'Status is required';
    }

    if (!data.priority) {
        errors.priority = 'Priority is required';
    }

    return errors;
};

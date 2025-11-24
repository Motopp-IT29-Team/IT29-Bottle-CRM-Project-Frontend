import { LeadFormData } from './useLeadFormData';
import { SERVER } from '../../services/ApiUrls';
import { LeadUrl } from '../../services/ApiUrls';

interface SubmitResult {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    data?: any;
}

export function useSubmitLead(resetForm: () => void) {
    const submitForm = async (formData: LeadFormData): Promise<SubmitResult> => {
        const token = localStorage.getItem('Token');
        const org = localStorage.getItem('org');

        const Header: Record<string, string> = {
            Accept: 'application/json',
        };

        if (token) {
            Header.Authorization = token;
        }

        if (org) {
            Header.org = org;
        }

        const formDataObj = new FormData();

        formDataObj.append('title', formData.title);
        formDataObj.append('first_name', formData.first_name);
        formDataObj.append('last_name', formData.last_name);
        formDataObj.append('account_name', formData.account_name);
        formDataObj.append('phone', formData.phone);
        formDataObj.append('email', formData.email);
        formDataObj.append('opportunity_amount', formData.opportunity_amount.toString());
        formDataObj.append('website', formData.website);
        formDataObj.append('description', formData.description);
        formDataObj.append('status', formData.status);
        formDataObj.append('source', formData.source);
        formDataObj.append('probability', formData.probability.toString());
        formDataObj.append('industry', formData.industry);
        formDataObj.append('skype_ID', formData.skype_ID);
        formDataObj.append('salutation', formData.salutation);
        formDataObj.append('department', formData.department);
        formDataObj.append('preferred_language', formData.preferred_language);
        formDataObj.append('rating', formData.rating);
        formDataObj.append('budget_range', formData.budget_range);
        formDataObj.append('decision_timeframe', formData.decision_timeframe);
        formDataObj.append('do_not_call', formData.do_not_call.toString());
        formDataObj.append('address_line', formData.address_line);
        formDataObj.append('street', formData.street);
        formDataObj.append('city', formData.city);
        formDataObj.append('state', formData.state);
        formDataObj.append('postcode', formData.postcode);
        formDataObj.append('country', formData.country);

        if (formData.actualFile) {
            formDataObj.append('lead_attachment', formData.actualFile);
        }

        formData.assigned_to.forEach((id) => formDataObj.append('assigned_to', id));
        formData.contacts.forEach((id) => formDataObj.append('contacts', id));
        formData.tags.forEach((tag) => formDataObj.append('tags', tag));

        try {
            const response = await fetch(`${SERVER}${LeadUrl}/`, {
                method: 'POST',
                headers: Header,
                body: formDataObj,
            });

            const data = await response.json();

            if (!response.ok) {
                return {
                    success: false,
                    error: data.message || 'Failed to create lead',
                    fieldErrors: data.errors || {},
                };
            }

            resetForm();
            return {
                success: true,
                data: data,
            };
        } catch (error: any) {
            return {
                success: false,
                error: error.message || 'An unexpected error occurred',
            };
        }
    };

    const checkDuplicate = async (email: string, phone: string): Promise<boolean> => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        try {
            const response = await fetch(
                `${SERVER}${LeadUrl}/check-duplicate/?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
                {
                    method: 'GET',
                    headers: Header as any,
                }
            );

            const data = await response.json();
            return data.duplicate || false;
        } catch (error) {
            console.error('Error checking duplicate:', error);
            return false;
        }
    };

    return {
        submitForm,
        checkDuplicate,
    };
}

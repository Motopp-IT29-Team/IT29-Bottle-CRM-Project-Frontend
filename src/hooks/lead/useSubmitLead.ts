import { LeadFormData } from './useLeadFormData';
import { fetchData } from '../../components/FetchData';
import { LeadUrl } from '../../services/ApiUrls';

interface SubmitResult {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
    data?: any;
}

export function useSubmitLead(resetForm: () => void) {
    const submitForm = async (formData: LeadFormData): Promise<SubmitResult> => {
        const Header = {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: localStorage.getItem('Token'),
            org: localStorage.getItem('org'),
        };

        const data = {
            title: formData.title,
            first_name: formData.first_name,
            last_name: formData.last_name,
            account_name: formData.account_name,
            phone: formData.phone,
            email: formData.email,
            lead_attachment: formData.file,
            opportunity_amount: formData.opportunity_amount,
            website: formData.website,
            description: formData.description,
            assigned_to: formData.assigned_to,
            contacts: formData.contacts,
            status: formData.status,
            source: formData.source,
            address_line: formData.address_line,
            street: formData.street,
            city: formData.city,
            state: formData.state,
            postcode: formData.postcode,
            country: formData.country,
            tags: formData.tags,
            probability: formData.probability,
            industry: formData.industry,
            skype_ID: formData.skype_ID,
        };

        try {
            const response = await fetchData(`${LeadUrl}/`, 'POST', JSON.stringify(data), Header);

            if (response.error) {
                return {
                    success: false,
                    error: response.error.message || 'Failed to create lead',
                    fieldErrors: response.errors || {},
                };
            }

            resetForm();
            return {
                success: true,
                data: response,
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
            const response = await fetchData(
                `${LeadUrl}/check-duplicate/?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`,
                'GET',
                null,
                Header
            );

            return response.isDuplicate || false;
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

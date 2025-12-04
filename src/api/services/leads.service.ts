import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { UploadedFile } from '../../components/ui/form';

export interface LeadFormData {
    first_name: string;
    last_name: string;
    title: string;
    phone: string;
    email: string;
    account_name: string;
    opportunity_amount: string;
    website: string;
    industry: string;
    status: string;
    source: string;
    probability: number;
    close_date: string;
    salutation: string;
    department: string;
    preferred_language: string;
    rating: string;
    budget_range: string;
    decision_timeframe: string;
    do_not_call: boolean;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
    description: string;
    attachments?: UploadedFile[] | null;
    assigned_to: Array<{ value: string; label: string }> | string[];
    contacts: string[];
    tags: string[];
}

export interface Lead {
    id: string;
    title: string;
    first_name: string;
    last_name: string;
    account_name: string;
    phone: string;
    email: string;
    status: string;
    source: string;
    created_at: string;
    country: string;
    tags: any[];
    created_by: {
        email: string;
        profile_pic: string;
    };
    website?: string;
    description?: string;
    status_display?: string;
    source_display?: string;
    industry?: string;
    industry_display?: string;
    probability: number;
    opportunity_amount?: string;
    salutation: string;
    salutation_display?: string;
    department?: string;
    department_display?: string;
    preferred_language?: string;
    preferred_language_display?: string;
    rating?: string;
    rating_display?: string;
    budget_range?: string;
    budget_range_display?: string;
    decision_timeframe?: string;
    decision_timeframe_display?: string;
    do_not_call?: boolean;
    address_line?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    close_date?: string;
    organization?: string;
    created_from_site?: boolean;
    assigned_to: any[];
    team?: any;
    // Conversion fields
    is_converted?: boolean;
    converted_at?: string;
    converted_by?: any;
    converted_account?: any;
    converted_contact?: any;
    converted_opportunity?: any;
}

export interface GetLeadsParams {
    offset?: number;
    limit?: number;
    status?: string;
    search?: string;
}

// Lead Conversion Types
export interface AccountOption {
    action: 'create' | 'link';
    existing_id?: string;
    name?: string;
}

export interface ContactOption {
    action: 'create' | 'link';
    existing_id?: string;
}

export interface OpportunityOption {
    create: boolean;
    name?: string;
    stage?: string;
    amount?: number;
    close_date?: string;
}

export interface LeadConversionRequest {
    account?: AccountOption;
    contact?: ContactOption;
    opportunity?: OpportunityOption;
}

export interface DuplicateMatch {
    id: string;
    name: string;
    email?: string;
    match_field: string;
    match_score: number;
}

export interface LeadDuplicateCheckResponse {
    account_matches: DuplicateMatch[];
    contact_matches: DuplicateMatch[];
}

export interface LeadConversionResponse {
    error: boolean;
    message: string;
    data: {
        success: boolean;
        message: string;
        lead: Lead;
        account: any;
        contact: any;
        opportunity: any;
    };
}

export interface GetLeadsResponse {
    open_leads: {
        open_leads: Lead[];
        leads_count: number;
        offset: number | null;
    };
    close_leads: {
        close_leads: Lead[];
        leads_count: number;
        offset: number;
    };
    contacts: any[];
    status: any[];
    source: any[];
    companies: any[];
    tags: any[];
    users: any[];
    countries: any[];
    industries: any[];
}

export const leadsService = {
    getAll: async (params?: GetLeadsParams) => {
        const queryParams = new URLSearchParams();

        if (params?.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.status) {
            queryParams.append('status', params.status);
        }
        if (params?.search) {
            queryParams.append('search', params.search);
        }

        const url = queryParams.toString() ? `${ENDPOINTS.LEADS}?${queryParams.toString()}` : ENDPOINTS.LEADS;

        const response = await apiClient.get(url);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(ENDPOINTS.LEAD_DETAIL(id));
        return response.data;
    },

    create: async (data: LeadFormData) => {
        const formData = new FormData();

        formData.append('title', data.title);
        formData.append('first_name', data.first_name);
        formData.append('last_name', data.last_name);
        formData.append('account_name', data.account_name);
        formData.append('phone', data.phone);
        formData.append('email', data.email);
        formData.append('close_date', data.close_date);
        formData.append('opportunity_amount', data.opportunity_amount.toString());
        formData.append('website', data.website);
        formData.append('description', data.description);
        formData.append('status', data.status);
        formData.append('source', data.source);
        formData.append('probability', data.probability.toString());
        formData.append('industry', data.industry);
        formData.append('salutation', data.salutation);
        formData.append('department', data.department);
        formData.append('preferred_language', data.preferred_language);
        formData.append('rating', data.rating);
        formData.append('budget_range', data.budget_range);
        formData.append('decision_timeframe', data.decision_timeframe);
        formData.append('do_not_call', data.do_not_call.toString());
        formData.append('address_line', data.address_line);
        formData.append('street', data.street);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('postcode', data.postcode);
        formData.append('country', data.country);

        if (data.attachments && data.attachments.length > 0) {
            data.attachments.forEach((fileObj) => {
                if (fileObj.isNew && fileObj.file) {
                    formData.append('lead_attachment', fileObj.file);
                }
            });
        }

        const assignedToIds = Array.isArray(data.assigned_to)
            ? data.assigned_to.map((item) => (typeof item === 'string' ? item : item.value))
            : [];
        assignedToIds.forEach((id) => formData.append('assigned_to', id));
        data.contacts.forEach((value) => formData.append('contacts', value));
        data.tags.forEach((tag) => formData.append('tags', tag));

        const response = await apiClient.post(ENDPOINTS.LEADS, formData);
        return response.data;
    },

    update: async (id: string, data: Partial<LeadFormData>) => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            const value = (data as any)[key];

            if (key === 'attachments') {
                if (value && value.length > 0) {
                    value.forEach((fileObj: UploadedFile) => {
                        if (fileObj.isNew && fileObj.file) {
                            formData.append('lead_attachment', fileObj.file);
                        }
                    });
                }
            } else if (key === 'assigned_to') {
                if (Array.isArray(value)) {
                    const assignedToIds = value.map((item) => (typeof item === 'string' ? item : item.value));
                    assignedToIds.forEach((id: string) => formData.append('assigned_to', id));
                }
            } else if (key === 'contacts' || key === 'tags') {
                if (Array.isArray(value)) {
                    value.forEach((item: string) => formData.append(key, item));
                }
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        const response = await apiClient.put(ENDPOINTS.LEAD_DETAIL(id), formData);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(ENDPOINTS.LEAD_DETAIL(id));
        return response.data;
    },

    checkDuplicate: async (email: string, phone: string) => {
        const response = await apiClient.get(
            `${ENDPOINTS.LEAD_DUPLICATE_CHECK}?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
        );
        return response.data;
    },

    addComment: async (id: string, comment: string) => {
        const response = await apiClient.post(ENDPOINTS.LEAD_DETAIL(id), { comment });
        return response.data;
    },

    deleteComment: async (commentId: string) => {
        const response = await apiClient.delete(ENDPOINTS.LEAD_COMMENT(commentId));
        return response.data;
    },

    uploadAttachment: async (id: string, file: File) => {
        const formData = new FormData();
        formData.append('lead_attachment', file);

        const response = await apiClient.post(ENDPOINTS.LEAD_ATTACHMENT(id), formData);
        return response.data;
    },

    deleteAttachment: async (attachmentId: string) => {
        const response = await apiClient.delete(ENDPOINTS.LEAD_ATTACHMENT_DELETE(attachmentId));
        return response.data;
    },

    // Lead Conversion Methods
    checkConversionDuplicates: async (id: string): Promise<LeadDuplicateCheckResponse> => {
        const response = await apiClient.get(ENDPOINTS.LEAD_CHECK_DUPLICATES(id));
        return response.data.data;
    },

    convert: async (id: string, options?: LeadConversionRequest): Promise<LeadConversionResponse> => {
        const response = await apiClient.post(ENDPOINTS.LEAD_CONVERT(id), options || {});
        return response.data;
    },
};

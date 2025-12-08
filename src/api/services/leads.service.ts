import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { UploadedFile } from '../../components/ui/form';
import {
    IAccount,
    IAttachment,
    IChoiceOption,
    IComment,
    ICompany,
    IContact,
    ILead,
    IOpportunity,
    IProfile,
    ITag,
    ITeam,
} from '../../types';

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
    assigned_to: string | null;
    contacts: string[];
    tags: string[];
}

export interface GetLeadsParams {
    offset?: number;
    limit?: number;
    status?: string;
    search?: string;
}

export interface ContactMinimal {
    id: string;
    first_name: string;
}

export interface UserMinimal {
    id: string;
    user__email: string;
    user__is_active: boolean;
}

export interface GetLeadsResponse {
    open_leads: {
        open_leads: ILead[];
        leads_count: number;
        offset: number | null;
    };
    close_leads: {
        close_leads: ILead[];
        leads_count: number;
        offset: number;
    };
    contacts: ContactMinimal[];
    status: IChoiceOption[];
    source: IChoiceOption[];
    companies: ICompany[];
    tags: ITag[];
    users: UserMinimal[];
    countries: IChoiceOption[];
    industries: IChoiceOption[];
    error?: boolean;
}

export interface AssignedData {
    id: string;
    name: string;
}

export interface UserMention {
    user__email: string;
}

export interface LeadDetailResponse {
    error: boolean;
    lead_obj: ILead;
    users: IProfile[];
    users_excluding_team: IProfile[];
    teams: ITeam[];
    countries: IChoiceOption[];
    status: IChoiceOption[];
    source: IChoiceOption[];
    lead_attachment: IAttachment[];
    comments: IComment[];
    users_mention: UserMention[];
    assigned_data: AssignedData[];
    attachments: IAttachment[];
}

export interface LeadCreateResponse {
    error: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface LeadUpdateResponse {
    error: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface LeadDeleteResponse {
    error: boolean;
    message?: string;
}

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
    error: boolean;
    duplicate?: boolean;
    data: {
        account_matches: DuplicateMatch[];
        contact_matches: DuplicateMatch[];
    };
}

export interface LeadConversionResponse {
    error: boolean;
    message: string;
    data: {
        success: boolean;
        message: string;
        lead: ILead;
        account: IAccount | null;
        contact: IContact | null;
        opportunity: IOpportunity | null;
    };
}

export interface CommentCreateResponse {
    error: boolean;
    message?: string;
}

export interface CommentDeleteResponse {
    error: boolean;
    message?: string;
}

export interface AttachmentUploadResponse {
    error: boolean;
    message?: string;
}

export interface AttachmentDeleteResponse {
    error: boolean;
    message?: string;
}

export const leadsService = {
    getAll: async (params?: GetLeadsParams): Promise<GetLeadsResponse> => {
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

        const response = await apiClient.get<GetLeadsResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<LeadDetailResponse> => {
        const response = await apiClient.get<LeadDetailResponse>(ENDPOINTS.LEAD_DETAIL(id));
        return response.data;
    },

    create: async (data: LeadFormData): Promise<LeadCreateResponse> => {
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

        if (data.assigned_to) {
            formData.append('assigned_to', data.assigned_to);
        }
        data.contacts.forEach((value) => formData.append('contacts', value));
        data.tags.forEach((tag) => formData.append('tags', tag));

        const response = await apiClient.post<LeadCreateResponse>(ENDPOINTS.LEADS, formData);
        return response.data;
    },

    update: async (id: string, data: Partial<LeadFormData>): Promise<LeadUpdateResponse> => {
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
                if (value) {
                    formData.append('assigned_to', value);
                }
            } else if (key === 'contacts' || key === 'tags') {
                if (Array.isArray(value)) {
                    value.forEach((item: string) => formData.append(key, item));
                }
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        const response = await apiClient.put<LeadUpdateResponse>(ENDPOINTS.LEAD_DETAIL(id), formData);
        return response.data;
    },

    delete: async (id: string): Promise<LeadDeleteResponse> => {
        const response = await apiClient.delete<LeadDeleteResponse>(ENDPOINTS.LEAD_DETAIL(id));
        return response.data;
    },

    checkDuplicate: async (email: string, phone: string): Promise<LeadDuplicateCheckResponse> => {
        const response = await apiClient.get<LeadDuplicateCheckResponse>(
            `${ENDPOINTS.LEAD_DUPLICATE_CHECK}?email=${encodeURIComponent(email)}&phone=${encodeURIComponent(phone)}`
        );
        return response.data;
    },

    addComment: async (id: string, comment: string): Promise<CommentCreateResponse> => {
        const response = await apiClient.post<CommentCreateResponse>(ENDPOINTS.LEAD_DETAIL(id), { comment });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<CommentDeleteResponse> => {
        const response = await apiClient.delete<CommentDeleteResponse>(ENDPOINTS.LEAD_COMMENT(commentId));
        return response.data;
    },

    uploadAttachment: async (id: string, file: File): Promise<AttachmentUploadResponse> => {
        const formData = new FormData();
        formData.append('lead_attachment', file);

        const response = await apiClient.post<AttachmentUploadResponse>(ENDPOINTS.LEAD_ATTACHMENT(id), formData);
        return response.data;
    },

    deleteAttachment: async (attachmentId: string): Promise<AttachmentDeleteResponse> => {
        const response = await apiClient.delete<AttachmentDeleteResponse>(
            ENDPOINTS.LEAD_ATTACHMENT_DELETE(attachmentId)
        );
        return response.data;
    },

    checkConversionDuplicates: async (id: string): Promise<LeadDuplicateCheckResponse> => {
        const response = await apiClient.get<LeadDuplicateCheckResponse>(ENDPOINTS.LEAD_CHECK_DUPLICATES(id));
        return response.data;
    },

    convert: async (id: string, options?: LeadConversionRequest): Promise<LeadConversionResponse> => {
        const response = await apiClient.post<LeadConversionResponse>(ENDPOINTS.LEAD_CONVERT(id), options || {});
        return response.data;
    },
};

import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import {
    IAccount,
    IAttachment,
    IComment,
    IContact,
    IProfile,
    ITeam,
    ITag,
    ILead,
    ICase,
    ITask,
    IInvoice,
    IOpportunity,
} from '../../types';

export interface AccountFormData {
    name: string;
    phone?: string;
    email?: string;
    billing_address_line?: string;
    billing_street?: string;
    billing_city?: string;
    billing_state?: string;
    billing_postcode?: string;
    billing_country?: string;
    website?: string;
    industry?: string;
    description?: string;
    status?: 'open' | 'close';
    lead?: string;
    contact_name?: string;
    contacts?: string[];
    teams?: string[];
    assigned_to?: string[];
    tags?: string[];
    account_attachment?: File | null;
}

export interface GetAccountsParams {
    offset?: number;
    limit?: number;
    name?: string;
    city?: string;
    industry?: string;
    tags?: string;
}

// Response types
export interface AccountsListResponse {
    error?: boolean;
    per_page: number;
    page_number: number[];
    active_accounts: {
        offset: number | null;
        open_accounts: IAccount[];
    };
    closed_accounts: {
        offset: number | null;
        close_accounts: IAccount[];
    };
    contacts: IContact[];
    teams: ITeam[];
    countries: [string, string][];
    industries: [string, string][];
    tags: ITag[];
    users: IProfile[];
    leads: ILead[];
    status: string[];
}

export interface AccountDetailResponse {
    error?: boolean;
    account_obj: IAccount;
    attachments: IAttachment[];
    comments: IComment[];
    contacts: IContact[];
    opportunity_list: IOpportunity[];
    users: IProfile[];
    cases: ICase[];
    teams: ITeam[];
    stages: [string, string][];
    sources: [string, string][];
    countries: [string, string][];
    currencies: [string, string][];
    case_types: [string, string][];
    case_priority: [string, string][];
    case_status: [string, string][];
    comment_permission: boolean;
    tasks: ITask[];
    invoices: IInvoice[];
    // emails: any[]; // IAccountEmail[] if needed
    users_mention: any[];
    leads: ILead[];
    status: string[];
}

export interface AccountCreateResponse {
    error?: boolean;
    message?: string;
}

export interface AccountUpdateResponse {
    error?: boolean;
    message?: string;
}

export interface AccountDeleteResponse {
    error?: boolean;
    message?: string;
}

export interface AccountCommentCreateResponse {
    error?: boolean;
    message?: string;
    account_obj: IAccount;
    attachments: IAttachment[];
    comments: IComment[];
}

export interface AccountCommentUpdateResponse {
    error?: boolean;
    message?: string;
}

export interface AccountCommentDeleteResponse {
    error?: boolean;
    message?: string;
}

export interface AccountAttachmentDeleteResponse {
    error?: boolean;
    message?: string;
}

export const accountsService = {
    getAll: async (params: GetAccountsParams = {}): Promise<AccountsListResponse> => {
        const queryParams = new URLSearchParams();

        if (params.offset !== undefined) queryParams.append('offset', params.offset.toString());
        if (params.limit !== undefined) queryParams.append('limit', params.limit.toString());
        if (params.name) queryParams.append('name', params.name);
        if (params.city) queryParams.append('city', params.city);
        if (params.industry) queryParams.append('industry', params.industry);
        if (params.tags) queryParams.append('tags', params.tags);

        const url = queryParams.toString() ? `${ENDPOINTS.ACCOUNTS}?${queryParams.toString()}` : ENDPOINTS.ACCOUNTS;

        const response = await apiClient.get<AccountsListResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<AccountDetailResponse> => {
        const response = await apiClient.get<AccountDetailResponse>(ENDPOINTS.ACCOUNT_DETAIL(id));
        return response.data;
    },

    create: async (data: AccountFormData): Promise<AccountCreateResponse> => {
        const formData = new FormData();

        formData.append('name', data.name);
        if (data.phone) formData.append('phone', data.phone);
        if (data.email) formData.append('email', data.email);
        if (data.billing_address_line) formData.append('billing_address_line', data.billing_address_line);
        if (data.billing_street) formData.append('billing_street', data.billing_street);
        if (data.billing_city) formData.append('billing_city', data.billing_city);
        if (data.billing_state) formData.append('billing_state', data.billing_state);
        if (data.billing_postcode) formData.append('billing_postcode', data.billing_postcode);
        if (data.billing_country) formData.append('billing_country', data.billing_country);
        if (data.website) formData.append('website', data.website);
        if (data.industry) formData.append('industry', data.industry);
        if (data.description) formData.append('description', data.description);
        if (data.status) formData.append('status', data.status);
        if (data.lead) formData.append('lead', data.lead);
        if (data.contact_name) formData.append('contact_name', data.contact_name);

        if (data.contacts && data.contacts.length > 0) {
            formData.append('contacts', JSON.stringify(data.contacts));
        }
        if (data.teams && data.teams.length > 0) {
            formData.append('teams', JSON.stringify(data.teams));
        }
        if (data.assigned_to && data.assigned_to.length > 0) {
            formData.append('assigned_to', JSON.stringify(data.assigned_to));
        }
        if (data.tags && data.tags.length > 0) {
            formData.append('tags', JSON.stringify(data.tags));
        }
        if (data.account_attachment) {
            formData.append('account_attachment', data.account_attachment);
        }

        const response = await apiClient.post<AccountCreateResponse>(ENDPOINTS.ACCOUNTS, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: string, data: AccountFormData): Promise<AccountUpdateResponse> => {
        const formData = new FormData();

        formData.append('name', data.name);
        if (data.phone) formData.append('phone', data.phone);
        if (data.email) formData.append('email', data.email);
        if (data.billing_address_line) formData.append('billing_address_line', data.billing_address_line);
        if (data.billing_street) formData.append('billing_street', data.billing_street);
        if (data.billing_city) formData.append('billing_city', data.billing_city);
        if (data.billing_state) formData.append('billing_state', data.billing_state);
        if (data.billing_postcode) formData.append('billing_postcode', data.billing_postcode);
        if (data.billing_country) formData.append('billing_country', data.billing_country);
        if (data.website) formData.append('website', data.website);
        if (data.industry) formData.append('industry', data.industry);
        if (data.description) formData.append('description', data.description);
        if (data.status) formData.append('status', data.status);
        if (data.lead) formData.append('lead', data.lead);
        if (data.contact_name) formData.append('contact_name', data.contact_name);

        if (data.contacts && data.contacts.length > 0) {
            formData.append('contacts', JSON.stringify(data.contacts));
        }
        if (data.teams && data.teams.length > 0) {
            formData.append('teams', JSON.stringify(data.teams));
        }
        if (data.assigned_to && data.assigned_to.length > 0) {
            formData.append('assigned_to', JSON.stringify(data.assigned_to));
        }
        if (data.tags && data.tags.length > 0) {
            formData.append('tags', JSON.stringify(data.tags));
        }
        if (data.account_attachment) {
            formData.append('account_attachment', data.account_attachment);
        }

        const response = await apiClient.put<AccountUpdateResponse>(ENDPOINTS.ACCOUNT_DETAIL(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: string): Promise<AccountDeleteResponse> => {
        const response = await apiClient.delete<AccountDeleteResponse>(ENDPOINTS.ACCOUNT_DETAIL(id));
        return response.data;
    },

    addComment: async (id: string, comment: string): Promise<AccountCommentCreateResponse> => {
        const response = await apiClient.post<AccountCommentCreateResponse>(ENDPOINTS.ACCOUNT_DETAIL(id), { comment });
        return response.data;
    },

    updateComment: async (commentId: string, comment: string): Promise<AccountCommentUpdateResponse> => {
        const response = await apiClient.put<AccountCommentUpdateResponse>(ENDPOINTS.ACCOUNT_COMMENT(commentId), {
            comment,
        });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<AccountCommentDeleteResponse> => {
        const response = await apiClient.delete<AccountCommentDeleteResponse>(ENDPOINTS.ACCOUNT_COMMENT(commentId));
        return response.data;
    },

    deleteAttachment: async (attachmentId: string): Promise<AccountAttachmentDeleteResponse> => {
        const response = await apiClient.delete<AccountAttachmentDeleteResponse>(
            ENDPOINTS.ACCOUNT_ATTACHMENT(attachmentId)
        );
        return response.data;
    },
};

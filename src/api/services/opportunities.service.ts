import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { UploadedFile } from '../../components/ui/form';
import { IAccount, IAttachment, IChoiceOption, IComment, IContact, IOpportunity, IProfile, ITag } from '../../types';

export interface OpportunityFormData {
    name: string;
    account: string;
    stage: string;
    currency: string;
    amount: string;
    lead_source: string;
    probability: number;
    budget_range: string;
    decision_timeframe: string;
    closed_on: string;
    description: string;
    contacts: string[];
    tags: string[];
    teams: string[];
    assigned_to: Array<{ value: string; label: string }> | string[];
    attachments?: UploadedFile[] | null;
}

export interface GetOpportunitiesParams {
    offset?: number;
    limit?: number;
    name?: string;
    account?: string;
    stage?: string;
    lead_source?: string;
    tags?: string;
}

export interface OpportunitiesListResponse {
    error?: boolean;
    opportunities: IOpportunity[];
    opportunities_count: number;
    offset: number | null;
    per_page: number;
    page_number: number[];
    accounts_list: IAccount[];
    contacts_list: IContact[];
    users: IProfile[];
    tags: ITag[];
    stage: IChoiceOption[];
    lead_source: IChoiceOption[];
    currency: IChoiceOption[];
}

export interface OpportunityDetailResponse {
    error?: boolean;
    opportunity_obj: IOpportunity;
    comments: IComment[];
    attachments: IAttachment[];
    contacts: IContact[];
    users: IProfile[];
    stage: IChoiceOption[];
    lead_source: IChoiceOption[];
    currency: IChoiceOption[];
    comment_permission: boolean;
    users_mention: Array<{ user__email: string }>;
}

export interface OpportunityCreateResponse {
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface OpportunityUpdateResponse {
    error?: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface OpportunityDeleteResponse {
    error?: boolean;
    message?: string;
}

export interface OpportunityCommentCreateResponse {
    error?: boolean;
    message?: string;
    opportunity_obj: IOpportunity;
    comments: IComment[];
    attachments: IAttachment[];
}

export interface OpportunityCommentUpdateResponse {
    error?: boolean;
    message?: string;
}

export interface OpportunityCommentDeleteResponse {
    error?: boolean;
    message?: string;
}

export interface OpportunityAttachmentDeleteResponse {
    error?: boolean;
    message?: string;
}

export const opportunitiesService = {
    getAll: async (params?: GetOpportunitiesParams): Promise<OpportunitiesListResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.offset !== undefined) {
            queryParams.append('offset', params.offset.toString());
        }
        if (params?.limit !== undefined) {
            queryParams.append('limit', params.limit.toString());
        }
        if (params?.name) {
            queryParams.append('name', params.name);
        }
        if (params?.account) {
            queryParams.append('account', params.account);
        }
        if (params?.stage) {
            queryParams.append('stage', params.stage);
        }
        if (params?.lead_source) {
            queryParams.append('lead_source', params.lead_source);
        }
        if (params?.tags) {
            queryParams.append('tags', params.tags);
        }

        const url = queryParams.toString()
            ? `${ENDPOINTS.OPPORTUNITIES}?${queryParams.toString()}`
            : ENDPOINTS.OPPORTUNITIES;

        const response = await apiClient.get<OpportunitiesListResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<OpportunityDetailResponse> => {
        const response = await apiClient.get<OpportunityDetailResponse>(ENDPOINTS.OPPORTUNITY_DETAIL(id));
        return response.data;
    },

    create: async (data: OpportunityFormData): Promise<OpportunityCreateResponse> => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('account', data.account);
        formData.append('stage', data.stage);
        formData.append('currency', data.currency);
        formData.append('amount', data.amount.toString());
        formData.append('lead_source', data.lead_source);
        formData.append('probability', data.probability.toString());
        if (data.closed_on) {
            formData.append('due_date', data.closed_on);
        }
        formData.append('description', data.description);

        if (data.attachments && data.attachments.length > 0) {
            data.attachments.forEach((fileObj) => {
                if (fileObj.isNew && fileObj.file) {
                    formData.append('opportunity_attachment', fileObj.file);
                }
            });
        }

        const assignedToIds = Array.isArray(data.assigned_to)
            ? data.assigned_to.map((item) => (typeof item === 'string' ? item : item.value))
            : [];
        assignedToIds.forEach((id) => formData.append('assigned_to', id));

        data.contacts.forEach((id) => formData.append('contacts', id));
        data.tags.forEach((tag) => formData.append('tags', tag));
        data.teams.forEach((id) => formData.append('teams', id));

        const response = await apiClient.post<OpportunityCreateResponse>(ENDPOINTS.OPPORTUNITIES, formData);
        return response.data;
    },

    update: async (id: string, data: Partial<OpportunityFormData>): Promise<OpportunityUpdateResponse> => {
        const formData = new FormData();

        Object.keys(data).forEach((key) => {
            const value = (data as any)[key];

            if (key === 'attachments') {
                if (value && value.length > 0) {
                    value.forEach((fileObj: UploadedFile) => {
                        if (fileObj.isNew && fileObj.file) {
                            formData.append('opportunity_attachment', fileObj.file);
                        }
                    });
                }
            } else if (key === 'assigned_to') {
                if (Array.isArray(value)) {
                    const assignedToIds = value.map((item) => (typeof item === 'string' ? item : item.value));
                    assignedToIds.forEach((id: string) => formData.append('assigned_to', id));
                }
            } else if (key === 'contacts' || key === 'tags' || key === 'teams') {
                if (Array.isArray(value)) {
                    value.forEach((item: string) => formData.append(key, item));
                }
            } else if (key === 'closed_on') {
                if (value) {
                    formData.append('due_date', value);
                }
            } else if (value !== undefined && value !== null) {
                formData.append(key, value.toString());
            }
        });

        const response = await apiClient.put<OpportunityUpdateResponse>(ENDPOINTS.OPPORTUNITY_DETAIL(id), formData);
        return response.data;
    },

    delete: async (id: string): Promise<OpportunityDeleteResponse> => {
        const response = await apiClient.delete<OpportunityDeleteResponse>(ENDPOINTS.OPPORTUNITY_DETAIL(id));
        return response.data;
    },

    addComment: async (id: string, comment: string): Promise<OpportunityCommentCreateResponse> => {
        const response = await apiClient.post<OpportunityCommentCreateResponse>(ENDPOINTS.OPPORTUNITY_DETAIL(id), {
            comment,
        });
        return response.data;
    },

    updateComment: async (commentId: string, comment: string): Promise<OpportunityCommentUpdateResponse> => {
        const response = await apiClient.put<OpportunityCommentUpdateResponse>(
            ENDPOINTS.OPPORTUNITY_COMMENT(commentId),
            { comment }
        );
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<OpportunityCommentDeleteResponse> => {
        const response = await apiClient.delete<OpportunityCommentDeleteResponse>(
            ENDPOINTS.OPPORTUNITY_COMMENT(commentId)
        );
        return response.data;
    },

    deleteAttachment: async (attachmentId: string): Promise<OpportunityAttachmentDeleteResponse> => {
        const response = await apiClient.delete<OpportunityAttachmentDeleteResponse>(
            ENDPOINTS.OPPORTUNITY_ATTACHMENT(attachmentId)
        );
        return response.data;
    },
};

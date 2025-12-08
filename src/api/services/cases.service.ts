import { ENDPOINTS } from '../endpoints';
import { ICase } from '../../types';
import { apiClient } from '../client';

export interface CaseFormData {
    name: string;
    account: string;
    status: string;
    priority: string;
    case_type?: string;
    closed_on?: string;
    description?: string;
    contacts?: string[];
    assigned_to?: string[];
    teams?: string[];
    case_attachment?: File;
}

export interface GetCasesParams {
    offset?: number;
    limit?: number;
    name?: string;
    status?: string;
    priority?: string;
    account?: string;
}

export interface CasesListResponse {
    error?: boolean;
    cases_count: number;
    offset: number | null;
    cases: ICase[];
    status: Array<[string, string]>;
    priority: Array<[string, string]>;
    type_of_case: Array<[string, string]>;
    accounts_list: any[];
    contacts_list: any[];
}

export interface CaseDetailResponse {
    error?: boolean;
    cases_obj: ICase;
    attachments: any[];
    comments: any[];
    contacts: any[];
    status: Array<[string, string]>;
    priority: Array<[string, string]>;
    type_of_case: Array<[string, string]>;
    comment_permission: boolean;
    users_mention: any[];
}

export interface CaseCreateResponse {
    error?: boolean;
    message: string;
}

export interface CaseUpdateResponse {
    error?: boolean;
    message: string;
}

export interface CaseDeleteResponse {
    error?: boolean;
    message: string;
}

export interface CaseCommentCreateResponse {
    error?: boolean;
    cases_obj: ICase;
    attachments: any[];
    comments: any[];
}

export interface CaseCommentUpdateResponse {
    error?: boolean;
    message: string;
}

export interface CaseCommentDeleteResponse {
    error?: boolean;
    message: string;
}

export interface CaseAttachmentDeleteResponse {
    error?: boolean;
    message: string;
}

export const casesService = {
    getAll: async (params?: GetCasesParams): Promise<CasesListResponse> => {
        const queryParams = new URLSearchParams();

        if (params?.offset !== undefined) queryParams.append('offset', params.offset.toString());
        if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
        if (params?.name) queryParams.append('name', params.name);
        if (params?.status) queryParams.append('status', params.status);
        if (params?.priority) queryParams.append('priority', params.priority);
        if (params?.account) queryParams.append('account', params.account);

        const url = queryParams.toString() ? `${ENDPOINTS.CASES}?${queryParams.toString()}` : ENDPOINTS.CASES;

        const response = await apiClient.get<CasesListResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<CaseDetailResponse> => {
        const response = await apiClient.get<CaseDetailResponse>(ENDPOINTS.CASE_DETAIL(id));
        return response.data;
    },

    create: async (data: CaseFormData): Promise<CaseCreateResponse> => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('account', data.account);
        formData.append('status', data.status);
        formData.append('priority', data.priority);

        if (data.case_type) formData.append('case_type', data.case_type);
        if (data.closed_on) formData.append('closed_on', data.closed_on);
        if (data.description) formData.append('description', data.description);

        if (data.contacts && data.contacts.length > 0) {
            data.contacts.forEach((id) => formData.append('contacts', id));
        }

        if (data.assigned_to && data.assigned_to.length > 0) {
            data.assigned_to.forEach((id) => formData.append('assigned_to', id));
        }

        if (data.teams && data.teams.length > 0) {
            data.teams.forEach((id) => formData.append('teams', id));
        }

        if (data.case_attachment) {
            formData.append('case_attachment', data.case_attachment);
        }

        const response = await apiClient.post<CaseCreateResponse>(ENDPOINTS.CASES, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    update: async (id: string, data: CaseFormData): Promise<CaseUpdateResponse> => {
        const formData = new FormData();

        formData.append('name', data.name);
        formData.append('account', data.account);
        formData.append('status', data.status);
        formData.append('priority', data.priority);

        if (data.case_type) formData.append('case_type', data.case_type);
        if (data.closed_on) formData.append('closed_on', data.closed_on);
        if (data.description) formData.append('description', data.description);

        if (data.contacts && data.contacts.length > 0) {
            data.contacts.forEach((id) => formData.append('contacts', id));
        }

        if (data.assigned_to && data.assigned_to.length > 0) {
            data.assigned_to.forEach((id) => formData.append('assigned_to', id));
        }

        if (data.teams && data.teams.length > 0) {
            data.teams.forEach((id) => formData.append('teams', id));
        }

        if (data.case_attachment) {
            formData.append('case_attachment', data.case_attachment);
        }

        const response = await apiClient.put<CaseUpdateResponse>(ENDPOINTS.CASE_DETAIL(id), formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    delete: async (id: string): Promise<CaseDeleteResponse> => {
        const response = await apiClient.delete<CaseDeleteResponse>(ENDPOINTS.CASE_DETAIL(id));
        return response.data;
    },

    addComment: async (caseId: string, comment: string): Promise<CaseCommentCreateResponse> => {
        const response = await apiClient.post<CaseCommentCreateResponse>(ENDPOINTS.CASE_DETAIL(caseId), { comment });
        return response.data;
    },

    updateComment: async (commentId: string, comment: string): Promise<CaseCommentUpdateResponse> => {
        const response = await apiClient.put<CaseCommentUpdateResponse>(ENDPOINTS.CASE_COMMENT(commentId), { comment });
        return response.data;
    },

    deleteComment: async (commentId: string): Promise<CaseCommentDeleteResponse> => {
        const response = await apiClient.delete<CaseCommentDeleteResponse>(ENDPOINTS.CASE_COMMENT(commentId));
        return response.data;
    },

    deleteAttachment: async (attachmentId: string): Promise<CaseAttachmentDeleteResponse> => {
        const response = await apiClient.delete<CaseAttachmentDeleteResponse>(ENDPOINTS.CASE_ATTACHMENT(attachmentId));
        return response.data;
    },
};

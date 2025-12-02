import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export interface UserFormData {
    first_name: string;
    last_name: string;
    role: string;
    date_of_joining: string;
    address_line?: string;
    street?: string;
    city?: string;
    state?: string;
    postcode?: string;
    country?: string;
    is_active?: boolean;
    email: string;
    password?: string;
}

export interface User {
    id: string;
    first_name: string;
    last_name: string;
    role: string;
    address?: any;
    date_of_joining: string;
    created_by_email?: string;
    created_at: string;
    updated_by_email?: string;
    updated_at: string;
    deactivated_by_email?: string;
    deactivated_at?: string;
    user_details: {
        email: string;
        profile_pic?: string;
        is_active: boolean;
    };
}

export interface GetUsersParams {
    offset?: number;
    limit?: number;
    status?: 'active' | 'inactive';
}

export const usersService = {
    getAll: async (params?: GetUsersParams) => {
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

        const url = queryParams.toString() ? `${ENDPOINTS.USERS}?${queryParams.toString()}` : ENDPOINTS.USERS;

        const response = await apiClient.get(url);
        return response.data;
    },

    getById: async (id: string) => {
        const response = await apiClient.get(ENDPOINTS.USER_DETAIL(id));
        return response.data;
    },

    create: async (data: UserFormData) => {
        const response = await apiClient.post(ENDPOINTS.USERS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<UserFormData>) => {
        const response = await apiClient.put(ENDPOINTS.USER_DETAIL(id), data);
        return response.data;
    },

    delete: async (id: string) => {
        const response = await apiClient.delete(ENDPOINTS.USER_DETAIL(id));
        return response.data;
    },

    resendInvitation: async (id: string) => {
        const response = await apiClient.post(ENDPOINTS.USER_RESEND_INVITATION(id));
        return response.data;
    },

    toggleStatus: async (id: string) => {
        const response = await apiClient.post(ENDPOINTS.USER_TOGGLE_STATUS(id));
        return response.data;
    },
};

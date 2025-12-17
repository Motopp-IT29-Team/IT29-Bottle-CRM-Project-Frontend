import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { IUser } from '../../types';

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
    can_view_others_activity_logs?: boolean;
    email: string;
    password?: string;
}

export interface GetUsersParams {
    offset?: number;
    limit?: number;
    status?: 'active' | 'inactive';
}

export interface UsersListResponse {
    users: IUser[];
    total_count: number;
    status: string;
    error?: boolean;
}

export interface UserDetailResponse {
    error: boolean;
    data: {
        profile_obj: IUser;
        opportunity_list: any[];
        contacts: any[];
        cases: any[];
        assigned_data: any[];
        comments: any[];
        countries: [string, string][];
    };
}

export interface UserCreateResponse {
    error: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface UserUpdateResponse {
    error: boolean;
    message?: string;
    errors?: Record<string, string[]>;
}

export interface UserDeleteResponse {
    error: boolean;
    message?: string;
}

export interface UserInvitationResponse {
    error: boolean;
    message?: string;
}

export interface UserStatusToggleResponse {
    error: boolean;
    message?: string;
}

export const usersService = {
    getAll: async (params?: GetUsersParams): Promise<UsersListResponse> => {
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

        const response = await apiClient.get<UsersListResponse>(url);
        return response.data;
    },

    getById: async (id: string): Promise<UserDetailResponse> => {
        const response = await apiClient.get<UserDetailResponse>(ENDPOINTS.USER_DETAIL(id));
        return response.data;
    },

    create: async (data: UserFormData): Promise<UserCreateResponse> => {
        const response = await apiClient.post<UserCreateResponse>(ENDPOINTS.USERS, data);
        return response.data;
    },

    update: async (id: string, data: Partial<UserFormData>): Promise<UserUpdateResponse> => {
        const response = await apiClient.put<UserUpdateResponse>(ENDPOINTS.USER_DETAIL(id), data);
        return response.data;
    },

    delete: async (id: string): Promise<UserDeleteResponse> => {
        const response = await apiClient.delete<UserDeleteResponse>(ENDPOINTS.USER_DETAIL(id));
        return response.data;
    },

    resendInvitation: async (id: string): Promise<UserInvitationResponse> => {
        const response = await apiClient.post<UserInvitationResponse>(ENDPOINTS.USER_RESEND_INVITATION(id));
        return response.data;
    },

    toggleStatus: async (id: string): Promise<UserStatusToggleResponse> => {
        const response = await apiClient.post<UserStatusToggleResponse>(ENDPOINTS.USER_TOGGLE_STATUS(id));
        return response.data;
    },
};

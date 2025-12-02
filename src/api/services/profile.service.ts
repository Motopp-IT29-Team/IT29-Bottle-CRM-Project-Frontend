import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export interface UserDetail {
    first_name?: string;
    last_name?: string;
    role?: string;
    user_details?: {
        email?: string;
        profile_pic?: string;
    };
}

export interface ProfileResponse {
    user_obj: UserDetail;
    current_org?: {
        name?: string;
    };
}

export const profileService = {
    getProfile: async () => {
        const response = await apiClient.get(ENDPOINTS.PROFILE);
        return response.data as ProfileResponse;
    },
};

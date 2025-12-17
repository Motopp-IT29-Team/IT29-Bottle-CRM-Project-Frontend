import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';

export interface ActivityLog {
    id: string;
    user_email: string;
    user_role: string;
    action: string;
    action_display: string;
    entity_type: string;
    entity_type_display: string;
    entity_id: string;
    entity_name: string;
    details: Record<string, any> | null;
    created_at: string;
    created_on_arrow: string;
}

export interface GetActivityLogsParams {
    user?: string;
    user_id?: string;
    action?: string;
    entity_type?: string;
    date_from?: string;
    date_to?: string;
    limit?: number;
    offset?: number;
}

export interface GetActivityLogsResponse {
    error: boolean;
    total_count: number;
    logs: ActivityLog[];
    can_view_others?: boolean;
    viewing_mode?: 'own' | 'all';
}

export const activityLogsService = {
    getAll: async (params?: GetActivityLogsParams): Promise<GetActivityLogsResponse> => {
        const queryParams = new URLSearchParams();
        
        if (params?.user) queryParams.append('user', params.user);
        if (params?.user_id) queryParams.append('user_id', params.user_id);
        if (params?.action) queryParams.append('action', params.action);
        if (params?.entity_type) queryParams.append('entity_type', params.entity_type);
        if (params?.date_from) queryParams.append('date_from', params.date_from);
        if (params?.date_to) queryParams.append('date_to', params.date_to);
        if (params?.limit) queryParams.append('limit', params.limit.toString());
        if (params?.offset) queryParams.append('offset', params.offset.toString());
        
        const queryString = queryParams.toString();
        const url = queryString ? `${ENDPOINTS.ACTIVITY_LOGS}?${queryString}` : ENDPOINTS.ACTIVITY_LOGS;
        
        const response = await apiClient.get(url);
        return response.data;
    },
};

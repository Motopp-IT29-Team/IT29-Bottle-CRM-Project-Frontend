import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { IDashboardResponse } from '../../types';

export const dashboardService = {
    /**
     * Get dashboard data including stats and recent items
     */
    async getDashboard(): Promise<IDashboardResponse> {
        console.log('Calling dashboard API:', ENDPOINTS.DASHBOARD);
        const response = await apiClient.get<IDashboardResponse>(ENDPOINTS.DASHBOARD);
        console.log('Dashboard API full response:', response);
        console.log('Dashboard API response.data:', response.data);
        return response.data;
    },
};

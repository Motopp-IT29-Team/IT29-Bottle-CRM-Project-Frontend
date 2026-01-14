import { apiClient } from '../client';
import { ENDPOINTS } from '../endpoints';
import { IDashboardResponse } from '../../types';

export const dashboardService = {
    /**
     * Get dashboard data including stats and recent items
     */
    async getDashboard(): Promise<IDashboardResponse> {
        const response = await apiClient.get<IDashboardResponse>(ENDPOINTS.DASHBOARD);

        return response.data;
    },
};

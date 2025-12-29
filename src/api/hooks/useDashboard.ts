import { useState, useCallback } from 'react';
import { dashboardService } from '../services/dashboard.service';
import { ApiResult } from '../types';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { IDashboardResponse } from '../../types';

export const useDashboard = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [dashboardData, setDashboardData] = useState<IDashboardResponse | null>(null);
    const { addNotification } = useNotification();

    const getDashboard = useCallback(async (): Promise<ApiResult<IDashboardResponse>> => {
        setIsLoading(true);
        try {
            const data = await dashboardService.getDashboard();
            console.log('Dashboard API response:', data);

            if (data && !('error' in data)) {
                setDashboardData(data);
                return { success: true, data };
            } else {
                console.error('Dashboard API error:', data);
                return {
                    success: false,
                    error: 'Failed to load dashboard data',
                };
            }
        } catch (error: any) {
            console.error('Dashboard API exception:', error);
            addNotification('error', 'Server Error', error.message || 'Failed to load dashboard');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    }, [addNotification]);

    const refetch = useCallback(() => {
        return getDashboard();
    }, [getDashboard]);

    return {
        isLoading,
        dashboardData,
        getDashboard,
        refetch,
    };
};

import { useState, useCallback } from 'react';
import {
    activityLogsService,
    ActivityLog,
    GetActivityLogsParams,
    GetActivityLogsResponse,
} from '../services/activityLogs.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';

export const useActivityLogs = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
    const [totalCount, setTotalCount] = useState(0);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetActivityLogsParams): Promise<ApiResult<GetActivityLogsResponse>> => {
            setIsLoading(true);
            try {
                const data = await activityLogsService.getAll(params);

                if (!data.error) {
                    setActivityLogs(data.logs || []);
                    setTotalCount(data.total_count || 0);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load activity logs'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                console.error('Critical error loading activity logs:', error);
                addNotification('error', 'Server Error', error.message || 'Failed to load activity logs');
                return {
                    success: false,
                    error: error.message || 'Server error occurred',
                };
            } finally {
                setIsLoading(false);
            }
        },
        [addNotification]
    );

    const refetch = useCallback(
        (params?: GetActivityLogsParams) => {
            return getAll(params);
        },
        [getAll]
    );

    return {
        isLoading,
        activityLogs,
        totalCount,
        getAll,
        refetch,
    };
};

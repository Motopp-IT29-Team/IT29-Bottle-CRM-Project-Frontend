import { renderHook, waitFor } from '@testing-library/react';
import { useActivityLogs } from './useActivityLogs';
import { activityLogsService } from '../services/activityLogs.service';

// Mock the service
jest.mock('../services/activityLogs.service');
jest.mock('../../components/ui/notification/NotificationContext', () => ({
    useNotification: () => ({
        addNotification: jest.fn(),
    }),
}));

const mockActivityLogsService = activityLogsService as jest.Mocked<typeof activityLogsService>;

describe('useActivityLogs', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should initialize with default values', () => {
        const { result } = renderHook(() => useActivityLogs());

        expect(result.current.isLoading).toBe(false);
        expect(result.current.activityLogs).toEqual([]);
        expect(result.current.totalCount).toBe(0);
        expect(result.current.canViewOthers).toBe(false);
        expect(result.current.viewingMode).toBe('own');
    });

    it('should fetch activity logs successfully', async () => {
        const mockResponse = {
            error: false,
            total_count: 2,
            can_view_others: true,
            viewing_mode: 'all' as const,
            logs: [
                {
                    id: '1',
                    user_email: 'user@example.com',
                    user_role: 'USER',
                    action: 'CREATE',
                    action_display: 'Create',
                    entity_type: 'Lead',
                    entity_type_display: 'Lead',
                    entity_id: '123',
                    entity_name: 'Test Lead',
                    details: {},
                    created_at: '2024-01-01T10:00:00Z',
                    created_on_arrow: '1 hour ago',
                },
            ],
        };

        mockActivityLogsService.getAll.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useActivityLogs());

        await waitFor(async () => {
            const response = await result.current.getAll();
            expect(response.success).toBe(true);
        });

        await waitFor(() => {
            expect(result.current.activityLogs).toHaveLength(1);
            expect(result.current.totalCount).toBe(2);
            expect(result.current.canViewOthers).toBe(true);
            expect(result.current.viewingMode).toBe('all');
        });
    });

    it('should set canViewOthers to false when user can only view own logs', async () => {
        const mockResponse = {
            error: false,
            total_count: 1,
            can_view_others: false,
            viewing_mode: 'own' as const,
            logs: [
                {
                    id: '1',
                    user_email: 'user@example.com',
                    user_role: 'USER',
                    action: 'LOGIN',
                    action_display: 'Login',
                    entity_type: 'System',
                    entity_type_display: 'System',
                    entity_id: '',
                    entity_name: 'User Login',
                    details: {},
                    created_at: '2024-01-01T10:00:00Z',
                    created_on_arrow: '1 hour ago',
                },
            ],
        };

        mockActivityLogsService.getAll.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useActivityLogs());

        await waitFor(async () => {
            await result.current.getAll();
        });

        await waitFor(() => {
            expect(result.current.canViewOthers).toBe(false);
            expect(result.current.viewingMode).toBe('own');
        });
    });

    it('should handle errors gracefully', async () => {
        const mockError = new Error('Network error');
        mockActivityLogsService.getAll.mockRejectedValue(mockError);

        const { result } = renderHook(() => useActivityLogs());

        await result.current.getAll();

        // Error handling is done internally via notification context
        expect(mockActivityLogsService.getAll).toHaveBeenCalled();
    });

    it('should pass filters to service', async () => {
        const mockResponse = {
            error: false,
            total_count: 0,
            can_view_others: true,
            viewing_mode: 'all' as const,
            logs: [],
        };

        mockActivityLogsService.getAll.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useActivityLogs());

        const params = {
            action: 'CREATE',
            entity_type: 'Lead',
            date_from: '2024-01-01',
            date_to: '2024-01-31',
            user_id: 'user-123',
            limit: 20,
            offset: 0,
        };

        await result.current.getAll(params);

        expect(mockActivityLogsService.getAll).toHaveBeenCalledWith(params);
    });

    it('should set loading state during fetch', async () => {
        const mockResponse = {
            error: false,
            total_count: 0,
            can_view_others: false,
            viewing_mode: 'own' as const,
            logs: [],
        };

        let resolvePromise: (value: any) => void;
        const promise = new Promise((resolve) => {
            resolvePromise = resolve;
        });

        mockActivityLogsService.getAll.mockReturnValue(promise as any);

        const { result } = renderHook(() => useActivityLogs());

        const fetchPromise = result.current.getAll();

        // Should be loading
        expect(result.current.isLoading).toBe(true);

        // Resolve the promise
        resolvePromise!(mockResponse);
        await fetchPromise;

        // Should no longer be loading
        await waitFor(() => {
            expect(result.current.isLoading).toBe(false);
        });
    });

    it('should refetch with same params', async () => {
        const mockResponse = {
            error: false,
            total_count: 0,
            can_view_others: false,
            viewing_mode: 'own' as const,
            logs: [],
        };

        mockActivityLogsService.getAll.mockResolvedValue(mockResponse);

        const { result } = renderHook(() => useActivityLogs());

        const params = { action: 'CREATE' };
        await result.current.refetch(params);

        expect(mockActivityLogsService.getAll).toHaveBeenCalledWith(params);
    });
});

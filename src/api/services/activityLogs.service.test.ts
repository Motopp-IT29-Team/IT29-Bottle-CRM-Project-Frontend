import { activityLogsService, GetActivityLogsParams } from './activityLogs.service';
import { apiClient } from '../client';

jest.mock('../client');

const mockApiClient = apiClient as jest.Mocked<typeof apiClient>;

describe('activityLogsService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should fetch all activity logs without filters', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 5,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const result = await activityLogsService.getAll();

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/activity-logs/');
        expect(result).toEqual(mockResponse.data);
    });

    it('should fetch activity logs with action filter', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 2,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            action: 'CREATE',
        };

        await activityLogsService.getAll(params);

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/activity-logs/?action=CREATE');
    });

    it('should fetch activity logs with user_id filter', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 3,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            user_id: 'user-123',
        };

        await activityLogsService.getAll(params);

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/activity-logs/?user_id=user-123');
    });

    it('should fetch activity logs with multiple filters', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 1,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            action: 'UPDATE',
            entity_type: 'Lead',
            date_from: '2024-01-01',
            date_to: '2024-01-31',
            user_id: 'user-456',
            limit: 20,
            offset: 40,
        };

        await activityLogsService.getAll(params);

        expect(mockApiClient.get).toHaveBeenCalledWith(
            '/api/activity-logs/?action=UPDATE&entity_type=Lead&date_from=2024-01-01&date_to=2024-01-31&user_id=user-456&limit=20&offset=40'
        );
    });

    it('should fetch activity logs with pagination', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 100,
                can_view_others: false,
                viewing_mode: 'own',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            limit: 25,
            offset: 50,
        };

        await activityLogsService.getAll(params);

        expect(mockApiClient.get).toHaveBeenCalledWith('/api/activity-logs/?limit=25&offset=50');
    });

    it('should handle date range filters', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 10,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            date_from: '2024-01-01',
            date_to: '2024-12-31',
        };

        await activityLogsService.getAll(params);

        expect(mockApiClient.get).toHaveBeenCalledWith(
            '/api/activity-logs/?date_from=2024-01-01&date_to=2024-12-31'
        );
    });

    it('should ignore undefined parameters', async () => {
        const mockResponse = {
            data: {
                error: false,
                total_count: 5,
                can_view_others: true,
                viewing_mode: 'all',
                logs: [],
            },
        };

        mockApiClient.get.mockResolvedValue(mockResponse);

        const params: GetActivityLogsParams = {
            action: 'CREATE',
            user_id: undefined,
            entity_type: undefined,
        };

        await activityLogsService.getAll(params);

        // Should only include action, not undefined params
        expect(mockApiClient.get).toHaveBeenCalledWith('/api/activity-logs/?action=CREATE');
    });
});

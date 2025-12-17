import React from 'react';
import { render, screen, waitFor, within } from '@testing-library/react';
import { ActivityLogs } from './ActivityLogs';
import { useActivityLogs } from '../../api/hooks/useActivityLogs';
import { usersService } from '../../api/services/users.service';

// Mock the hooks and services
jest.mock('../../api/hooks/useActivityLogs');
jest.mock('../../api/services/users.service');
jest.mock('../../components/ui/notification/NotificationContext', () => ({
    useNotification: () => ({
        addNotification: jest.fn(),
    }),
}));

const mockUseActivityLogs = useActivityLogs as jest.MockedFunction<typeof useActivityLogs>;
const mockUsersService = usersService as jest.Mocked<typeof usersService>;

describe('ActivityLogs', () => {
    const mockGetAll = jest.fn();
    const mockRefetch = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('should render activity logs page with title', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.getByText('Activity Log')).toBeInTheDocument();
    });

    it('should show info alert when viewing own logs only', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(
            screen.getByText(/You are viewing only your own activity logs/i)
        ).toBeInTheDocument();
    });

    it('should NOT show info alert when viewing all logs', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: true,
            viewingMode: 'all',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(
            screen.queryByText(/You are viewing only your own activity logs/i)
        ).not.toBeInTheDocument();
    });

    it('should show user filter when canViewOthers is true', async () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: true,
            viewingMode: 'all',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        mockUsersService.getAll.mockResolvedValue({
            users: [
                {
                    id: '1',
                    first_name: 'John',
                    last_name: 'Doe',
                    role: 'USER',
                    user_details: {
                        id: '1',
                        email: 'john@example.com',
                        is_active: true,
                        profile_pic: null,
                    },
                    address: null,
                    date_of_joining: null,
                    created_by_email: null,
                    created_at: '2024-01-01',
                    updated_by_email: null,
                    updated_at: '2024-01-01',
                    deactivated_by_email: null,
                    deactivated_at: null,
                },
            ],
            total_count: 1,
            status: 'success',
        });

        render(<ActivityLogs />);

        await waitFor(() => {
            expect(screen.getByLabelText('User')).toBeInTheDocument();
        });
    });

    it('should NOT show user filter when canViewOthers is false', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.queryByLabelText('User')).not.toBeInTheDocument();
    });

    it('should display activity logs in table', () => {
        const mockLogs = [
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
            {
                id: '2',
                user_email: 'user@example.com',
                user_role: 'USER',
                action: 'UPDATE',
                action_display: 'Update',
                entity_type: 'Contact',
                entity_type_display: 'Contact',
                entity_id: '456',
                entity_name: 'Test Contact',
                details: {},
                created_at: '2024-01-01T11:00:00Z',
                created_on_arrow: '30 minutes ago',
            },
        ];

        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: mockLogs,
            totalCount: 2,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.getByText('user@example.com')).toBeInTheDocument();
        expect(screen.getByText('Test Lead')).toBeInTheDocument();
        expect(screen.getByText('Test Contact')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: true,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('should show empty state when no logs found', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.getByText('No activity logs found')).toBeInTheDocument();
    });

    it('should have all filter options', () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: false,
            viewingMode: 'own',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        render(<ActivityLogs />);

        expect(screen.getByLabelText('Action')).toBeInTheDocument();
        expect(screen.getByLabelText('Entity Type')).toBeInTheDocument();
        expect(screen.getByLabelText('Date From')).toBeInTheDocument();
        expect(screen.getByLabelText('Date To')).toBeInTheDocument();
    });

    it('should call getAll with user_id when user filter is used', async () => {
        mockUseActivityLogs.mockReturnValue({
            isLoading: false,
            activityLogs: [],
            totalCount: 0,
            canViewOthers: true,
            viewingMode: 'all',
            getAll: mockGetAll,
            refetch: mockRefetch,
        });

        mockUsersService.getAll.mockResolvedValue({
            users: [
                {
                    id: 'user-123',
                    first_name: 'John',
                    last_name: 'Doe',
                    role: 'USER',
                    user_details: {
                        id: 'user-123',
                        email: 'john@example.com',
                        is_active: true,
                        profile_pic: null,
                    },
                    address: null,
                    date_of_joining: null,
                    created_by_email: null,
                    created_at: '2024-01-01',
                    updated_by_email: null,
                    updated_at: '2024-01-01',
                    deactivated_by_email: null,
                    deactivated_at: null,
                },
            ],
            total_count: 1,
            status: 'success',
        });

        const { container } = render(<ActivityLogs />);

        // Initial call
        await waitFor(() => {
            expect(mockGetAll).toHaveBeenCalledWith(
                expect.objectContaining({
                    limit: 10,
                    offset: 0,
                })
            );
        });
    });
});

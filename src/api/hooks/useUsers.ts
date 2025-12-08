import { useState, useCallback } from 'react';
import { usersService, UserFormData, GetUsersParams, UsersListResponse } from '../services/users.service';
import { ApiResult } from '../types';
import { parseApiErrors, formatErrorMessage } from '../errors';
import { useNotification } from '../../components/ui/notification/NotificationContext';
import { IUser } from '../../types';

export const useUsers = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [users, setUsers] = useState<IUser[]>([]);
    const { addNotification } = useNotification();

    const getAll = useCallback(
        async (params?: GetUsersParams): Promise<ApiResult<UsersListResponse>> => {
            setIsLoading(true);
            try {
                const data = await usersService.getAll(params);

                if (!data.error) {
                    setUsers(data.users || []);
                    return { success: true, data };
                } else {
                    const fieldErrors = parseApiErrors(data as any);
                    return {
                        success: false,
                        error: formatErrorMessage(fieldErrors, 'Failed to load users'),
                        fieldErrors,
                    };
                }
            } catch (error: any) {
                addNotification('error', 'Server Error', error.message || 'Failed to load users');
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
        (params?: GetUsersParams) => {
            return getAll(params);
        },
        [getAll]
    );

    const getById = async (id: string): Promise<ApiResult<IUser>> => {
        setIsLoading(true);
        try {
            const data = await usersService.getById(id);

            if (!data.error) {
                const userData = data.data?.profile_obj || data;
                return { success: true, data: userData };
            } else {
                const fieldErrors = parseApiErrors(data);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to load user'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to load user');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const create = async (formData: UserFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await usersService.create(formData);

            if (!data.error) {
                addNotification('success', 'User created', 'The user has been created successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to create user');
                addNotification('error', 'Failed to create user', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to create user');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const update = async (id: string, formData: Partial<UserFormData>): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await usersService.update(id, formData);

            if (!data.error) {
                addNotification('success', 'User updated', 'The user has been updated successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to update user');
                addNotification('error', 'Failed to update user', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to update user');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await usersService.delete(id);

            if (!data.error) {
                addNotification('success', 'User deleted', 'The user has been deleted successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to delete user');
                addNotification('error', 'Failed to delete user', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to delete user');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const resendInvitation = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await usersService.resendInvitation(id);

            if (!data.error) {
                addNotification('success', 'Invitation sent', 'The invitation has been resent successfully');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to resend invitation');
                addNotification('error', 'Failed to resend invitation', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to resend invitation');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const toggleStatus = async (id: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const data = await usersService.toggleStatus(id);

            if (!data.error) {
                addNotification('success', 'Status changed', 'User status has been updated');
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(data);
                const errorMessage = formatErrorMessage(fieldErrors, 'Failed to change user status');
                addNotification('error', 'Failed to change status', errorMessage);
                return {
                    success: false,
                    error: errorMessage,
                    fieldErrors,
                };
            }
        } catch (error: any) {
            addNotification('error', 'Server Error', error.message || 'Failed to change user status');
            return {
                success: false,
                error: error.message || 'Server error occurred',
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        users,
        getAll,
        refetch,
        getById,
        create,
        update,
        deleteUser,
        resendInvitation,
        toggleStatus,
    };
};

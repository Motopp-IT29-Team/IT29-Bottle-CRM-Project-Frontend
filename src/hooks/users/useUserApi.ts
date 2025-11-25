import { useState } from 'react';
import { fetchData } from '../../components/FetchData';
import { UsersUrl, UserUrl } from '../../services/ApiUrls';
import { formatErrorMessage, parseApiErrors } from '../../utils/errorFormatter';
import { FormErrors } from '../../components/ui/form';

interface ApiResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: FormErrors;
}

interface UserFormData {
    email: string;
    first_name: string;
    last_name: string;
    role: string;
    password?: string;
    is_active?: boolean;
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

interface User {
    id: string;
    first_name: string;
    last_name: string;
    user_details: {
        email: string;
        id: string;
        is_active: boolean;
        profile_pic?: string;
    };
    role: string;
}

interface UserDetails {
    first_name: string;
    last_name: string;
    user_details: {
        email: string;
        is_active: boolean;
        profile_pic?: string;
    };
    role: string;
    address: {
        address_line: string;
        street: string;
        city: string;
        state: string;
        postcode: string;
        country: string;
    };
    date_of_joining: string;
    is_active: boolean;
    created_by_email?: string;
    created_at?: string;
    updated_by_email?: string;
    updated_at?: string;
    deactivated_by_email?: string;
    deactivated_at?: string;
}

interface UsersListParams {
    offset: number;
    limit: number;
    status?: 'active' | 'inactive';
}

export const useUserApi = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getUsers = async (params: UsersListParams): Promise<ApiResult<{ users: User[]; total_count: number }>> => {
        setIsLoading(true);
        try {
            const { offset, limit, status } = params;
            const res = await fetchData(
                `${UsersUrl}/?offset=${offset}&limit=${limit}&status=${status}`,
                'GET',
                null as any,
                getAuthHeaders()
            );

            if (!res.error) {
                return {
                    success: true,
                    data: {
                        users: res?.users || [],
                        total_count: res?.total_count || 0,
                    },
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch users',
                };
            }
        } catch (error: any) {
            console.error('Error fetching users:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const getUser = async (userId: string): Promise<ApiResult<UserDetails>> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'GET', null as any, getAuthHeaders());

            if (!res.error) {
                const data = res?.data?.profile_obj;
                return {
                    success: true,
                    data: {
                        first_name: data?.first_name || '',
                        last_name: data?.last_name || '',
                        user_details: {
                            email: data?.user_details?.email || '',
                            is_active: data?.user_details?.is_active ?? true,
                            profile_pic: data?.user_details?.profile_pic,
                        },
                        role: data?.role || 'ADMIN',
                        address: {
                            address_line: data?.address?.address_line || '',
                            street: data?.address?.street || '',
                            city: data?.address?.city || '',
                            state: data?.address?.state || '',
                            postcode: data?.address?.postcode || '',
                            country: data?.address?.country || '',
                        },
                        date_of_joining: data?.date_of_joining || '',
                        is_active: data?.user_details?.is_active ?? true,
                        created_by_email: data?.created_by_email,
                        created_at: data?.created_at,
                        updated_by_email: data?.updated_by_email,
                        updated_at: data?.updated_at,
                        deactivated_by_email: data?.deactivated_by_email,
                        deactivated_at: data?.deactivated_at,
                    },
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch user data',
                };
            }
        } catch (error: any) {
            console.error('Error fetching user:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const createUser = async (formData: UserFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${UsersUrl}/`, 'POST', JSON.stringify(formData), getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(res);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to create user'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Error creating user:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const updateUser = async (userId: string, formData: UserFormData): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'PUT', JSON.stringify(formData), getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                const fieldErrors = parseApiErrors(res);
                return {
                    success: false,
                    error: formatErrorMessage(fieldErrors, 'Failed to update user'),
                    fieldErrors,
                };
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const deleteUser = async (userId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'DELETE', null as any, getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Failed to delete user',
                };
            }
        } catch (error: any) {
            console.error('Error deleting user:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const toggleUserStatus = async (userId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/status/`, 'POST', null as any, getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: res.message || 'Failed to change user status',
                };
            }
        } catch (error: any) {
            console.error('Error toggling user status:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    const resendInvitation = async (userId: string): Promise<ApiResult> => {
        setIsLoading(true);
        try {
            const res = await fetchData(
                `${UserUrl}/${userId}/resend-invitation/`,
                'POST',
                null as any,
                getAuthHeaders()
            );

            if (!res.error) {
                return { success: true };
            } else {
                return {
                    success: false,
                    error: 'Failed to resend invitation',
                };
            }
        } catch (error: any) {
            console.error('Error resending invitation:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsLoading(false);
        }
    };

    return {
        isLoading,
        getUsers,
        getUser,
        createUser,
        updateUser,
        deleteUser,
        toggleUserStatus,
        resendInvitation,
    };
};

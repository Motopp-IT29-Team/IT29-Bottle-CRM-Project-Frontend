import { useState } from 'react';
import { fetchData } from '../../components/FetchData';
import { UserUrl } from '../../services/ApiUrls';

interface FormData {
    email: string;
    role: string;
    address_line: string;
    street: string;
    city: string;
    state: string;
    pincode: string;
    country: string;
}

interface EditUserResult {
    success: boolean;
    error?: string;
    fieldErrors?: Record<string, string[]>;
}

export const useEditUser = () => {
    const [isSubmitting, setIsSubmitting] = useState(false);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getUserData = async (userId: string) => {
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'GET', null as any, getAuthHeaders());
            if (!res.error) {
                const data = res?.data?.profile_obj;
                return {
                    success: true,
                    data: {
                        email: data?.user_details?.email || '',
                        role: data?.role || 'ADMIN',
                        address_line: data?.address?.address_line || '',
                        street: data?.address?.street || '',
                        city: data?.address?.city || '',
                        state: data?.address?.state || '',
                        pincode: data?.address?.postcode || '',
                        country: data?.address?.country || '',
                        is_active: data?.user_details?.is_active ?? true,
                    },
                };
            } else {
                return { success: false, error: 'Failed to fetch user data' };
            }
        } catch (error) {
            console.error('Error fetching user:', error);
            return { success: false, error: 'Network error' };
        }
    };

    const updateUser = async (userId: string, formData: FormData, password?: string): Promise<EditUserResult> => {
        const data = {
            ...formData,
            ...(password && password.trim().length > 0 ? { password: password.trim() } : {}),
        };

        setIsSubmitting(true);
        try {
            const res = await fetchData(`${UserUrl}/${userId}/`, 'PUT', JSON.stringify(data), getAuthHeaders());

            if (!res.error) {
                return { success: true };
            } else {
                const allErrors = {
                    ...res?.errors?.profile_errors,
                    ...res?.errors?.user_errors,
                    ...res?.errors?.address_errors,
                };

                // Форматуємо помилки
                const errorMessages: string[] = [];
                Object.keys(allErrors).forEach((key) => {
                    if (Array.isArray(allErrors[key])) {
                        errorMessages.push(...allErrors[key]);
                    }
                });

                return {
                    success: false,
                    error: errorMessages.join('. ') || 'Failed to update user',
                    fieldErrors: allErrors,
                };
            }
        } catch (error: any) {
            console.error('Error updating user:', error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleUserStatus = async (userId: string, isActive: boolean): Promise<EditUserResult> => {
        const endpoint = isActive ? 'deactivate' : 'activate';

        try {
            const res = await fetchData(`${UserUrl}/${userId}/status/`, 'POST', null as any, getAuthHeaders());

            if (!res.error) {
                return {
                    success: true,
                };
            } else {
                return {
                    success: false,
                    error: res.message || `Failed to ${endpoint} user`,
                };
            }
        } catch (error: any) {
            console.error(`Error ${endpoint} user:`, error);
            return {
                success: false,
                error: error.message || 'Network error',
            };
        }
    };

    return {
        getUserData,
        updateUser,
        toggleUserStatus,
        isSubmitting,
    };
};

import { useState } from 'react';
import { fetchData } from '../../components/FetchData';
import { ContactUrl } from '../../services/ApiUrls';
import { FormErrors } from '../../components/ui/form';

interface ApiResult<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    fieldErrors?: FormErrors;
}

export interface Contact {
    id: string;
}

interface Params {
    offset?: number;
    limit?: number;
}

export const useContactsApi = () => {
    const [isLoading, setIsLoading] = useState(false);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getContacts = async (params: Params): Promise<ApiResult<{ contacts: Contact[]; total_count: number }>> => {
        setIsLoading(true);
        try {
            const { offset, limit } = params;
            const res = await fetchData(
                `${ContactUrl}/?offset=${offset}&limit=${limit}`,
                'GET',
                null as any,
                getAuthHeaders()
            );

            if (!res.error) {
                return {
                    success: true,
                    data: {
                        contacts: res?.contacts || [],
                        total_count: res?.total_count || 0,
                    },
                };
            } else {
                return {
                    success: false,
                    error: 'Failed to fetch contacts',
                };
            }
        } catch (error: any) {
            console.error('Error fetching contacts:', error);
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
        getContacts,
    };
};

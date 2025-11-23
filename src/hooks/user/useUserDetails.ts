import { useState, useEffect } from 'react';
import { fetchData } from '../../components/FetchData';
import { UserUrl } from '../../services/ApiUrls';

interface UserDetailsResponse {
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

export const useUserDetails = (userId: string | null) => {
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null);
    const [isResending, setIsResending] = useState(false);

    const getAuthHeaders = () => ({
        Accept: 'application/json',
        'Content-Type': 'application/json',
        Authorization: localStorage.getItem('Token'),
        org: localStorage.getItem('org'),
    });

    const getUserDetail = async (id: string) => {
        setLoading(true);
        try {
            const res = await fetchData(`${UserUrl}/${id}/`, 'GET', null as any, getAuthHeaders());
            if (!res.error) {
                setUserDetails(res?.data?.profile_obj);
                return true;
            }
            return false;
        } catch (error) {
            console.error('Error fetching user details:', error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    const resendInvitation = async () => {
        if (!userId) return false;

        setIsResending(true);
        try {
            const response = await fetchData(
                `${UserUrl}/${userId}/resend-invitation/`,
                'POST',
                null as any,
                getAuthHeaders()
            );

            if (!response.error) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            return false;
        } finally {
            setIsResending(false);
        }
    };

    useEffect(() => {
        if (userId) {
            void getUserDetail(userId);
        }
    }, [userId]);

    return {
        loading,
        userDetails,
        isResending,
        resendInvitation,
        refreshUser: () => userId && getUserDetail(userId),
    };
};

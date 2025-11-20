import { useState, useEffect } from 'react';
import { fetchData } from '../../components/FetchData';
import { UserUrl } from '../../services/ApiUrls';

interface UserDetailsResponse {
    user_details: {
        email: string;
        is_active: boolean;
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
}

type SnackbarState = {
    open: boolean;
    message: string;
    severity: 'success' | 'error' | 'info';
};

export const useUserDetails = (userId: string | null) => {
    const [loading, setLoading] = useState(true);
    const [userDetails, setUserDetails] = useState<UserDetailsResponse | null>(null);
    const [isResending, setIsResending] = useState(false);
    const [snackbar, setSnackbar] = useState<SnackbarState>({
        open: false,
        message: '',
        severity: 'success',
    });

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
                setSnackbar({
                    open: true,
                    message: 'Invitation sent successfully!',
                    severity: 'success',
                });
                return true;
            } else {
                setSnackbar({
                    open: true,
                    message: response.message || 'Failed to send invitation. Please try again.',
                    severity: 'error',
                });
                return false;
            }
        } catch (error) {
            setSnackbar({
                open: true,
                message: 'Failed to send invitation. Please try again.',
                severity: 'error',
            });
            return false;
        } finally {
            setIsResending(false);
        }
    };

    const closeSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
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
        snackbar,
        resendInvitation,
        closeSnackbar,
        refreshUser: () => userId && getUserDetail(userId),
    };
};

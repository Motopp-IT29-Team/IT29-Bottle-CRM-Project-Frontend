import React from 'react';
import { Box, CircularProgress, Typography, Snackbar, Alert } from '@mui/material';
import { ModernAppBar, AppBarAction } from '../../components/ModernAppBar';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
    USER_DETAILS_PAGE_STYLES,
    USER_DETAILS_CONTAINER_STYLES,
    USER_DETAILS_LOADING_CONTAINER_STYLES,
    USER_DETAILS_LOADING_TEXT_STYLES,
    USER_DETAILS_LOADING_SPINNER_STYLES,
} from '../../styles/UsersStyles';
import { UserProfileHeader } from '../../components/users/details/UserProfileHeader';
import { UserInfoSection } from '../../components/users/details/UserInfoSection';
import { UserAddressSection } from '../../components/users/details/UserAddressSection';
import { useUserDetails } from '../../hooks/user/useUserDetails';

export default function UserDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');

    const { loading, userDetails, isResending, snackbar, resendInvitation, closeSnackbar } = useUserDetails(userId);

    const handleBack = () => navigate('/app/users');
    const handleEdit = () => navigate(`/app/users/edit-user?id=${userId}`);

    if (!userId) {
        navigate('/app/users');
        return null;
    }

    if (loading) {
        return (
            <Box sx={USER_DETAILS_LOADING_CONTAINER_STYLES}>
                <CircularProgress size={40} sx={USER_DETAILS_LOADING_SPINNER_STYLES} />
                <Typography sx={USER_DETAILS_LOADING_TEXT_STYLES}>Loading user details...</Typography>
            </Box>
        );
    }

    if (!userDetails) {
        navigate('/app/users');
        return null;
    }

    const actions: AppBarAction[] = [{ type: 'back', label: 'Back To Users', onClick: handleBack }];

    actions.push({
        type: 'edit',
        onClick: handleEdit,
    });

    return (
        <Box sx={USER_DETAILS_PAGE_STYLES}>
            <ModernAppBar module="Users" crntPage="User Details" actions={actions} />

            <Box sx={USER_DETAILS_CONTAINER_STYLES}>
                <UserProfileHeader
                    email={userDetails.user_details.email}
                    role={userDetails.role}
                    isActive={userDetails.user_details.is_active}
                    onResendInvitation={!userDetails.user_details.is_active ? resendInvitation : undefined}
                    isResending={isResending}
                />

                <UserInfoSection
                    email={userDetails.user_details.email}
                    role={userDetails.role}
                    dateOfJoining={userDetails.date_of_joining}
                />

                <UserAddressSection address={userDetails.address} />
            </Box>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={closeSnackbar}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
            >
                <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Box>
    );
}

import React, { useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
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
import { DeleteModal } from '../../components/DeleteModal';
import { useUsers } from '../../hooks/user/useUsers';
import { useNotification } from '../../context/NotificationContext';
import { UserActivitySection } from '../../components/users/details/UserActivitySection';

export function UserDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const [deleteModal, setDeleteModal] = useState(false);

    const { addNotification } = useNotification();
    const { deleteUser } = useUsers();
    const { isLoading, userDetails, isResending, resendInvitation } = useUserDetails(userId);

    const handleBack = () => navigate('/app/users');
    const handleEdit = () => navigate(`/app/users/edit-user?id=${userId}`);

    if (!userId) {
        navigate('/app/users');
        return null;
    }

    if (isLoading) {
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

    const openDeleteModal = () => {
        setDeleteModal(true);
    };

    const modalClose = () => {
        setDeleteModal(false);
    };

    const handleDeleteUser = async () => {
        const success = await deleteUser(userId);
        if (success) {
            navigate('/app/users');
            addNotification('success', `User deleted`, `The user has been deleted`);
            modalClose();
        } else {
            addNotification('error', 'Failed to delete user');
        }
    };

    const handleResendInvitation = async () => {
        const success = await resendInvitation();
        if (success) {
            addNotification('success', `Resend invitation`, `The invitation has been resend`);
            modalClose();
        } else {
            addNotification('error', 'Failed to resend invitation');
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
        { type: 'delete', onClick: openDeleteModal },
    ];

    return (
        <Box sx={USER_DETAILS_PAGE_STYLES}>
            <ModernAppBar module="Users" crntPage="User Details" actions={actions} />

            <Box sx={USER_DETAILS_CONTAINER_STYLES}>
                <UserProfileHeader
                    firstName={userDetails.first_name}
                    lastName={userDetails.last_name}
                    email={userDetails.user_details.email}
                    role={userDetails.role}
                    profilePic={userDetails.user_details.profile_pic}
                    isActive={userDetails.user_details.is_active}
                    onResendInvitation={!userDetails.user_details.is_active ? handleResendInvitation : undefined}
                    isResending={isResending}
                />

                <UserInfoSection
                    email={userDetails.user_details.email}
                    role={userDetails.role}
                    dateOfJoining={userDetails.date_of_joining}
                />

                <UserAddressSection address={userDetails.address} />

                <UserActivitySection
                    createdByEmail={userDetails.created_by_email}
                    createdAt={userDetails.created_at}
                    updatedByEmail={userDetails.updated_by_email}
                    updatedAt={userDetails.updated_at}
                    deactivatedByEmail={userDetails.deactivated_by_email}
                    deactivatedAt={userDetails.deactivated_at}
                    isActive={userDetails.user_details.is_active}
                />
            </Box>

            <DeleteModal
                onClose={modalClose}
                open={deleteModal}
                id={userId}
                modalDialog="Are you sure you want to delete this user?"
                modalTitle="Delete User"
                buttonName="Delete"
                onClick={handleDeleteUser}
            />
        </Box>
    );
}

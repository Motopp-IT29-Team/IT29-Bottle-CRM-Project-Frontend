import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { IModernAppBar, AppBarAction, ILoadingState, ErrorState, IActionModal } from '../../components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserProfileHeader } from '../../components/users/details/UserProfileHeader';
import { UserInfoSection } from '../../components/users/details/UserInfoSection';
import { UserActivitySection } from '../../components/users/details/UserActivitySection';
import { useUsers } from '../../api';
import { routes } from '../../constants/routes';
import { IUser } from '../../types';

export function UserDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const { getById, deleteUser, resendInvitation, isLoading } = useUsers();

    const [deleteModal, setDeleteModal] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [userDetails, setUserDetails] = useState<IUser | null>(null);

    useEffect(() => {
        if (!userId) {
            navigate(routes.users.main);
            return;
        }
        fetchUserData();
    }, [userId, navigate]);

    const fetchUserData = async () => {
        if (!userId) return;

        const result = await getById(userId);

        if (result.success && result.data) {
            setUserDetails(result.data);
        } else {
            navigate(routes.users.main);
        }
    };

    const handleBack = () => navigate(routes.users.main);
    const handleEdit = () => navigate(`${routes.users.edit}?id=${userId}`);

    const openDeleteModal = () => {
        setDeleteModal(true);
    };

    const modalClose = () => {
        setDeleteModal(false);
    };

    const handleDeleteUser = async () => {
        if (!userId) return;

        const result = await deleteUser(userId);
        if (result.success) {
            navigate(routes.users.main);
            modalClose();
        }
    };

    const handleResendInvitation = async () => {
        if (!userId) return;

        setIsResending(true);
        await resendInvitation(userId);
        setIsResending(false);
    };

    if (isLoading) {
        return <ILoadingState message="Loading..." />;
    }

    if (!userId || !userDetails) {
        return <ErrorState message="Error loading user data. Please try again." />;
    }

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Users', onClick: handleBack },
        { type: 'edit', onClick: handleEdit },
        { type: 'delete', onClick: openDeleteModal },
    ];

    return (
        <Box>
            <IModernAppBar module="Users" crntPage="User Details" actions={actions} />

            <Box sx={{ p: 3, mx: 'auto' }}>
                <UserProfileHeader
                    user={userDetails}
                    onResendInvitation={!userDetails.user_details.is_active ? handleResendInvitation : undefined}
                    isResending={isResending}
                />

                <UserInfoSection
                    email={userDetails.user_details.email}
                    role={userDetails.role}
                    dateOfJoining={userDetails.date_of_joining}
                />

                <UserActivitySection user={userDetails} />
            </Box>

            <IActionModal
                open={deleteModal}
                onClose={modalClose}
                onConfirm={handleDeleteUser}
                variant="warning"
                title="Delete User?"
                message="Are you sure you want to delete this user?"
                confirmText="Delete"
                cancelText="Cancel"
            />
        </Box>
    );
}

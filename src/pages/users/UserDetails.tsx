import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import { ModernAppBar, AppBarAction, LoadingState, ErrorState } from '../../components/ui';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { UserProfileHeader } from '../../components/users/details/UserProfileHeader';
import { UserInfoSection } from '../../components/users/details/UserInfoSection';
import { UserAddressSection } from '../../components/users/details/UserAddressSection';
import { UserActivitySection } from '../../components/users/details/UserActivitySection';
import { DeleteModal } from '../../components/DeleteModal';
import { useUsers, User } from '../../api';
import { routes } from '../../constants/routes';

export function UserDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const userId = searchParams.get('id');
    const { getById, deleteUser, resendInvitation, isLoading } = useUsers();

    const [deleteModal, setDeleteModal] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const [userDetails, setUserDetails] = useState<User | null>(null);

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
        return <LoadingState message="Loading user details..." />;
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
        <Box sx={{ mt: '60px', backgroundColor: '#f9fafb' }}>
            <ModernAppBar module="Users" crntPage="User Details" actions={actions} />

            <Box sx={{ mt: '120px', p: '24px', mx: 'auto' }}>
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

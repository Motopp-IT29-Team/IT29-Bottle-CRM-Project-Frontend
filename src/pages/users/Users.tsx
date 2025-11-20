import React, { useState, SyntheticEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Container } from '@mui/material';
import { UsersTable } from '../../components/users/UsersTable';
import { UsersToolbar } from '../../components/users/UsersToolbar';
import { useUsers } from '../../hooks/user/useUsers';

export default function Users() {
    const navigate = useNavigate();
    const [tab, setTab] = useState<'active' | 'inactive'>('active');

    const {
        loading,
        currentUsers,
        currentPage,
        totalPages,
        recordsPerPage,
        handleRecordsPerPage,
        handlePreviousPage,
        handleNextPage,
    } = useUsers(tab);

    const handleChangeTab = (e: SyntheticEvent, val: 'active' | 'inactive') => {
        if (val) setTab(val);
    };

    const navigateToUserDetail = (userId: string) => {
        navigate(`/app/users/user-details?id=${userId}`);
    };

    const navigateToAddUser = () => {
        if (!loading) navigate('/app/users/add-users');
    };

    return (
        <Box sx={{ mt: '60px' }}>
            <UsersToolbar
                tab={tab}
                onTabChange={handleChangeTab}
                currentPage={currentPage}
                totalPages={totalPages}
                recordsPerPage={recordsPerPage}
                onRecordsPerPageChange={handleRecordsPerPage}
                onPreviousPage={handlePreviousPage}
                onNextPage={handleNextPage}
                onAddUser={navigateToAddUser}
                loading={loading}
            />

            <Container sx={{ maxWidth: '100%', px: 3, py: 3 }}>
                <UsersTable users={currentUsers} loading={loading} tab={tab} onViewDetail={navigateToUserDetail} />
            </Container>
        </Box>
    );
}

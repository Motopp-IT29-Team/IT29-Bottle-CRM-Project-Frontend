import React, { SyntheticEvent } from 'react';
import { Tabs, Button, Stack } from '@mui/material';
import { FiPlus } from '@react-icons/all-files/fi/FiPlus';
import { UsersPagination } from './UsersPagination';
import { CustomTab, CustomToolbar } from '../../styles/CssStyled';
import { USERS_ADD_BUTTON_STYLES, USERS_TAB_STYLES } from '../../styles/UsersStyles';

interface UsersToolbarProps {
    tab: 'active' | 'inactive';
    onTabChange: (e: SyntheticEvent, val: 'active' | 'inactive') => void;
    currentPage: number;
    totalPages: number;
    recordsPerPage: number;
    onRecordsPerPageChange: (value: number) => void;
    onPreviousPage: () => void;
    onNextPage: () => void;
    onAddUser: () => void;
    loading: boolean;
}

export const UsersToolbar: React.FC<UsersToolbarProps> = ({
    tab,
    onTabChange,
    currentPage,
    totalPages,
    recordsPerPage,
    onRecordsPerPageChange,
    onPreviousPage,
    onNextPage,
    onAddUser,
    loading,
}) => {
    const getTabStyle = (tabValue: 'active' | 'inactive') => ({
        ...USERS_TAB_STYLES[tab === tabValue ? 'active' : 'inactive'],
        ...(tabValue === 'inactive' && { ml: '5px' }),
    });

    return (
        <CustomToolbar>
            <Tabs
                value={tab}
                onChange={onTabChange}
                sx={{
                    mt: '26px',
                    '& .MuiTabs-indicator': {
                        display: 'none',
                    },
                }}
            >
                <CustomTab value="active" label="Active" sx={getTabStyle('active')} />
                <CustomTab value="inactive" label="Inactive" sx={getTabStyle('inactive')} />
            </Tabs>

            <Stack direction="row" spacing={1.5} alignItems="center">
                <UsersPagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    recordsPerPage={recordsPerPage}
                    onRecordsPerPageChange={onRecordsPerPageChange}
                    onPreviousPage={onPreviousPage}
                    onNextPage={onNextPage}
                />

                <Button
                    variant="contained"
                    startIcon={<FiPlus />}
                    onClick={onAddUser}
                    disabled={loading}
                    sx={USERS_ADD_BUTTON_STYLES}
                >
                    Add User
                </Button>
            </Stack>
        </CustomToolbar>
    );
};

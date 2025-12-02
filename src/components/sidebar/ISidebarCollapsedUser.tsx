import React from 'react';
import { Avatar, Box, Tooltip } from '@mui/material';

interface Props {
    userDetail: any;
    getInitials: () => string;
    getDisplayName: () => string;
}

export const ISidebarCollapsedUser: React.FC<Props> = ({ userDetail, getInitials, getDisplayName }) => {
    return (
        <Box
            sx={{
                p: 1.5,
                borderTop: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Tooltip title={getDisplayName()} placement="right">
                <Avatar
                    src={userDetail?.user_details?.profile_pic || undefined}
                    sx={{
                        width: 36,
                        height: 36,
                        backgroundColor: '#6366f1',
                        fontSize: '14px',
                        fontWeight: 600,
                        cursor: 'pointer',
                    }}
                >
                    {getInitials()}
                </Avatar>
            </Tooltip>
        </Box>
    );
};

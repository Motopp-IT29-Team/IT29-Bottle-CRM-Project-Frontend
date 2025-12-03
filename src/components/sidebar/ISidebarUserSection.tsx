import React, { useState } from 'react';
import { Avatar, Box, Divider, Stack, Typography } from '@mui/material';
import { FiLogOut, FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { IActionModal } from '../ui/IActionModal';

interface Props {
    userDetail: any;
    orgName: string;
    getInitials: () => string;
    getDisplayName: () => string;
    onOrganizationClick: () => void;
}

export const ISidebarUserSection: React.FC<Props> = ({
    userDetail,
    orgName,
    getInitials,
    getDisplayName,
    onOrganizationClick,
}) => {
    const navigate = useNavigate();
    const [logoutModalOpen, setLogoutModalOpen] = useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogoutClick = () => {
        setLogoutModalOpen(true);
    };

    const handleLogoutConfirm = () => {
        setIsLoggingOut(true);
        localStorage.clear();
        navigate('/login');
    };

    return (
        <>
            <Box sx={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
                {/* User Profile */}
                <Box sx={{ p: 2 }}>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar
                            src={userDetail?.user_details?.profile_pic || undefined}
                            sx={{
                                width: 40,
                                height: 40,
                                backgroundColor: '#6366f1',
                                fontSize: '14px',
                                fontWeight: 600,
                                flexShrink: 0,
                            }}
                        >
                            {getInitials()}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: 'white',
                                    whiteSpace: 'nowrap',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                }}
                            >
                                {getDisplayName()}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '12px',
                                    color: 'rgba(255, 255, 255, 0.5)',
                                    textTransform: 'capitalize',
                                }}
                            >
                                {userDetail?.role?.toLowerCase() || 'User'}
                            </Typography>
                        </Box>
                    </Stack>

                    {/* Organization */}
                    <Box
                        sx={{
                            mt: 1.5,
                            p: 1,
                            borderRadius: '8px',
                            backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        }}
                    >
                        <Typography
                            sx={{
                                fontSize: '11px',
                                color: 'rgba(255, 255, 255, 0.5)',
                                mb: 0.25,
                            }}
                        >
                            Organization
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: '13px',
                                color: 'white',
                                fontWeight: 500,
                                whiteSpace: 'nowrap',
                                overflow: 'hidden',
                                textOverflow: 'ellipsis',
                            }}
                        >
                            {orgName}
                        </Typography>
                    </Box>
                </Box>

                <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.08)' }} />

                {/* Menu Actions */}
                <Box sx={{ p: 1 }}>
                    <Box
                        onClick={onOrganizationClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 1.5,
                            py: 1.25,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: 'rgba(255, 255, 255, 0.7)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                                color: 'white',
                            },
                        }}
                    >
                        <FiSettings size={18} />
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Organization</Typography>
                    </Box>

                    <Box
                        onClick={handleLogoutClick}
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1.5,
                            px: 1.5,
                            py: 1.25,
                            borderRadius: '8px',
                            cursor: 'pointer',
                            color: '#ef4444',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: 'rgba(239, 68, 68, 0.1)',
                            },
                        }}
                    >
                        <FiLogOut size={18} />
                        <Typography sx={{ fontSize: '14px', fontWeight: 500 }}>Sign Out</Typography>
                    </Box>
                </Box>
            </Box>

            {/* Logout Confirmation Modal */}
            <IActionModal
                open={logoutModalOpen}
                onClose={() => setLogoutModalOpen(false)}
                onConfirm={handleLogoutConfirm}
                variant="warning"
                title="Sign Out?"
                message="Are you sure you want to sign out? You'll need to sign in again to access your account."
                confirmText="Sign Out"
                cancelText="Cancel"
                isLoading={isLoggingOut}
            />
        </>
    );
};

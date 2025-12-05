import React from 'react';
import { Card, Box, Avatar, Typography, Chip, Button } from '@mui/material';
import { FiCheckCircle } from '@react-icons/all-files/fi/FiCheckCircle';
import { FiXCircle } from '@react-icons/all-files/fi/FiXCircle';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { getInitials } from '../../../utils/userHelpers';
import {
    USER_PROFILE_HEADER_CARD_STYLES,
    USER_PROFILE_HEADER_GRADIENT_STYLES,
    USER_PROFILE_HEADER_CONTENT_STYLES,
    USER_PROFILE_HEADER_FLEX_STYLES,
    USER_PROFILE_AVATAR_STYLES,
    USER_PROFILE_INFO_CONTAINER_STYLES,
    USER_PROFILE_EMAIL_STYLES,
    USER_PROFILE_CHIPS_CONTAINER_STYLES,
    USER_PROFILE_ROLE_CHIP_STYLES,
    USER_PROFILE_ACTIVE_CHIP_STYLES,
    USER_PROFILE_INACTIVE_CHIP_STYLES,
    CHIP_ICON_STYLES,
    RESEND_INVITATION_BUTTON_STYLES,
} from '../../../styles/UsersStyles';
import { IUser } from '../../../types';

interface Props {
    user: IUser;
    onResendInvitation?: () => void;
    isResending?: boolean;
}

export const UserProfileHeader: React.FC<Props> = ({ user, onResendInvitation, isResending = false }) => {
    const fullName = `${user.first_name || ''} ${user.last_name || ''}`.trim();
    const displayName = fullName || '';
    const initials = fullName ? getInitials(fullName) : getInitials(user.user_details.email);

    return (
        <Card sx={USER_PROFILE_HEADER_CARD_STYLES}>
            <Box sx={USER_PROFILE_HEADER_GRADIENT_STYLES} />
            <Box sx={USER_PROFILE_HEADER_CONTENT_STYLES}>
                <Box sx={USER_PROFILE_HEADER_FLEX_STYLES}>
                    <Avatar sx={USER_PROFILE_AVATAR_STYLES} src={user.user_details.profile_pic || undefined}>
                        {initials}
                    </Avatar>

                    <Box sx={USER_PROFILE_INFO_CONTAINER_STYLES}>
                        <Typography sx={USER_PROFILE_EMAIL_STYLES}>{displayName}</Typography>
                        <Box sx={USER_PROFILE_CHIPS_CONTAINER_STYLES}>
                            <Chip label={user.role} size="small" sx={USER_PROFILE_ROLE_CHIP_STYLES} />
                            {user.user_details.is_active ? (
                                <Chip
                                    icon={<FiCheckCircle style={CHIP_ICON_STYLES} />}
                                    label="Active"
                                    size="small"
                                    sx={USER_PROFILE_ACTIVE_CHIP_STYLES}
                                />
                            ) : (
                                <Chip
                                    icon={<FiXCircle style={CHIP_ICON_STYLES} />}
                                    label="Inactive"
                                    size="small"
                                    sx={USER_PROFILE_INACTIVE_CHIP_STYLES}
                                />
                            )}
                        </Box>
                    </Box>

                    {!user.user_details.is_active && onResendInvitation && (
                        <Box
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-end',
                                gap: 1,
                                ml: 'auto',
                            }}
                        >
                            <Typography sx={{ fontSize: '14px', color: '#6b7280', fontWeight: 500 }}>
                                {user.user_details.email}
                            </Typography>
                            <Button
                                variant="outlined"
                                size="small"
                                startIcon={<FiMail />}
                                onClick={onResendInvitation}
                                disabled={isResending}
                                sx={RESEND_INVITATION_BUTTON_STYLES}
                            >
                                {isResending ? 'Sending...' : 'Resend Invitation'}
                            </Button>
                        </Box>
                    )}
                </Box>
            </Box>
        </Card>
    );
};

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

interface UserProfileHeaderProps {
    email: string;
    role: string;
    isActive: boolean;
    onResendInvitation?: () => void;
    isResending?: boolean;
}

export const UserProfileHeader: React.FC<UserProfileHeaderProps> = ({
    email,
    role,
    isActive,
    onResendInvitation,
    isResending = false,
}) => {
    return (
        <Card sx={USER_PROFILE_HEADER_CARD_STYLES}>
            <Box sx={USER_PROFILE_HEADER_GRADIENT_STYLES} />
            <Box sx={USER_PROFILE_HEADER_CONTENT_STYLES}>
                <Box sx={USER_PROFILE_HEADER_FLEX_STYLES}>
                    <Avatar sx={USER_PROFILE_AVATAR_STYLES}>{getInitials(email)}</Avatar>
                    <Box sx={USER_PROFILE_INFO_CONTAINER_STYLES}>
                        <Typography sx={USER_PROFILE_EMAIL_STYLES}>{email}</Typography>
                        <Box sx={USER_PROFILE_CHIPS_CONTAINER_STYLES}>
                            <Chip label={role} size="small" sx={USER_PROFILE_ROLE_CHIP_STYLES} />
                            {isActive ? (
                                <Chip
                                    icon={<FiCheckCircle style={CHIP_ICON_STYLES} />}
                                    label="Active"
                                    size="small"
                                    sx={USER_PROFILE_ACTIVE_CHIP_STYLES}
                                />
                            ) : (
                                <>
                                    <Chip
                                        icon={<FiXCircle style={CHIP_ICON_STYLES} />}
                                        label="Inactive"
                                        size="small"
                                        sx={USER_PROFILE_INACTIVE_CHIP_STYLES}
                                    />
                                    {onResendInvitation && (
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
                                    )}
                                </>
                            )}
                        </Box>
                    </Box>
                </Box>
            </Box>
        </Card>
    );
};

import React from 'react';
import { Paper, Box, Typography } from '@mui/material';
import {
    getInfoCardHoverStyles,
    INFO_CARD_FLEX_STYLES,
    getInfoCardIconContainerStyles,
    INFO_CARD_CONTENT_STYLES,
    INFO_CARD_LABEL_STYLES,
    INFO_CARD_VALUE_STYLES,
} from '../../../styles/UsersStyles';

interface UserInfoCardProps {
    icon: React.ReactNode;
    label: string;
    value: string;
    color?: string;
}

export const UserInfoCard: React.FC<UserInfoCardProps> = ({ icon, label, value, color = '#667eea' }) => (
    <Paper elevation={0} sx={getInfoCardHoverStyles(color)}>
        <Box sx={INFO_CARD_FLEX_STYLES}>
            <Box sx={getInfoCardIconContainerStyles(color)}>{icon}</Box>
            <Box sx={INFO_CARD_CONTENT_STYLES}>
                <Typography sx={INFO_CARD_LABEL_STYLES}>{label}</Typography>
                <Typography sx={INFO_CARD_VALUE_STYLES}>{value || '---'}</Typography>
            </Box>
        </Box>
    </Paper>
);

import React from 'react';
import { Box, Typography } from '@mui/material';
import { FiMail } from '@react-icons/all-files/fi/FiMail';
import { FiUser } from '@react-icons/all-files/fi/FiUser';
import { FiCalendar } from '@react-icons/all-files/fi/FiCalendar';
import { UserInfoCard } from './UserInfoCard';
import { formatDate } from '../../../utils/userHelpers';
import {
    USER_SECTION_CONTAINER_STYLES,
    USER_SECTION_TITLE_STYLES,
    USER_SECTION_GRID_STYLES,
} from '../../../styles/UsersStyles';

interface Props {
    email: string;
    role: string;
    dateOfJoining: string;
}

export const UserInfoSection: React.FC<Props> = ({ email, role, dateOfJoining }) => {
    return (
        <Box sx={USER_SECTION_CONTAINER_STYLES}>
            <Typography sx={USER_SECTION_TITLE_STYLES}>
                <FiUser size={20} />
                User Information
            </Typography>
            <Box sx={USER_SECTION_GRID_STYLES}>
                <UserInfoCard icon={<FiMail size={20} />} label="Email Address" value={email} color="#667eea" />
                <UserInfoCard icon={<FiUser size={20} />} label="Role" value={role} color="#f59e0b" />
                <UserInfoCard
                    icon={<FiCalendar size={20} />}
                    label="Date of Joining"
                    value={formatDate(dateOfJoining)}
                    color="#10b981"
                />
            </Box>
        </Box>
    );
};

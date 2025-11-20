import React from 'react';
import { Box, Typography } from '@mui/material';
import { FiMapPin } from '@react-icons/all-files/fi/FiMapPin';
import { FiHome } from '@react-icons/all-files/fi/FiHome';
import { FiNavigation } from '@react-icons/all-files/fi/FiNavigation';
import { UserInfoCard } from './UserInfoCard';
import { getCountryNameByCode } from '../../../utils/userHelpers';

interface Address {
    address_line: string;
    street: string;
    city: string;
    state: string;
    postcode: string;
    country: string;
}

interface UserAddressSectionProps {
    address?: Address;
}

export const UserAddressSection: React.FC<UserAddressSectionProps> = ({ address }) => {
    return (
        <Box>
            <Typography
                sx={{
                    fontSize: '20px',
                    fontWeight: 700,
                    color: '#111827',
                    mb: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                }}
            >
                <FiMapPin size={20} />
                Address Information
            </Typography>
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: 2,
                }}
            >
                <UserInfoCard
                    icon={<FiHome size={20} />}
                    label="Address Line"
                    value={address?.address_line || ''}
                    color="#ec4899"
                />
                <UserInfoCard
                    icon={<FiNavigation size={20} />}
                    label="Street"
                    value={address?.street || ''}
                    color="#8b5cf6"
                />
                <UserInfoCard icon={<FiMapPin size={20} />} label="City" value={address?.city || ''} color="#06b6d4" />
                <UserInfoCard
                    icon={<FiMapPin size={20} />}
                    label="State"
                    value={address?.state || ''}
                    color="#3b82f6"
                />
                <UserInfoCard
                    icon={<FiMapPin size={20} />}
                    label="Postal Code"
                    value={address?.postcode || ''}
                    color="#f59e0b"
                />
                <UserInfoCard
                    icon={<FiMapPin size={20} />}
                    label="Country"
                    value={getCountryNameByCode(address?.country || '')}
                    color="#10b981"
                />
            </Box>
        </Box>
    );
};

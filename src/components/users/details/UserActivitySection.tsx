import React from 'react';
import { Box, Typography } from '@mui/material';
import { FiClock, FiUserPlus, FiEdit, FiUserX, FiUserCheck } from 'react-icons/fi';

interface ActivityItem {
    icon: React.ReactNode;
    title: string;
    subtitle: string;
    timestamp: string;
    color: string;
    bgColor: string;
}

interface Props {
    createdByEmail?: string;
    createdAt?: string;
    updatedByEmail?: string;
    updatedAt?: string;
    deactivatedByEmail?: string;
    deactivatedAt?: string;
    isActive: boolean;
}

export const UserActivitySection: React.FC<Props> = ({
    createdByEmail,
    createdAt,
    updatedByEmail,
    updatedAt,
    deactivatedByEmail,
    deactivatedAt,
    isActive,
}) => {
    const activities: ActivityItem[] = [];

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (createdByEmail && createdAt) {
        activities.push({
            icon: <FiUserPlus size={18} />,
            title: 'User Created',
            subtitle: `by ${createdByEmail}`,
            timestamp: formatDate(createdAt),
            color: '#10b981',
            bgColor: '#f0fdf4',
        });
    }

    if (updatedByEmail && updatedAt && updatedAt !== createdAt) {
        activities.push({
            icon: <FiEdit size={18} />,
            title: 'User Updated',
            subtitle: `by ${updatedByEmail}`,
            timestamp: formatDate(updatedAt),
            color: '#3b82f6',
            bgColor: '#eff6ff',
        });
    }

    if (!isActive && deactivatedByEmail && deactivatedAt) {
        activities.push({
            icon: <FiUserX size={18} />,
            title: 'User Deactivated',
            subtitle: `by ${deactivatedByEmail}`,
            timestamp: formatDate(deactivatedAt),
            color: '#ef4444',
            bgColor: '#fef2f2',
        });
    }

    if (isActive && deactivatedByEmail && deactivatedAt) {
        activities.push({
            icon: <FiUserCheck size={18} />,
            title: 'User Activated',
            subtitle: `by ${updatedByEmail || 'admin'}`,
            timestamp: updatedAt ? formatDate(updatedAt) : '',
            color: '#10b981',
            bgColor: '#f0fdf4',
        });
    }

    activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (activities.length === 0) {
        return null;
    }

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
                <FiClock size={20} />
                Activity History
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {activities.map((activity, index) => (
                    <Box
                        key={index}
                        sx={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 2,
                            p: 2,
                            borderRadius: '10px',
                            backgroundColor: activity.bgColor,
                            border: `1px solid ${activity.color}20`,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                backgroundColor: activity.bgColor,
                                borderColor: `${activity.color}40`,
                                transform: 'translateX(4px)',
                            },
                        }}
                    >
                        {/* Icon */}
                        <Box
                            sx={{
                                width: 40,
                                height: 40,
                                borderRadius: '10px',
                                backgroundColor: 'white',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: activity.color,
                                flexShrink: 0,
                                border: `2px solid ${activity.color}`,
                            }}
                        >
                            {activity.icon}
                        </Box>

                        {/* Content */}
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Typography
                                sx={{
                                    fontSize: '14px',
                                    fontWeight: 600,
                                    color: '#111827',
                                    mb: 0.5,
                                }}
                            >
                                {activity.title}
                            </Typography>
                            <Typography
                                sx={{
                                    fontSize: '13px',
                                    color: '#6b7280',
                                }}
                            >
                                {activity.subtitle}
                            </Typography>
                        </Box>

                        {/* Timestamp */}
                        <Typography
                            sx={{
                                fontSize: '12px',
                                color: '#9ca3af',
                                whiteSpace: 'nowrap',
                                flexShrink: 0,
                            }}
                        >
                            {activity.timestamp}
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Box>
    );
};

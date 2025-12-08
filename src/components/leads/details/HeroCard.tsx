import React from 'react';
import { Paper, Typography, Stack, Chip, Avatar, Box, Divider } from '@mui/material';
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaPercentage, FaTag, FaClock } from 'react-icons/fa';
import { ILead } from '../../../types';
import FormateTime from '../../../utils/formateTime';

interface Props {
    lead: ILead;
}

export const HeroCard: React.FC<Props> = ({ lead }) => {
    const getStatusColor = (status: string): string => {
        const colors: Record<string, string> = {
            assigned: '#3b82f6',
            'in process': '#f59e0b',
            converted: '#10b981',
            recycled: '#6366f1',
            closed: '#ef4444',
        };
        return colors[status?.toLowerCase()] || '#6b7280';
    };

    const getSourceColor = (source: string): string => {
        const colors: Record<string, string> = {
            call: '#8b5cf6',
            email: '#3b82f6',
            'existing customer': '#10b981',
            partner: '#f59e0b',
            'public relations': '#ec4899',
            campaign: '#6366f1',
            other: '#6b7280',
        };
        return colors[source?.toLowerCase()] || '#6b7280';
    };

    const getRatingColor = (rating: string): string => {
        const colors: Record<string, string> = {
            hot: '#ef4444',
            warm: '#f59e0b',
            cold: '#3b82f6',
        };
        return colors[rating?.toLowerCase()] || '#6b7280';
    };

    const getUserDisplayName = (user: any): string => {
        if (user.first_name || user.last_name) {
            return `${user.first_name || ''} ${user.last_name || ''}`.trim();
        }
        return user.user_details?.email || user.email || 'Unknown User';
    };

    const getUserInitials = (user: any): string => {
        if (user.first_name || user.last_name) {
            const firstInitial = user.first_name?.charAt(0)?.toUpperCase() || '';
            const lastInitial = user.last_name?.charAt(0)?.toUpperCase() || '';
            return `${firstInitial}${lastInitial}`;
        }
        const email = user.user_details?.email || user.email || 'U';
        return email.charAt(0).toUpperCase();
    };

    return (
        <Paper
            elevation={0}
            sx={{
                mb: 3,
                borderRadius: '16px',
                overflow: 'hidden',
                border: '1px solid #e5e7eb',
                backgroundColor: 'white',
            }}
        >
            {/* Main Header */}
            <Box sx={{ p: 4, pb: 3 }}>
                {/* Top Row: Name + Badges */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#111827" mb={0.5}>
                            {lead.salutation} {lead.first_name} {lead.last_name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FaBriefcase style={{ color: '#6b7280', fontSize: '14px' }} />
                            <Typography variant="body1" color="#6b7280">
                                {lead.title || 'No job title'}
                            </Typography>
                            <Typography variant="body1" color="#d1d5db">
                                •
                            </Typography>
                            <Typography variant="body1" color="#374151" fontWeight={600}>
                                {lead.account_name}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Status Badge - Large and Prominent */}
                    <Box
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: '12px',
                            backgroundColor: `${getStatusColor(lead.status)}15`,
                            border: `2px solid ${getStatusColor(lead.status)}`,
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            sx={{
                                color: getStatusColor(lead.status),
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '14px',
                            }}
                        >
                            {lead.status}
                        </Typography>
                    </Box>
                </Stack>

                {/* Tags + Source + Rating */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip
                        icon={<FaTag style={{ fontSize: '12px' }} />}
                        label={lead.source}
                        size="small"
                        sx={{
                            backgroundColor: `${getSourceColor(lead.source)}15`,
                            color: getSourceColor(lead.source),
                            border: `1px solid ${getSourceColor(lead.source)}40`,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            paddingX: 1,
                        }}
                    />
                    {lead.rating && (
                        <Chip
                            label={lead.rating}
                            size="small"
                            sx={{
                                backgroundColor: `${getRatingColor(lead.rating)}15`,
                                color: getRatingColor(lead.rating),
                                border: `1px solid ${getRatingColor(lead.rating)}40`,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        />
                    )}
                    {lead.tags?.map((tag: any, index: number) => (
                        <Chip
                            key={index}
                            label={tag.name}
                            size="small"
                            variant="outlined"
                            sx={{
                                borderColor: '#d1d5db',
                                color: '#6b7280',
                                fontWeight: 500,
                            }}
                        />
                    ))}
                </Stack>
            </Box>

            <Divider />

            {/* Stats Grid */}
            <Box
                sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    borderBottom: '1px solid #e5e7eb',
                }}
            >
                {/* Opportunity Amount */}
                <Box
                    sx={{
                        p: 3,
                        borderRight: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f9fafb',
                        },
                    }}
                >
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    backgroundColor: '#ecfdf5',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FaDollarSign style={{ color: '#10b981', fontSize: '16px' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Opportunity
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight={700} color="#111827">
                            €{lead.opportunity_amount || '0'}
                        </Typography>
                    </Stack>
                </Box>

                {/* Probability */}
                <Box
                    sx={{
                        p: 3,
                        borderRight: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f9fafb',
                        },
                    }}
                >
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    backgroundColor: '#eff6ff',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FaPercentage style={{ color: '#3b82f6', fontSize: '14px' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Win Probability
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight={700} color="#111827">
                            {lead.probability}%
                        </Typography>
                    </Stack>
                </Box>

                {/* Close Date */}
                <Box
                    sx={{
                        p: 3,
                        borderRight: '1px solid #e5e7eb',
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f9fafb',
                        },
                    }}
                >
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <Box
                                sx={{
                                    width: 36,
                                    height: 36,
                                    borderRadius: '8px',
                                    backgroundColor: '#fef3c7',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                }}
                            >
                                <FaCalendarAlt style={{ color: '#f59e0b', fontSize: '14px' }} />
                            </Box>
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                Expected Close
                            </Typography>
                        </Stack>
                        <Typography variant="h6" fontWeight={700} color="#111827">
                            {lead.close_date || 'Not set'}
                        </Typography>
                    </Stack>
                </Box>

                {/* Assigned To */}
                <Box
                    sx={{
                        p: 3,
                        transition: 'all 0.2s',
                        '&:hover': {
                            backgroundColor: '#f9fafb',
                        },
                    }}
                >
                    <Stack spacing={1}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600}>
                            Assigned To
                        </Typography>
                        {lead.assigned_to ? (
                            <Stack direction="row" spacing={1} alignItems="center">
                                <Avatar
                                    src={lead.assigned_to.user_details?.profile_pic || ''}
                                    alt={getUserDisplayName(lead.assigned_to)}
                                    sx={{
                                        width: 36,
                                        height: 36,
                                        border: '2px solid white',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        bgcolor: lead.assigned_to.user_details?.profile_pic ? 'transparent' : '#667eea',
                                        fontSize: '14px',
                                        fontWeight: 600,
                                    }}
                                >
                                    {!lead.assigned_to.user_details?.profile_pic && getUserInitials(lead.assigned_to)}
                                </Avatar>
                                <Typography variant="body2" color="text.primary">
                                    {getUserDisplayName(lead.assigned_to)}
                                </Typography>
                            </Stack>
                        ) : (
                            <Typography variant="body2" color="text.secondary">
                                Unassigned
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Box>

            {/* Footer */}
            <Box sx={{ px: 4, py: 2.5, backgroundColor: '#f9fafb' }}>
                <Stack direction="row" spacing={3} alignItems="center">
                    <Stack direction="row" spacing={1.5} alignItems="center">
                        <Avatar src={lead.created_by?.profile_pic || ''} sx={{ width: 28, height: 28 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Created by
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                {lead.created_by?.email}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FaClock style={{ color: '#9ca3af', fontSize: '14px' }} />
                        <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>{FormateTime(lead.created_at)}</Box>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
};

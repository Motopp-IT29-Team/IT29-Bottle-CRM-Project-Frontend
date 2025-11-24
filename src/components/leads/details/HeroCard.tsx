import React from 'react';
import { Paper, Typography, Stack, Chip, Avatar, Box, Divider } from '@mui/material';
import { FaBriefcase, FaDollarSign, FaCalendarAlt, FaPercentage, FaTag, FaClock } from 'react-icons/fa';
import FormateTime from '../../FormateTime';
import { useLeadColors } from '../../../hooks/lead/useLeadColors';

interface Props {
    salutation: string;
    firstName: string;
    lastName: string;
    title?: string;
    companyName: string;
    status: string;
    source: string;
    rating?: string;
    opportunityAmount?: string;
    probability: number;
    closeDate?: string;
    assignedTo: any[];
    tags: any[];
    createdBy: {
        email: string;
        profile_pic: string;
    };
    createdAt: string;
}

export const HeroCard: React.FC<Props> = ({
    salutation,
    firstName,
    lastName,
    title,
    companyName,
    status,
    source,
    rating,
    opportunityAmount,
    probability,
    closeDate,
    assignedTo,
    tags,
    createdBy,
    createdAt,
}) => {
    const { getStatusColor, getSourceColor, getRatingColor } = useLeadColors();

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
                            {salutation} {firstName} {lastName}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FaBriefcase style={{ color: '#6b7280', fontSize: '14px' }} />
                            <Typography variant="body1" color="#6b7280">
                                {title || 'No job title'}
                            </Typography>
                            <Typography variant="body1" color="#d1d5db">
                                •
                            </Typography>
                            <Typography variant="body1" color="#374151" fontWeight={600}>
                                {companyName}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Status Badge - Large and Prominent */}
                    <Box
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: '12px',
                            backgroundColor: `${getStatusColor(status)}15`,
                            border: `2px solid ${getStatusColor(status)}`,
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            sx={{
                                color: getStatusColor(status),
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '14px',
                            }}
                        >
                            {status}
                        </Typography>
                    </Box>
                </Stack>

                {/* Tags + Source + Rating */}
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" gap={1}>
                    <Chip
                        icon={<FaTag style={{ fontSize: '12px' }} />}
                        label={source}
                        size="small"
                        sx={{
                            backgroundColor: `${getSourceColor(source)}15`,
                            color: getSourceColor(source),
                            border: `1px solid ${getSourceColor(source)}40`,
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            paddingX: 1,
                        }}
                    />
                    {rating && (
                        <Chip
                            label={rating}
                            size="small"
                            sx={{
                                backgroundColor: `${getRatingColor(rating)}15`,
                                color: getRatingColor(rating),
                                border: `1px solid ${getRatingColor(rating)}40`,
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        />
                    )}
                    {tags?.map((tag: any, index: number) => (
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
                            €{opportunityAmount || '0'}
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
                            {probability}%
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
                            {closeDate || 'Not set'}
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
                        {assignedTo?.length > 0 ? (
                            <Stack direction="row" spacing={-1}>
                                {assignedTo.slice(0, 4).map((user: any, index: number) => (
                                    <Avatar
                                        key={index}
                                        src={user.user_details?.profile_pic}
                                        alt={user.user_details?.email}
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            border: '2px solid white',
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                        }}
                                    />
                                ))}
                                {assignedTo.length > 4 && (
                                    <Avatar
                                        sx={{
                                            width: 36,
                                            height: 36,
                                            backgroundColor: '#6366f1',
                                            border: '2px solid white',
                                            fontSize: '13px',
                                            fontWeight: 700,
                                        }}
                                    >
                                        +{assignedTo.length - 4}
                                    </Avatar>
                                )}
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
                        <Avatar src={createdBy?.profile_pic} sx={{ width: 28, height: 28 }} />
                        <Box>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Created by
                            </Typography>
                            <Typography variant="body2" fontWeight={600} color="text.primary">
                                {createdBy?.email}
                            </Typography>
                        </Box>
                    </Stack>
                    <Stack direction="row" spacing={1} alignItems="center">
                        <FaClock style={{ color: '#9ca3af', fontSize: '14px' }} />
                        <Box sx={{ fontSize: '14px', color: 'text.secondary' }}>{FormateTime(createdAt)}</Box>
                    </Stack>
                </Stack>
            </Box>
        </Paper>
    );
};

import React from 'react';
import { Paper, Typography, Stack, Chip, Divider, Avatar, Box } from '@mui/material';
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
                p: 4,
                mb: 3,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                borderRadius: '16px',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background decoration */}
            <Box
                sx={{
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 200,
                    height: 200,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                }}
            />

            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                <Box>
                    <Typography variant="h4" fontWeight={700} mb={1}>
                        {salutation} {firstName} {lastName}
                    </Typography>
                    <Typography variant="h6" sx={{ opacity: 0.9 }}>
                        {title || 'No job title'} at {companyName}
                    </Typography>
                </Box>
                <Stack direction="row" spacing={1}>
                    <Chip
                        label={status}
                        sx={{
                            backgroundColor: getStatusColor(status),
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            backdropFilter: 'blur(10px)',
                        }}
                    />
                    <Chip
                        label={source}
                        sx={{
                            backgroundColor: getSourceColor(source),
                            color: 'white',
                            fontWeight: 600,
                            textTransform: 'capitalize',
                            backdropFilter: 'blur(10px)',
                        }}
                    />
                    {rating && (
                        <Chip
                            label={rating}
                            sx={{
                                backgroundColor: getRatingColor(rating),
                                color: 'white',
                                fontWeight: 600,
                                textTransform: 'capitalize',
                            }}
                        />
                    )}
                </Stack>
            </Stack>

            <Divider sx={{ borderColor: 'rgba(255, 255, 255, 0.2)', my: 3 }} />

            {/* Quick Stats */}
            <Stack direction="row" spacing={4}>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Opportunity Amount
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                        €{opportunityAmount || '0'}
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Probability
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                        {probability}%
                    </Typography>
                </Box>
                <Box>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Expected Close
                    </Typography>
                    <Typography variant="h6" fontWeight={600}>
                        {closeDate || 'Not set'}
                    </Typography>
                </Box>
                <Box sx={{ ml: 'auto' }}>
                    <Typography variant="caption" sx={{ opacity: 0.8 }}>
                        Assigned To
                    </Typography>
                    <Stack direction="row" spacing={-1} mt={0.5}>
                        {assignedTo?.length > 0 ? (
                            assignedTo.map((user: any, index: number) => (
                                <Avatar
                                    key={index}
                                    src={user.user_details?.profile_pic}
                                    alt={user.user_details?.email}
                                    sx={{
                                        width: 32,
                                        height: 32,
                                        border: '2px solid white',
                                    }}
                                />
                            ))
                        ) : (
                            <Typography variant="body2">Unassigned</Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>

            {/* Tags */}
            {tags?.length > 0 && (
                <Stack direction="row" spacing={1} mt={3}>
                    {tags.map((tag: any, index: number) => (
                        <Chip
                            key={index}
                            label={tag.name}
                            size="small"
                            sx={{
                                backgroundColor: 'rgba(255, 255, 255, 0.15)',
                                color: 'white',
                                border: '1px solid rgba(255, 255, 255, 0.3)',
                            }}
                        />
                    ))}
                </Stack>
            )}

            {/* Created info */}
            <Stack direction="row" spacing={2} mt={3} sx={{ opacity: 0.8 }}>
                <Stack direction="row" spacing={1} alignItems="center">
                    <Avatar src={createdBy?.profile_pic} sx={{ width: 20, height: 20 }} />
                    <Typography variant="caption">Created by {createdBy?.email}</Typography>
                </Stack>
                <Typography variant="caption">{FormateTime(createdAt)}</Typography>
            </Stack>
        </Paper>
    );
};

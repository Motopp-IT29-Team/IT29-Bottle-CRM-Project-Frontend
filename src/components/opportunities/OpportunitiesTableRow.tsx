import React from 'react';
import { TableRow, TableCell, Box, Typography, Chip, Stack, Avatar } from '@mui/material';
import { IOpportunity } from '../../types';
import { ILabel } from '../ui/ILabel';

interface OpportunitiesTableRowProps {
    opportunity: IOpportunity;
    onViewDetail: (id: string) => void;
}

export function OpportunitiesTableRow({ opportunity, onViewDetail }: OpportunitiesTableRowProps) {
    const getStageColor = (stage: string) => {
        const colors: Record<string, string> = {
            QUALIFICATION: '#e0f2fe',
            'NEEDS ANALYSIS': '#fef3c7',
            'VALUE PROPOSITION': '#e0e7ff',
            PROPOSAL: '#dbeafe',
            NEGOTIATION: '#fef3c7',
            'CLOSED WON': '#d1fae5',
            'CLOSED LOST': '#fee2e2',
        };
        return colors[stage] || '#f1f5f9';
    };

    const getStageTextColor = (stage: string) => {
        const colors: Record<string, string> = {
            QUALIFICATION: '#0369a1',
            'NEEDS ANALYSIS': '#d97706',
            'VALUE PROPOSITION': '#6366f1',
            PROPOSAL: '#2563eb',
            NEGOTIATION: '#d97706',
            'CLOSED WON': '#059669',
            'CLOSED LOST': '#dc2626',
        };
        return colors[stage] || '#64748b';
    };

    const formatDate = (dateString: string) => {
        if (!dateString) return '---';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const formatAmount = (amount: string | number, currency: string) => {
        if (!amount) return '---';
        const currencySymbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
        };
        const symbol = currencySymbols[currency] || currency;
        return `${symbol}${Number(amount).toLocaleString()}`;
    };

    return (
        <TableRow
            onClick={() => onViewDetail(opportunity.id)}
            sx={{
                cursor: 'pointer',
                '&:hover': { backgroundColor: '#f9fafb' },
                transition: 'background-color 0.2s',
            }}
        >
            {/* Name */}
            <TableCell sx={{ border: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>{opportunity.name}</Typography>
            </TableCell>

            {/* Account */}
            <TableCell sx={{ border: 0 }}>
                <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>
                    {opportunity.account?.name || '---'}
                </Typography>
            </TableCell>

            {/* Assigned To */}
            <TableCell sx={{ border: 0 }}>
                {opportunity.assigned_to && opportunity.assigned_to.length > 0 ? (
                    <Stack direction="row" spacing={-1}>
                        {opportunity.assigned_to.slice(0, 3).map((user, idx) => (
                            <Avatar
                                key={idx}
                                src={user.user_details?.profile_pic || ''}
                                alt={user.user_details?.email}
                                sx={{
                                    width: 32,
                                    height: 32,
                                    border: '2px solid white',
                                }}
                            >
                                {user.first_name?.charAt(0)}
                                {user.last_name?.charAt(0)}
                            </Avatar>
                        ))}
                        {opportunity.assigned_to.length > 3 && (
                            <Avatar
                                sx={{ width: 32, height: 32, bgcolor: '#e5e7eb', color: '#4b5563', fontSize: '12px' }}
                            >
                                +{opportunity.assigned_to.length - 3}
                            </Avatar>
                        )}
                    </Stack>
                ) : (
                    <Typography sx={{ fontSize: '14px', color: '#9ca3af' }}>---</Typography>
                )}
            </TableCell>

            {/* Stage */}
            <TableCell sx={{ border: 0 }}>
                <Chip
                    label={opportunity.stage || '---'}
                    size="small"
                    sx={{
                        backgroundColor: getStageColor(opportunity.stage),
                        color: getStageTextColor(opportunity.stage),
                        fontSize: '12px',
                        fontWeight: 500,
                        height: '24px',
                    }}
                />
            </TableCell>

            {/* Amount */}
            <TableCell sx={{ border: 0 }}>
                <Typography sx={{ fontSize: '14px', fontWeight: 600, color: '#1f2937' }}>
                    {formatAmount(opportunity.amount, opportunity.currency)}
                </Typography>
                <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    {opportunity.probability}% probability
                </Typography>
            </TableCell>

            {/* Created Date */}
            <TableCell sx={{ border: 0 }}>
                <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>
                    {formatDate(opportunity.created_at)}
                </Typography>
            </TableCell>

            {/* Tags */}
            <TableCell sx={{ border: 0 }}>
                <Box sx={{ display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                    {opportunity.tags && opportunity.tags.length > 0 ? (
                        opportunity.tags.slice(0, 2).map((tag, idx) => <ILabel key={idx} tags={tag} />)
                    ) : (
                        <Typography sx={{ fontSize: '14px', color: '#9ca3af' }}>---</Typography>
                    )}
                    {opportunity.tags && opportunity.tags.length > 2 && (
                        <Chip
                            label={`+${opportunity.tags.length - 2}`}
                            size="small"
                            sx={{
                                height: '20px',
                                fontSize: '11px',
                                backgroundColor: '#f3f4f6',
                                color: '#6b7280',
                            }}
                        />
                    )}
                </Box>
            </TableCell>

            {/* Lead Source */}
            <TableCell sx={{ border: 0 }}>
                <Typography sx={{ fontSize: '14px', color: '#4b5563' }}>{opportunity.lead_source || '---'}</Typography>
            </TableCell>
        </TableRow>
    );
}

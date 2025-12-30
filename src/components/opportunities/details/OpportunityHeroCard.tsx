import React from 'react';
import { Paper, Typography, Stack, Chip, Avatar, Box, Divider } from '@mui/material';
import { FaDollarSign, FaPercentage, FaCalendarAlt, FaBuilding, FaTag, FaEuroSign } from 'react-icons/fa';
import { IOpportunity } from '../../../types';
import FormateTime from '../../../utils/formateTime';

interface Props {
    opportunity: IOpportunity;
}

export const OpportunityHeroCard: React.FC<Props> = ({ opportunity }) => {
    const getStageColor = (stage: string): string => {
        const colors: Record<string, string> = {
            qualification: '#3b82f6',
            'needs analysis': '#f59e0b',
            'value proposition': '#8b5cf6',
            proposal: '#6366f1',
            negotiation: '#ec4899',
            'closed won': '#10b981',
            'closed lost': '#ef4444',
        };
        return colors[stage?.toLowerCase()] || '#6b7280';
    };

    const getSourceColor = (source: string): string => {
        const colors: Record<string, string> = {
            call: '#8b5cf6',
            email: '#3b82f6',
            'existing customer': '#10b981',
            partner: '#f59e0b',
            campaign: '#6366f1',
            web: '#ec4899',
            other: '#6b7280',
        };
        return colors[source?.toLowerCase()] || '#6b7280';
    };

    const getCurrencySymbol = (currency?: string): string => {
        const symbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
        };
        return symbols[currency || ''] || '€';
    };

    const formatAmount = (amount: number | string | undefined, currency?: string): string => {
        if (!amount) return '---';
        const num = typeof amount === 'string' ? parseFloat(amount) : amount;
        return `${getCurrencySymbol(currency)}${num.toLocaleString()}`;
    };

    const formatBudgetRange = (value?: string): string => {
        if (!value) return '---';
        const labels: Record<string, string> = {
            less_than_5000: 'Less than €5,000',
            '5000_to_10000': '€5,000–€10,000',
            '10000_to_25000': '€10,000–€25,000',
            over_25000: 'Over €25,000',
        };
        return labels[value] || value;
    };

    const formatDecisionTimeframe = (value?: string): string => {
        if (!value) return '---';
        const labels: Record<string, string> = {
            within_1_week: 'Within 1 week',
            within_1_month: 'Within 1 month',
            within_3_months: 'Within 3 months',
            more_than_3_months: 'More than 3 months',
        };
        return labels[value] || value;
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
                {/* Top Row: Name + Stage Badge */}
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h4" fontWeight={700} color="#111827" mb={0.5}>
                            {opportunity.name}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FaBuilding style={{ color: '#6b7280', fontSize: '14px' }} />
                            <Typography variant="body1" color="#374151" fontWeight={600}>
                                {opportunity.account?.name || 'No account'}
                            </Typography>
                        </Stack>
                    </Box>

                    {/* Stage Badge - Large and Prominent */}
                    <Box
                        sx={{
                            px: 3,
                            py: 1.5,
                            borderRadius: '12px',
                            backgroundColor: `${getStageColor(opportunity.stage)}15`,
                            border: `2px solid ${getStageColor(opportunity.stage)}`,
                        }}
                    >
                        <Typography
                            variant="body1"
                            fontWeight={700}
                            sx={{
                                color: getStageColor(opportunity.stage),
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                fontSize: '14px',
                            }}
                        >
                            {opportunity.stage}
                        </Typography>
                    </Box>
                </Stack>

                {/* Tags + Source */}
                <Stack direction="row" spacing={1} flexWrap="wrap" alignItems="center" mb={3}>
                    {opportunity.lead_source && (
                        <Chip
                            icon={<FaTag style={{ fontSize: '10px' }} />}
                            label={opportunity.lead_source}
                            size="small"
                            sx={{
                                backgroundColor: `${getSourceColor(opportunity.lead_source)}15`,
                                color: getSourceColor(opportunity.lead_source),
                                fontWeight: 600,
                                fontSize: '12px',
                            }}
                        />
                    )}
                    {opportunity.tags?.map((tag: any) => (
                        <Chip
                            key={tag.id || tag.name || tag}
                            label={tag.name || tag}
                            size="small"
                            sx={{
                                backgroundColor: '#f3f4f6',
                                color: '#374151',
                                fontWeight: 500,
                                fontSize: '12px',
                            }}
                        />
                    ))}
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Key Metrics Row */}
                <Stack direction="row" spacing={4} flexWrap="wrap">
                    {/* Amount */}
                    <Box sx={{ minWidth: '140px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            <FaEuroSign style={{ color: '#10b981', fontSize: '14px' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                AMOUNT
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight={700} color="#111827">
                            {formatAmount(opportunity.amount, opportunity.currency)}
                        </Typography>
                    </Box>

                    {/* Probability */}
                    <Box sx={{ minWidth: '100px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            <FaPercentage style={{ color: '#6366f1', fontSize: '14px' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                PROBABILITY
                            </Typography>
                        </Stack>
                        <Typography variant="h5" fontWeight={700} color="#111827">
                            {opportunity.probability || 0}%
                        </Typography>
                    </Box>

                    {/* Close Date */}
                    <Box sx={{ minWidth: '140px' }}>
                        <Stack direction="row" spacing={1} alignItems="center" mb={0.5}>
                            <FaCalendarAlt style={{ color: '#f59e0b', fontSize: '14px' }} />
                            <Typography variant="caption" color="text.secondary" fontWeight={600}>
                                CLOSE DATE
                            </Typography>
                        </Stack>
                        <Typography variant="h6" fontWeight={600} color="#111827">
                            {opportunity.closed_on || '---'}
                        </Typography>
                    </Box>

                    {/* Budget Range */}
                    <Box sx={{ minWidth: '120px' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                            BUDGET RANGE
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="#111827">
                            {formatBudgetRange(opportunity.budget_range)}
                        </Typography>
                    </Box>

                    {/* Decision Timeframe */}
                    <Box sx={{ minWidth: '140px' }}>
                        <Typography variant="caption" color="text.secondary" fontWeight={600} display="block" mb={0.5}>
                            DECISION TIMEFRAME
                        </Typography>
                        <Typography variant="body1" fontWeight={600} color="#111827">
                            {formatDecisionTimeframe(opportunity.decision_timeframe)}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            {/* Footer: Assigned Users + Created Info */}
            <Box
                sx={{
                    px: 4,
                    py: 2,
                    backgroundColor: '#f9fafb',
                    borderTop: '1px solid #e5e7eb',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}
            >
                {/* Assigned To */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        Assigned to:
                    </Typography>
                    {opportunity.assigned_to && opportunity.assigned_to.length > 0 ? (
                        <Stack direction="row" spacing={-0.5}>
                            {opportunity.assigned_to.slice(0, 4).map((user: any, index: number) => (
                                <Avatar
                                    key={user.id || index}
                                    src={user.profile_pic || user.user_details?.profile_pic}
                                    alt={getUserDisplayName(user)}
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        fontSize: '12px',
                                        border: '2px solid white',
                                        backgroundColor: '#6366f1',
                                    }}
                                >
                                    {getUserInitials(user)}
                                </Avatar>
                            ))}
                            {opportunity.assigned_to.length > 4 && (
                                <Avatar
                                    sx={{
                                        width: 28,
                                        height: 28,
                                        fontSize: '11px',
                                        border: '2px solid white',
                                        backgroundColor: '#9ca3af',
                                    }}
                                >
                                    +{opportunity.assigned_to.length - 4}
                                </Avatar>
                            )}
                        </Stack>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            Unassigned
                        </Typography>
                    )}
                </Stack>

                {/* Created Info */}
                <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                        Created {FormateTime(opportunity.created_at)} by
                    </Typography>
                    <Avatar
                        src={opportunity.created_by?.profile_pic || undefined}
                        alt={opportunity.created_by?.email || undefined}
                        sx={{ width: 24, height: 24, fontSize: '11px' }}
                    >
                        {opportunity.created_by?.email?.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="body2" color="text.secondary" fontWeight={500}>
                        {opportunity.created_by?.email}
                    </Typography>
                </Stack>
            </Box>
        </Paper>
    );
};

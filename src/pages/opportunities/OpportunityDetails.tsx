import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Paper, Stack, Avatar, Chip } from '@mui/material';
import { FaEdit, FaTrash, FaDollarSign, FaBuilding, FaFileAlt, FaUsers } from 'react-icons/fa';
import { IModernAppBar, AppBarAction, IActionModal, ILoadingState, ErrorState } from '../../components/ui';
import { useOpportunities } from '../../api';
import { routes } from '../../constants/routes';
import { IOpportunity, IAttachment, IComment, IProfile } from '../../types';
import { OpportunityHeroCard } from '../../components/opportunities/details';
import { DetailSection, DetailField, AttachmentsCard } from '../../components/leads/details';

export function OpportunityDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const opportunityId = searchParams.get('id');

    const { getById, deleteOpportunity, isLoading } = useOpportunities();

    const [opportunity, setOpportunity] = useState<IOpportunity | null>(null);
    const [attachments, setAttachments] = useState<IAttachment[]>([]);
    const [comments, setComments] = useState<IComment[]>([]);
    const [users, setUsers] = useState<IProfile[]>([]);

    // Modal states
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (!opportunityId) {
            navigate(routes.opportunities.main);
            return;
        }

        fetchOpportunityDetails();
    }, [opportunityId]);

    const fetchOpportunityDetails = async () => {
        if (!opportunityId) return;

        const result = await getById(opportunityId);

        if (result.success && result.data) {
            setOpportunity(result.data.opportunity_obj);
            setAttachments(result.data.attachments || []);
            setComments(result.data.comments || []);
            setUsers(result.data.users || []);
        } else {
            navigate(routes.opportunities.main);
        }
    };

    if (!opportunityId) {
        return null;
    }

    const handleBack = () => navigate(routes.opportunities.main);

    const handleEdit = () => {
        navigate(`/opportunities/edit/${opportunityId}`);
    };

    const handleDeleteClick = () => {
        setDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!opportunityId) return;

        setIsDeleting(true);
        const result = await deleteOpportunity(opportunityId);
        setIsDeleting(false);

        if (result.success) {
            setDeleteModalOpen(false);
            navigate(routes.opportunities.main);
        } else {
            setDeleteModalOpen(false);
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Opportunities', onClick: handleBack },
        { type: 'custom', label: 'Edit', icon: <FaEdit />, onClick: handleEdit },
        { type: 'custom', label: 'Delete', icon: <FaTrash />, onClick: handleDeleteClick, color: 'error' },
    ];

    if (isLoading) {
        return <ILoadingState message="Loading opportunity data..." />;
    }

    if (!opportunity) {
        return <ErrorState message="Opportunity not found" />;
    }

    const getCurrencySymbol = (currency?: string): string => {
        const symbols: Record<string, string> = {
            USD: '$',
            EUR: '€',
            GBP: '£',
            JPY: '¥',
        };
        return symbols[currency || ''] || '€';
    };

    const formatBudgetRange = (value: string): string => {
        const labels: Record<string, string> = {
            'less_than_5000': 'Less than €5,000',
            '5000_to_10000': '€5,000–€10,000',
            '10000_to_25000': '€10,000–€25,000',
            'over_25000': 'Over €25,000',
        };
        return labels[value] || value;
    };

    const formatDecisionTimeframe = (value: string): string => {
        const labels: Record<string, string> = {
            'within_1_week': 'Within 1 week',
            'within_1_month': 'Within 1 month',
            'within_3_months': 'Within 3 months',
            'more_than_3_months': 'More than 3 months',
        };
        return labels[value] || value;
    };

    return (
        <Box>
            <IModernAppBar module="Opportunities" crntPage="Opportunity Details" actions={actions} />

            <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
                {/* Main Content - 68% */}
                <Box sx={{ flex: '0 0 68%' }}>
                    <OpportunityHeroCard opportunity={opportunity} />

                    <DetailSection title="Opportunity Details" icon={<FaDollarSign style={{ color: '#6366f1' }} />}>
                        <DetailField label="Name" value={opportunity.name} />
                        <DetailField label="Stage" value={opportunity.stage} />
                        <DetailField label="Lead Source" value={opportunity.lead_source} />
                        <DetailField 
                            label="Amount" 
                            value={opportunity.amount ? `${getCurrencySymbol(opportunity.currency)}${Number(opportunity.amount).toLocaleString()}` : '---'} 
                        />
                        <DetailField label="Probability" value={`${opportunity.probability || 0}%`} />
                        <DetailField label="Budget Range" value={opportunity.budget_range ? formatBudgetRange(opportunity.budget_range) : '---'} />
                        <DetailField label="Decision Timeframe" value={opportunity.decision_timeframe ? formatDecisionTimeframe(opportunity.decision_timeframe) : '---'} />
                    </DetailSection>

                    <DetailSection title="Account Information" icon={<FaBuilding style={{ color: '#6366f1' }} />}>
                        <DetailField label="Account Name" value={opportunity.account?.name} />
                        <DetailField label="Close Date" value={opportunity.closed_on} />
                        <DetailField 
                            label="Teams" 
                            value={
                                opportunity.teams && opportunity.teams.length > 0 ? (
                                    <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                        {opportunity.teams.map((team: any) => (
                                            <Chip
                                                key={team.id || team}
                                                label={team.name || team}
                                                size="small"
                                                sx={{ height: '24px', borderRadius: '4px' }}
                                            />
                                        ))}
                                    </Stack>
                                ) : '---'
                            } 
                        />
                    </DetailSection>

                    {/* Contacts Section */}
                    {opportunity.contacts && opportunity.contacts.length > 0 && (
                        <DetailSection title="Related Contacts" icon={<FaUsers style={{ color: '#6366f1' }} />}>
                            {opportunity.contacts.map((contact: any) => (
                                <Box key={contact.id}>
                                    <Stack direction="row" spacing={1} alignItems="center">
                                        <Avatar sx={{ width: 32, height: 32, backgroundColor: '#6366f1', fontSize: '12px' }}>
                                            {contact.first_name?.charAt(0)}{contact.last_name?.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="body2" fontWeight={600}>
                                                {contact.first_name} {contact.last_name}
                                            </Typography>
                                            {contact.primary_email && (
                                                <Typography variant="caption" color="text.secondary">
                                                    {contact.primary_email}
                                                </Typography>
                                            )}
                                        </Box>
                                    </Stack>
                                </Box>
                            ))}
                        </DetailSection>
                    )}

                    <DetailSection title="Description" icon={<FaFileAlt style={{ color: '#6366f1' }} />}>
                        {opportunity.description ? (
                            <Box
                                sx={{
                                    gridColumn: 'span 3',
                                    color: 'text.secondary',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                }}
                                dangerouslySetInnerHTML={{ __html: opportunity.description }}
                            />
                        ) : (
                            <Typography color="text.secondary" sx={{ gridColumn: 'span 3' }}>
                                No description provided
                            </Typography>
                        )}
                    </DetailSection>
                </Box>

                {/* Sidebar - 30% */}
                <Box sx={{ flex: '0 0 30%' }}>
                    <AttachmentsCard
                        attachments={attachments.map((a: any) => ({
                            id: a.id,
                            file_name: a.file_name || a.attachment?.split('/').pop() || 'Attachment',
                            file_path: a.attachment || a.file_path || '',
                            created_at: a.created_at || '',
                            created_by: a.created_by?.email || '',
                        }))}
                        onFileUpload={() => {}}
                    />
                </Box>
            </Box>

            {/* Delete Opportunity Modal */}
            <IActionModal
                open={deleteModalOpen}
                onClose={() => setDeleteModalOpen(false)}
                onConfirm={handleConfirmDelete}
                variant="error"
                title="Delete Opportunity?"
                message={`Are you sure you want to delete "${opportunity?.name}"? This action cannot be undone and will remove all associated data.`}
                confirmText="Delete Opportunity"
                cancelText="Cancel"
                isLoading={isDeleting}
            />
        </Box>
    );
}

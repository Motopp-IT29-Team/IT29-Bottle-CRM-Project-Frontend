import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Stack, Avatar } from '@mui/material';
import { FaEdit, FaTrash, FaFileAlt, FaUsers } from 'react-icons/fa';
import { IModernAppBar, AppBarAction, IActionModal, ILoadingState, ErrorState } from '../../components/ui';
import { useOpportunities } from '../../api';
import { routes } from '../../constants/routes';
import { IOpportunity, IAttachment } from '../../types';
import { OpportunityHeroCard } from '../../components/opportunities/details';
import { DetailSection, AttachmentsCard } from '../../components/leads/details';

export function OpportunityDetails() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const opportunityId = searchParams.get('id');

    const { getById, deleteOpportunity, isLoading } = useOpportunities();

    const [opportunity, setOpportunity] = useState<IOpportunity | null>(null);
    const [attachments, setAttachments] = useState<IAttachment[]>([]);

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

    return (
        <Box>
            <IModernAppBar module="Opportunities" crntPage="Opportunity Details" actions={actions} />

            <Box sx={{ p: 3, display: 'flex', gap: 3 }}>
                {/* Main Content - 68% */}
                <Box sx={{ flex: '0 0 68%' }}>
                    <OpportunityHeroCard opportunity={opportunity} />

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

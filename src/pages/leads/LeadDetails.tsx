import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Box, Typography, Link } from '@mui/material';
import { FaEdit, FaTrash, FaBuilding, FaUser, FaMapMarkerAlt, FaFileAlt, FaExchangeAlt } from 'react-icons/fa';
import { IActionModal, ModernAppBar, AppBarAction, LoadingState, ErrorState } from '../../components/ui';
import { HeroCard, DetailSection, DetailField, AttachmentsCard, NotesCard } from '../../components/leads/details';
import { ConvertLeadModal } from '../../components/leads/conversion';
import { useLeads } from '../../api';
import { routes } from '../../constants/routes';
import { ILead } from '../../types';

export function LeadDetails() {
    const [searchParams] = useSearchParams();
    const leadId = searchParams.get('id');
    const navigate = useNavigate();

    const { getById, deleteLead, addComment, deleteComment, uploadAttachment, deleteAttachment, isLoading } =
        useLeads();

    const [leadDetails, setLeadDetails] = useState<ILead | null>(null);
    const [attachments, setAttachments] = useState<any[]>([]);
    const [comments, setComments] = useState<any[]>([]);
    const [note, setNote] = useState('');

    // Modal states
    const [deleteLeadModalOpen, setDeleteLeadModalOpen] = useState(false);
    const [deleteAttachmentModalOpen, setDeleteAttachmentModalOpen] = useState(false);
    const [deleteNoteModalOpen, setDeleteNoteModalOpen] = useState(false);
    const [convertModalOpen, setConvertModalOpen] = useState(false);
    const [selectedCommentId, setSelectedCommentId] = useState<string | null>(null);
    const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        if (leadId) {
            fetchLeadDetails();
        } else {
            navigate(routes.leads.main);
        }
    }, [leadId]);

    const fetchLeadDetails = async () => {
        if (!leadId) return;

        const result = await getById(leadId);
        if (result.success && result.data) {
            setLeadDetails(result.data.lead);
            setAttachments(result.data.attachments);
            setComments(result.data.comments);
        } else {
            navigate(routes.leads.main);
        }
    };

    const refresh = async () => {
        await fetchLeadDetails();
    };

    if (!leadId) {
        return null;
    }

    if (!isLoading && !leadDetails) {
        return null;
    }

    const handleBack = () => navigate(routes.leads.main);

    const handleEdit = () => {
        navigate(`${routes.leads.edit}?id=${leadId}`);
    };

    const handleDeleteClick = () => {
        setDeleteLeadModalOpen(true);
    };

    const handleConvertClick = () => {
        setConvertModalOpen(true);
    };

    const handleConversionComplete = () => {
        fetchLeadDetails();
    };

    const handleConfirmDeleteLead = async () => {
        setIsDeleting(true);
        const result = await deleteLead(leadId);
        setIsDeleting(false);

        if (result.success) {
            setDeleteLeadModalOpen(false);
            navigate(routes.leads.main);
        } else {
            setDeleteLeadModalOpen(false);
        }
    };

    const handleFileUpload = async (file: File) => {
        const result = await uploadAttachment(leadId, file);
        if (result.success) {
            await refresh();
        }
    };

    const handleDeleteAttachmentClick = (attachmentId: string) => {
        setSelectedAttachmentId(attachmentId);
        setDeleteAttachmentModalOpen(true);
    };

    const handleConfirmDeleteAttachment = async () => {
        if (!selectedAttachmentId) return;

        setIsDeleting(true);
        const result = await deleteAttachment(selectedAttachmentId);
        setIsDeleting(false);

        if (result.success) {
            setDeleteAttachmentModalOpen(false);
            setSelectedAttachmentId(null);
            await refresh();
        } else {
            setDeleteAttachmentModalOpen(false);
            setSelectedAttachmentId(null);
        }
    };

    const handleSendNote = async () => {
        if (!note.trim()) return;

        const result = await addComment(leadId, note);
        if (result.success) {
            setNote('');
            await refresh();
        }
    };

    const handleDeleteNoteClick = (commentId: string) => {
        setSelectedCommentId(commentId);
        setDeleteNoteModalOpen(true);
    };

    const handleConfirmDeleteNote = async () => {
        if (!selectedCommentId) return;

        setIsDeleting(true);
        const result = await deleteComment(selectedCommentId);
        setIsDeleting(false);

        if (result.success) {
            setDeleteNoteModalOpen(false);
            setSelectedCommentId(null);
            await refresh();
        } else {
            setDeleteNoteModalOpen(false);
            setSelectedCommentId(null);
        }
    };

    const actions: AppBarAction[] = [
        { type: 'back', label: 'Back To Leads', onClick: handleBack },
        ...(leadDetails && !leadDetails.is_converted && leadDetails.status === 'qualified'
            ? [
                  {
                      type: 'custom' as const,
                      label: 'Convert',
                      icon: <FaExchangeAlt />,
                      onClick: handleConvertClick,
                      color: 'success' as const,
                  },
              ]
            : []),
        { type: 'custom', label: 'Edit', icon: <FaEdit />, onClick: handleEdit },
        { type: 'custom', label: 'Delete', icon: <FaTrash />, onClick: handleDeleteClick, color: 'error' },
    ];

    if (isLoading) {
        return <LoadingState message="Loading lead data..." />;
    }

    if (!leadDetails) {
        return <ErrorState message="Lead not found" />;
    }

    return (
        <Box sx={{ mt: '60px' }}>
            <ModernAppBar module="Leads" crntPage="Lead Details" actions={actions} />

            <Box sx={{ mt: '120px', p: 3, display: 'flex', gap: 3 }}>
                {/* Main Content - 68% */}
                <Box sx={{ flex: '0 0 68%' }}>
                    <HeroCard lead={leadDetails} />

                    <DetailSection title="Lead Information" icon={<FaBuilding style={{ color: '#6366f1' }} />}>
                        <DetailField label="Company Name" value={leadDetails.account_name} />
                        <DetailField label="Industry" value={leadDetails.industry_display} />
                        <DetailField label="Department" value={leadDetails.department_display} />
                        <DetailField label="Budget Range" value={leadDetails.budget_range_display} />
                        <DetailField label="Decision Timeframe" value={leadDetails.decision_timeframe_display} />
                        <DetailField
                            label="Website"
                            value={
                                leadDetails.website ? (
                                    <Link href={leadDetails.website} target="_blank" rel="noopener">
                                        {leadDetails.website}
                                    </Link>
                                ) : (
                                    '---'
                                )
                            }
                        />
                    </DetailSection>

                    <DetailSection title="Contact Information" icon={<FaUser style={{ color: '#6366f1' }} />}>
                        <DetailField label="First Name" value={leadDetails.first_name} />
                        <DetailField label="Last Name" value={leadDetails.last_name} />
                        <DetailField
                            label="Email"
                            value={
                                leadDetails.email ? (
                                    <Link href={`mailto:${leadDetails.email}`}>{leadDetails.email}</Link>
                                ) : (
                                    '---'
                                )
                            }
                        />
                        <DetailField label="Phone" value={leadDetails.phone} />
                        <DetailField label="Preferred Language" value={leadDetails.preferred_language} />
                        <DetailField label="Do Not Call" value={leadDetails.do_not_call ? 'Yes' : 'No'} />
                    </DetailSection>

                    <DetailSection title="Address Information" icon={<FaMapMarkerAlt style={{ color: '#6366f1' }} />}>
                        <DetailField label="Address Line" value={leadDetails.address_line} />
                        <DetailField label="Street" value={leadDetails.street} />
                        <DetailField label="City" value={leadDetails.city} />
                        <DetailField label="State" value={leadDetails.state} />
                        <DetailField label="Postal Code" value={leadDetails.postcode} />
                        <DetailField label="Country" value={leadDetails.country} />
                    </DetailSection>

                    <DetailSection title="Description" icon={<FaFileAlt style={{ color: '#6366f1' }} />}>
                        {leadDetails.description ? (
                            <Box
                                sx={{
                                    gridColumn: 'span 3',
                                    color: 'text.secondary',
                                    fontSize: '14px',
                                    lineHeight: 1.7,
                                }}
                                dangerouslySetInnerHTML={{ __html: leadDetails.description }}
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
                        attachments={attachments}
                        onFileUpload={handleFileUpload}
                        onDeleteAttachment={handleDeleteAttachmentClick}
                    />
                    <NotesCard
                        comments={comments}
                        note={note}
                        onNoteChange={setNote}
                        onSendNote={handleSendNote}
                        onDeleteNote={handleDeleteNoteClick}
                    />
                </Box>
            </Box>

            {/* Delete Lead Modal */}
            <IActionModal
                open={deleteLeadModalOpen}
                onClose={() => setDeleteLeadModalOpen(false)}
                onConfirm={handleConfirmDeleteLead}
                variant="error"
                title="Delete Lead?"
                message={`Are you sure you want to delete "${leadDetails?.first_name} ${leadDetails?.last_name}"? This action cannot be undone and will remove all associated data.`}
                confirmText="Delete Lead"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Delete Attachment Modal */}
            <IActionModal
                open={deleteAttachmentModalOpen}
                onClose={() => {
                    setDeleteAttachmentModalOpen(false);
                    setSelectedAttachmentId(null);
                }}
                onConfirm={handleConfirmDeleteAttachment}
                variant="warning"
                title="Delete Attachment?"
                message="Are you sure you want to delete this attachment? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Delete Note Modal */}
            <IActionModal
                open={deleteNoteModalOpen}
                onClose={() => {
                    setDeleteNoteModalOpen(false);
                    setSelectedCommentId(null);
                }}
                onConfirm={handleConfirmDeleteNote}
                variant="warning"
                title="Delete Note?"
                message="Are you sure you want to delete this note? This action cannot be undone."
                confirmText="Delete"
                cancelText="Cancel"
                isLoading={isDeleting}
            />

            {/* Convert Lead Modal */}
            {leadDetails && (
                <ConvertLeadModal
                    open={convertModalOpen}
                    onClose={() => setConvertModalOpen(false)}
                    lead={leadDetails}
                    onConversionComplete={handleConversionComplete}
                />
            )}
        </Box>
    );
}
